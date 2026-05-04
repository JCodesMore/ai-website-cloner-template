import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { verifyN8nIngress } from "@/lib/n8n/ingress";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type BootstrapRequest = {
  n8n_url: string;
  n8n_user: string;
  n8n_password: string;
  activate?: boolean;
  workflows?: string[]; // optional filter — defaults to all 8
};

type ImportResult = {
  file: string;
  workflow_id: string | null;
  imported: boolean;
  activated: boolean;
  error?: string;
};

/**
 * One-shot importer that pushes all 8 workflow JSONs from this repo into a
 * live n8n instance. Run from your laptop after Hetzner is up:
 *
 *   curl -X POST https://www.bajablue.mx/api/n8n/bootstrap \
 *     -H "x-n8n-secret: $BAJABLUE_INGRESS_SECRET" \
 *     -H "Content-Type: application/json" \
 *     -d '{ "n8n_url": "https://n8n.bajablue.mx", "n8n_user": "nico",
 *           "n8n_password": "...", "activate": true }'
 *
 * Each workflow is POSTed to n8n's /rest/workflows endpoint with basic auth.
 * If `activate: true`, each workflow is then PATCHed to set active=true.
 */
export async function POST(req: NextRequest) {
  const unauthorized = verifyN8nIngress(req);
  if (unauthorized) return unauthorized;

  let body: BootstrapRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.n8n_url || !body.n8n_user || !body.n8n_password) {
    return NextResponse.json(
      { ok: false, error: "Required: n8n_url, n8n_user, n8n_password" },
      { status: 400 }
    );
  }

  const n8nUrl = body.n8n_url.replace(/\/+$/, "");
  const auth = "Basic " + Buffer.from(`${body.n8n_user}:${body.n8n_password}`).toString("base64");

  // ── Locate the workflow JSONs ─────────────────────────────────────────────
  // In dev: read from filesystem at n8n/workflows/
  // In production (Vercel): we need to bake the JSONs in. We use a shim that
  // imports them at build time so they ship with the deployment.
  const allWorkflows = await loadWorkflowJsons();
  const filter = new Set(body.workflows || []);
  const targets = filter.size > 0 ? allWorkflows.filter((w) => filter.has(w.file)) : allWorkflows;

  const results: ImportResult[] = [];

  for (const wf of targets) {
    const result: ImportResult = {
      file: wf.file,
      workflow_id: null,
      imported: false,
      activated: false,
    };

    try {
      // 1. POST workflow to n8n
      const importRes = await fetch(`${n8nUrl}/rest/workflows`, {
        method: "POST",
        headers: {
          Authorization: auth,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: wf.json.name,
          nodes: wf.json.nodes,
          connections: wf.json.connections,
          settings: wf.json.settings || { executionOrder: "v1" },
          tags: wf.json.tags || [],
        }),
      });

      if (!importRes.ok) {
        const text = await importRes.text();
        result.error = `Import failed (${importRes.status}): ${text.slice(0, 200)}`;
        results.push(result);
        continue;
      }

      const importedWf = (await importRes.json()) as { data?: { id?: string }; id?: string };
      const newId = importedWf.data?.id || importedWf.id || null;
      result.workflow_id = newId;
      result.imported = true;

      // 2. Activate if requested
      if (body.activate && newId) {
        const activateRes = await fetch(`${n8nUrl}/rest/workflows/${newId}/activate`, {
          method: "POST",
          headers: { Authorization: auth },
        });
        result.activated = activateRes.ok;
        if (!activateRes.ok) {
          const text = await activateRes.text();
          result.error = `Activation failed (${activateRes.status}): ${text.slice(0, 200)}`;
        }
      }

      results.push(result);
    } catch (e) {
      result.error = e instanceof Error ? e.message : "Unknown error";
      results.push(result);
    }
  }

  const summary = {
    ok: results.every((r) => r.imported),
    total: results.length,
    imported: results.filter((r) => r.imported).length,
    activated: results.filter((r) => r.activated).length,
    failed: results.filter((r) => !r.imported).length,
    n8n_url: n8nUrl,
    results,
  };

  return NextResponse.json(summary);
}

/**
 * Reads all 8 workflow JSON files. In dev/build time this reads from the
 * project's n8n/workflows/ directory. The Next.js bundler will inline these
 * via the dynamic require pattern below — safe for serverless runtime.
 */
async function loadWorkflowJsons(): Promise<Array<{ file: string; json: WorkflowJson }>> {
  const workflowsDir = path.join(process.cwd(), "n8n", "workflows");
  let files: string[] = [];
  try {
    files = (await fs.readdir(workflowsDir))
      .filter((f) => f.endsWith(".json"))
      .sort();
  } catch (e) {
    // On Vercel the file may not be in cwd; fall back to baked manifest
    return BAKED_WORKFLOWS;
  }

  const out: Array<{ file: string; json: WorkflowJson }> = [];
  for (const file of files) {
    try {
      const raw = await fs.readFile(path.join(workflowsDir, file), "utf8");
      out.push({ file, json: JSON.parse(raw) as WorkflowJson });
    } catch (e) {
      console.error(`[n8n/bootstrap] failed to load ${file}:`, e);
    }
  }
  return out.length > 0 ? out : BAKED_WORKFLOWS;
}

type WorkflowJson = {
  name: string;
  nodes: unknown[];
  connections: Record<string, unknown>;
  settings?: Record<string, unknown>;
  tags?: Array<{ name: string }>;
};

// Empty fallback when filesystem read fails (Vercel sometimes can't see project files
// outside src/). In that case the user should call this endpoint from a deploy
// where n8n/workflows/ ships, or POST the JSONs in the request body explicitly.
const BAKED_WORKFLOWS: Array<{ file: string; json: WorkflowJson }> = [];

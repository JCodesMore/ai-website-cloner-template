import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";

function compareText(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function containedBy(root, candidate, pathApi) {
  if (candidate === root) return true;
  const boundary = root.endsWith(pathApi.sep) ? root : `${root}${pathApi.sep}`;
  return candidate.startsWith(boundary);
}

function emptyResult(overrides = {}) {
  return {
    checked_record_count: 0,
    findings: [],
    record_count: 0,
    records: [],
    status: "PASS",
    unique_file_count: 0,
    ...overrides,
  };
}

async function parseEvidence(packagePath) {
  let source;
  try {
    source = await readFile(path.join(packagePath, "EVIDENCE.jsonl"), "utf8");
  } catch {
    return {
      findings: [{ status: "EVIDENCE_READ_ERROR" }],
      records: [],
      recordCount: 0,
    };
  }

  const lines = source.split(/\r?\n/);
  if (lines.at(-1) === "") lines.pop();
  const records = [];
  const findings = [];
  for (const [index, line] of lines.entries()) {
    let record;
    try {
      if (line.trim() === "") throw new SyntaxError("blank JSONL line");
      record = JSON.parse(line);
    } catch {
      findings.push({ line: index + 1, status: "MALFORMED_JSONL" });
      continue;
    }
    if (
      record === null ||
      typeof record !== "object" ||
      Array.isArray(record) ||
      typeof record.evidence_id !== "string" ||
      record.evidence_id.trim() === "" ||
      record.provenance === null ||
      typeof record.provenance !== "object" ||
      typeof record.provenance.artifact !== "string" ||
      record.provenance.artifact.trim() === "" ||
      typeof record.provenance.sha256 !== "string"
    ) {
      findings.push({ line: index + 1, status: "INVALID_EVIDENCE_RECORD" });
      continue;
    }
    records.push(record);
  }

  const counts = new Map();
  for (const record of records) {
    counts.set(record.evidence_id, (counts.get(record.evidence_id) ?? 0) + 1);
  }
  for (const [evidenceId, count] of counts) {
    if (count > 1) {
      findings.push({
        evidence_id: evidenceId,
        status: "DUPLICATE_EVIDENCE_ID",
      });
    }
  }
  findings.sort((left, right) => {
    if (left.line !== undefined || right.line !== undefined) {
      return (left.line ?? Number.MAX_SAFE_INTEGER) - (right.line ?? Number.MAX_SAFE_INTEGER);
    }
    return compareText(left.evidence_id, right.evidence_id);
  });
  return { findings, records, recordCount: records.length };
}

async function streamingSha256(file) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest("hex");
}

function locatorFailure(locator, canonicalRoot, pathApi) {
  if (
    pathApi.isAbsolute(locator) ||
    path.win32.isAbsolute(locator) ||
    path.posix.isAbsolute(locator)
  ) {
    return "UNSUPPORTED_ABSOLUTE_LOCATOR";
  }
  if (/^[A-Za-z][A-Za-z0-9+.-]*:/.test(locator)) {
    return "UNSUPPORTED_URI_LOCATOR";
  }
  if (locator.includes(":")) return "UNSUPPORTED_COLON_LOCATOR";
  const candidate = pathApi.resolve(canonicalRoot, locator);
  return containedBy(canonicalRoot, candidate, pathApi) ? null : "LEXICAL_ESCAPE";
}

function auditRecordBase(record) {
  return {
    artifact: record.provenance.artifact,
    evidence_id: record.evidence_id,
    expected_sha256: record.provenance.sha256,
  };
}

export async function auditEvidenceArtifacts({
  packagePath,
  artifactRoot,
  dependencies: {
    hashFile = streamingSha256,
    pathApi = path,
    realpath: resolveRealpath = realpath,
    stat: getStat = stat,
  } = {},
}) {
  const parsed = await parseEvidence(packagePath);
  if (parsed.findings.length > 0) {
    return emptyResult({
      findings: parsed.findings,
      record_count: parsed.recordCount,
      status: "FINDINGS",
    });
  }
  if (parsed.records.length === 0) return emptyResult();

  const rootResolved = pathApi.resolve(artifactRoot);
  let rootReal;
  try {
    rootReal = await resolveRealpath(rootResolved);
    if (!(await getStat(rootReal)).isDirectory()) {
      return emptyResult({
        findings: [{ status: "ARTIFACT_ROOT_NOT_DIRECTORY" }],
        record_count: parsed.recordCount,
        status: "FINDINGS",
      });
    }
  } catch {
    return emptyResult({
      findings: [{ status: "ARTIFACT_ROOT_UNAVAILABLE" }],
      record_count: parsed.recordCount,
      status: "FINDINGS",
    });
  }

  const records = [];
  const hashes = new Map();
  let checkedRecordCount = 0;
  const ordered = [...parsed.records].sort((left, right) =>
    compareText(left.evidence_id, right.evidence_id),
  );
  for (const record of ordered) {
    const base = auditRecordBase(record);
    const locatorStatus = locatorFailure(
      record.provenance.artifact,
      rootReal,
      pathApi,
    );
    if (locatorStatus) {
      records.push({ ...base, status: locatorStatus });
      continue;
    }

    const candidate = pathApi.resolve(rootReal, record.provenance.artifact);
    let candidateReal;
    try {
      candidateReal = await resolveRealpath(candidate);
    } catch {
      records.push({ ...base, status: "MISSING" });
      continue;
    }
    if (!containedBy(rootReal, candidateReal, pathApi)) {
      records.push({ ...base, status: "REALPATH_ESCAPE" });
      continue;
    }
    try {
      if (!(await getStat(candidateReal)).isFile()) {
        records.push({ ...base, status: "NOT_REGULAR_FILE" });
        continue;
      }
    } catch {
      records.push({ ...base, status: "MISSING" });
      continue;
    }

    const hashKey = candidateReal;
    let actual = hashes.get(hashKey);
    try {
      if (actual === undefined) {
        actual = await hashFile(candidateReal);
        hashes.set(hashKey, actual);
      }
    } catch {
      records.push({ ...base, status: "READ_ERROR" });
      continue;
    }
    checkedRecordCount += 1;
    records.push({
      actual_sha256: actual,
      ...base,
      status: actual === record.provenance.sha256 ? "MATCH" : "HASH_MISMATCH",
    });
  }

  const status = records.every((record) => record.status === "MATCH")
    ? "PASS"
    : "FINDINGS";
  return {
    checked_record_count: checkedRecordCount,
    findings: [],
    record_count: parsed.recordCount,
    records,
    status,
    unique_file_count: hashes.size,
  };
}

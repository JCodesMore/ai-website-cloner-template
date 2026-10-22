import { cp, rm, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT_E2E_PORT = 3100;
const MINIMUM_E2E_PORT = 1024;
const MAXIMUM_E2E_PORT = 65535;

export function resolveE2EPort(value = process.env.CODEX_E2E_PORT) {
  if (value === undefined) {
    return DEFAULT_E2E_PORT;
  }
  if (!/^\d+$/.test(value)) {
    throw new Error("CODEX_E2E_PORT must be an integer from 1024 through 65535");
  }
  const port = Number(value);
  if (port < MINIMUM_E2E_PORT || port > MAXIMUM_E2E_PORT) {
    throw new Error("CODEX_E2E_PORT must be an integer from 1024 through 65535");
  }
  return port;
}

async function requireFile(file, label) {
  try {
    if (!(await stat(file)).isFile()) {
      throw new Error(`${label} is not a file: ${file}`);
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`${label} is missing: ${file}`);
    }
    throw error;
  }
}

async function requireDirectory(directory, label) {
  try {
    if (!(await stat(directory)).isDirectory()) {
      throw new Error(`${label} is not a directory: ${directory}`);
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`${label} is missing: ${directory}`);
    }
    throw error;
  }
}

export async function prepareStandaloneAssets({ projectRoot = process.cwd() } = {}) {
  const standaloneRoot = path.join(projectRoot, ".next", "standalone");
  const serverPath = path.join(standaloneRoot, "server.js");
  const staticSource = path.join(projectRoot, ".next", "static");
  const publicSource = path.join(projectRoot, "public");
  const staticDestination = path.join(standaloneRoot, ".next", "static");
  const publicDestination = path.join(standaloneRoot, "public");

  await requireFile(serverPath, "standalone server");
  await requireDirectory(staticSource, "static build output");

  let hasPublicDirectory = true;
  try {
    await requireDirectory(publicSource, "public assets");
  } catch (error) {
    if (error.code !== "ENOENT" && !error.message.startsWith("public assets is missing:")) {
      throw error;
    }
    hasPublicDirectory = false;
  }

  await rm(publicDestination, { force: true, recursive: true });
  await rm(staticDestination, { force: true, recursive: true });
  if (hasPublicDirectory) {
    await cp(publicSource, publicDestination, { recursive: true });
  }
  await cp(staticSource, staticDestination, { recursive: true });

  return { serverPath };
}

async function loadStandaloneServer(serverPath) {
  await import(pathToFileURL(serverPath).href);
}

export async function startStandaloneServer({
  env = process.env,
  loadServer = loadStandaloneServer,
  projectRoot = process.cwd(),
} = {}) {
  const port = resolveE2EPort(env.CODEX_E2E_PORT);
  const { serverPath } = await prepareStandaloneAssets({ projectRoot });
  Object.assign(env, {
    HOSTNAME: "127.0.0.1",
    NODE_ENV: "production",
    NEXT_TELEMETRY_DISABLED: "1",
    PORT: String(port),
  });
  await loadServer(serverPath);
  return {
    port,
    serverPath,
    url: `http://127.0.0.1:${port}`,
  };
}

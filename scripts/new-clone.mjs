#!/usr/bin/env node
// Scaffold a standalone app for one cloned site so the template root stays reusable.
//
//   npm run new-clone -- <name> [folder]
//
// Creates <folder>/<name>/ (default folder: clones) from the committed scaffold, so the new app
// starts clean even if the root app has been edited. Run `npm install` inside it, then clone there.
// The folder is positional because PowerShell drops `--` and npm would swallow a `--dir` flag;
// `node scripts/new-clone.mjs <name> --dir <folder>` also works.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const dirIndex = args.indexOf("--dir");
const positional = args.filter((a, i) => !a.startsWith("--") && (dirIndex < 0 || i !== dirIndex + 1));
const rawName = positional[0];
const baseDir = dirIndex >= 0 ? args[dirIndex + 1] : (positional[1] ?? "clones");

if (!rawName || !baseDir) {
  console.error("Usage: npm run new-clone -- <name> [folder]   e.g. npm run new-clone -- stripe");
  process.exit(1);
}

const name = rawName
  .toLowerCase()
  .replace(/^https?:\/\//, "")
  .replace(/^www\./, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");
if (!name) {
  console.error(`"${rawName}" does not contain usable characters for a folder name.`);
  process.exit(1);
}

const root = process.cwd();
if (!fs.existsSync(path.join(root, "package.json")) || !fs.existsSync(path.join(root, "src", "app"))) {
  console.error("Run this from the template root (the folder with package.json and src/app).");
  process.exit(1);
}

const dest = path.resolve(root, baseDir, name);
if (fs.existsSync(dest) && fs.readdirSync(dest).length) {
  console.error(`${path.relative(root, dest)} already exists and is not empty.`);
  process.exit(1);
}

// Everything a clone app needs to build; agent configs, docs, and Docker files stay at the root.
const SCAFFOLD = [
  "package.json",
  "package-lock.json",
  "next.config.ts",
  "tsconfig.json",
  "postcss.config.mjs",
  "eslint.config.mjs",
  "components.json",
  ".gitignore",
  ".nvmrc",
  "src",
  "public",
];

const git = (...a) => execFileSync("git", a, { cwd: root, stdio: ["ignore", "pipe", "ignore"], maxBuffer: 64 * 1024 * 1024 });

function listCommitted() {
  try {
    git("rev-parse", "--verify", "HEAD");
    return git("ls-tree", "-r", "--name-only", "HEAD", "--", ...SCAFFOLD).toString().split("\n").filter(Boolean);
  } catch {
    return null;
  }
}

function listWorkingTree() {
  const out = [];
  const walk = (rel) => {
    const abs = path.join(root, rel);
    if (!fs.existsSync(abs)) return;
    if (fs.statSync(abs).isDirectory()) {
      for (const f of fs.readdirSync(abs)) walk(path.join(rel, f));
    } else {
      out.push(rel.split(path.sep).join("/"));
    }
  };
  SCAFFOLD.forEach(walk);
  return out;
}

const committed = listCommitted();
const files = committed ?? listWorkingTree();
if (!committed) console.warn("No git history found; copying the working tree as-is.");

for (const file of files) {
  const target = path.join(dest, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const content = committed ? git("show", `HEAD:${file}`) : fs.readFileSync(path.join(root, file));
  fs.writeFileSync(target, content);
}

// The app sits inside the template checkout, which has its own lockfile; pin the workspace root
// so Next does not resolve modules or trace output from the template root.
const configPath = path.join(dest, "next.config.ts");
const config = fs.existsSync(configPath) ? fs.readFileSync(configPath, "utf8") : "";
const opener = "const nextConfig: NextConfig = {";
if (config.includes(opener)) {
  fs.writeFileSync(
    configPath,
    `import path from "node:path";\n${config.replace(
      opener,
      `${opener}\n  turbopack: { root: path.join(__dirname) },\n  outputFileTracingRoot: path.join(__dirname),`
    )}`
  );
} else {
  console.warn("next.config.ts has an unexpected shape; set turbopack.root and outputFileTracingRoot to the app folder manually.");
}

// The root stylesheet excludes clones/ from Tailwind's scan; that line means nothing inside a clone.
const cssPath = path.join(dest, "src", "app", "globals.css");
if (fs.existsSync(cssPath)) {
  fs.writeFileSync(cssPath, fs.readFileSync(cssPath, "utf8").replace(/@source not "\.\.\/\.\.\/clones";\r?\n\r?\n?/, ""));
}

const pkgPath = path.join(dest, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const app = {
  name,
  version: "0.1.0",
  private: true,
  engines: pkg.engines,
  scripts: Object.fromEntries(Object.entries(pkg.scripts).filter(([key]) => key !== "new-clone")),
  dependencies: pkg.dependencies,
  devDependencies: pkg.devDependencies,
};
fs.writeFileSync(pkgPath, `${JSON.stringify(app, null, 2)}\n`);

const lockPath = path.join(dest, "package-lock.json");
if (fs.existsSync(lockPath)) {
  const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
  lock.name = name;
  lock.version = app.version;
  if (lock.packages?.[""]) {
    lock.packages[""].name = name;
    lock.packages[""].version = app.version;
    for (const key of ["description", "author", "license", "repository", "homepage", "bugs", "keywords"]) {
      delete lock.packages[""][key];
    }
  }
  fs.writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`);
}

const rel = path.relative(root, dest).split(path.sep).join("/");
console.log(`Created ${rel} (${files.length} files).

Next:
  cd ${rel}
  npm install
Then run the cloning workflow with ${rel} as the project root.`);

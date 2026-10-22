import { startStandaloneServer } from "./lib/playwright-server.mjs";

try {
  const { url } = await startStandaloneServer();
  console.log(`Standalone server starting at ${url}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}

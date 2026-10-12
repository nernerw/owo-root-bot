const path = require("node:path");
const { spawnSync } = require("node:child_process");

const authToken = process.env.ROOT_AUTH_TOKEN?.trim();
const host = process.env.ROOT_HOST?.trim() || "dev.rootapp.com";

if (!authToken || authToken.startsWith("TODO-")) {
  console.error(
    "Set ROOT_AUTH_TOKEN to a Root Dev Portal auth token before publishing.",
  );
  process.exit(1);
}

if (!/^[a-z0-9.-]+(?::\d+)?$/i.test(host)) {
  console.error("ROOT_HOST must be a hostname, such as dev.rootapp.com.");
  process.exit(1);
}

const devToolsPackage = require.resolve("@rootsdk/dev-tools/package.json");
const rootsdkCli = path.join(
  path.dirname(devToolsPackage),
  "bin",
  "rootsdk",
);

function runNodeScript(scriptPath, args = []) {
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    stdio: "inherit",
  });

  if (result.error) {
    console.error(`Could not start ${path.basename(scriptPath)}:`, result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

runNodeScript(require.resolve("typescript/bin/tsc"));
runNodeScript(rootsdkCli, [
  "build",
  "package",
  "--output-file",
  "./rootapp.pkg",
  "--project-folder",
  ".",
]);
runNodeScript(rootsdkCli, [
  "upload",
  "package",
  "--file",
  "./rootapp.pkg",
  "--authToken",
  authToken,
  "--host",
  host,
]);

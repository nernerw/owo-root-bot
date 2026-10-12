const path = require("node:path");
const { spawn } = require("node:child_process");

if (!process.env.DEV_TOKEN?.trim()) {
  console.error(
    "DEV_TOKEN is missing. Add the development-community token to the Render worker environment; ROOT_AUTH_TOKEN is only for package publishing.",
  );
  process.exit(1);
}

const devToolsPackage = require.resolve("@rootsdk/dev-tools/package.json");
const rootsdkCli = path.join(
  path.dirname(devToolsPackage),
  "bin",
  "rootsdk",
);
const child = spawn(process.execPath, [rootsdkCli, "start", "devhost"], {
  stdio: "inherit",
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}

child.on("error", (error) => {
  console.error("Could not start the Root development host:", error.message);
  process.exitCode = 1;
});

child.on("exit", (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0);
});

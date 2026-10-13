const fs = require("fs");

fs.rmSync("./dist", { recursive: true, force: true });
fs.rmSync("./tsconfig.tsbuildinfo", { force: true });
console.log("Removed generated build files.");

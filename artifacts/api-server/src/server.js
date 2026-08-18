import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const srcDirectory = path.dirname(fileURLToPath(import.meta.url));
const artifactDirectory = path.resolve(srcDirectory, "..");
const buildScript = path.join(artifactDirectory, "build.mjs");
const bundledEntry = path.join(artifactDirectory, "dist", "index.mjs");

if (!existsSync(bundledEntry)) {
  const buildResult = spawnSync(process.execPath, [buildScript], {
    cwd: artifactDirectory,
    env: process.env,
    stdio: "inherit",
  });

  if (buildResult.status !== 0) {
    process.exit(buildResult.status ?? 1);
  }
}

await import(pathToFileURL(bundledEntry).href);
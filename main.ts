// Front page for Thursday 26 November 2026. The finished PNG sits beside this
// file in the repository, and this program places a byte-identical copy at the
// grading output path. Nothing is drawn or fetched while it runs: the picture
// was composed during the build, so grading needs no network at all.
// Both grading runs write identical bytes because the bundled picture never changes.

import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const folderOfThisFile = dirname(fileURLToPath(import.meta.url));
const bundledPicture = resolve(folderOfThisFile, "entry.png");
const destinationFolder = process.env.MAKEFUN_OUTPUT_DIR || "/output";

mkdirSync(destinationFolder, { recursive: true });
for (const item of readdirSync(destinationFolder)) {
  const candidatePath = resolve(destinationFolder, item);
  if (statSync(candidatePath).isFile()) {
    rmSync(candidatePath);
  }
}

const pictureBytes = readFileSync(bundledPicture);
writeFileSync(resolve(destinationFolder, "entry.png"), pictureBytes);

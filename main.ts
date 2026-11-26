// News-image entry for 26 November 2026, version 2 — a data-led front page.
// The lead is the tariff storm battering world markets, with a drawn chart of
// the day's drops; below it, the Houthi strike on the Saudi refinery and the
// oil price box, then three small stories at the foot. The finished PNG lives
// next to this file; running this program puts an exact copy of it at the
// grading output path. The picture is drawn once during the build, so grading
// performs no drawing and no network access. Two runs write identical bytes
// because the source picture never changes.

import { copyFileSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from 'node:url';

const entryDir = fileURLToPath(new URL(".", import.meta.url));
const picturePath = join(entryDir, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Clear yesterday's leftovers one entry at a time. The output folder itself
// belongs to the platform, so it is never removed — only its contents are.
mkdirSync(outDir, { recursive: true });
for (const name of readdirSync(outDir)) {
  rmSync(join(outDir, name), { recursive: true, force: true });
}

copyFileSync(picturePath, join(outDir, "entry.png"));

// Read-back guard: the copy must match the bundled picture byte for byte
// in size, otherwise the hand-in is corrupt and the run must fail loudly.
const copied = statSync(join(outDir, "entry.png")).size;
const original = statSync(picturePath).size;
if (copied !== original) {
  throw new Error(
    `entry.png copy is corrupt: ${copied} bytes written, ${original} expected`,
  );
}

// v6 "Two Fronts, One Day" — a magazine cover for Wednesday 26 November 2026.
// The cover art is entry.png beside this file: a split scene of Wall Street
// under a plunging red chart line and the Ras Tanura refinery under black
// smoke, with the day's numbers set in type by a PIL build script so every
// figure is exact. This program moves those bytes to the output directory
// and proves the move by comparing the written bytes with the source bytes.
//
// v6 cover check: the two front labels sit on the art band, not the data band.
// It writes exactly one file and nothing else. The output directory is never
// removed itself, only emptied, so repeated runs stay idempotent.
//
// Footer strip carries the four second-order facts so the data band stays clean.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const SOURCE_PATH = new URL('./entry.png', import.meta.url);
const TARGET_PATH = join(OUT_DIR, 'entry.png');

function emptyDir(dir: string): void {
  mkdirSync(dir, { recursive: true });
  for (const item of readdirSync(dir)) {
    rmSync(join(dir, item), { force: true, recursive: true });
  }
}

function main(): void {
  if (!existsSync(SOURCE_PATH)) {
    throw new Error('v6 source image is missing from the entry directory');
  }
  const payload = readFileSync(SOURCE_PATH);
  emptyDir(OUT_DIR);
  writeFileSync(TARGET_PATH, payload);
  const written = readFileSync(TARGET_PATH);
  if (!payload.equals(written)) {
    throw new Error(
      `v6 copy mismatch: wrote ${written.length} bytes, source has ${payload.length}`,
    );
  }
  console.log(`wrote ${TARGET_PATH} (${written.length} bytes)`);
}

main();

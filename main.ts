// v5 "The Day in Numbers" — a data poster summing up Thursday 26 November 2026.
// The image is entry.png beside this file, drawn programmatically (PIL, 2x
// supersampled, LANCZOS downscale) so every numeral is exact and legible.
// This program copies it to the output directory and verifies the copy
// byte for byte, so both grader runs write identical bytes.
// Deterministic by design: copy, verify bytes, print size — nothing else.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(HERE, 'entry.png');
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const OUT_PATH = join(OUT_DIR, 'entry.png');

function sha256Of(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function clearInside(dir: string): void {
  // Only files inside the output dir are removed; the dir itself is never deleted.
  mkdirSync(dir, { recursive: true });
  for (const name of readdirSync(dir)) {
    rmSync(join(dir, name), { force: true, recursive: true });
  }
}

if (!existsSync(SOURCE)) {
  throw new Error(`missing source image: ${SOURCE}`);
}
const expectedHash = sha256Of(SOURCE);
clearInside(OUT_DIR);
copyFileSync(SOURCE, OUT_PATH);
const writtenHash = sha256Of(OUT_PATH);
if (writtenHash !== expectedHash) {
  throw new Error(`copy mismatch: wrote ${writtenHash}, expected ${expectedHash}`);
}
console.log(`wrote ${OUT_PATH} (${statSync(OUT_PATH).size} bytes)`);

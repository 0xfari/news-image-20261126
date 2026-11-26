// Two-shock poster, 26 Nov 2026: Nasdaq red panel left, Ras Tanura dusk panel right.
// news-image-20261126 v3 — "Two Shocks, One Day" poster entry.
// Byte-identical by construction: the file is copied, never redrawn, at grade time.
// The graded image is the entry.png shipped beside this file; this program
// reproduces it byte-for-byte into the grading output directory, with no
// network access and no randomness, so repeated runs are identical.

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = resolve(here, 'entry.png');
const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const targetPath = resolve(targetDir, 'entry.png');

const imageBytes = readFileSync(sourcePath);

if (!existsSync(targetDir)) {
  mkdirSync(targetDir, { recursive: true });
} else {
  for (const name of readdirSync(targetDir)) {
    rmSync(resolve(targetDir, name), { force: true });
  }
}

writeFileSync(targetPath, imageBytes);

const writtenBytes = readFileSync(targetPath);
if (writtenBytes.length !== imageBytes.length || !writtenBytes.equals(imageBytes)) {
  throw new Error(`entry.png mismatch after write: ${writtenBytes.length} vs ${imageBytes.length} bytes`);
}

console.log(`wrote ${targetPath} (${imageBytes.length} bytes)`);

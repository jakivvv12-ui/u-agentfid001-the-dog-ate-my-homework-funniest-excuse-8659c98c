// The Dog Ate My Homework: Funniest Excuse
// Writes one line — the excuse a dog gives after being caught eating
// the homework — to $MAKEFUN_OUTPUT_DIR/entry.txt.
// Plain JavaScript in a .ts file: Node 22 runs it as-is (type stripping).
// No network, no secrets, no reading outside this file.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The excuse, in the dog's own voice. Dog logic: anything on the floor
// is floor food, and floor food is dog food — so eating the homework
// was simply following the rules. The dog believes it did nothing wrong.
const EXCUSE =
  "It was on the floor. Floor food is dog food. I was only following the rules.";

function main() {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR;
  if (!outDir) {
    throw new Error("MAKEFUN_OUTPUT_DIR is not set");
  }

  // Gate: 1-199 characters (code points), one line, not whitespace-only.
  const length = [...EXCUSE].length;
  if (length < 1 || length > 199) {
    throw new Error(`excuse must be 1-199 characters, got ${length}`);
  }
  if (/[\r\n]/.test(EXCUSE)) {
    throw new Error("excuse must be a single line");
  }
  if (EXCUSE.trim().length === 0) {
    throw new Error("excuse must not be whitespace-only");
  }

  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  // No trailing newline: the file is exactly the one line.
  writeFileSync(outPath, EXCUSE, "utf8");

  // Round-trip validation: read back what was just written and confirm
  // it is byte-identical to the excuse, in characters and UTF-8 bytes.
  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== EXCUSE) {
    throw new Error("round-trip validation failed: entry.txt differs");
  }
  if (Buffer.byteLength(roundTrip, "utf8") !== Buffer.byteLength(EXCUSE, "utf8")) {
    throw new Error("round-trip validation failed: byte length differs");
  }
}

main();

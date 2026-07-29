/**
 * Pre-commit encoding guard.
 * Rejects any source file that contains non-UTF-8 bytes or
 * "smart" Unicode characters (curly quotes, em-dashes, ellipsis, etc.)
 * that the write tool mangles into latin-1 garbage.
 *
 * Run with: node scripts/check-encoding.mjs
 */
import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

const BANNED = [
  [0x2013, "en-dash (use -)"],
  [0x2014, "em-dash (use --)"],
  [0x2018, "left single quote (use ')"],
  [0x2019, "right single quote (use ')"],
  [0x201c, "left double quote (use \")"],
  [0x201d, "right double quote (use \")"],
  [0x2026, "ellipsis (use ...)"],
  [0x2022, "bullet (use -)"],
  [0x2665, "heart (use text)"],
  [0x2714, "checkmark (use text)"],
  [0x2716, "cross (use text)"],
];

const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".css"]);

function walk(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) results.push(...walk(full));
    else if (EXTENSIONS.has(full.slice(full.lastIndexOf(".")))) results.push(full);
  }
  return results;
}

let errors = 0;
const root = new URL("..", import.meta.url).pathname;

for (const file of walk(root)) {
  let text;
  try {
    text = readFileSync(file, "utf-8");
  } catch {
    console.error(`ENCODING ERROR (not utf-8): ${file}`);
    errors++;
    continue;
  }

  for (let i = 0; i < text.length; i++) {
    const cp = text.codePointAt(i);
    const banned = BANNED.find(([b]) => b === cp);
    if (banned) {
      const line = text.slice(0, i).split("\n").length;
      console.error(`BANNED CHAR in ${file}:${line} ¡X U+${cp.toString(16).toUpperCase().padStart(4, "0")} ${banned[1]}`);
      errors++;
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} encoding error(s) found. Fix before committing.`);
  process.exit(1);
} else {
  console.log("Encoding check passed.");
}

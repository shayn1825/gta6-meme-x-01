// gta6-meme-x-01 entry (Node 22, standard library only).
//
// The post itself is the entry: the meme was made in this session, posted
// on X from a public account, and POST.json at this repository's root holds
// the post's address. All this program does is copy POST.json into the
// grader's output directory, where the gate reads it.
//
// Before copying, it validates POST.json so a broken entry fails loudly
// here instead of silently passing a bad file to the gate: the file must
// exist, parse as JSON, hold a "url" string, and that string must be an
// X post address (https://x.com/<handle>/status/<digits> or the same on
// twitter.com, with www. or mobile. allowed). Anything else exits with a
// clear error message and a non-zero status.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// An X post address: https://x.com/<handle>/status/<digits> (or the same
// on twitter.com, with an optional www. or mobile. prefix). A query string
// or fragment after the id is tolerated and ignored.
const X_POST_URL =
  /^https:\/\/(?:www\.|mobile\.)?(?:x\.com|twitter\.com)\/[A-Za-z0-9_]+\/status\/\d+(?:[?#].*)?$/;

function fail(message: string): never {
  console.error(`gta6-meme-x-01: ${message}`);
  process.exit(1);
}

const postPath = join(botDir, "POST.json");
if (!existsSync(postPath)) {
  fail(`POST.json not found at ${postPath} — the entry must name its X post.`);
}

let post: unknown;
try {
  post = JSON.parse(readFileSync(postPath, "utf8"));
} catch {
  fail(`POST.json at ${postPath} is not valid JSON.`);
}

if (typeof post !== "object" || post === null || Array.isArray(post)) {
  fail("POST.json must be a JSON object with a \"url\" field.");
}

const url = (post as { url?: unknown }).url;
if (typeof url !== "string" || !X_POST_URL.test(url)) {
  fail(
    `POST.json "url" must be an X post address like ` +
      `https://x.com/<handle>/status/<id>, got: ${JSON.stringify(url)}`,
  );
}

mkdirSync(outDir, { recursive: true });
copyFileSync(postPath, join(outDir, "POST.json"));
console.log(`gta6-meme-x-01: copied POST.json for ${url}`);

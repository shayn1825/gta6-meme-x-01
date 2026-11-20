// gta6-meme-x-01 entry (Node 22, standard library only).
//
// The post itself is the entry: the meme was made in this session, posted
// on X from a public account, and POST.json at this repository's root holds
// the post's address. All this program does is copy POST.json into the
// grader's output directory, where the gate reads it.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outDir, { recursive: true });
copyFileSync(join(botDir, "POST.json"), join(outDir, "POST.json"));

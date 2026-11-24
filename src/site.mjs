import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { buildHtml } from "./build.mjs";

/**
 * Write a static, noindex Vercel site: index.html (screen view with a
 * download button) + the PDF + vercel.json.
 */
export function writeSite(data, { siteDir, pdfPath, template, fontSize, accent }) {
  mkdirSync(siteDir, { recursive: true });
  const pdfName = basename(pdfPath);
  copyFileSync(pdfPath, join(siteDir, pdfName));
  writeFileSync(join(siteDir, "index.html"), buildHtml(data, { template, fontSize, accent, site: true, pdfName }));
  writeFileSync(
    join(siteDir, "vercel.json"),
    JSON.stringify(
      {
        cleanUrls: true,
        headers: [{ source: "/(.*)", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }],
      },
      null,
      2
    ) + "\n"
  );
  return resolve(siteDir);
}

/**
 * Deploy a site folder to Vercel production. Needs a logged-in Vercel CLI or
 * VERCEL_TOKEN in the environment. The project name is the folder name.
 */
export function deploySite(siteDir) {
  const cmd = process.platform === "win32" ? "npx.cmd" : "npx";
  const r = spawnSync(cmd, ["--yes", "vercel@latest", "deploy", "--prod", "--yes"], {
    cwd: resolve(siteDir),
    encoding: "utf8",
    shell: process.platform === "win32",
    env: process.env,
  });
  const out = `${r.stdout ?? ""}\n${r.stderr ?? ""}`;
  if (r.status !== 0) throw new Error(`vercel deploy failed:\n${out.trim()}`);
  const urls = out.match(/https:\/\/[^\s"']+\.vercel\.app/g) ?? [];
  return { url: urls.at(-1) ?? null, log: out };
}

import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { buildHtml } from "./build.mjs";

const CANDIDATES = {
  win32: [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  ],
  darwin: [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ],
  linux: ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "microsoft-edge"],
};

export function findBrowser() {
  const env = process.env.RESUMEFORGE_BROWSER || process.env.CHROME_PATH;
  if (env) return env;
  for (const c of CANDIDATES[process.platform] ?? CANDIDATES.linux) {
    if (c.includes("/") && existsSync(c)) return c;
    if (!c.includes("/")) {
      const r = spawnSync(process.platform === "win32" ? "where" : "which", [c], { encoding: "utf8" });
      if (r.status === 0 && r.stdout.trim()) return r.stdout.trim().split(/\r?\n/)[0];
    }
  }
  throw new Error("No Chrome, Edge or Chromium found. Set RESUMEFORGE_BROWSER to the browser executable.");
}

/** Print an HTML file to PDF with headless Chromium: no header, no footer. */
export function printPdf(htmlPath, pdfPath) {
  const browser = findBrowser();
  const out = resolve(pdfPath);
  for (let attempt = 1; attempt <= 3; attempt++) {
    rmSync(out, { force: true });
    const profile = mkdtempSync(join(tmpdir(), "resumeforge-"));
    spawnSync(
      browser,
      [
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--no-first-run",
        `--user-data-dir=${profile}`,
        "--no-pdf-header-footer",
        "--print-to-pdf-no-header",
        `--print-to-pdf=${out}`,
        pathToFileURL(resolve(htmlPath)).href,
      ],
      { stdio: "ignore", timeout: 90_000 }
    );
    rmSync(profile, { recursive: true, force: true });
    if (existsSync(out) && statSync(out).size > 1000) return out;
  }
  throw new Error(`Browser did not write ${out}`);
}

/** Root page count. Chromium writes one /Pages tree whose /Count is the largest. */
export function pageCount(pdfPath) {
  const raw = readFileSync(pdfPath).toString("latin1");
  const counts = [...raw.matchAll(/\/Type\s*\/Pages[^>]*?\/Count\s+(\d+)/gs)].map((m) => +m[1]);
  if (counts.length) return Math.max(...counts);
  const any = [...raw.matchAll(/\/Count\s+(\d+)/g)].map((m) => +m[1]);
  return any.length ? Math.max(...any) : 0;
}

/**
 * Build + render, searching for the largest body font size that keeps the
 * resume within maxPages. Writes the final HTML next to the PDF.
 */
export function renderFitted(data, { template, outDir, maxPages, minFs = 8.2, maxFs = 11, accent, site = false }) {
  const pages = maxPages ?? data.maxPages ?? 1;
  const work = mkdtempSync(join(tmpdir(), "resumeforge-fit-"));
  const trial = (fs) => {
    const html = join(work, "trial.html");
    const pdf = join(work, "trial.pdf");
    writeFileSync(html, buildHtml(data, { template, fontSize: fs, accent }));
    printPdf(html, pdf);
    return pageCount(pdf);
  };

  let lo = minFs;
  let hi = maxFs;
  let best = null;
  if (trial(hi) <= pages) best = hi;
  else {
    if (trial(lo) > pages) best = null;
    else {
      best = lo;
      while (hi - lo > 0.1) {
        const mid = Math.round(((lo + hi) / 2) * 10) / 10;
        if (trial(mid) <= pages) {
          best = mid;
          lo = mid;
        } else hi = mid;
      }
    }
  }
  rmSync(work, { recursive: true, force: true });

  const fontSize = best ?? minFs;
  return { fontSize, fits: best !== null, maxPages: pages };
}

export { buildHtml };

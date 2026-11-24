import { spawnSync } from "node:child_process";
import { statSync } from "node:fs";
import { pageCount } from "./render.mjs";

const DASHES = new RegExp("[" + String.fromCharCode(0x2012, 0x2013, 0x2014, 0x2015) + "]", "g");
const ARTIFACTS = [
  { re: /file:\/\/\S+/i, why: "browser footer file URL" },
  { re: /about:blank/i, why: "browser header" },
  { re: /\b\d{1,2}\/\d{1,2}\/\d{2,4},?\s+\d{1,2}:\d{2}\s*(AM|PM)?/i, why: "browser header date stamp" },
  { re: /^\s*\d+\s*\/\s*\d+\s*$/m, why: "page-number footer" },
];
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{25A0}-\u{25FF}]/u;

export function extractText(pdfPath, layout = false) {
  const args = layout ? ["-layout", pdfPath, "-"] : [pdfPath, "-"];
  const r = spawnSync("pdftotext", args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  if (r.error) return null;
  return r.stdout;
}

const norm = (s) => s.toLowerCase().replace(/\s+/g, " ");

/**
 * Verify a rendered resume PDF. Returns { status, checks[] } where status is
 * PASS, WARN or FAIL. Text checks need pdftotext (poppler-utils).
 */
export function verifyPdf(pdfPath, { maxPages = 1, name, headings = [], keywords = [], allowDashes = false } = {}) {
  const checks = [];
  const add = (level, check, detail) => checks.push({ level, check, detail });

  const size = statSync(pdfPath).size;
  const pages = pageCount(pdfPath);
  add(pages >= 1 && pages <= maxPages ? "PASS" : "FAIL", "page count", `${pages} page(s), limit ${maxPages}`);
  add(size < 500_000 ? "PASS" : "WARN", "file size", `${Math.round(size / 1024)} KB${size >= 500_000 ? " (images embedded?)" : ""}`);

  const text = extractText(pdfPath);
  if (text === null) {
    add("WARN", "text extraction", "pdftotext not found; install poppler-utils to run text checks");
    return finish(checks);
  }
  const flat = norm(text);
  add(flat.trim().length > 400 ? "PASS" : "FAIL", "selectable text", `${flat.length} characters extracted`);

  if (name) {
    const first = text.split(/\r?\n/).find((l) => l.trim());
    add(first && norm(first).includes(norm(name)) ? "PASS" : "WARN", "name first", `first line: "${(first ?? "").trim().slice(0, 60)}"`);
  }

  for (const h of headings) add(flat.includes(norm(h)) ? "PASS" : "FAIL", "heading", h);

  if (keywords.length) {
    const missing = keywords.filter((k) => !flat.includes(norm(k)));
    add(missing.length ? "WARN" : "PASS", "keywords", missing.length ? `missing: ${missing.join(", ")}` : `all ${keywords.length} present`);
  }

  const dashes = (text.match(DASHES) ?? []).length;
  if (!allowDashes) add(dashes ? "WARN" : "PASS", "em/en dashes", `${dashes} found`);

  if (EMOJI.test(text)) add("WARN", "symbols", "emoji or symbol glyphs found; use plain <ul><li> bullets");

  const layout = extractText(pdfPath, true) ?? "";
  const hits = ARTIFACTS.filter((a) => a.re.test(layout)).map((a) => a.why);
  add(hits.length ? "FAIL" : "PASS", "header/footer artifacts", hits.length ? hits.join(", ") : "none");

  return finish(checks);
}

function finish(checks) {
  const status = checks.some((c) => c.level === "FAIL") ? "FAIL" : checks.some((c) => c.level === "WARN") ? "WARN" : "PASS";
  return { status, checks };
}

/**
 * Content lint on resume.json, before any rendering. Encodes the honesty
 * rules: every listed skill should be evidenced somewhere in the prose.
 */
export function lintResume(d) {
  const checks = [];
  const add = (level, check, detail) => checks.push({ level, check, detail });
  for (const f of ["name", "experience"]) if (!d[f] || (Array.isArray(d[f]) && !d[f].length)) add("FAIL", "required field", f);

  const prose = norm(
    [
      ...(Array.isArray(d.summary) ? d.summary : [d.summary ?? ""]),
      ...(d.experience ?? []).flatMap((r) => r.bullets ?? []),
      ...(d.projects ?? []).flatMap((p) => [p.stack ?? "", ...(p.bullets ?? [])]),
      ...(d.certifications ?? []).map((c) => (typeof c === "string" ? c : c.name)),
    ]
      .join(" ")
      .replace(/\*\*/g, "")
  );
  const unevidenced = (d.skills ?? []).flatMap((g) => g.items).filter((s) => !prose.includes(norm(s)));
  add(
    unevidenced.length ? "WARN" : "PASS",
    "skills evidenced in bullets",
    unevidenced.length ? `${unevidenced.length} skill(s) appear nowhere in the summary, bullets or projects: ${unevidenced.join(", ")}` : "every skill is backed by prose"
  );

  const long = (d.experience ?? []).flatMap((r) => (r.bullets ?? []).filter((b) => b.length > 280));
  add(long.length ? "WARN" : "PASS", "bullet length", long.length ? `${long.length} bullet(s) over 280 characters` : "all bullets under 280 characters");

  const raw = JSON.stringify(d);
  const dashes = (raw.match(DASHES) ?? []).length;
  add(dashes ? "WARN" : "PASS", "em/en dashes in content", `${dashes} found`);

  const roles = d.experience ?? [];
  const bulletCounts = roles.map((r) => (r.bullets ?? []).length);
  if (bulletCounts.length > 1 && bulletCounts[0] < Math.max(...bulletCounts.slice(1)))
    add("WARN", "bullet balance", "most recent role has fewer bullets than an older role");

  return finish(checks);
}

export function printReport(title, { status, checks }) {
  const icon = { PASS: "ok  ", WARN: "warn", FAIL: "FAIL" };
  console.log(`\n${title}: ${status}`);
  for (const c of checks) console.log(`  [${icon[c.level]}] ${c.check}: ${c.detail}`);
}

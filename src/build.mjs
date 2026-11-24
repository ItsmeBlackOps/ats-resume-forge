import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const TEMPLATE_DIR = join(ROOT, "templates");

export const DEFAULT_SECTIONS = ["summary", "skills", "experience", "projects", "certifications", "education"];

const HEADINGS = {
  summary: "Summary",
  skills: "Technical Skills",
  experience: "Professional Experience",
  projects: "Projects",
  certifications: "Certifications",
  education: "Education",
};

export function listTemplates() {
  const manifest = JSON.parse(readFileSync(join(TEMPLATE_DIR, "manifest.json"), "utf8"));
  return manifest.templates;
}

export function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Inline formatting: **bold** only. Everything else is escaped. */
export function inline(s) {
  return esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function contactItem(c) {
  if (typeof c === "string") return esc(c);
  const label = esc(c.label ?? c.url ?? c.value);
  if (c.url) return `<a href="${esc(c.url)}">${label}</a>`;
  return label;
}

function dateRange(start, end) {
  if (!start && !end) return "";
  if (!end) return esc(start);
  return `${esc(start)} to ${esc(end)}`;
}

function row(left, right) {
  return `<div class="row"><span class="lt">${left}</span>${right ? `<span class="rt">${right}</span>` : ""}</div>`;
}

function bullets(list) {
  if (!list || !list.length) return "";
  return `<ul>${list.map((b) => `<li>${inline(b)}</li>`).join("")}</ul>`;
}

const SECTION_RENDERERS = {
  summary(d) {
    if (!d.summary) return "";
    const paras = Array.isArray(d.summary) ? d.summary : [d.summary];
    return paras.map((p) => `<p>${inline(p)}</p>`).join("");
  },
  skills(d) {
    if (!d.skills || !d.skills.length) return "";
    return `<div class="skills">${d.skills
      .map((g) => `<p><strong>${esc(g.label)}:</strong> ${g.items.map(esc).join(", ")}</p>`)
      .join("")}</div>`;
  },
  experience(d) {
    if (!d.experience || !d.experience.length) return "";
    return d.experience
      .map((r) => {
        const loc = r.location ? `<span class="loc">, ${esc(r.location)}</span>` : "";
        const left = `<span class="jt">${esc(r.title)}</span><span class="org"><span class="sep"> | </span>${esc(r.company)}</span>${loc}`;
        return `<div class="role">${row(left, dateRange(r.start, r.end))}${bullets(r.bullets)}</div>`;
      })
      .join("");
  },
  projects(d) {
    if (!d.projects || !d.projects.length) return "";
    return d.projects
      .map((p) => {
        const left = `<span class="jt">${esc(p.name)}</span>${p.stack ? `<span class="org"><span class="sep"> | </span>${esc(p.stack)}</span>` : ""}`;
        const right = p.url ? `<a href="${esc(p.url)}">${esc(p.urlLabel ?? p.url)}</a>` : esc(p.date ?? "");
        return `<div class="role">${row(left, right)}${bullets(p.bullets)}</div>`;
      })
      .join("");
  },
  certifications(d) {
    if (!d.certifications || !d.certifications.length) return "";
    return `<p>${d.certifications
      .map((c) => (typeof c === "string" ? `<strong>${esc(c)}</strong>` : `<strong>${esc(c.name)}</strong>${c.issuer ? `, ${esc(c.issuer)}` : ""}${c.date ? ` (${esc(c.date)})` : ""}`))
      .join('<span class="sep"> | </span>')}</p>`;
  },
  education(d) {
    if (!d.education || !d.education.length) return "";
    return d.education
      .map((e) => {
        const left = `<strong>${esc(e.degree)}</strong><span class="sep"> | </span>${esc(e.school)}${e.location ? `, ${esc(e.location)}` : ""}`;
        return row(left, esc(e.dates ?? ""));
      })
      .join("");
  },
};

export function fileStem(d) {
  if (d.fileName) return d.fileName.replace(/\.pdf$/i, "");
  const parts = [d.name, d.targetRole ?? d.headline?.split("|")[0]].filter(Boolean).join(" ");
  return parts
    .normalize("NFKD")
    .replace(/[^\x20-\x7e]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);
}

/**
 * Build a complete, single-column, ATS-safe HTML resume.
 * opts.template  theme name from templates/manifest.json
 * opts.fontSize  body size in pt (the fit loop varies this)
 * opts.site      add the screen-only download bar linking opts.pdfName
 */
export function buildHtml(d, opts = {}) {
  const templates = listTemplates();
  const name = opts.template ?? d.template ?? templates[0].name;
  const meta = templates.find((t) => t.name === name);
  if (!meta) throw new Error(`Unknown template "${name}". Run: resumeforge templates`);

  const base = readFileSync(join(TEMPLATE_DIR, "base.css"), "utf8");
  const themePath = join(TEMPLATE_DIR, `${name}.css`);
  const theme = existsSync(themePath) ? readFileSync(themePath, "utf8") : "";
  const page = (d.page ?? "Letter").toLowerCase() === "a4" ? "A4" : "Letter";
  const fs = opts.fontSize ?? d.fontSize ?? 10;
  const accent = opts.accent ?? d.accent ?? meta.accent;

  const order = d.sections ?? DEFAULT_SECTIONS;
  const headings = { ...HEADINGS, ...(d.headings ?? {}) };
  const body = order
    .map((key) => {
      const html = SECTION_RENDERERS[key]?.(d) ?? "";
      return html ? `<section class="sec sec-${key}"><h2>${esc(headings[key])}</h2>${html}</section>` : "";
    })
    .join("\n");

  const contact = (d.contact ?? []).map(contactItem).join('<span class="sep"> | </span>');
  const pdfName = opts.pdfName ?? `${fileStem(d)}.pdf`;
  const dlbar = opts.site
    ? `<div class="dlbar"><span class="who">${esc(d.name)}${d.headline ? ` / ${esc(d.headline.split("|")[0].trim())}` : ""}</span><a href="${esc(pdfName)}" download>Download PDF</a></div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(d.name)}${d.headline ? ` - ${esc(d.headline.split("|")[0].trim())}` : ""}</title>
${opts.site ? '<meta name="robots" content="noindex, nofollow">' : ""}
<style>
@page { size: ${page}; margin: 0; }
:root { --fs: ${fs}pt; --accent: ${accent}; --sheet-w: ${page === "A4" ? "210mm" : "8.5in"}; }
${base}
${theme}
</style>
</head>
<body class="t-${name}">
${dlbar}
<main class="sheet">
<header class="top">
<h1>${esc(d.name)}</h1>
${d.headline ? `<p class="headline">${esc(d.headline)}</p>` : ""}
${contact ? `<p class="contact">${contact}</p>` : ""}
</header>
<div class="body">
${body}
</div>
</main>
</body>
</html>
`;
}

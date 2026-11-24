#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildHtml, fileStem, listTemplates } from "../src/build.mjs";
import { printPdf, renderFitted } from "../src/render.mjs";
import { lintResume, printReport, verifyPdf } from "../src/verify.mjs";
import { deploySite, writeSite, writeStaticSite } from "../src/site.mjs";
import { buildBrief, briefProbes } from "../src/brief.mjs";
import { extractText } from "../src/verify.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const HISTORY = resolve(".resumeforge", "history.json");

const HELP = `resumeforge: resume.json -> ATS-safe HTML -> verified PDF -> optional Vercel site

Usage
  resumeforge init [file]                 copy the sample to candidates/resume.json (gitignored)
  resumeforge templates                   list templates (and which you have used here)
  resumeforge lint <resume.json>          content checks: unevidenced skills, dashes, long bullets
  resumeforge html <resume.json> [opts]   write the HTML only
  resumeforge pdf  <resume.json> [opts]   build, fit to page limit, print PDF, verify
  resumeforge verify <file.pdf> [opts]    verify any PDF (page count, text, headers, keywords)
  resumeforge site <resume.json> [opts]   pdf + a static noindex site folder for Vercel
  resumeforge deploy <siteDir>            vercel deploy --prod (needs vercel login or VERCEL_TOKEN)
  resumeforge all <resume.json> [opts]    lint + pdf + verify + site (+ --deploy)
  resumeforge brief <brief.json> [opts]   two-sheet "why this role fits" brief: html + pdf + verify
                                          (--site-dir <dir> also writes a site, --deploy publishes it)

Options
  --template <name>     theme (default: resume.json "template", else first unused one)
  --out <dir>           output folder (default: ./out)
  --max-pages <n>       page limit for the fit loop (default: resume.json maxPages or 1)
  --font-size <pt>      skip the fit loop and use this body size
  --accent <#hex>       override the template accent colour
  --keywords <a,b,c>    must-have keywords to check in the PDF text
  --site-dir <dir>      site folder (default: <out>/site-<slug>)
  --deploy              (all) deploy the site after building it
  --allow-dashes        do not warn about em/en dashes
`;

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) args[key] = true;
      else {
        args[key] = next;
        i++;
      }
    } else args._.push(a);
  }
  return args;
}

const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const loadHistory = () => (existsSync(HISTORY) ? readJson(HISTORY) : []);

function slug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);
}

function pickTemplate(data, args) {
  if (args.template) return args.template;
  if (data.template) return data.template;
  const used = new Set(loadHistory().map((h) => h.template));
  const fresh = listTemplates().find((t) => !used.has(t.name));
  return (fresh ?? listTemplates()[0]).name;
}

function record(template, data) {
  const h = loadHistory();
  h.push({ template, who: slug(data.name), at: new Date().toISOString().slice(0, 10) });
  mkdirSync(dirname(HISTORY), { recursive: true });
  writeFileSync(HISTORY, JSON.stringify(h, null, 2) + "\n");
}

function keywordsOf(args, data) {
  if (typeof args.keywords === "string") return args.keywords.split(",").map((s) => s.trim()).filter(Boolean);
  return data.mustHaveKeywords ?? [];
}

function headingsOf(data) {
  const map = {
    summary: "Summary",
    skills: "Technical Skills",
    experience: "Professional Experience",
    projects: "Projects",
    certifications: "Certifications",
    education: "Education",
    ...(data.headings ?? {}),
  };
  const order = data.sections ?? ["summary", "skills", "experience", "projects", "certifications", "education"];
  return order.filter((k) => (Array.isArray(data[k]) ? data[k].length : data[k])).map((k) => map[k]);
}

function makePdf(file, args) {
  const data = readJson(file);
  const template = pickTemplate(data, args);
  const outDir = resolve(args.out ?? "out");
  mkdirSync(outDir, { recursive: true });
  const maxPages = args.maxPages ? +args.maxPages : data.maxPages ?? 1;

  let fontSize = args.fontSize ? +args.fontSize : null;
  if (fontSize === null) {
    const fit = renderFitted(data, { template, outDir, maxPages, accent: args.accent });
    fontSize = fit.fontSize;
    console.log(fit.fits ? `fit: ${fontSize}pt body keeps it to ${maxPages} page(s)` : `fit: does not fit ${maxPages} page(s) even at ${fontSize}pt; cut content`);
  }
  const stem = fileStem(data);
  const htmlPath = join(outDir, `${stem}.html`);
  const pdfPath = join(outDir, `${stem}.pdf`);
  writeFileSync(htmlPath, buildHtml(data, { template, fontSize, accent: args.accent }));
  printPdf(htmlPath, pdfPath);
  record(template, data);
  console.log(`template: ${template}\nhtml: ${htmlPath}\npdf:  ${pdfPath}`);

  const report = verifyPdf(pdfPath, {
    maxPages,
    name: data.name,
    headings: headingsOf(data),
    keywords: keywordsOf(args, data),
    allowDashes: !!args.allowDashes,
  });
  printReport("verify", report);
  return { data, template, fontSize, pdfPath, htmlPath, outDir, report };
}

function makeSite(file, args) {
  const r = makePdf(file, args);
  const siteDir = resolve(args.siteDir ?? join(r.outDir, `site-${slug(r.data.name)}`));
  writeSite(r.data, { siteDir, pdfPath: r.pdfPath, template: r.template, fontSize: r.fontSize, accent: args.accent });
  console.log(`site: ${siteDir}`);
  return { ...r, siteDir };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const [cmd, target] = args._;
  try {
    switch (cmd) {
      case "init": {
        const dest = resolve(target ?? join("candidates", "resume.json"));
        if (existsSync(dest)) throw new Error(`${dest} already exists`);
        mkdirSync(dirname(dest), { recursive: true });
        copyFileSync(join(ROOT, "examples", "sample-resume.json"), dest);
        console.log(`wrote ${dest}; replace the fictional sample with real, evidenced content`);
        break;
      }
      case "templates": {
        const used = loadHistory().reduce((m, h) => ((m[h.template] = (m[h.template] ?? 0) + 1), m), {});
        for (const t of listTemplates()) console.log(`${t.name.padEnd(10)} ${String(used[t.name] ?? 0).padStart(2)} used  ${t.description}`);
        break;
      }
      case "lint": {
        const report = lintResume(readJson(target));
        printReport("lint", report);
        process.exitCode = report.status === "FAIL" ? 1 : 0;
        break;
      }
      case "html": {
        const data = readJson(target);
        const template = pickTemplate(data, args);
        const outDir = resolve(args.out ?? "out");
        mkdirSync(outDir, { recursive: true });
        const p = join(outDir, `${fileStem(data)}.html`);
        writeFileSync(p, buildHtml(data, { template, fontSize: args.fontSize ? +args.fontSize : undefined, accent: args.accent }));
        console.log(p);
        break;
      }
      case "pdf": {
        const { report } = makePdf(target, args);
        process.exitCode = report.status === "FAIL" ? 1 : 0;
        break;
      }
      case "verify": {
        const report = verifyPdf(resolve(target), {
          maxPages: args.maxPages ? +args.maxPages : 1,
          keywords: keywordsOf(args, {}),
          allowDashes: !!args.allowDashes,
        });
        printReport("verify", report);
        process.exitCode = report.status === "FAIL" ? 1 : 0;
        break;
      }
      case "site": {
        makeSite(target, args);
        break;
      }
      case "deploy": {
        const { url } = deploySite(target);
        console.log(url ? `live: ${url}` : "deployed; see the Vercel output for the URL");
        break;
      }
      case "all": {
        const lint = lintResume(readJson(target));
        printReport("lint", lint);
        if (lint.status === "FAIL") throw new Error("lint failed; fix resume.json first");
        const r = makeSite(target, args);
        if (r.report.status === "FAIL") throw new Error("PDF verification failed; fix and rerun");
        if (args.deploy) {
          const { url } = deploySite(r.siteDir);
          console.log(url ? `live: ${url}` : "deployed; see the Vercel output for the URL");
        }
        break;
      }
      case "brief": {
        const data = readJson(target);
        const outDir = resolve(args.out ?? "out");
        mkdirSync(outDir, { recursive: true });
        const stem = (data.fileName ?? `${data.name}_Why_This_Role_Fits`).replace(/\.pdf$/i, "").replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "");
        const htmlPath = join(outDir, `${stem}.html`);
        const pdfPath = join(outDir, `${stem}.pdf`);
        writeFileSync(htmlPath, buildBrief(data, { site: true, pdfName: `${stem}.pdf` }));
        printPdf(htmlPath, pdfPath);
        console.log(`html: ${htmlPath}\npdf:  ${pdfPath}`);
        const report = verifyPdf(pdfPath, { maxPages: 2, name: undefined, keywords: keywordsOf(args, data), allowDashes: !!args.allowDashes });
        const text = (extractText(pdfPath) ?? "").toLowerCase().replace(/\s+/g, " ");
        if (text) {
          for (const p of briefProbes(data)) {
            const ok = text.includes(p.text.toLowerCase().replace(/\s+/g, " "));
            report.checks.push({ level: ok ? "PASS" : "FAIL", check: "not clipped", detail: `${p.where}${ok ? "" : ": text missing, the sheet overflowed; trim content"}` });
          }
          if (report.checks.some((c) => c.level === "FAIL")) report.status = "FAIL";
        }
        printReport("verify", report);
        if (args.siteDir) {
          const siteDir = writeStaticSite(resolve(args.siteDir), readFileSync(htmlPath, "utf8"), pdfPath);
          console.log(`site: ${siteDir}`);
          if (args.deploy) {
            const { url } = deploySite(siteDir);
            console.log(url ? `live: ${url}` : "deployed; see the Vercel output for the URL");
          }
        }
        process.exitCode = report.status === "FAIL" ? 1 : 0;
        break;
      }
      default:
        console.log(HELP);
    }
  } catch (e) {
    console.error(`error: ${e.message}`);
    process.exitCode = 1;
  }
}

main();

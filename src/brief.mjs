import { readFileSync } from "node:fs";
import { join } from "node:path";
import { esc, inline, TEMPLATE_DIR } from "./build.mjs";

/*
 * Fit brief: a two-sheet "why this role fits" document styled as a press
 * proof. Sheet 1 is the requirement register; sheet 2 carries the diagrams.
 * Every diagram is optional and drawn from data; nothing is hard-coded.
 */

const DEFAULT_COLORS = {
  spot: "#005f6f",
  mark: "#0a8fa8",
  tint50: "#85c7d4",
  tint25: "#c2e3e9",
  wash: "#eef7f9",
  onSpot2: "#d6f0f4",
  dieline: "#e5007e",
  dielineInk: "#b0005f",
};

function wrap(text, max) {
  const words = String(text ?? "").split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > max && line) {
      lines.push(line);
      line = w;
    } else line = (line + " " + w).trim();
  }
  if (line) lines.push(line);
  return lines;
}

function tspans(lines, x, dy = 12) {
  return lines.map((l, i) => `<tspan x="${x}"${i ? ` dy="${dy}"` : ""}>${esc(l)}</tspan>`).join("");
}

function symbols(c) {
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<symbol id="reg-ok" viewBox="0 0 24 24"><path d="M12 12V3.5A8.5 8.5 0 0 1 20.5 12Z M12 12v8.5A8.5 8.5 0 0 1 3.5 12Z" fill="${c.mark}"/><circle cx="12" cy="12" r="8.5" fill="none" stroke="${c.mark}" stroke-width="1.7"/><path d="M12 1.5v21M1.5 12h21" stroke="${c.mark}" stroke-width="1.7"/></symbol>
<symbol id="reg-part" viewBox="0 0 24 24"><g fill="none" stroke="#121212" stroke-width="1.4"><circle cx="9.5" cy="12" r="7.2"/><path d="M9.5 2.2v19.6M0.6 12h17.8"/></g><circle cx="14.5" cy="12" r="7.2" fill="${c.tint50}" stroke="${c.mark}" stroke-width="1.4"/><path d="M14.5 2.2v19.6M5.6 12h17.8" fill="none" stroke="${c.mark}" stroke-width="1.4"/></symbol>
<symbol id="reg-ok-white" viewBox="0 0 24 24"><path d="M12 12V3.5A8.5 8.5 0 0 1 20.5 12Z M12 12v8.5A8.5 8.5 0 0 1 3.5 12Z" fill="#fff" fill-opacity=".55"/><circle cx="12" cy="12" r="8.5" fill="none" stroke="#fff" stroke-width="1.7"/><path d="M12 1.5v21M1.5 12h21" stroke="#fff" stroke-width="1.7"/></symbol>
</defs></svg>`;
}

function chrome(c) {
  return `<svg class="chrome" viewBox="0 0 816 1056" aria-hidden="true">
<g stroke="#121212" stroke-width=".75" fill="none">
<path d="M8 48h26M43.2 12v26 M782 48h26M772.8 12v26 M8 994.6h26M43.2 1042v11 M782 994.6h26M772.8 1042v11"/>
<circle cx="21" cy="517" r="6"/><path d="M21 508v18M12 517h18"/>
<circle cx="795" cy="517" r="6"/><path d="M795 508v18M786 517h18"/>
</g>
<rect x="43.2" y="48" width="729.6" height="946.6" fill="none" stroke="${c.dieline}" stroke-width=".75"/>
<text x="781" y="590" transform="rotate(-90 781 590)" font-family="Bahnschrift, Arial Narrow, Arial, sans-serif" font-size="6.4" letter-spacing=".4" fill="${c.dielineInk}">DIELINE: DOES NOT PRINT</text>
</svg>`;
}

function slug(d, n) {
  const right = [d.role, d.company, d.revision ? `Rev ${d.revision}` : "", d.date].filter(Boolean);
  return `<div class="slug"><span>Proof ${n} of 2</span><span>${esc(d.name)}</span><span>Candidate fit brief</span>${right
    .map((r, i) => `<span${i === 0 ? ' class="r"' : ""}>${esc(r)}</span>`)
    .join("")}</div>`;
}

function strip(c, n) {
  const patches = [
    [c.spot, "Principal panel"],
    [c.mark, "Spot 100%: marks, in register"],
    [c.tint50, "Spot 50%: partial register"],
    [c.tint25, "Spot 25%: fills"],
    ["#fff;border-color:" + c.dieline, "Dieline, trim of the artwork"],
    ["#121212", "Registration black, text"],
    ["#898781", "Grey balance"],
    ["#e1e0d9", "Rules and scale"],
  ];
  return `<div class="strip" aria-label="Colour control strip and legend">${patches
    .map(([bg, label]) => `<div class="patch"><i style="background:${bg}"></i><span>${esc(label)}</span></div>`)
    .join("")}<div class="sheetno">Sheet ${n} of 2</div></div>`;
}

function principal(d) {
  const reqs = d.requirements ?? [];
  const met = reqs.filter((r) => r.status !== "partial").length;
  const partial = reqs.length - met;
  const checks = [
    reqs.length ? `<b>Posted requirements:</b> ${met} of ${reqs.length} fully in register${partial ? `; ${partial} in partial register, stated as such` : ""}` : null,
    ...(d.checks ?? []).map((c) => `<b>${esc(c.label)}:</b> ${esc(c.text)}`),
  ].filter(Boolean);
  return `<header class="principal"><div>
<h1>${esc(d.name)}</h1>
<p class="role">${esc(d.roleLine ?? `Why the ${d.role} role fits`)}</p>
<p class="fit">${inline(d.fitStatement ?? "")}</p>
</div><aside class="check" aria-label="Register check"><h3>Register check</h3><ul>${checks
    .map((c) => `<li><svg aria-hidden="true"><use href="#reg-ok-white"/></svg><span>${c}</span></li>`)
    .join("")}</ul></aside></header>`;
}

function register(d) {
  const rows = (d.requirements ?? [])
    .map((r, i) => {
      const part = r.status === "partial";
      const mark = `<svg role="img" aria-label="${part ? "Partial register" : "In register"}"><use href="#${part ? "reg-part" : "reg-ok"}"/></svg><span>${part ? "Partial register" : "In register"}</span>`;
      const note = r.note ? ` <span class="note">${inline(r.note)}</span>` : "";
      return `<tr style="--i:${i + 1}"><th scope="row">${esc(r.requirement)}</th><td class="mark"><div class="in">${mark}</div></td><td class="ev"><div class="in">${inline(r.evidence)}${note}</div></td></tr>`;
    })
    .join("\n");
  return `<table class="register"><caption>Requirements in register<small>Posted items beside their evidence; an offset mark means a partial match.</small></caption>
<colgroup><col class="c-req"><col class="c-mark"><col class="c-ev"></colgroup>
<thead><tr><th scope="col">Requirement, as posted</th><th scope="col" class="mark">Register</th><th scope="col">Evidence, from the candidate's record</th></tr></thead>
<tbody>
${rows}
</tbody></table>`;
}

function story(s, c) {
  if (!s) return "";
  const stages = s.stages ?? [];
  const n = Math.max(stages.length, 1);
  const gap = 12;
  const w = (338 - (n - 1) * gap) / n;
  const trig = wrap(s.trigger?.text, 25).slice(0, 3);
  const ver = wrap(s.check?.text, 22).slice(0, 3);
  const stageSvg = stages
    .map((st, i) => {
      const x = 341 + i * (w + gap);
      const last = i === stages.length - 1;
      const cap = wrap(st.long ?? "", Math.max(8, Math.floor(w / 5.2))).slice(0, 2);
      const tick = last ? "" : `<path d="M${x + w + 2} 51l3 3 5-5" fill="none" stroke="${c.spot}" stroke-width="1.6"/>`;
      return `<g class="node"><title>${esc(st.long ?? st.short)}</title><rect x="${x}" y="44" width="${w}" height="24" fill="${last ? c.spot : c.mark}"/><text x="${x + w / 2}" y="60" text-anchor="middle" class="lab" font-size="10" fill="#fff">${esc(st.short)}</text></g>${tick}<text x="${x + w / 2}" y="82" text-anchor="middle" class="cap" font-size="9.4" fill="#52514e">${tspans(cap, x + w / 2, 10)}</text>`;
    })
    .join("");
  return `<section class="panel wide" aria-labelledby="h-story"><h2 id="h-story">${esc(s.title)}</h2>${s.intro ? `<p>${inline(s.intro)}</p>` : ""}
<svg class="fig" viewBox="0 0 730 144" role="img" aria-label="${esc(s.ariaLabel ?? s.title)}">
<defs><marker id="arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="#121212"/></marker></defs>
<g class="node"><title>${esc(s.trigger?.text)}</title><rect x="1" y="14" width="148" height="66" fill="#fff" stroke="#121212"/><rect x="1" y="14" width="148" height="16" fill="#121212"/><text x="9" y="26" class="lab" font-size="9.5" fill="#fff">${esc(s.trigger?.label ?? "STARTING POINT")}</text><text x="9" y="46" font-size="9.4" fill="#121212">${tspans(trig, 9)}</text></g>
<path d="M149 47h22" stroke="#121212" marker-end="url(#arr)"/>
<g class="node"><title>${esc(s.check?.text)}</title><rect x="179" y="14" width="132" height="66" fill="#fff" stroke="#121212"/><text x="187" y="27" class="lab" font-size="9.5" fill="${c.spot}">${esc(s.check?.label ?? "DIAGNOSED")}</text><text x="187" y="46" font-size="9.4" fill="#121212">${tspans(ver, 187)}</text></g>
<path d="M311 47h22" stroke="#121212" marker-end="url(#arr)"/>
<text x="341" y="25" class="lab" font-size="9.5" fill="${c.spot}">${esc(s.stagesLabel ?? "CARRIED THROUGH, IN ORDER")}</text>
<path d="M345 56H725" stroke="#c3c2b7"/>
${stageSvg}
<path d="M679 56h16V39" fill="none" stroke="#121212" marker-end="url(#arr)"/>
<g class="node"><title>${esc(s.outcome)}</title><rect x="690" y="14" width="39" height="22" fill="#fff" stroke="${c.spot}" stroke-width="1.2"/><path d="M700 25l4 4 8-8" fill="none" stroke="${c.spot}" stroke-width="1.8"/></g>
<text x="684" y="29" text-anchor="end" class="lab" font-size="9.4" fill="${c.spot}">${esc(s.outcome ?? "DONE")}</text>
${s.throughline ? `<path d="M1 104v7h728v-7" fill="none" stroke="#121212" stroke-width=".8"/><text x="365" y="126" text-anchor="middle" font-size="9.4" fill="#121212">${esc(s.throughline)}</text>` : ""}
${s.postingLine ? `<text x="365" y="139" text-anchor="middle" class="cap" font-size="9.4" fill="#52514e">Posting line it answers: "${esc(s.postingLine)}"</text>` : ""}
</svg></section>`;
}

function system(s, c) {
  if (!s) return "";
  const nodes = (s.nodes ?? []).slice(0, 3);
  const xs = [1, 130, 259];
  const fills = [c.spot, c.mark, "#fff"];
  const nodeSvg = nodes
    .map((nd, i) => {
      const fill = fills[i];
      const ink = i < 2 ? "#fff" : "#121212";
      const sub = i === 0 ? c.onSpot2 : i === 1 ? "#fff" : "#52514e";
      const subLines = wrap(nd.sub, 17).slice(0, 2);
      return `<g class="node"><title>${esc(nd.title)}${nd.sub ? `: ${esc(nd.sub)}` : ""}</title><rect x="${xs[i]}" y="58" width="92" height="50" fill="${fill}"${i === 2 ? ' stroke="#121212"' : ""}/><text x="${xs[i] + 46}" y="76" text-anchor="middle" class="lab" font-size="10" fill="${ink}">${esc(nd.title.toUpperCase())}</text>${subLines
        .map((l, j) => `<text x="${xs[i] + 46}" y="${91 + j * 11}" text-anchor="middle" class="cap" font-size="9.4" fill="${sub}">${esc(l)}</text>`)
        .join("")}</g>`;
    })
    .join("");
  const duties = (s.duties ?? []).slice(0, 4);
  const pos = [
    { x: 104, anchor: "end", y: 20 },
    { x: 248, anchor: "start", y: 20 },
    { x: 104, anchor: "end", y: 140 },
    { x: 248, anchor: "start", y: 140 },
  ];
  const dutySvg = duties
    .map((du, i) => {
      const p = pos[i];
      const sub = wrap(du.sub, 20).slice(0, 2);
      return `<text x="${p.x}" y="${p.y}" text-anchor="${p.anchor}" class="lab" font-size="9.4" fill="${c.spot}">${esc(du.title.toUpperCase())}</text>${sub
        .map((l, j) => `<text x="${p.x}" y="${p.y + 12 + j * 11}" text-anchor="${p.anchor}" class="cap" font-size="9.4" fill="#52514e">${esc(l)}</text>`)
        .join("")}`;
    })
    .join("");
  return `<section class="panel" aria-labelledby="h-system"><h2 id="h-system">${esc(s.title)}</h2>${s.intro ? `<p>${inline(s.intro)}</p>` : ""}
<svg class="fig" viewBox="0 0 352 168" role="img" aria-label="${esc(s.ariaLabel ?? s.title)}">
<path d="M111 18v132M241 18v132" stroke="#c3c2b7"/>
${nodeSvg}
<path d="M93 83h37M222 83h37" stroke="#121212" stroke-width="1.2"/>
<path d="M98 79l-5 4 5 4M125 79l5 4-5 4M227 79l-5 4 5 4M254 79l5 4-5 4" fill="none" stroke="#121212" stroke-width="1.2"/>
<circle cx="111" cy="83" r="2.4" fill="#121212"/><circle cx="241" cy="83" r="2.4" fill="#121212"/>
${dutySvg}
</svg>${s.footer ? `<p class="foot">${inline(s.footer)}</p>` : ""}</section>`;
}

function credentialsAndContact(d) {
  const creds = (d.credentials ?? [])
    .map((cr) => `<li><svg role="img" aria-label="In register"><use href="#reg-ok"/></svg><span><b>${esc(cr.name)}</b>${cr.note ? ` <small>${esc(cr.note)}</small>` : ""}</span></li>`)
    .join("");
  const contact = (d.contact ?? [])
    .map((c) => (typeof c === "string" ? esc(c) : c.url ? `<a href="${esc(c.url)}">${esc(c.label ?? c.url)}</a>` : esc(c.label)))
    .join(" &nbsp;|&nbsp; ");
  return `<div class="panel">
${creds ? `<section aria-labelledby="h-cred"><h2 id="h-cred">Credentials against the posting</h2><ul class="creds">${creds}</ul></section>` : ""}
<section aria-labelledby="h-contact" style="margin-top:0.1in"><h2 id="h-contact">Contact</h2><div class="contact"><div><span class="who">${esc(d.name)}</span>${contact ? ` &nbsp;|&nbsp; ${contact}` : ""}</div>${
    d.provenance ? `<p class="prov">${esc(d.provenance)}</p>` : ""
  }</div></section>
</div>`;
}

function traits(d) {
  if (!d.traits || !d.traits.length) return "";
  return `<section class="panel wide" aria-labelledby="h-how"><h2 id="h-how">${esc(d.traitsTitle ?? "How they work, in the posting's own terms")}</h2><ul class="how" style="margin-top:4pt">${d.traits
    .slice(0, 6)
    .map((t) => `<li><b>${esc(t.label)}</b>${inline(t.text)}</li>`)
    .join("")}</ul></section>`;
}

const ym = (s) => {
  if (!s || /present|now/i.test(s)) {
    const n = new Date();
    return n.getFullYear() + n.getMonth() / 12;
  }
  const [y, m] = String(s).split("-").map(Number);
  return y + ((m || 1) - 1) / 12;
};

function timeline(d, c) {
  const items = d.timeline ?? [];
  if (!items.length) return "";
  const lo = Math.floor(Math.min(...items.map((t) => ym(t.start))));
  const hi = Math.ceil(Math.max(...items.map((t) => ym(t.end))) + 0.01);
  const span = Math.max(hi - lo, 1);
  const x = (v) => 24 + ((v - lo) / span) * 684;
  // Each row: a caption line above its bar. The caption starts at the bar
  // and is pulled left when it would run past the end of the ruler.
  const rowH = 30;
  const top = 4;
  const rows = items
    .map((t, i) => {
      const y = top + i * rowH;
      const x1 = x(ym(t.start));
      const x2 = x(ym(t.end));
      const w = Math.max(x2 - x1, 4);
      const edu = t.kind === "education";
      const caption = t.dates ? `${t.label}, ${t.dates}` : t.label;
      const est = caption.length * 4.9;
      const tx = Math.max(24, Math.min(x1, 714 - est));
      const fill = edu ? "#fff" : i === items.length - 1 || t.current ? c.spot : c.mark;
      return `<g class="bar"><title>${esc(caption)}</title><text x="${tx}" y="${y + 9}" font-size="8.6" fill="#121212">${esc(t.label)}${
        t.dates ? `<tspan class="cap" font-size="8.6" fill="#52514e">, ${esc(t.dates)}</tspan>` : ""
      }</text><rect x="${x1}" y="${y + 13}" width="${w}" height="12" fill="${fill}"${edu ? ` stroke="${c.mark}" stroke-width="1.2"` : ""}/></g>`;
    })
    .join("");
  const axisY = top + items.length * rowH + 4;
  const ticks = [];
  const labels = [];
  for (let yr = lo; yr <= hi; yr++) {
    ticks.push(`M${x(yr)} ${axisY}v-8`);
    if (yr < hi) labels.push(`<text x="${x(yr)}" y="${axisY + 13}">${yr}</text>`);
  }
  return `<section class="panel wide" aria-labelledby="h-time"><h2 id="h-time">Timeline, to scale</h2><p>Filled bars are employment, the outlined bar is education. One year on the ruler is one year on the page.</p>
<svg class="fig" viewBox="0 0 730 ${axisY + 18}" role="img" aria-label="${esc(items.map((t) => `${t.label} ${t.dates ?? ""}`).join("; "))}">
<g stroke="#c3c2b7" fill="none"><path d="M24 ${axisY}H714"/><path d="${ticks.join("")}"/></g>
<g class="cap" font-size="9.4" fill="#52514e" text-anchor="middle">${labels.join("")}</g>
${rows}
</svg></section>`;
}

export function buildBrief(d, opts = {}) {
  const c = { ...DEFAULT_COLORS, ...(d.colors ?? {}) };
  const css = readFileSync(join(TEMPLATE_DIR, "fit-brief.css"), "utf8");
  const pdfName = opts.pdfName ?? "fit-brief.pdf";
  const dlbar = opts.site
    ? `<div class="dlbar"><span class="who">${esc(d.name)} &nbsp;/&nbsp; Why this role fits</span><a href="${esc(pdfName)}" download>Download PDF</a></div>`
    : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(d.name)}: why the ${esc(d.role)} role fits</title>
<meta name="robots" content="noindex">
<style>
:root {
  --ink: #121212; --ink-2: #52514e; --ink-3: #6b6a65; --rule: #e1e0d9; --base: #c3c2b7; --stock: #ffffff;
  --spot: ${c.spot}; --mark: ${c.mark}; --wash: ${c.wash}; --on-spot-2: ${c.onSpot2};
  --display: Bahnschrift, "DIN Alternate", "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  --text: "Segoe UI", "Helvetica Neue", Carlito, Calibri, Arial, sans-serif;
}
${css}
</style>
</head>
<body>
${symbols(c)}
${dlbar}
<main class="table">
<section class="sheet" aria-label="Proof sheet 1 of 2">
${slug(d, 1)}
<div class="artwork">
${principal(d)}
${register(d)}
</div>
${strip(c, 1)}
${chrome(c)}
</section>
<section class="sheet" aria-label="Proof sheet 2 of 2">
${slug(d, 2)}
<div class="artwork"><div class="panels">
${story(d.story, c)}
${system(d.system, c)}
${credentialsAndContact(d)}
${traits(d)}
${timeline(d, c)}
</div></div>
${strip(c, 2)}
${chrome(c)}
</section>
</main>
<script>
(function () {
  var table = document.querySelector('.table');
  var bar = document.querySelector('.dlbar');
  var W = 816;
  function fit() {
    var avail = document.documentElement.clientWidth - 24;
    var s = Math.min(1, avail / W);
    table.style.transform = ''; table.style.height = '';
    if (s < 1) {
      var h = table.offsetHeight;
      table.style.transform = 'scale(' + s + ')';
      table.style.height = (h * s) + 'px';
      table.style.marginLeft = Math.max(0, (avail - W * s) / 2) + 'px';
      if (bar) bar.style.width = (W * s) + 'px';
    } else { table.style.marginLeft = ''; if (bar) bar.style.width = ''; }
  }
  window.addEventListener('resize', fit);
  window.addEventListener('beforeprint', function () { table.style.transform = ''; table.style.height = ''; table.style.marginLeft = ''; });
  window.addEventListener('afterprint', fit);
  window.addEventListener('load', fit);
  fit();
})();
</script>
</body>
</html>
`;
}

/** Strings that must survive into the PDF text; a missing one means a sheet overflowed and clipped it. */
export function briefProbes(d) {
  const first = (s) => String(s ?? "").replace(/\*\*/g, "").split(/\s+/).slice(0, 5).join(" ");
  const probes = [];
  const reqs = d.requirements ?? [];
  if (reqs.length) probes.push({ where: "last requirement (sheet 1)", text: first(reqs.at(-1).evidence) });
  if (d.timeline?.length) probes.push({ where: "timeline (sheet 2)", text: first(d.timeline.at(-1).label) });
  if (d.provenance) probes.push({ where: "contact panel (sheet 2)", text: first(d.provenance) });
  return probes;
}

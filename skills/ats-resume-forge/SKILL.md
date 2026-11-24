---
name: ats-resume-forge
description: Build truthful, ATS-safe resumes and ship them as a verified PDF and an optional Vercel web page. Use when the user asks to write, rewrite, tailor, ATS-optimize, or "match" a resume to a job description; pastes a resume plus a JD; asks for a resume PDF, a resume website, or a new resume template; or wants interview questions that expose gaps in a resume. Works for any candidate, role, or seniority.
---

# ATS Resume Forge

Turn a candidate's real history plus a target job into a resume that passes machine parsing and survives a sharp interviewer. The output is a `resume.json`, rendered by this repo's CLI into an ATS-safe HTML file, a verified PDF, and, on request, a static site deployed to Vercel.

The CLI lives in the repo root: `node bin/resumeforge.mjs <command>` (or `resumeforge <command>` after `npm link`). Run `resumeforge` with no arguments for help.

## Non-negotiable rules

1. **Evidence before adjectives.** Every claim traces to something the candidate gave you: their resume, their written answers, a repository, a certificate. Never invent employers, titles, dates, degrees, certifications, tools, or metrics.
2. **Titles and dates are immutable.** Keep job titles exactly as held. A headline may describe the target role; the experience rows may not rename a past job.
3. **Calibrate to tenure.** A four-month role cannot carry five platforms and a two-year transformation. Trim claims until a skeptical interviewer would believe them for that time span.
4. **No skills graveyard.** Every skill in the Skills section must also appear in a bullet, the summary, or a project. If it can't be evidenced, cut it or ask the candidate. `resumeforge lint` flags unevidenced skills.
5. **Partial is partial.** If the candidate meets a requirement only in part, phrase it as what they actually did. Never round up. Interview time is when overclaims die.
6. **Metrics must be real.** If the candidate cannot recall a number, write the bullet without one. Do not convert a human process time into a system latency, a team result into a personal one, or an estimate into a fact.
7. **Keep candidates separate.** Never carry an employer, number, or project from one person's material into another's resume. If answers mention companies that are not on the candidate's record, stop and ask.
8. **Data stays local.** Candidate material lives in a gitignored working folder (`candidates/`, `out/`). Never commit it, never paste it into public issues, never deploy a resume site without the candidate's consent.

## Workflow

### 1. Intake
Collect, and ask once for anything missing:
- The candidate's current resume (PDF, DOCX, text, or pasted).
- The target job description (full text, not a title).
- Constraints: page size (Letter or A4), page limit, target country, anything the candidate has asked to include or remove.

### 2. Evidence inventory
Build a fact list from the resume and the candidate's answers, using `references/knowledge-base-extraction.md`: employers, titles, dates, tools per role, metrics with their source, certifications. Mark each fact as confirmed or inferred. Inferred facts never reach the page without confirmation.

### 3. Decompose the job
Use `references/jd-decomposition.md` and `references/jd-signal-universe.md`: required versus preferred skills, responsibilities, repeated phrases, seniority signals, domain terms, compliance terms. Produce a short must-have keyword list (one or two words each).

### 4. Gap map and questions
Score each requirement as met, partial, or missing (`references/scoring-rubric.md`). For every partial or missing item that the candidate might genuinely have, ask a targeted question in interviewer style ("What volume of tickets did you handle per week, and in which tool?"). Keep questions minimal and grouped. Do not proceed on guesses.

### 5. Write `resume.json`
Follow `references/tailoring-rules.md` and `references/resume-json.md`:
- Headline: target role in the job's own words plus two or three true specialties.
- Summary: years of experience, core stack, two quantified wins, in three or four sentences.
- Skills: grouped, ordered by the job's priorities, every item evidenced.
- Experience: reverse chronological. Most recent role gets the most bullets. Each bullet is action, scope, and outcome; bold the keywords a recruiter scans for with `**double asterisks**`.
- Put the must-have keywords in `mustHaveKeywords` so verification can check them.
- No em dashes or en dashes in content; use commas, colons, or "to" for date ranges.

Run `resumeforge lint resume.json` and fix every warning you can.

### 6. Pick a template
Run `resumeforge templates`. Choose a template the user has not already used for another person in this workspace (the CLI tracks usage in `.resumeforge/history.json` and picks an unused one by default). Two candidates from the same sender should never arrive looking identical. All templates are single column, text-only, and ATS-safe; novelty comes from header composition, heading treatment, and accent, never from columns, icons, or images.

### 7. Render and verify
```
resumeforge pdf resume.json --out out/<candidate>
```
The CLI searches for the largest body size (8.2pt to 11pt) that keeps the resume within `maxPages`, prints with headless Chrome or Edge with no header or footer, then verifies: page count, selectable text, name first, every section heading present, every must-have keyword present, zero em/en dashes, no browser header/footer artifacts. Fix the content, never the PDF, until verification passes. If it cannot fit even at 8.2pt, cut the weakest bullets rather than shrinking further.

Then look at the PDF yourself (rasterize with `pdftoppm -png -r 80` if you can view images) for wrapping, orphans, and alignment.

### 8. Website (optional, with consent)
```
resumeforge site resume.json --out out/<candidate>
resumeforge deploy out/<candidate>/site-<name>
```
The site is a static `index.html` with a Download PDF button, the PDF itself, and a `vercel.json` that sends `X-Robots-Tag: noindex, nofollow`. Deploying needs `vercel login` or a `VERCEL_TOKEN` in the environment. Tell the user the URL is public to anyone who has it.

### 9. Hand-off
Report: the PDF path, the site URL if deployed, the verification table, the requirements still partial or missing (stated plainly), and five to ten interview questions an interviewer is likely to ask about the riskiest bullets, so the candidate can rehearse.

## Reference files

| File | Use it for |
|---|---|
| `references/resume-json.md` | The `resume.json` schema this CLI renders |
| `references/knowledge-base-extraction.md` | Building the evidence inventory |
| `references/jd-decomposition.md` | Parsing a job description |
| `references/jd-signal-universe.md` | Keyword families and adjacent-skill bridges |
| `references/scoring-rubric.md` | Met, partial, missing classification and match score |
| `references/tailoring-rules.md` | What may change and what may never change |
| `references/ats-rules.md` | Formatting and keyword placement for parsers |
| `references/verification-checklist.md` | Final QA before delivery |

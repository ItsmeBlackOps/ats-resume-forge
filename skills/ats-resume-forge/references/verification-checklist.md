# Pre-Output Verification Checklist

Run every check below before writing the file to disk. If any check fails, fix it, don't ship anyway.

## Content integrity (truth)

- [ ] Every claim in the resume traces to a fact in the candidate knowledge base
- [ ] No tools, languages, or skills listed that the candidate hasn't used
- [ ] Employment dates match the base resume exactly (no rounding, no nudging)
- [ ] Company names match the base resume exactly
- [ ] Job titles match (or are slash-augmented with truthful scope)
- [ ] Education degrees, institutions, and graduation dates match exactly
- [ ] Years of experience in summary matches the math (sum the role lengths)
- [ ] Numbers (percentages, dollars, scale figures) match the base resume, none inflated
- [ ] No fabricated certifications, awards, or memberships

## JD alignment (relevance)

- [ ] Title line mirrors the JD role title verbatim
- [ ] Top 5 JD must-have keywords appear in the professional summary
- [ ] ≥ 80% of JD must-haves appear somewhere on the resume (target ≥ 90%)
- [ ] Each must-have keyword appears at least twice (skills section + a bullet)
- [ ] JD's nice-to-haves are mentioned where the candidate has truthful evidence
- [ ] Tone keywords from the JD echo (subtly) in the summary
- [ ] Lead bullet of the most-recent role maps to the JD's #1 must-have

## Structure (ATS-safe)

- [ ] Single-column layout, no tables, no text boxes, no columns
- [ ] Standard font: Calibri / Arial / Helvetica / Times New Roman
- [ ] Body text 10.5 to 11pt; name 18 to 22pt; section headers 11 to 12pt
- [ ] Contact info in document body (not in header or footer)
- [ ] No images, icons, photos, logos, or decorative graphics
- [ ] No emojis anywhere in the content
- [ ] Section headers in correct order: Summary → Skills → Experience → Education → (optional)
- [ ] Standard bullet character (• or -), no custom Unicode glyphs

## Bullet quality

- [ ] Every bullet starts with a strong action verb
- [ ] Every bullet has a quantified outcome OR a clear scale indicator
- [ ] No "responsible for", "helped with", "worked on", "involved in"
- [ ] No bullet wraps past 2 lines as rendered
- [ ] Most JD-relevant bullet is bullet #1 in each role
- [ ] JD keywords are bolded (`<b>`) inside bullets, both for ATS density and recruiter scanability
- [ ] Verb tense is correct (past for past roles, present for current)
- [ ] Bullet count per role: 5-7 (current), 4-5 (next), 3-4 (older); old roles compressed to 1-2 lines

## Summary block

- [ ] 75 to 95 words, 4-5 sentences
- [ ] Sentence 1 contains: role title from JD + computed YOE + top must-have skill
- [ ] At least 2 quantified achievements named in the summary
- [ ] No first-person pronouns (no "I", "my", "me")
- [ ] No clichés ("hardworking", "team player", "passionate", "results-driven")
- [ ] Tone matches the JD's voice (formal vs. casual)

## Technical Skills block

- [ ] Categorized into clear groups (Languages, Cloud, Databases, BI, etc.)
- [ ] JD's priority category appears first
- [ ] Each tool listed appears in at least one bullet (proves real use)
- [ ] No proficiency labels ("Expert in X", "Advanced Y"), bullets prove scope
- [ ] Uses JD's exact phrasing (Power BI not PowerBI, etc.)
- [ ] No trivial skills (Microsoft Word, Email, Internet)
- [ ] No tools the candidate hasn't actually used

## Length

- [ ] 0 to 5 yrs experience → 1 page when printed
- [ ] 5 to 12 yrs → 1 to 2 pages
- [ ] 12+ yrs → 2 pages max
- [ ] No bullets running into a 3rd page solely because they're unedited

## Filename

- [ ] Format: `<Company>_<Role>.html` (or `<Candidate>_<Company>_<Role>.html` for batch generation)
- [ ] No spaces, parentheses, version tags
- [ ] ASCII only, ≤ 80 characters total

## Report-back

- [ ] Match score computed and reported
- [ ] Surfaced (🟢) keywords listed in the report
- [ ] Reframed (🟡) skills listed
- [ ] Honest gaps (🔴) listed, never hidden
- [ ] Next-step suggestions included (PDF export, outreach plan, cover letter)

## The "6-second test"

A recruiter spends roughly 6 seconds on first scan. After running all the above checks, do this final qualitative test:

> Show the rendered HTML to someone (or imagine doing so). Ask them: "What role is this person applying for?"

If they answer correctly within 6 seconds, the title line and summary are working. If they hesitate or get it wrong, go back to Step 4 of the workflow and re-tighten the title line and summary opening sentence.

## Stop / fix conditions

If any of these are true, do NOT write the file:

- [ ] Match score < 75% (skip the role; tell the user)
- [ ] Any deal-breaker is unmet (citizenship, clearance, location-only), skip
- [ ] Any forbidden claim ended up in the resume, fix and re-verify
- [ ] Filename collision with an existing tailored resume, confirm with user before overwriting

If any of these are true, write the file but flag it in the report:

- [ ] Match score 75 to 84%, note in report; ask if user wants to ship anyway
- [ ] One or more must-haves are 🔴, list them so user is informed
- [ ] YOE gap of 1+ year vs. JD requirement, mention in report

## Final pre-write self-check

Read the rendered output (or its text version) end to end one time. Ask yourself:
- Would I, if I were a recruiter, want to call this person?
- Would I, if I were a hiring manager, want to interview this person?
- Would I, if I were the candidate, be comfortable defending every claim in this resume in an interview?

If the answer to any is "no", iterate. If "yes" to all three, ship it.

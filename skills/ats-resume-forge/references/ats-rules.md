# ATS Rules, Formatting and Keyword Placement

The resume must pass through Applicant Tracking System (ATS) parsers, Workday, Greenhouse, Lever, iCIMS, SmartRecruiters, Taleo, Ashby, BambooHR, without losing structure or keywords. Roughly 75% of resumes get filtered before any human sees them. These rules prevent that.

## How ATS parsers actually work

When a candidate submits a resume:
1. The ATS extracts text from the file (PDF / DOCX / sometimes HTML).
2. It segments the text into sections: contact info, experience, education, skills.
3. It runs a literal **keyword match** against the JD's required and preferred phrases.
4. It scores the resume (0-100%).
5. Recruiters see only candidates above a threshold (commonly 60-80%, sometimes 90%+).

Two failure modes:
- **Parse failure:** the resume's structure confuses the parser, fields get scrambled or lost.
- **Keyword miss:** required phrases aren't on the resume in literal form, so the score is too low.

The rules below address both.

## Formatting, what passes ATS

✅ **Single-column layout.** Multi-column layouts get scrambled, section headers from one column blend into bullets from another.

✅ **Standard fonts.** Calibri, Arial, Helvetica, Times New Roman, Georgia. Anything else risks character substitution.

✅ **Font sizes:** 10.5 to 11pt body, 18 to 22pt name, 11 to 12pt section headers. Smaller risks legibility; larger pushes page to 2.

✅ **Black text on white.** Subtle accent colors (navy, dark blue) are fine for headers. Avoid colored text for body content.

✅ **Clear section headers** with consistent capitalization. The parser uses these to segment: "Professional Experience", "Education", "Technical Skills", "Certifications".

✅ **Standard bullet characters.** `•` or `-` are universally parsed. Custom Unicode glyphs may not be.

✅ **Save as PDF (text-based).** PDF is the most reliable format. Make sure the PDF is text-selectable, not a scanned image.

✅ **File name without spaces or special characters.** `Jane_Doe_Acme_DataEngineer.pdf` ✓, `Jane Doe, Resume (final v2).pdf` ✗.

## Formatting, what breaks ATS

❌ **Multi-column layouts.** Almost every two-column "modern" resume template breaks at least one major ATS.

❌ **Tables, text boxes, frames.** ATS parsers often skip or jumble cell content.

❌ **Headers and footers** containing key info. Many parsers ignore them. Put name + contact in the **body** of the document.

❌ **Images, logos, icons, photos.** ATS can't read them. They sometimes confuse the parser into skipping nearby text.

❌ **Decorative or script fonts.** Comic Sans, Pacifico, anything cursive or display-only.

❌ **Colored or patterned backgrounds.** Reduces parse accuracy and looks unprofessional.

❌ **Submitting as a .png, .jpg, or scanned PDF.** Image-based files require OCR; many ATS skip them.

❌ **Emojis.** They get parsed as garbage characters or stripped.

❌ **Special characters in the file name.** Em-dashes, parentheses with version tags, non-ASCII.

❌ **Long blocks of italic text.** Italics reduce parse confidence.

❌ **Underlines on body text** (other than links). Same reason.

## Keyword placement strategy

Every JD must-have keyword should appear at least **twice**:
1. **Once in Technical Skills**, the parser's primary harvesting ground for keywords
2. **Once in a bullet**, proves the candidate actually used it, not just listed it

For the most important must-haves (top 3-5), aim for **three** placements:
1. Skills section
2. A bullet
3. The professional summary

### Use the JD's exact phrasing

ATS does literal string matching. Synonyms and abbreviations get penalized.

| JD says | Use on resume | Don't use |
|---|---|---|
| "Power BI" | Power BI | PowerBI, MS BI |
| "Microsoft Power BI" | Microsoft Power BI (and Power BI alone) | just "BI" |
| "machine learning" | machine learning (and ML if also listed) | only "ML" |
| "stakeholder management" | stakeholder management | "stakeholder mgmt" |
| "Amazon Web Services" | Amazon Web Services (AWS) | only "AWS" |
| "Customer Relationship Management (CRM)" | Customer Relationship Management (CRM) | only "CRM" |

When the JD lists both the long form and abbreviation, include both. When it lists only one, include only that one, but you may add the other in parentheses.

### Match verb forms

If the JD says "designed pipelines" and your bullet says "designs pipelines", many ATS won't fuzzy-match. Mirror tense. Past-tense for past roles, present for current.

### Avoid keyword stuffing

Stuffing the resume with the JD keyword 10 times doesn't 10× the score, most ATS cap repetition value at 2-3 instances. And human recruiters spot stuffing immediately.

The right pattern: each must-have keyword appears 2-3 times, naturally embedded in real bullets and the skills section. No "Skills: Python, Python, Python."

## Section ordering

ATS parsers expect a standard order. Use it:

1. Contact block (name + city/state + phone + email + LinkedIn)
2. Professional Summary (or "Profile")
3. Technical Skills (or "Core Competencies", "Skills")
4. Professional Experience (most recent first)
5. Education
6. (Optional) Certifications, Projects, Publications, Languages

Do not lead with a "Career Objective." It's been deprecated for ~15 years and signals junior-level thinking.

## Contact block specifics

The contact block goes in the **body** of the document, never in a header or footer. ATS often skips headers/footers.

Required:
- Full name (first + last)
- City, State (sometimes city only is fine; full address never)
- Phone number (with country code if applying internationally)
- Professional email (firstname.lastname@gmail.com, never partyboy99@hotmail.com)
- LinkedIn profile URL (customized: linkedin.com/in/firstname-lastname)

Optional:
- Personal website / portfolio (if relevant)
- GitHub (if engineering role)

Never include:
- Photo
- Date of birth, marital status, nationality
- Full street address
- A second phone number "in case the first doesn't work"

## Bullet writing for ATS

Each bullet should:
- Start with a strong action verb (parsers and recruiters both scan for these)
- Mention a tool/skill/keyword by name
- Include scale or measurable outcome
- Stay to 1-2 lines as rendered

```
✅ "Architected migration of HEDIS pipeline from SQL Server to Snowflake, replaced 40+ stored procs with 20 dbt models, cut runtime 60% across 20M+ records."
✗  "Was responsible for data pipeline modernization."
```

The first bullet hits Snowflake, dbt, runtime, and scale figure. The second hits nothing.

## Length

| Years of experience | Page count |
|---|---|
| 0 to 5 yrs | 1 page |
| 5 to 12 yrs | 1 to 2 pages |
| 12+ yrs | 2 pages max |

Going to 3 pages for a senior IC role signals "doesn't know how to prioritize." Cut.

## Pre-submit smoke test

Before considering a resume done:

1. Open the PDF in any PDF reader.
2. Select All (Ctrl+A) → Copy → paste into Notepad.
3. Read the text version.
4. Do the sections appear in the right order? Is contact info on top? Are bullets intact?

If anything is scrambled, the ATS will see the same scrambled version. Fix the formatting and re-export.

If you want a more rigorous test, a free service like Jobscan or Resumeworded will compute your literal keyword match score for a given JD. Aim for ≥ 80% there.

# JD Decomposition

How to parse any job description into structured fields the tailoring engine can consume. Run this **before** building the match matrix, not in parallel with it, you want the JD parse to be unbiased by what the candidate happens to have.

## Read the JD three times

Most JD-parsing failures come from skimming. Read it three times deliberately:

1. **First pass:** Just understand what the role is. Don't extract anything. Build a mental model.
2. **Second pass:** Highlight every skill, tool, certification, and number.
3. **Third pass:** Note tone (formal vs. casual), recurring themes, and what the JD doesn't say but implies.

## Extract these fields, in this order

```
─────────────────────────────────────
COMPANY:        <exact legal/brand name>
ROLE TITLE:     <exact, no paraphrase>
REQ ID:         <if present, useful for outreach>
LOCATION:       <city, state, country>
WORK MODE:      onsite | hybrid | remote | flexible
YOE REQUIRED:   <range, e.g. "3-5" or "5+">
SENIORITY:      entry | associate | mid | senior | staff | principal | director+
COMP BAND:      <as listed, or "Not listed">
DOMAIN:         <healthcare payer | b2b SaaS | fintech | etc.>
ATS PLATFORM:   <Workday | Greenhouse | Lever | iCIMS | SmartRecruiters | Taleo | unknown>
                (look at the URL: jobs.lever.co, *.workday.com, etc.)
APPLY URL:      <direct posting URL>
─────────────────────────────────────

MUST-HAVE SKILLS (from "Requirements" / "What you'll need" / "Required"):
- <verbatim phrase 1>
- <verbatim phrase 2>
...

NICE-TO-HAVE SKILLS (from "Bonus" / "Preferred" / "Plus"):
- <verbatim>
...

EXACT KEYWORDS (every multi-word phrase to surface in the resume verbatim):
- <e.g. "stakeholder management">
- <e.g. "data pipelines at scale">
- <e.g. "cross-functional collaboration">

DEAL-BREAKERS (any of these unmet → SKIP the role):
- US Citizenship required? Y/N
- Security clearance? Y/N, what level?
- Specific location only? Y/N
- Specific shift / on-call? Y/N
- Visa sponsorship: provided / not provided / unstated

TONE KEYWORDS (echo these in the summary's voice):
- <e.g. "scrappy", "mission-driven", "ownership", "first principles">

RESPONSIBILITIES (what they'll do day-to-day, top 5):
1. <verb + object>
2. ...
```

## Capturing keywords correctly

ATS scanners do literal string matching, not semantic matching. Three rules:

1. **Use the JD's exact phrasing.** If the JD says "Power BI", don't write "PowerBI". If it says "machine learning", write "machine learning", don't substitute "ML". If it says both, include both.

2. **Multi-word phrases > single tokens.** "Stakeholder management" is a phrase the ATS scores as one unit. "Stakeholder" alone won't match.

3. **Capture verb forms separately when they vary.** If the JD says "designed pipelines" and you write "designs pipelines", many ATS won't fuzzy-match. Mirror tense.

## Spotting must-have vs. nice-to-have

Different JDs use different headers. Use this priority:

**Must-have indicators:**
- "Required", "Must have", "You have", "What you'll need", "Minimum qualifications"
- Anything that uses "must", "required", "essential"
- Years of experience tied to a specific skill ("3+ years of Python") = must-have

**Nice-to-have indicators:**
- "Bonus", "Preferred", "Nice to have", "Plus", "Ideal"
- "Familiarity with", "Exposure to", "Comfortable with"
- Anything that uses "ideally", "preferably"

When in doubt, treat it as must-have for scoring. It's safer to slightly over-weight requirements than under-prepare.

## Domain & industry detection

This determines which of the candidate's bullets get foregrounded:

- **Healthcare payer:** keywords include HEDIS, NCQA, CMS Stars, Risk Adjustment, HCC, RAF, Medicare, Medicaid, claims, encounters, EDPS/RAPS
- **Healthcare provider:** keywords include EHR (Epic, Cerner), Clinical, ICD-10, CPT, DRG, patient outcomes, length of stay
- **Fintech:** keywords include payments, ledger, KYC, AML, transaction, risk, treasury, GAAP
- **B2B SaaS:** keywords include MRR, ARR, churn, NRR, pipeline, AE, SDR, expansion
- **E-commerce:** keywords include cart, checkout, conversion, AOV, fulfillment, SKU
- **Marketplace:** keywords include supply, demand, GMV, take-rate, two-sided
- **Adtech:** keywords include CTR, CPM, attribution, programmatic, DSP/SSP

If the JD doesn't fit any of these, label the domain neutrally (e.g. "data analytics, generic enterprise") and don't force a specific framing.

## ATS platform detection

Look at the apply URL or any "powered by" footer:

| URL pattern / footer | Platform |
|---|---|
| `jobs.lever.co/...` | Lever |
| `*.workday.com`, `myworkdayjobs.com` | Workday |
| `boards.greenhouse.io`, `job-boards.greenhouse.io` | Greenhouse |
| `*.icims.com` | iCIMS |
| `careers.smartrecruiters.com` | SmartRecruiters |
| `*.taleo.net` | Taleo |
| `jobs.ashbyhq.com` | Ashby |
| `*.bamboohr.com/jobs` | BambooHR |

Knowing the platform helps because each has slightly different keyword-parsing quirks (Workday is strict; Greenhouse is forgiving). It also helps with outreach-plan generation.

## What to ignore

- Boilerplate ("we are an equal opportunity employer", "background check required")
- Marketing fluff ("be part of something bigger")
- Benefits descriptions
- Application instructions

These are signal-free for resume tailoring.

## Output format

The decomposition should produce a single block (in markdown or JSON) that downstream steps consume directly. Don't pass the raw JD around, pass the decomposed structure.

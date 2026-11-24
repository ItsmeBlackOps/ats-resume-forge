# Knowledge Base Extraction

Read this whenever you tailor a resume. The knowledge base is the **only** source of truth for what may appear in the tailored output. It must be built carefully, over-extracting causes fabrication, under-extracting causes weak resumes.

## Why this exists

Most tailoring failures come from skipping this step. When you tailor straight from JD ↔ base resume in your head, you tend to add JD keywords that "feel like" they could have been in the candidate's experience. That's how fabrication happens.

The fact inventory forces you to commit, in writing, to what's true *before* the JD biases you. Then you tailor against the inventory, not the JD's wish list.

## What to extract

### 1. Candidate identity block
- Full name (use the exact spelling and any middle name/initial, keep consistent across all tailored versions)
- Contact details: city + state, phone, email, LinkedIn URL
- Visa / work authorization, if stated
- Computed YOE: months from earliest full-time role's start date to today, ÷ 12. Floor at full years for the resume; carry decimals internally for matching against JD ranges.

### 2. Education
- Each degree: name, institution, location, graduation month + year (or expected)
- GPA only if stated and ≥ 3.5
- Honors, relevant coursework if junior

### 3. Certifications
- Each cert: name, issuer, date earned (or "in progress")
- Cloud/data certs especially matter, AWS, Azure, GCP, Snowflake, Databricks, dbt, Tableau, Power BI

### 4. Employment history (per role)

For each job in the base resume, extract:

```
ROLE: <exact title held>
COMPANY: <exact name>
LOCATION: <city, state, country, or "Remote">
DATES: <Month YYYY> - <Month YYYY or "Present">
DOMAIN: <industry / vertical, e.g. "Healthcare payer", "B2B SaaS", "Fintech">

ACHIEVEMENTS (every quantified bullet, copied as-is):
- <bullet 1, with the original numbers>
- <bullet 2>
...

TOOLS ACTUALLY USED (only what's named in this role's bullets):
- <list>

PARTNERSHIPS (cross-functional teams worked with):
- <list>

NOTABLE: <ownership scope, mentorship, audit results, anything special>
```

Be literal. If the bullet says "built dashboards in Power BI", extract "Power BI" but not "Tableau", Tableau may be in another role's bullets, not this one.

### 5. Tech stack inventory (rolled-up across all roles)

Group all tools into categories. For each tool, note the roles it appears in. This depth signal is what distinguishes "🟢 strong" from "🟡 medium" later.

```
LANGUAGES:        Python (CVS, Optum, Philips), SQL (all), Bash (Optum), R (Optum)
DATABASES:        Snowflake (all), SQL Server (CVS), PostgreSQL (Optum), Redshift (CVS)
CLOUD:            Azure (CVS), AWS S3+Redshift (CVS), Snowflake (Optum)
ETL/PIPELINES:    dbt (CVS, Optum, Philips), PySpark/Databricks (CVS, Optum), SSIS (Philips)
BI:               Power BI (CVS, Optum), Tableau (CVS, Philips), Looker (, )
AI / LLM TOOLS:   Claude / Claude Code (CVS), GitHub Copilot (CVS), Cursor (, )
DOMAIN:           HEDIS, CMS Stars, Risk Adjustment HCC/RAF, NCQA, ICD-10/CPT, Epic Clarity
```

Tools that appear in 2+ roles = 🟢-eligible. Tools in 1 role = 🟡-eligible (mention with scope). Tools in 0 roles = forbidden (do not list).

### 6. Quantified achievements, the gold

Pull every number, %, dollar amount, scale figure, or measurable outcome out of the bullets into a single list. These are the ammunition for the summary block, recruiters scan for numbers in the first 6 seconds.

```
QUANTIFIED ACHIEVEMENTS:
- 60% pipeline runtime reduction (CVS, Synapse migration)
- $190K+ spend discrepancies surfaced (Optum, Python recon script)
- Batch runtime 4 hr → 35 min (Optum, Databricks PySpark)
- 40% manual reporting eliminated (CVS)
- 20M+ claims records / 15M+ member records / 50K+ patients (scale figures)
- Zero NCQA audit findings (compliance outcome)
- 6 days → 3 days reporting cycle (Optum)
- Mentored 2 junior analysts (Optum)
```

Rank these by magnitude of impact. The top 3-4 go into the summary. The rest distribute across role-specific bullets.

### 7. Forbidden claims (the "do not include" list)

Make this explicit. Write down:
- Tools the candidate has not used (even if "they're like X which I have used")
- Years of experience the candidate doesn't have (don't round 3.6 up to "5+")
- Job titles never held
- Companies never worked at
- Education credentials not earned
- Domain expertise not demonstrated (e.g. "fintech" if all jobs were healthcare)

When the JD asks for one of these and the candidate doesn't have it, it goes on the 🔴 list in the match matrix. It does NOT go in the resume.

## Handling ambiguous cases

| Case | Decision |
|---|---|
| "Touched X briefly", used in a sandbox, never production | 🟡, mention with scope ("evaluated X in PoC") |
| "Heard of X via team standup", never used | 🔴, forbidden |
| "Tutorial/coursework only", academic, not professional | Cite under Education / Coursework, not Skills |
| Self-taught at home, no professional use | 🟡, mention as "self-taught" if relevant; never claim production scope |
| Adjacent tool ("Snowpipe" vs JD's "Kafka") | 🟡, mention the real tool, not the JD's |
| Same tool, different vendor (Tableau vs Looker) | Different tools. Don't substitute. |
| Synonym (NumPy/Pandas under "Python") | Roll up; "Python (Pandas, NumPy)" is fine |
| Title at company differs from common usage | Use what's on the offer letter / LinkedIn |

## Format for handing off

Write the full inventory in a scratch file or pass it inline before tailoring. Don't tailor from memory of a quick read, extract first, then tailor.

The skill that uses this inventory only needs to consult three things during tailoring:
1. The fact inventory (what's true)
2. The JD parse (what's asked for)
3. The match matrix (the intersection)

Everything else is template.

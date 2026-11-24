# Tailoring Rules, What You Can and Cannot Change

The single hardest discipline in resume tailoring is knowing where the line sits between **honest reframing** and **fabrication**. This document is the line.

## The mental model

Think of the base resume as a **fact database** and the tailored version as a **query result**. You can:
- Filter (omit irrelevant facts)
- Sort (reorder by relevance)
- Project (highlight specific columns/details)
- Format (apply different wording while preserving meaning)

You cannot:
- Insert new rows (add facts that aren't there)
- Mutate values (change numbers, dates, names)
- Aggregate falsely (combine half-truths into a stronger claim)

## What you may change freely

### Wording
- ✅ Rephrase any bullet to use the JD's vocabulary, as long as the underlying fact is unchanged
- ✅ Substitute synonyms (e.g. "built" ↔ "engineered", "led" ↔ "drove")
- ✅ Tighten verbose bullets to 1-2 lines
- ✅ Surface a specific tool the bullet used but didn't name (only if the candidate actually used it)

### Ordering
- ✅ Reorder bullets within a role to put the JD-relevant one first
- ✅ Reorder skill categories so the JD's priority stack appears first
- ✅ Reorder skills within a category for the same reason

### Emphasis
- ✅ Bold (`<b>`) keywords that appear in the JD
- ✅ Move a quantified achievement from a buried bullet to the summary
- ✅ Drop a bullet entirely if it's irrelevant to the JD (and replace with a more relevant one, from the same role)

### Title line
- ✅ Mirror the JD's exact role title verbatim
- ✅ Append 4-6 of the JD's top must-have keywords
- ✅ Drop the candidate's preferred self-description if the JD frames things differently

### Summary
- ✅ Rewrite from scratch, every time, JD-specific
- ✅ Adjust tone (formal vs. casual) to match the JD
- ✅ Surface different quantified wins for different JDs

### Skills section
- ✅ Add a new category if the JD requires it AND the candidate has the skills (e.g. add "AI / LLM Tooling" if JD mentions Claude/Copilot and candidate uses them)
- ✅ Drop a category if no JD requirement touches it
- ✅ Use the JD's exact phrasing for tools

### Job-title augmentation (narrow)
- ✅ Augment a held title with a slash if duties truthfully spanned both, e.g. "Data Analyst / Junior Engineer" if the bullets back both
- ❌ Replace a held title with a different one ("Data Analyst" → "Senior Data Engineer" when the candidate was an Analyst)

## What you may never change

### Facts about employment
- ❌ Employment dates, they are what they are
- ❌ Company names, verbatim from base resume
- ❌ Locations, verbatim
- ❌ Job titles outright, only slash-augmentation as above

### Education / credentials
- ❌ Degree names, institutions, graduation dates
- ❌ Add credentials the candidate hasn't earned
- ❌ Move "in progress" to "completed"

### Numbers
- ❌ Inflate any quantified claim (60% becomes 75%, $190K becomes $300K, etc.)
- ❌ Combine two separate scale figures into one bigger one
- ❌ Round generously ("≈ 6 months" reported as "1 year")

### Tech stack
- ❌ Add tools the candidate hasn't used in any role
- ❌ Imply broader use than reality ("evaluated Kafka in PoC" reported as "production Kafka pipelines")
- ❌ Substitute one tool for another (Tableau ≠ Looker, they're different products even if both are BI)

### Years of experience
- ❌ Round 3.6 yrs to "5+ years"
- ❌ Count internships as full-time experience
- ❌ Count overlapping employment as additive

## Gray areas, how to decide

When you're tempted to bend a rule, ask: **"If a recruiter cold-called the candidate's previous manager, would the manager confirm this claim verbatim?"**

If the answer is no, don't write it.

| Tempting situation | Honest answer |
|---|---|
| JD wants 5 yrs, candidate has 4 | Show 4. Many recruiters accept ±1. |
| Candidate did Spark on a side project, never at work | Mention under Projects, not under a job's bullets |
| Candidate's title was "Associate I" but did senior work | Title stays "Associate I". Use bullets to show scope. |
| JD wants Tableau, candidate has Power BI | List Power BI. Don't list Tableau. They're different. |
| Candidate took an online course in Kafka | Cert/Education line, not a job bullet |
| Candidate's degree is from a non-target school | Show the school. Don't omit. |
| Candidate has an employment gap | Show the dates honestly. Address the gap in cover letter / outreach. |

## When the JD asks for something the candidate doesn't have

You have three options. Use them in order:

1. **Find an adjacent skill the candidate has.** JD wants "Kafka" → candidate has "PySpark structured streaming". List PySpark; mention streaming concepts. This is 🟡.

2. **Acknowledge the gap honestly in the report.** The match score reflects it (🔴). The user decides whether to apply anyway.

3. **Recommend the user pass on this role.** If too many must-haves are 🔴, the score is < 75%, and tailoring would require fabrication. The honest move is "this isn't your role".

## Reframing techniques (allowed)

These are powerful and 100% honest. Use freely.

### 1. Surface a tool the bullet didn't name
Before: "Built dashboards for leadership reporting."
After: "Built executive **Power BI** dashboards on top of **Snowflake**, surfacing 5 KPIs across 12M rows."
(Allowed only if the candidate actually used Power BI + Snowflake in this role.)

### 2. Quantify what was implicit
Before: "Owned the migration to a new data warehouse."
After: "Owned migration of 40+ legacy SQL Server stored procs to Snowflake, cut runtime 60% across 20M+ records."
(Allowed only if the numbers are real.)

### 3. Reframe stakeholder language
Before: "Worked with managers on monthly reports."
After: "**Partnered with Finance and Ops** on monthly close reports; surfaced $190K spend variance now logged in close checklist."

### 4. Map domain to the JD
Before: "Healthcare data work for HEDIS reporting."
After (for healthcare JD): "**HEDIS care-gap reporting** at scale, 15M+ member records, validated **RAPS / EDPS submissions** for retrospective Risk Adjustment cycles."
After (for non-healthcare JD): "Designed compliance-grade reporting pipelines on 15M+ records, validated against regulatory submission specs."

### 5. Compress old roles
Roles 5+ years old can shrink to 1-2 lines:
"Software Engineer, Acme Corp (2015 to 2018), Built early backend services in Python + Postgres; foundation for current platform."

## Output discipline

The tailored resume must:
- Be a single HTML file
- Render with the repo CLI (`resumeforge pdf resume.json`), which uses the ATS-safe templates in `templates/`
- Be ATS-safe (see `references/ats-rules.md`)
- Pass every box in `references/verification-checklist.md`

There is no "creative" path that bypasses these. Creativity goes into wording and ordering, not structure.

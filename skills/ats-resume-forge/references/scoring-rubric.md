# Match Scoring Rubric

The score is the single objective measure of "is this resume ready to submit?", it determines whether to ship, flag, or skip.

## The formula

```
score = (Σ matched must-haves × 1.0  +  Σ matched nice-to-haves × 0.5)
        / (Σ all must-haves × 1.0    +  Σ all nice-to-haves × 0.5)
        × 100
```

Must-haves are weighted 2× nice-to-haves because that's roughly how recruiters and ATS-keyword-density scoring rank importance.

## What counts as "matched"

| Strength | Counts? | When to use |
|---|---|---|
| 🟢 **Strong** | Yes (full credit) | Multiple bullets / 2+ roles directly support the requirement; you can confidently bold the keyword in a bullet |
| 🟡 **Medium** | Yes (full credit, but flag) | Partial / adjacent / single-role evidence; surface the real scope, don't oversell |
| 🔴 **Missing** | No | No honest evidence; do not include in resume |

A 🟡 still counts as a match because the resume can truthfully include a bullet that touches the topic, even if it's not the candidate's deepest skill. The goal is honest coverage, not rounded perfection.

## Worked example

JD has:
- 8 must-haves: Python, SQL, AWS, Snowflake, dbt, stakeholder mgmt, healthcare domain, BI dashboards
- 4 nice-to-haves: Airflow, Kafka, R, certifications

Candidate evidence:
- Python: 🟢, SQL: 🟢, AWS: 🟡 (S3+Redshift only), Snowflake: 🟢, dbt: 🟢, stakeholder mgmt: 🟢, healthcare: 🟢, BI: 🟢
- Airflow: 🔴, Kafka: 🔴, R: 🟡 (academic), certifications: 🔴

```
matched_must_haves    = 8 × 1.0 = 8.0
matched_nice_to_haves = 1 × 0.5 = 0.5
total_must_haves      = 8 × 1.0 = 8.0
total_nice_to_haves   = 4 × 0.5 = 2.0

score = (8.0 + 0.5) / (8.0 + 2.0) × 100
      = 8.5 / 10.0 × 100
      = 85.0%
```

That's "ship with flags" territory.

## Decision gates

| Score | Action |
|---|---|
| **≥ 95%** | Excellent, proceed and ship. The role is a strong fit. |
| **90 to 94%** | Target zone. Ship after one more pass to surface any 🟡 keywords more visibly. |
| **85 to 89%** | Acceptable. Ship but flag the missing must-haves clearly in the report. |
| **75 to 84%** | Stretch. Ask the user before tailoring. They may want to apply anyway, but it's worth a heads-up. |
| **< 75%** | Skip. Tell the user this isn't a real fit. A tailored resume here would either fabricate or look weak. |

## Re-scoring after tailoring

After you generate the HTML, recompute. The score should rise because:
- Tailored bullets surface JD keywords more prominently → ATS density goes up
- 🟡 entries that were "could mention" become "did mention" → effectively now matched
- The summary leads with JD must-haves → recruiter scan sees instant alignment

If the post-tailor score isn't at least 5% higher than the baseline, something went wrong, you didn't surface enough JD keywords. Iterate on the bullets and skills section.

## Common scoring mistakes

1. **Scoring 🟡 as 🔴.** "It's not a perfect match, so I won't count it." Wrong, 🟡 is a real match with real scope, and surfacing it truthfully gives the candidate full credit.

2. **Scoring 🔴 as 🟡 to hit 95%.** This is fabrication-by-rounding. Don't. Honest 88% beats fake 96%.

3. **Forgetting to re-score after tailoring.** The point of tailoring is to move the score up. If you don't measure, you can't tell whether you helped.

4. **Counting JD-tone keywords as must-haves.** "Scrappy" and "ownership" aren't ATS keywords; they're tone signals for the summary. Don't include them in the matrix.

5. **Counting JD-boilerplate as must-haves.** "Equal opportunity employer" is not a requirement. Filter out boilerplate before scoring.

## Output format

After scoring, hand off this structured block to the tailoring step:

```
SCORE: 92%
MUST-HAVES MATCHED: 8/8 (100%)
NICE-TO-HAVES MATCHED: 2/4 (50%)
GAPS (🔴, NOT to include in resume):
  - Kafka
  - AWS Solutions Architect cert

VERDICT: Ship with flag (mention candidate is willing to learn Kafka in cover letter)
```

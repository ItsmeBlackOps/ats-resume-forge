# fit-brief.json schema

A fit brief is a two-sheet "why this role fits" document the candidate can read to rehearse, and that is safe to forward to a recruiter. It is styled as a press proof (crop marks, a dieline, a colour bar that doubles as the legend). Sheet 1 is the requirement register; sheet 2 holds the diagrams. Start from `examples/sample-fit-brief.json` and render with:

```
resumeforge brief candidates/<name>-brief.json --out out/<name>
resumeforge brief candidates/<name>-brief.json --out out/<name> --site-dir out/<name>/<project-name> --deploy
```

Write it in the third person, evidence first, with no coaching language and no internal gap analysis: it may be forwarded. Partial matches still appear, stated plainly.

| Field | Type | Notes |
|---|---|---|
| `name`, `role`, `company` | string | Slug line and title. |
| `roleLine` | string | Line under the name. Default: "Why the `<role>` role fits". |
| `date`, `revision` | string | Shown in the slug line. |
| `fitStatement` | string | Three sentences, `**bold**` allowed. Name the partial matches here too. |
| `checks` | `{ label, text }[]` | Extra lines in the register-check box. The requirement count line is computed. |
| `requirements` | `{ requirement, status, evidence, note? }[]` | `status` is `"met"` or `"partial"`. `note` explains the partial in grey. Keep to about 12 rows so sheet 1 fits. |
| `story` | object | Optional rail diagram: `title`, `intro`, `trigger { label, text }`, `check { label, text }`, `stagesLabel`, `stages [{ short, long }]` (3 to 6, `short` up to about 7 characters), `outcome`, `throughline`, `postingLine`. |
| `system` | object | Optional three-node diagram: `title`, `intro`, `nodes [3 x { title, sub }]`, `duties [4 x { title, sub }]` (top-left, top-right, bottom-left, bottom-right), `footer`. |
| `credentials` | `{ name, note? }[]` | Certifications and degree. |
| `contact` | array | Strings or `{ label, url }`. |
| `provenance` | string | One line on where the facts came from. |
| `traitsTitle`, `traits` | string, `{ label, text }[]` | Up to six "how they work" cells, each tied to something on the record. |
| `timeline` | `{ label, start, end, dates?, kind? }[]` | `start`/`end` as `YYYY-MM` or `"present"`. `kind: "education"` draws an outlined bar. Drawn to scale. |
| `colors` | object | Optional: `spot`, `mark`, `tint50`, `tint25`, `wash`, `onSpot2`, `dieline`, `dielineInk`. |
| `mustHaveKeywords` | string[] | Checked in the PDF text. |
| `fileName` | string | Output file stem. |

The sheets are fixed size, so overflow is clipped rather than adding a page. `brief` checks that the last requirement, the last timeline row and the provenance line all survive into the PDF text and fails if any was clipped. When it fails, shorten requirement or evidence text, drop a trait, or drop the `story` or `system` diagram.

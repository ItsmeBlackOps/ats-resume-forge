# resume.json schema

The CLI renders one JSON file. Start from `examples/sample-resume.json` (`resumeforge init`). All text fields accept `**bold**`; everything else is escaped, so raw HTML is never injected.

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | Rendered as the first line of the PDF. |
| `headline` | string | no | Target role plus specialties, separated by ` \| `. |
| `targetRole` | string | no | Used in the output file name (`First_Last_Role.pdf`). |
| `fileName` | string | no | Override the output file stem. ASCII only. |
| `contact` | array | no | Strings, or `{ "label": "...", "url": "..." }` for links. Show the URL text, not "LinkedIn". |
| `page` | `"Letter"` or `"A4"` | no | Default Letter. |
| `maxPages` | number | no | Page limit for the fit loop. Default 1. |
| `template` | string | no | Pin a template; otherwise the CLI picks one not yet used in this workspace. |
| `accent` | hex string | no | Override the template accent. |
| `mustHaveKeywords` | string[] | no | Short tokens checked in the PDF text by `verify`. |
| `summary` | string or string[] | no | Three or four sentences. |
| `skills` | `{ label, items[] }[]` | no | Every item should appear somewhere in the prose (lint checks). |
| `experience` | `{ title, company, location?, start, end?, bullets[] }[]` | yes | Reverse chronological. `end` omitted means a single date. |
| `projects` | `{ name, stack?, url?, urlLabel?, date?, bullets[] }[]` | no | |
| `certifications` | string or `{ name, issuer?, date? }` [] | no | |
| `education` | `{ degree, school, location?, dates? }[]` | no | |
| `sections` | string[] | no | Order of sections. Default: summary, skills, experience, projects, certifications, education. |
| `headings` | object | no | Rename a heading, for example `{ "skills": "Skills" }`. Keep canonical words parsers recognise. |

Date ranges render as `Mar 2023 to Present`. Do not type dashes between dates.

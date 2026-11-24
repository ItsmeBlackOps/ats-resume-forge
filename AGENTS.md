# Agent instructions

This repository is an agent skill plus a CLI. Any coding agent (Claude Code, Codex, Cursor, Copilot, Gemini CLI and others) should:

1. Read `skills/ats-resume-forge/SKILL.md` before building or editing a resume. It holds the workflow and the honesty rules.
2. Use the CLI in `bin/resumeforge.mjs` for rendering, verification and deployment instead of hand-writing PDFs.
3. Keep candidate material in gitignored folders (`candidates/`, `out/`). Never commit real resumes, job applications or personal data to this repository.

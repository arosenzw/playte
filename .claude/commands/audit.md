Audit the implementation of: $ARGUMENTS

Find bugs by comparing the actual code against the spec (if one exists) and against expected behavior.

## Process

1. **Find the spec** — look for `docs/specs/$ARGUMENTS.md`. If it exists, use it as the source of truth. If it doesn't exist, note that and infer expected behavior from PRD, comments, and user-confirmed behavior in memory.

2. **Trace the full data path** — read every file involved end to end:
   - DB schema (prisma/schema.prisma)
   - API route(s)
   - Shared utilities (src/lib/)
   - UI component(s)
   Do not skip steps or skim — bugs hide in transformations between layers.

3. **Check each layer against the spec:**
   - Does the DB query fetch the right data?
   - Are transformations correct (sort direction, null handling, type coercion)?
   - Does the API response shape match what the UI expects?
   - Does the UI render the data correctly?
   - Are edge cases handled (empty arrays, single player, ties, skipped dishes)?

4. **Produce a numbered bug report.** For each bug:
   - File and line number
   - What the code does
   - What it should do per the spec
   - Severity: critical (wrong result) / minor (cosmetic or edge case)

5. **List anything that could not be verified** — e.g. runtime behavior that requires a live session to test.

## Output Format

### Spec Used
[path to spec, or "no spec found — inferred from X"]

### Bugs Found
1. **[severity]** `file:line` — description of what's wrong and what it should be
2. ...

### Could Not Verify
- ...

### No Issues Found In
- ...

Be thorough. The goal is to find every bug before the user does.

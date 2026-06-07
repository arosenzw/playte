Write a precise technical + UX specification document for: $ARGUMENTS

This skill works for both existing features and new features being designed.

## Process

**For existing features:**
1. Read the relevant source files to understand current implementation
2. Ask the user questions about any behavior that is ambiguous or where code may not reflect true intent — do NOT assume the code is correct
3. Incorporate confirmed behavior into the spec

**For new features:**
1. Ask the user targeted questions to nail down desired behavior before any implementation details
2. Explore the codebase to understand what already exists that can be reused
3. Incorporate decisions into the spec

Once behavior is confirmed, write the spec to `docs/specs/$ARGUMENTS.md`.

## Spec Document Structure

### Overview
What the user sees and experiences. Written from the user's perspective. For new features, describe the intended UX.

### Data Flow
Step by step: DB tables → API route(s) → UI component(s). Include field names and transformations. For new features, include proposed data model changes.

### Algorithm
Precise description of any calculations, rankings, scoring, or matching logic. Use concrete examples with numbers. Be explicit about edge cases (single player, ties, skipped dishes, zero data, etc.)

### UI Requirements
- Exact layout and visual behavior
- What shows when data is missing or empty
- Loading states
- Navigation (what buttons go where)
- Interactions (taps, toggles, animations)

### Edge Cases & Rules
Numbered list of explicit rules the implementation must satisfy.

### Files to Create or Modify
List every file with a one-line description of its role. For new features, flag which are new vs. modified.

### Out of Scope
Explicitly list what this spec does NOT cover.

---

When writing the spec, prioritize confirmed user intent over current code behavior. If code disagrees with confirmed intent, note it explicitly as a bug to fix.

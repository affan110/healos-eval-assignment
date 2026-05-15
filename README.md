# HEALOSBENCH – LLM Eval Harness

## Overview
This project implements an LLM-based evaluation harness for extracting structured clinical data from unstructured doctor–patient transcripts.

The system converts transcripts into structured JSON fields such as:
- Chief complaint
- Vitals
- Medications
- Diagnoses
- Follow-up plan

---

## What I Built

- **Extractor**
  - Uses Anthropic Claude (Haiku)
  - Tool-based structured output
  - Retry mechanism with schema validation (AJV)

- **Evaluator**
  - Fuzzy string matching (Fuzzball)
  - Set-based precision/recall/F1
  - Exact match for numeric fields
  - Field-wise scoring

- **Hallucination Detection**
  - Checks whether predicted values exist in transcript

- **Runner**
  - Batch evaluation over dataset
  - Concurrency control using `p-limit`

- **CLI Interface**
  - Run evaluations using:

```bash
bun run eval -- --strategy=zero_shot
```

- **Prompt Strategies**
  - zero_shot
  - few_shot
  - cot (chain-of-thought)

---

## Tech Stack

- TypeScript
- Bun (runtime)
- Hono (backend)
- Anthropic SDK (Claude Haiku)
- AJV (JSON schema validation)
- Fuzzball (fuzzy matching)
- p-limit (concurrency control)
- PostgreSQL + Drizzle (optional)

---

## How to Run

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment

Create a `.env` file inside `apps/server/` and add:

```env
ANTHROPIC_API_KEY=your_key_here
```

### 3. Database setup (optional)

```bash
bun run db:push
```

### 4. Start development server

```bash
bun run dev
```

### 5. Run evaluation (CLI)

```bash
bun run eval -- --strategy=zero_shot
```

---

## Notes

- Dataset is synthetic (no real patient data)
- Claude Haiku model used for cost efficiency
- Due to API credit constraints, evaluation may be run on a subset
- Full system supports complete dataset evaluation

---

## Future Improvements

- Better grounding validation
- Improved prompt engineering
- Cost estimation guardrails
- Enhanced evaluation metrics

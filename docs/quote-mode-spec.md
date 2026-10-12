# Quote Mode + Quote of the Day — Build Spec

## Concept

Two ships in one build:

1. **Quote mode** — a new test mode where you type real passages (book/movie
   passages, public-domain quotes) instead of random words. Answers the #1
   community complaint: "random words get boring."
2. **Quote of the Day** — one deterministic quote per day, the same for every
   visitor. Completing it feeds the streak + a small XP bonus. Daily return hook,
   zero backend.

## Content: the quote bank

- Static JSON: `src/data/quotes.json` (split per-letter files if it gets big).
- **Public domain only.** Pre-1930 authors, Project Gutenberg sources, or
  explicitly CC0 texts. NEVER modern copyrighted quotes (no movie quotes
  post-1930, no living authors).
- Target: 150–300 quotes for v1.
- Schema per quote:
  ```json
  { "id": "twain-001", "text": "…", "author": "Mark Twain",
    "source": "The Adventures of Tom Sawyer", "len": "short" }
  ```
- `len`: short (<120 chars), medium (120–280), long (>280). Maps to the
  existing duration/length options where sensible.
- Curate for typing quality: real punctuation (good practice), no archaic
  spellings that punish the typist, no slurs — review every entry.

## Mechanics

- **Mode selector**: new "Quotes" mode next to the existing modes. Reuses the
  segmented control.
- **Quote selection**: random (seeded per session is fine) within the chosen
  length; no repeats until the bank cycles.
- **Quote of the Day**: `quotes[dayOfYear % quotes.length]` — deterministic,
  identical for everyone, no server. Homepage card shows today's quote with a
  "daily" badge; completing it grants streak credit + 25 XP bonus ("daily"
  receipt line, reuses the XP receipt system).
- **Engine**: unchanged. Same timing, same WPM/accuracy math, same caret.
  Quotes contain real punctuation/caps — the engine already handles both.
- **Results**: standard results + quote attribution line ("— Mark Twain,
  Tom Sawyer"). Shareable PNG includes the attribution.

## Data model (extends it_profile_v1)

```ts
dailyQuote: {
  date: string;      // 'YYYY-MM-DD' (local)
  quoteId: string;
  completed: boolean;
}
```
- On load: if `date !== today`, roll to today's quote, reset completed.
- On completing today's quote: `completed = true`, streak +1 day credit,
  +25 XP with receipt line.

## UI

1. **Mode tab**: "Quotes" in the mode selector.
2. **Homepage daily card**: today's quote (truncated), author, "Type today's
   quote" CTA, completed state (check).
3. **Results**: attribution line under the stats.

Monochrome; no new colors. The daily badge uses the existing pill style.

## i18n

New keys (en.json first):
- `mode.quotes` ("Quotes"), `daily.title` ("Quote of the day"),
- `daily.cta` ("Type today's quote"), `daily.done` ("Completed"),
- `daily.xp` ("Daily quote +25"), `results.quote-by` ("— {author}, {source}")
- Quote *contents* stay English in v1 (translated banks are a later content
  effort, same as the Hindi/regional word-list wedge).

## SEO (the bank pays twice)

- Quote content = indexable text no competitor can scrape-clone easily if
  curated.
- Later (out of scope for this build): per-author pages (e.g. /quotes/mark-twain/)
  as programmatic SEO. Do NOT build those pages now — just keep the schema
  author/source fields clean so they're possible later.
- FAQ addition: "Where do the quotes come from?" → public-domain answer.

## Out of scope

- User-submitted quotes (moderation problem, no backend to moderate with).
- Quote leaderboards / fastest-on-this-quote (no-backend rule).
- Modern copyrighted quotes. Ever.
- Per-author pages (schema-ready, not built).
- Don't touch: typing engine, WPM math, caret code, streak/freeze logic
  (only ADD the daily-bonus receipt line).

## Verification

- `npm run build` passes, zero errors.
- Quote mode: full test start→finish, punctuation/caps score correctly.
- Quote of the Day: same quote across reloads; changes at local midnight
  (mock the date to verify); completing it credits streak + 25 XP exactly once
  (re-completing the same day grants nothing extra).
- Quote bank: every entry has id/text/author/source/len; no empty texts;
  spot-check 10 for offensive content.
- No console errors; reduced-motion respected; mobile layout holds.

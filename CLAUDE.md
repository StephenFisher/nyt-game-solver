# NYT Game Solver

A browser-based toolkit for solving New York Times puzzles. Pure HTML/CSS/JS with no build tools or dependencies.

## Project Structure

```
index.html          - Main page with nav between solvers
css/style.css       - All styling (dark theme, Wordle-inspired)
js/app.js           - Navigation logic, loads solvers into #solver-area
js/words.js         - Word list (WORD_LIST array) used by all solvers
js/wordle.js        - Wordle solver: enter guesses + color feedback, filters matching words
js/spelling-bee.js  - Spelling Bee solver: enter 7 letters, finds valid words
```

## Solvers

- **Wordle** - Working. User types guesses, clicks letters to cycle colors (gray/yellow/green), then "Find Words" filters WORD_LIST.
- **Connections** - Placeholder ("Coming soon"). Nav link exists but no solver built yet.
- **Spelling Bee** - Working. User enters center + 6 outer letters. Finds words (4+ letters, must use center letter, only valid letters). Highlights pangrams.

## Architecture

- No frameworks or build step. Open `index.html` directly in a browser.
- Each solver is a JS object (e.g. `WordleSolver`, `SpellingBeeSolver`) with `init()` and `render()` methods.
- `app.js` handles nav clicks and calls the appropriate solver's `init()`.
- All solvers share the same `WORD_LIST` from `words.js`.

## Current Status

- Wordle and Spelling Bee solvers are functional.
- Connections solver is not yet implemented.

## Rules

- **Before every `git push`**, update the Session Notes section below with a summary of what was done this session and what's next. Always do this automatically without being asked.

## Session Notes

- **2026-02-12:** Set up second development machine (WSL). Configured git identity, generated SSH key, cloned repo. Added CLAUDE.md for cross-machine context.
- **Next:** Continue building the Connections solver, or other improvements.

# 📋 Project Log — Interactive Quiz Game

> Tracks all decisions, progress, and lessons learned.

---

## Project Info

| Field | Value |
|---|---|
| **Project** | 1.2 Interactive Quiz Game |
| **Start Date** | 2026-02-18 |
| **Status** | 🔄 In Progress |
| **Live URL** | TBD |

---

## Phase 0: Idea — 2026-02-18 ✅

**Concept:** Multi-category quiz game with 7 categories, 3 difficulty levels, timer, and highscore tracking.

| Decision | Choice |
|---|---|
| Categories | Geography, Animals, Languages, Sports, Music, Food, Gaming + Mixed |
| Difficulty | Easy, Medium, Hard (questions get harder, timer stays the same) |
| Questions per round | 12 |
| Timer | 15 seconds per question (all difficulties) |
| Scoring | 100 base + time bonus × difficulty multiplier |
| Highscores | localStorage — per category+difficulty + overall per difficulty |
| Language | English (UI + questions) |
| Design | Light, colorful, category accent colors |
| Target | Friends + portfolio |

**Post-MVP ideas:**
- Global leaderboard (requires backend)
- Weekly/monthly best scores
- More questions per category

---

## Phase 1: Plan — 2026-02-18 ✅

- 4 views designed: Start, Quiz, Result, Highscores
- Question data structure defined (question, answers, correct index, category, difficulty)
- Scoring formula: base 100 + (timeLeft × multiplier per difficulty)
- localStorage structure designed for highscores
- File architecture planned: index.html, style.css, questions.js, game.js
- Color palette defined with unique category accent colors
- Responsive breakpoints planned

---

## Phase 2: Scaffold — 2026-02-18 ✅

- ✅ Folder structure created
- ✅ index.html — all 4 views with semantic structure
- ✅ css/style.css — full design system with tokens, all views styled, responsive
- ✅ js/questions.js — 252 questions (12 × 7 categories × 3 difficulties)
- ✅ js/game.js — complete game logic (views, timer, scoring, highscores, shuffle)
- ✅ .gitignore created
- ✅ LOG.md created
- ✅ README.md created

---

## Phase 3: Build — 2026-02-18 → 2026-02-19 🔄

### 2026-02-18 — Question Pool Expansion
- ✅ Doubled question pool: 252 → 504 questions (24 per category per difficulty)
- ✅ All 7 categories expanded with 12 new unique questions each

### 2026-02-19 — Fashion Category + Layout Redesign
- ✅ Added Fashion category (72 questions — clothes, shoes, bags, jewelry)
- ✅ Total questions: 504 → 576 (8 categories × 3 difficulties × 24 questions)
- ✅ Redesigned category grid: 8 categories in 4×2 grid
- ✅ Mixed moved to full-width button below grid
- ✅ Fashion color token added (#e879a0 rosa)
- ✅ Updated subtitle, meta description to "8 categories"

### 2026-02-19 — User System (Opgave 1-6)
- ✅ **Removed Clear All Scores** — button + function + event listener removed
- ✅ **Welcome Screen** — new View 0 added as default landing page
- ✅ **Step-based registration** — gender → avatar → username → 4-digit PIN
- ✅ **8 SVG avatars** — 4 male + 4 female (Young, Adult, Mature, Elder), pure CSS/SVG, no external files
- ✅ **Login system** — returning players see user list with avatars, select + enter PIN
- ✅ **Auto-login** — remembers current user in localStorage across sessions
- ✅ **Logout** — button on start screen, returns to welcome view
- ✅ **New data structure** — migrated from flat key-value to users object + scores array
- ✅ **Score array** — append-only, stores user/category/difficulty/score/date per game
- ✅ **Monthly highscores** — "This Month's Best" + "Last Month's Winner" with avatar display
- ✅ **Per-category highscores** — personal score (left) + best player with avatar (right)
- ✅ **Start screen user display** — shows logged-in avatar + name + logout button
- ✅ **Form validation** — username length, PIN format (4 digits), duplicate name check
- ✅ **Edge case handling** — January → December year rollover for last month scores

**Decisions made:**
| Decision | Choice | Reasoning |
|---|---|---|
| PIN storage | Plaintext in localStorage | Acceptable for local quiz game, not sensitive data |
| Avatar approach | SVG in JavaScript | No external files needed, scales perfectly, lightweight |
| Score storage | Append-only array | Enables monthly filtering, historical data, multiple users |
| View management | 5 views (welcome added) | Same showView() pattern, no refactor needed |

**Technical debt noted:**
- PIN is plaintext (acceptable for quiz game scope)
- No data migration from old localStorage format (old scores lost if they existed)
- Score array will grow indefinitely (not an issue for local use)

### 2026-02-20 — Question QA + Batch 2 + New Features

#### Question Review & Batch 2 Verification
- ✅ Analyseret alle spørgsmål systematisk med Node.js script
- ✅ Verified Batch 2 allerede i filen (576 nye spørgsmål)
- ✅ **Total: 1.152 spørgsmål** på tværs af 8 kategorier × 3 sværhedsgrader
- ✅ Fashion Batch 2 transformeret til brand/design fokus
- ✅ 9 kvalitetsproblemer fundet og rettet:
  - Music: instrument → instrument family (svar matchede ikke spørgsmål)
  - Animals: blandede svartyper (fugle + statements) → konsistente statements
  - Languages: Bolivia (37 sprog) rettet som korrekt svar, ikke India
  - Languages: German=Polish tied grammatiske køn → nyt unikt spørgsmål
  - Sports: F1 Championships → Schumacher+Hamilton deler rekord
  - Fashion: 23→24 medium spørgsmål (tilføjet Burberry)
  - Languages: "no word for please" faktuelt forkert → keigo-vinkel
  - Languages: fjernet duplikat (Japanese writing systems)
  - Animals: brain-to-body ratio rettet (ant → shrew)

#### Timer Update
- ✅ Timer sat op fra 25 → 30 sekunder

#### Streak Bonus System
- ✅ 4-tier streak system (1.25x → 2.5x multiplier)
- ✅ Streak-counter i quiz header med tier-baseret styling
- ✅ Glow + puls-animationer der intensiveres med tier
- ✅ Streak info i feedback-tekst ("Streak lost!" ved tab)
- ✅ Max streak trackes og vises på result screen
- ✅ Max streak gemmes i score-data (localStorage)

| Streak | Multiplier | Label | Visuel effekt |
|--------|-----------|-------|---------------|
| 2 | 1.25x | Nice! | Amber badge |
| 3-4 | 1.5x | On Fire! | Orange glow + puls |
| 5-6 | 2.0x | Unstoppable! | Rød glow + hurtig puls |
| 7+ | 2.5x | LEGENDARY! | Guld glow + intensiv puls |

#### Post-Game Review Screen
- ✅ Alle 12 spørgsmål vises efter quiz med spillerens svar
- ✅ Farvekodede review cards: grøn (korrekt), rød (forkert), amber (timeout)
- ✅ Korrekte svar highlightet i grønt, forkerte i rødt med gennemstreget tekst
- ✅ Staggered animation for review cards
- ✅ Responsivt layout (2-kolonne → 1-kolonne på mobil)

#### Animations & Visual Polish
- ✅ View fade-in transitions (alle views)
- ✅ Question slide-in animation (højre → venstre)
- ✅ Answer button staggered fade-in (50ms delay mellem knapper)
- ✅ Answer correct: subtle scale bounce
- ✅ Answer wrong: shake animation
- ✅ Answer click: scale(0.97) press feedback
- ✅ Feedback text: pop-in animation
- ✅ Score counter: pop + grøn flash ved point
- ✅ Result stats: staggered pop-in (4 cards)
- ✅ Timer danger: pulserende rød under 5 sekunder
- ✅ Review cards: staggered cascade appearance

**Decisions made:**
| Decision | Choice | Reasoning |
|---|---|---|
| Streak thresholds | 2/3/5/7 | Progressivt sværere, 7+ i 12 spørgsmål er imponerende |
| Streak multiplier cap | 2.5x | Højt nok til at føles impactful, ikke broken |
| Animation approach | Pure CSS | Ingen JS animation library nødvendig, performant |
| Review data | In-memory array | Nulstilles per quiz, behøver ikke persistence |
| offsetWidth reflow trick | For animation restart | Standard pattern til at genstarte CSS animations |

---

## Phase 5: Polish — 2026-02-20 ✅

- ✅ Alle spørgsmål quality-checked (9 rettelser)
- ✅ Streak system tilføjet for engagement
- ✅ Post-game review for læring
- ✅ Fuld animation suite for professionelt look
- ✅ Timer øget til 30 sekunder

---

## Project Info (Updated)

| Field | Value |
|---|---|
| **Project** | 1.2 Interactive Quiz Game |
| **Start Date** | 2026-02-18 |
| **Status** | ✅ Complete & Deployed |
| **Total Questions** | 1.296 |
| **Categories** | 8 + Mixed |
| **Features** | User system, Streak bonus, Review screen, Animations, Source category badge |
| **Live URL** | https://skinshredder.github.io/quiz-game/ |

---

## Phase 5b: Polish Round 2 — 2026-02-25 ✅

### Answer Length Bias Fix
- ✅ Systematisk gennemgang af 89 spørgsmål hvor korrekt svar var væsentligt længere end forkerte
- ✅ Forkerte svar forlænget med beskrivende kontekst så alle 4 svar har sammenlignelig længde
- ✅ Kategorier berørt: Languages, Music, Sports, Food, Fashion, Gaming (Medium + Hard)

### Quit Button Styling
- ✅ Cirkulært design med ✕ symbol
- ✅ Rød hover-effekt (danger-farve) for klar bruger-signalering
- ✅ Scale-animation på hover og klik

---

## Phase 5c: Content Expansion — 2026-02-25–26 ✅

### 144 New Questions
- ✅ 6 nye spørgsmål per sværhedsgrad × 3 sværhedsgrader × 8 kategorier = 144 nye
- ✅ Total: 1.152 → 1.296 spørgsmål
- ✅ Alle nye spørgsmål følger answer length bias rettelserne
- ✅ Ingen duplikater, faktuelt korrekte

### Source Category Badge (Mixed Mode)
- ✅ Nyt UI-element under spørgsmålsteksten
- ✅ Viser kategori-ikon + navn med kategori-farve som badge
- ✅ Kun synligt i mixed mode
- ✅ Fade-in animation ved hvert nyt spørgsmål

---

## Phase 6: Deploy — 2026-02-26 ✅

- ✅ Deployed til GitHub Pages: https://skinshredder.github.io/quiz-game/
- ✅ Tilføjet til portfolio-hjemmesiden

---

*Opdateres løbende med beslutninger, problemer, løsninger og læring.*

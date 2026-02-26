# 🎯 Interactive Quiz Game

> Test your knowledge across 8 categories with 3 difficulty levels. Create a profile, track your streaks, and compete for highscores!

**Live site:** [skinshredder.github.io/quiz-game](https://skinshredder.github.io/quiz-game/)

## Features

- **8 Categories:** Geography, Animals, Languages, Sports, Music, Food, Gaming, Fashion + Mixed mode
- **1,296 Unique Questions** across all categories and difficulty levels
- **3 Difficulty Levels:** Easy, Medium, Hard
- **User System:** Create profiles with SVG avatars, gender selection, and 4-digit PIN login
- **Streak Bonus System:** 4-tier multiplier (1.25x–2.5x) with progressive visual effects
- **30-second Timer** per question with visual countdown and danger animation
- **Score System** with time bonus — faster answers earn more points
- **Monthly Leaderboards** — this month's best + last month's winner
- **Post-Game Review** — see all questions with your answers color-coded
- **Source Category Badge** — shows which category each question belongs to in Mixed mode
- **Animations** — 10+ CSS animations for a polished game feel
- **Responsive Design** — works on desktop, tablet, and mobile

## How to Play

1. Create a new player (pick gender → avatar → username → PIN)
2. Choose a category (or Mixed for all)
3. Select your difficulty level
4. Answer 12 multiple-choice questions before time runs out
5. Build streaks for bonus multipliers!
6. Review your answers and beat your highscores

## Tech Stack

- **HTML5** — Semantic markup, single-page app with 5 views
- **CSS3** — Custom Properties, Grid, Flexbox, animations (@keyframes, staggered delays)
- **JavaScript** — Game state management, timer, localStorage, event-driven architecture
- **SVG** — Hand-crafted avatar system (8 unique avatars)
- **Hosting** — GitHub Pages

## Project Structure

```
quiz-game/
├── index.html          ← All views (welcome, start, quiz, result, highscores)
├── css/style.css       ← Design system with category color tokens
├── js/
│   ├── questions.js    ← Question database (1,296 questions)
│   └── game.js         ← Game logic, user system, timer, scoring
├── assets/             ← Images
├── README.md
└── LOG.md
```

## Scoring

| Component | Formula |
|---|---|
| Base points | 100 per correct answer |
| Time bonus | Remaining seconds × difficulty multiplier |
| Multiplier | Easy: ×2, Medium: ×4, Hard: ×6 |
| Streak bonus | 2x: 1.25×, 3x: 1.5×, 5x: 2.0×, 7x: 2.5× |
| Wrong/timeout | 0 points + streak reset |

## Author

**Sebastian Larsen** (SkinShredder)
AI Student @ SDU Odense

- [Portfolio](https://skinshredder.github.io)
- [GitHub](https://github.com/SkinShredder)
- [LinkedIn](https://www.linkedin.com/in/sebastian-larsen-4b46213b1/)

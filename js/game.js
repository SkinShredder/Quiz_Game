/*
===============================================
FILE: game.js
PURPOSE: Game logic — user system, view management, quiz flow, timer, scoring, highscores
PROJECT: 1.2 Interactive Quiz Game
AUTHOR: Sebastian Larsen (SkinShredder)
DATE: 2026-02-19
===============================================
*/

// ==================== GAME CONFIGURATION ====================

const CONFIG = {
    questionsPerRound: 12,
    timerSeconds: 30,
    basePoints: 100,
    bonusMultiplier: { easy: 2, medium: 4, hard: 6 },
    feedbackDelay: 1500,
    storageKey: "quizGameData",

    // Streak tiers — threshold is the minimum streak to activate that tier
    streakTiers: [
        { threshold: 2, multiplier: 1.25, label: "Nice!",          fires: "🔥" },
        { threshold: 3, multiplier: 1.5,  label: "On Fire!",       fires: "🔥🔥" },
        { threshold: 5, multiplier: 2.0,  label: "Unstoppable!",   fires: "🔥🔥🔥" },
        { threshold: 7, multiplier: 2.5,  label: "LEGENDARY!",     fires: "🔥🔥🔥🔥" }
    ]
};

// Category display info
const CATEGORIES = {
    mixed:     { name: "Mixed",     icon: "🎲", color: "#6366f1" },
    geography: { name: "Geography", icon: "🌍", color: "#10b981" },
    animals:   { name: "Animals",   icon: "🐾", color: "#f59e0b" },
    languages: { name: "Languages", icon: "🗣️", color: "#8b5cf6" },
    sports:    { name: "Sports",    icon: "⚽", color: "#ef4444" },
    music:     { name: "Music",     icon: "🎵", color: "#ec4899" },
    food:      { name: "Food",      icon: "🍕", color: "#f97316" },
    gaming:    { name: "Gaming",    icon: "🎮", color: "#3b82f6" },
    fashion:   { name: "Fashion",   icon: "👜", color: "#e879a0" }
};


// ==================== AVATAR SVG DEFINITIONS ====================

const AVATARS = {
    male: [
        {
            id: "boy",
            label: "Young",
            svg: `<svg viewBox="0 0 80 80">
                <circle cx="40" cy="38" r="22" fill="#87CEEB"/>
                <circle cx="33" cy="35" r="3" fill="#1e3a5f"/>
                <circle cx="47" cy="35" r="3" fill="#1e3a5f"/>
                <circle cx="33.5" cy="34" r="1" fill="white"/>
                <circle cx="47.5" cy="34" r="1" fill="white"/>
                <path d="M35 44 Q40 48 45 44" stroke="#1e3a5f" stroke-width="2" fill="none" stroke-linecap="round"/>
                <path d="M18 32 Q20 10 40 10 Q60 10 62 32" fill="#5a3e2b"/>
                <path d="M18 32 L22 28" stroke="#5a3e2b" stroke-width="4" stroke-linecap="round"/>
                <circle cx="40" cy="27" r="3" fill="#ef4444" opacity="0.6"/>
            </svg>`
        },
        {
            id: "young_man",
            label: "Adult",
            svg: `<svg viewBox="0 0 80 80">
                <circle cx="40" cy="38" r="22" fill="#F4C28C"/>
                <circle cx="33" cy="35" r="2.5" fill="#2d3748"/>
                <circle cx="47" cy="35" r="2.5" fill="#2d3748"/>
                <path d="M35 44 Q40 47 45 44" stroke="#2d3748" stroke-width="2" fill="none" stroke-linecap="round"/>
                <path d="M18 30 Q22 12 40 12 Q58 12 62 30" fill="#2d3748"/>
                <rect x="18" y="28" width="44" height="4" rx="2" fill="#2d3748"/>
            </svg>`
        },
        {
            id: "mature_man",
            label: "Mature",
            svg: `<svg viewBox="0 0 80 80">
                <circle cx="40" cy="38" r="22" fill="#E8B88A"/>
                <circle cx="33" cy="35" r="2.5" fill="#2d3748"/>
                <circle cx="47" cy="35" r="2.5" fill="#2d3748"/>
                <path d="M35 44 Q40 47 45 44" stroke="#2d3748" stroke-width="2" fill="none" stroke-linecap="round"/>
                <path d="M18 30 Q22 14 40 14 Q58 14 62 30" fill="#6b4423"/>
                <rect x="28" y="49" width="24" height="3" rx="1.5" fill="#6b4423"/>
            </svg>`
        },
        {
            id: "old_man",
            label: "Elder",
            svg: `<svg viewBox="0 0 80 80">
                <circle cx="40" cy="38" r="22" fill="#E8D5C0"/>
                <circle cx="33" cy="35" r="2.5" fill="#4a5568"/>
                <circle cx="47" cy="35" r="2.5" fill="#4a5568"/>
                <path d="M35 44 Q40 47 45 44" stroke="#4a5568" stroke-width="2" fill="none" stroke-linecap="round"/>
                <path d="M22 30 Q26 18 40 18 Q54 18 58 30" fill="#d1d5db"/>
                <rect x="26" y="31" width="28" height="3" rx="1.5" fill="#cbd5e0" opacity="0.6"/>
                <path d="M28 49 Q34 54 40 49 Q46 54 52 49" stroke="#d1d5db" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            </svg>`
        }
    ],
    female: [
        {
            id: "girl",
            label: "Young",
            svg: `<svg viewBox="0 0 80 80">
                <circle cx="40" cy="38" r="22" fill="#FADADD"/>
                <circle cx="33" cy="35" r="3" fill="#4a1942"/>
                <circle cx="47" cy="35" r="3" fill="#4a1942"/>
                <circle cx="33.5" cy="34" r="1" fill="white"/>
                <circle cx="47.5" cy="34" r="1" fill="white"/>
                <path d="M35 44 Q40 48 45 44" stroke="#4a1942" stroke-width="2" fill="none" stroke-linecap="round"/>
                <path d="M14 38 Q14 6 40 10 Q66 6 66 38" fill="#8B4513"/>
                <path d="M14 38 Q12 56 20 62" stroke="#8B4513" stroke-width="6" fill="none" stroke-linecap="round"/>
                <path d="M66 38 Q68 56 60 62" stroke="#8B4513" stroke-width="6" fill="none" stroke-linecap="round"/>
                <circle cx="54" cy="20" r="4" fill="#ec4899"/>
            </svg>`
        },
        {
            id: "young_woman",
            label: "Adult",
            svg: `<svg viewBox="0 0 80 80">
                <circle cx="40" cy="38" r="22" fill="#F4C2A0"/>
                <circle cx="33" cy="35" r="2.5" fill="#2d3748"/>
                <circle cx="47" cy="35" r="2.5" fill="#2d3748"/>
                <path d="M35 44 Q40 47 45 44" stroke="#2d3748" stroke-width="2" fill="none" stroke-linecap="round"/>
                <path d="M14 36 Q14 8 40 10 Q66 8 66 36" fill="#4a3728"/>
                <path d="M14 36 Q12 58 22 66" stroke="#4a3728" stroke-width="5" fill="none" stroke-linecap="round"/>
                <path d="M66 36 Q68 58 58 66" stroke="#4a3728" stroke-width="5" fill="none" stroke-linecap="round"/>
            </svg>`
        },
        {
            id: "mature_woman",
            label: "Mature",
            svg: `<svg viewBox="0 0 80 80">
                <circle cx="40" cy="38" r="22" fill="#E8B88A"/>
                <circle cx="33" cy="35" r="2.5" fill="#2d3748"/>
                <circle cx="47" cy="35" r="2.5" fill="#2d3748"/>
                <path d="M35 44 Q40 47 45 44" stroke="#2d3748" stroke-width="2" fill="none" stroke-linecap="round"/>
                <path d="M16 34 Q16 8 40 10 Q64 8 64 34" fill="#b45309"/>
                <path d="M16 34 Q14 50 20 56" stroke="#b45309" stroke-width="5" fill="none" stroke-linecap="round"/>
                <path d="M64 34 Q66 50 60 56" stroke="#b45309" stroke-width="5" fill="none" stroke-linecap="round"/>
                <circle cx="22" cy="42" r="4" fill="#F4C2A0" opacity="0.5"/>
                <circle cx="58" cy="42" r="4" fill="#F4C2A0" opacity="0.5"/>
            </svg>`
        },
        {
            id: "old_woman",
            label: "Elder",
            svg: `<svg viewBox="0 0 80 80">
                <circle cx="40" cy="38" r="22" fill="#E8D5C0"/>
                <circle cx="33" cy="35" r="2.5" fill="#4a5568"/>
                <circle cx="47" cy="35" r="2.5" fill="#4a5568"/>
                <path d="M35 44 Q40 47 45 44" stroke="#4a5568" stroke-width="2" fill="none" stroke-linecap="round"/>
                <path d="M16 34 Q16 10 40 12 Q64 10 64 34" fill="#d1d5db"/>
                <path d="M16 34 Q18 48 24 52" stroke="#d1d5db" stroke-width="5" fill="none" stroke-linecap="round"/>
                <path d="M64 34 Q62 48 56 52" stroke="#d1d5db" stroke-width="5" fill="none" stroke-linecap="round"/>
                <rect x="28" y="31" width="24" height="3" rx="1.5" fill="#e2e8f0" opacity="0.5"/>
            </svg>`
        }
    ]
};


// ==================== GAME STATE ====================

let state = {
    currentUser: null,
    category: "mixed",
    difficulty: "easy",
    questions: [],
    currentIndex: 0,
    score: 0,
    correctCount: 0,
    streak: 0,
    maxStreak: 0,
    answers: [],
    timerInterval: null,
    timeLeft: 0,
    answered: false,
    // Welcome screen state
    selectedGender: null,
    selectedAvatar: null
};


// ==================== DOM REFERENCES ====================

const views = {
    welcome:    document.getElementById("view-welcome"),
    start:      document.getElementById("view-start"),
    quiz:       document.getElementById("view-quiz"),
    result:     document.getElementById("view-result"),
    highscores: document.getElementById("view-highscores")
};

const dom = {
    // Quiz screen
    quizCategory:  document.getElementById("quiz-category"),
    quizProgress:  document.getElementById("quiz-progress"),
    quizStreak:    document.getElementById("quiz-streak"),
    quizScore:     document.getElementById("quiz-score"),
    quizQuestion:  document.getElementById("quiz-question"),
    answers:       document.getElementById("answers"),
    feedback:      document.getElementById("quiz-feedback"),
    sourceCategory: document.getElementById("quiz-source-category"),
    timerBar:      document.getElementById("timer-bar"),
    timerText:     document.getElementById("timer-text"),

    // Result screen
    resultTitle:     document.getElementById("result-title"),
    resultScore:     document.getElementById("result-score"),
    resultCorrect:   document.getElementById("result-correct"),
    resultAccuracy:  document.getElementById("result-accuracy"),
    resultStreak:    document.getElementById("result-streak"),
    resultHighscore: document.getElementById("result-highscore"),
    reviewList:      document.getElementById("review-list"),

    // Highscore preview
    previewEasy:   document.getElementById("preview-easy"),
    previewMedium: document.getElementById("preview-medium"),
    previewHard:   document.getElementById("preview-hard"),

    // Highscores screen
    hsOverallScore: document.getElementById("hs-overall-score"),
    hsList:         document.getElementById("hs-list"),

    // Start screen user display
    startUserAvatar: document.getElementById("start-user-avatar"),
    startUserName:   document.getElementById("start-user-name")
};


// ==================== VIEW NAVIGATION ====================

function showView(viewName) {
    Object.values(views).forEach(v => v.classList.remove("active"));
    views[viewName].classList.add("active");
}


// ==================== DATA STORAGE ====================

function getGameData() {
    const data = localStorage.getItem(CONFIG.storageKey);
    return data ? JSON.parse(data) : { users: {}, scores: [], currentUser: null };
}

function saveGameData(data) {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(data));
}

function getAvatarSvg(gender, avatarId) {
    const avatarList = AVATARS[gender] || [];
    const avatar = avatarList.find(a => a.id === avatarId);
    return avatar ? avatar.svg : "";
}


// ==================== WELCOME SCREEN LOGIC ====================

function showWelcomeStep(stepId) {
    document.querySelectorAll(".welcome__step").forEach(s => s.classList.add("hidden"));
    document.getElementById(stepId).classList.remove("hidden");
}

// Step 0: New or Returning
document.getElementById("btn-new-player").addEventListener("click", () => {
    state.selectedGender = null;
    state.selectedAvatar = null;
    showWelcomeStep("step-gender");
});

document.getElementById("btn-returning-player").addEventListener("click", () => {
    renderUserList();
    showWelcomeStep("step-login");
});

// Step 1: Gender
document.querySelectorAll(".gender-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".gender-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        state.selectedGender = btn.dataset.gender;

        // Small delay for visual feedback then go to avatar step
        setTimeout(() => {
            renderAvatarGrid(state.selectedGender);
            showWelcomeStep("step-avatar");
        }, 200);
    });
});

// Step 2: Avatar grid
function renderAvatarGrid(gender) {
    const grid = document.getElementById("avatar-grid");
    const avatars = AVATARS[gender];
    let html = "";

    avatars.forEach(avatar => {
        html += '<button class="avatar-btn" data-avatar-id="' + avatar.id + '">';
        html += avatar.svg;
        html += '<span>' + avatar.label + '</span>';
        html += '</button>';
    });

    grid.innerHTML = html;

    // Add click handlers
    grid.querySelectorAll(".avatar-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            grid.querySelectorAll(".avatar-btn").forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            state.selectedAvatar = btn.dataset.avatarId;

            setTimeout(() => {
                // Show selected avatar in credentials step
                const preview = document.getElementById("selected-avatar-preview");
                preview.innerHTML = getAvatarSvg(state.selectedGender, state.selectedAvatar);
                showWelcomeStep("step-credentials");
            }, 200);
        });
    });
}

// Step 3: Create account
document.getElementById("btn-create-account").addEventListener("click", () => {
    const username = document.getElementById("input-username").value.trim();
    const pin = document.getElementById("input-pin").value.trim();
    const errorEl = document.getElementById("create-error");

    // Validation
    if (!username) {
        showFormError(errorEl, "Please enter a username");
        return;
    }
    if (username.length < 2) {
        showFormError(errorEl, "Username must be at least 2 characters");
        return;
    }
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
        showFormError(errorEl, "PIN must be exactly 4 digits");
        return;
    }

    const data = getGameData();

    // Check if username exists (case insensitive)
    const lowerName = username.toLowerCase();
    const exists = Object.keys(data.users).some(u => u.toLowerCase() === lowerName);
    if (exists) {
        showFormError(errorEl, "Username already taken");
        return;
    }

    // Create user
    data.users[username] = {
        pin: pin,
        gender: state.selectedGender,
        avatar: state.selectedAvatar,
        createdAt: new Date().toISOString().split("T")[0]
    };
    data.currentUser = username;
    saveGameData(data);

    state.currentUser = username;
    errorEl.classList.add("hidden");

    // Clear form
    document.getElementById("input-username").value = "";
    document.getElementById("input-pin").value = "";

    enterGame();
});

// Login: User list
function renderUserList() {
    const data = getGameData();
    const list = document.getElementById("user-list");
    const users = Object.entries(data.users);

    if (users.length === 0) {
        list.innerHTML = '<p style="color: var(--color-text-secondary);">No players yet. Create a new player first!</p>';
        document.getElementById("login-pin-section").classList.add("hidden");
        return;
    }

    let html = "";
    users.forEach(([name, user]) => {
        html += '<button class="user-card" data-username="' + name + '">';
        html += '  <span class="user-card__avatar">' + getAvatarSvg(user.gender, user.avatar) + '</span>';
        html += '  <span class="user-card__name">' + name + '</span>';
        html += '</button>';
    });
    list.innerHTML = html;

    // Click handlers
    let selectedUser = null;
    list.querySelectorAll(".user-card").forEach(card => {
        card.addEventListener("click", () => {
            list.querySelectorAll(".user-card").forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            selectedUser = card.dataset.username;

            // Show PIN input
            const pinSection = document.getElementById("login-pin-section");
            const userPreview = document.getElementById("login-selected-user");
            const userData = data.users[selectedUser];
            userPreview.innerHTML = getAvatarSvg(userData.gender, userData.avatar) + ' <span>' + selectedUser + '</span>';
            pinSection.classList.remove("hidden");
            document.getElementById("login-pin-input").value = "";
            document.getElementById("login-pin-input").focus();
            document.getElementById("login-error").classList.add("hidden");
        });
    });
}

// Login: PIN submit
document.getElementById("btn-login").addEventListener("click", () => {
    const data = getGameData();
    const selectedCard = document.querySelector(".user-card.selected");
    const errorEl = document.getElementById("login-error");

    if (!selectedCard) {
        showFormError(errorEl, "Select a player first");
        return;
    }

    const username = selectedCard.dataset.username;
    const pin = document.getElementById("login-pin-input").value.trim();

    if (data.users[username].pin !== pin) {
        showFormError(errorEl, "Wrong PIN. Try again.");
        document.getElementById("login-pin-input").value = "";
        return;
    }

    // Login success
    data.currentUser = username;
    saveGameData(data);
    state.currentUser = username;
    errorEl.classList.add("hidden");

    enterGame();
});

// Enter game after login/create
function enterGame() {
    updateStartScreenUser();
    updateHighscorePreview();
    showView("start");
}

// Update logged-in user display
function updateStartScreenUser() {
    const data = getGameData();
    const user = data.users[state.currentUser];
    if (user) {
        dom.startUserAvatar.innerHTML = getAvatarSvg(user.gender, user.avatar);
        dom.startUserName.textContent = state.currentUser;
    }
}

// Logout
document.getElementById("btn-logout").addEventListener("click", () => {
    state.currentUser = null;
    const data = getGameData();
    data.currentUser = null;
    saveGameData(data);
    showWelcomeStep("step-choice");
    showView("welcome");
});

// Back buttons
document.getElementById("btn-back-to-choice").addEventListener("click", () => showWelcomeStep("step-choice"));
document.getElementById("btn-back-to-gender").addEventListener("click", () => showWelcomeStep("step-gender"));
document.getElementById("btn-back-to-avatar").addEventListener("click", () => showWelcomeStep("step-avatar"));
document.getElementById("btn-back-to-choice-from-login").addEventListener("click", () => {
    document.getElementById("login-pin-section").classList.add("hidden");
    showWelcomeStep("step-choice");
});

function showFormError(el, message) {
    el.textContent = message;
    el.classList.remove("hidden");
}


// ==================== START SCREEN SETUP ====================

// Category selection
document.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        state.category = btn.dataset.category;
        updateHighscorePreview();
    });
});

// Difficulty selection
document.querySelectorAll(".difficulty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".difficulty-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        state.difficulty = btn.dataset.difficulty;
        updateHighscorePreview();
    });
});

// Start button
document.getElementById("btn-start").addEventListener("click", startQuiz);

// Highscores button
document.getElementById("btn-show-highscores").addEventListener("click", () => {
    renderHighscoresView("easy");
    showView("highscores");
});


// ==================== STREAK LOGIC ====================

// Returns the active streak tier or null if streak is below minimum threshold
function getStreakTier(streak) {
    let activeTier = null;
    for (let i = 0; i < CONFIG.streakTiers.length; i++) {
        if (streak >= CONFIG.streakTiers[i].threshold) {
            activeTier = CONFIG.streakTiers[i];
        }
    }
    return activeTier;
}

// Updates the streak counter in the quiz header
function updateStreakDisplay() {
    const tier = getStreakTier(state.streak);

    if (!tier) {
        dom.quizStreak.classList.add("hidden");
        dom.quizStreak.removeAttribute("data-tier");
        return;
    }

    // Show streak counter with tier info
    dom.quizStreak.textContent = tier.fires + " " + state.streak + "x " + tier.label;
    dom.quizStreak.classList.remove("hidden");

    // Set tier level for CSS styling (1-4)
    const tierIndex = CONFIG.streakTiers.indexOf(tier) + 1;
    dom.quizStreak.setAttribute("data-tier", tierIndex);
}


// ==================== QUIZ LOGIC ====================

function startQuiz() {
    // Filter questions by category and difficulty
    let pool;
    if (state.category === "mixed") {
        pool = QUESTIONS.filter(q => q.difficulty === state.difficulty);
    } else {
        pool = QUESTIONS.filter(q => q.category === state.category && q.difficulty === state.difficulty);
    }

    // Shuffle and pick questions for the round
    state.questions = shuffleArray(pool).slice(0, CONFIG.questionsPerRound);
    state.currentIndex = 0;
    state.score = 0;
    state.correctCount = 0;
    state.streak = 0;
    state.maxStreak = 0;
    state.answers = [];

    // Set category label color
    const catInfo = CATEGORIES[state.category];
    dom.quizCategory.textContent = catInfo.icon + " " + catInfo.name + " — " + capitalize(state.difficulty);
    dom.quizCategory.style.backgroundColor = catInfo.color;

    showView("quiz");
    loadQuestion();
}

function loadQuestion() {
    const q = state.questions[state.currentIndex];
    state.answered = false;

    // Update header
    dom.quizProgress.textContent = (state.currentIndex + 1) + " / " + CONFIG.questionsPerRound;
    dom.quizScore.textContent = "Score: " + state.score;

    // Set question text with animation
    dom.quizQuestion.textContent = q.question;
    dom.quizQuestion.classList.remove("animate-in");
    void dom.quizQuestion.offsetWidth;
    dom.quizQuestion.classList.add("animate-in");

    // Show source category badge in mixed mode
    if (state.category === "mixed") {
        const srcCat = CATEGORIES[q.category];
        dom.sourceCategory.textContent = srcCat.icon + " " + srcCat.name;
        dom.sourceCategory.style.backgroundColor = srcCat.color;
        dom.sourceCategory.classList.remove("hidden");
    } else {
        dom.sourceCategory.classList.add("hidden");
    }

    // Shuffle answer order for variety
    const answerIndices = shuffleArray([0, 1, 2, 3]);
    const answerButtons = dom.answers.querySelectorAll(".answer-btn");

    answerButtons.forEach((btn, i) => {
        const originalIndex = answerIndices[i];
        btn.textContent = q.answers[originalIndex];
        btn.dataset.index = originalIndex;
        btn.className = "answer-btn animate-in";
        btn.disabled = false;
    });

    // Clear feedback
    dom.feedback.textContent = "";
    dom.feedback.className = "quiz__feedback";

    // Start timer
    startTimer();
}

function handleAnswer(selectedIndex) {
    if (state.answered) return;
    state.answered = true;

    // Stop timer
    clearInterval(state.timerInterval);

    const q = state.questions[state.currentIndex];
    const isCorrect = parseInt(selectedIndex) === q.correct;
    const answerButtons = dom.answers.querySelectorAll(".answer-btn");

    // Disable all buttons
    answerButtons.forEach(btn => {
        btn.disabled = true;
        const btnIndex = parseInt(btn.dataset.index);

        if (btnIndex === q.correct) {
            btn.classList.add("answer-btn--correct");
        } else if (btnIndex === parseInt(selectedIndex)) {
            btn.classList.add("answer-btn--wrong");
        } else {
            btn.classList.add("answer-btn--disabled");
        }
    });

    // Record answer for review
    state.answers.push({ selected: parseInt(selectedIndex), correct: q.correct, timeout: false });

    // Calculate score and update streak
    if (isCorrect) {
        state.streak++;
        if (state.streak > state.maxStreak) state.maxStreak = state.streak;

        const multiplier = CONFIG.bonusMultiplier[state.difficulty];
        const timeBonus = Math.round(state.timeLeft * multiplier);
        const basePoints = CONFIG.basePoints + timeBonus;

        // Apply streak multiplier
        const tier = getStreakTier(state.streak);
        const streakMultiplier = tier ? tier.multiplier : 1.0;
        const points = Math.round(basePoints * streakMultiplier);

        state.score += points;
        state.correctCount++;
        dom.quizScore.textContent = "Score: " + state.score;

        // Animate score update
        dom.quizScore.classList.remove("score-pop");
        void dom.quizScore.offsetWidth;
        dom.quizScore.classList.add("score-pop");

        // Build feedback text with streak info
        let feedbackText = "✓ Correct! +" + points + " points";
        if (tier) {
            feedbackText += " (" + tier.fires + " " + streakMultiplier + "x)";
        }
        dom.feedback.textContent = feedbackText;
        dom.feedback.className = "quiz__feedback quiz__feedback--correct";
    } else {
        const lostStreak = state.streak;
        state.streak = 0;

        let feedbackText = "✗ Wrong! The answer was: " + q.answers[q.correct];
        if (lostStreak >= 2) {
            feedbackText += " — Streak lost! (" + lostStreak + ")";
        }
        dom.feedback.textContent = feedbackText;
        dom.feedback.className = "quiz__feedback quiz__feedback--wrong";
    }

    updateStreakDisplay();

    // Next question after delay
    setTimeout(nextQuestion, CONFIG.feedbackDelay);
}

function handleTimeout() {
    if (state.answered) return;
    state.answered = true;

    const q = state.questions[state.currentIndex];
    const answerButtons = dom.answers.querySelectorAll(".answer-btn");

    // Show correct answer and disable buttons
    answerButtons.forEach(btn => {
        btn.disabled = true;
        if (parseInt(btn.dataset.index) === q.correct) {
            btn.classList.add("answer-btn--correct");
        } else {
            btn.classList.add("answer-btn--disabled");
        }
    });

    // Record timeout for review
    state.answers.push({ selected: -1, correct: q.correct, timeout: true });

    // Timeout breaks streak
    const lostStreak = state.streak;
    state.streak = 0;

    let feedbackText = "⏰ Time's up! The answer was: " + q.answers[q.correct];
    if (lostStreak >= 2) {
        feedbackText += " — Streak lost! (" + lostStreak + ")";
    }
    dom.feedback.textContent = feedbackText;
    dom.feedback.className = "quiz__feedback quiz__feedback--timeout";

    updateStreakDisplay();

    setTimeout(nextQuestion, CONFIG.feedbackDelay);
}

function nextQuestion() {
    state.currentIndex++;

    if (state.currentIndex >= state.questions.length) {
        endQuiz();
    } else {
        loadQuestion();
    }
}


// ==================== TIMER ====================

function startTimer() {
    state.timeLeft = CONFIG.timerSeconds;
    dom.timerBar.style.width = "100%";
    dom.timerBar.className = "timer__bar";
    dom.timerText.textContent = state.timeLeft + "s";
    runTimerInterval();
}

function resumeTimer() {
    runTimerInterval();
}

function runTimerInterval() {
    state.timerInterval = setInterval(() => {
        state.timeLeft--;
        const percentage = (state.timeLeft / CONFIG.timerSeconds) * 100;
        dom.timerBar.style.width = percentage + "%";
        dom.timerText.textContent = state.timeLeft + "s";

        // Color changes based on time remaining
        if (state.timeLeft <= 5) {
            dom.timerBar.className = "timer__bar timer__bar--danger";
        } else if (state.timeLeft <= 10) {
            dom.timerBar.className = "timer__bar timer__bar--warning";
        }

        if (state.timeLeft <= 0) {
            clearInterval(state.timerInterval);
            handleTimeout();
        }
    }, 1000);
}


// ==================== RESULTS ====================

// Renders post-game review showing all questions with player answers
function renderReview() {
    let html = "";

    state.questions.forEach((q, i) => {
        const answer = state.answers[i];
        if (!answer) return;

        const isCorrect = answer.selected === answer.correct;
        const statusClass = answer.timeout ? "review-card--timeout" : (isCorrect ? "review-card--correct" : "review-card--wrong");
        const statusIcon = answer.timeout ? "⏰" : (isCorrect ? "✓" : "✗");

        html += '<div class="review-card ' + statusClass + '" style="--i:' + i + '">';
        html += '  <div class="review-card__header">';
        html += '    <span class="review-card__number">' + (i + 1) + '</span>';
        html += '    <span class="review-card__status">' + statusIcon + '</span>';
        html += '  </div>';
        html += '  <p class="review-card__question">' + q.question + '</p>';
        html += '  <div class="review-card__answers">';

        q.answers.forEach((ans, j) => {
            let ansClass = "review-answer";
            if (j === answer.correct) ansClass += " review-answer--correct";
            if (j === answer.selected && !isCorrect) ansClass += " review-answer--wrong";

            html += '<span class="' + ansClass + '">' + ans + '</span>';
        });

        html += '  </div>';
        html += '</div>';
    });

    dom.reviewList.innerHTML = html;
}

function endQuiz() {
    clearInterval(state.timerInterval);

    const accuracy = Math.round((state.correctCount / CONFIG.questionsPerRound) * 100);

    // Set result title based on performance
    if (accuracy >= 90) {
        dom.resultTitle.textContent = "🏆 Outstanding!";
    } else if (accuracy >= 70) {
        dom.resultTitle.textContent = "🌟 Great Job!";
    } else if (accuracy >= 50) {
        dom.resultTitle.textContent = "👍 Not Bad!";
    } else {
        dom.resultTitle.textContent = "💪 Keep Practicing!";
    }

    dom.resultScore.textContent = state.score;
    dom.resultCorrect.textContent = state.correctCount + "/" + CONFIG.questionsPerRound;
    dom.resultAccuracy.textContent = accuracy + "%";

    // Show streak info
    if (state.maxStreak >= 2) {
        const tier = getStreakTier(state.maxStreak);
        const fires = tier ? tier.fires : "";
        dom.resultStreak.textContent = state.maxStreak + " " + fires;
        dom.resultStreak.closest(".result__stat").classList.remove("hidden");
    } else {
        dom.resultStreak.textContent = "—";
        dom.resultStreak.closest(".result__stat").classList.remove("hidden");
    }

    // Save score
    const isNew = saveScore(state.currentUser, state.category, state.difficulty, state.score);

    if (isNew) {
        dom.resultHighscore.classList.remove("hidden");
    } else {
        dom.resultHighscore.classList.add("hidden");
    }

    renderReview();
    showView("result");
}


// ==================== SCORE MANAGEMENT ====================

function saveScore(username, category, difficulty, score) {
    const data = getGameData();
    const today = new Date().toISOString().split("T")[0];

    // Add score to scores array
    data.scores.push({
        user: username,
        category: category,
        difficulty: difficulty,
        score: score,
        maxStreak: state.maxStreak || 0,
        date: today
    });

    saveGameData(data);
    updateHighscorePreview();

    // Check if this is a new personal best for this category+difficulty
    const personalScores = data.scores.filter(s =>
        s.user === username &&
        s.category === category &&
        s.difficulty === difficulty
    );
    const best = Math.max(...personalScores.map(s => s.score));
    return score >= best;
}

function getMonthScores(year, month) {
    const data = getGameData();
    const monthStr = String(month).padStart(2, "0");
    const prefix = year + "-" + monthStr;

    return data.scores.filter(s => s.date.startsWith(prefix));
}

function getMonthlyBest(difficulty) {
    const now = new Date();
    const scores = getMonthScores(now.getFullYear(), now.getMonth() + 1);
    const filtered = scores.filter(s => s.difficulty === difficulty);

    if (filtered.length === 0) return null;

    // Find the highest score
    let best = filtered[0];
    filtered.forEach(s => {
        if (s.score > best.score) best = s;
    });

    return best;
}

function getLastMonthBest(difficulty) {
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth(); // 0-indexed, so this is last month

    if (month === 0) {
        month = 12;
        year--;
    }

    const scores = getMonthScores(year, month);
    const filtered = scores.filter(s => s.difficulty === difficulty);

    if (filtered.length === 0) return null;

    let best = filtered[0];
    filtered.forEach(s => {
        if (s.score > best.score) best = s;
    });

    return best;
}

function getPersonalBest(username, category, difficulty) {
    const data = getGameData();
    const scores = data.scores.filter(s =>
        s.user === username &&
        s.category === category &&
        s.difficulty === difficulty
    );

    if (scores.length === 0) return null;

    let best = scores[0];
    scores.forEach(s => {
        if (s.score > best.score) best = s;
    });

    return best;
}

function getOverallBest(category, difficulty) {
    const data = getGameData();
    const scores = data.scores.filter(s =>
        s.category === category &&
        s.difficulty === difficulty
    );

    if (scores.length === 0) return null;

    let best = scores[0];
    scores.forEach(s => {
        if (s.score > best.score) best = s;
    });

    return best;
}

function updateHighscorePreview() {
    // Show current user's best for selected category at each difficulty
    if (!state.currentUser) return;

    const cat = state.category;
    const easyBest = cat === "mixed"
        ? getPersonalBestOverall(state.currentUser, "easy")
        : getPersonalBest(state.currentUser, cat, "easy");
    const medBest = cat === "mixed"
        ? getPersonalBestOverall(state.currentUser, "medium")
        : getPersonalBest(state.currentUser, cat, "medium");
    const hardBest = cat === "mixed"
        ? getPersonalBestOverall(state.currentUser, "hard")
        : getPersonalBest(state.currentUser, cat, "hard");

    dom.previewEasy.textContent = easyBest ? easyBest.score : "—";
    dom.previewMedium.textContent = medBest ? medBest.score : "—";
    dom.previewHard.textContent = hardBest ? hardBest.score : "—";
}

function getPersonalBestOverall(username, difficulty) {
    const data = getGameData();
    const scores = data.scores.filter(s =>
        s.user === username &&
        s.difficulty === difficulty
    );

    if (scores.length === 0) return null;

    let best = scores[0];
    scores.forEach(s => {
        if (s.score > best.score) best = s;
    });

    return best;
}


// ==================== HIGHSCORES VIEW ====================

function renderHighscoresView(difficulty) {
    const data = getGameData();

    // Update tabs
    document.querySelectorAll(".highscores__tab").forEach(tab => {
        tab.classList.toggle("active", tab.dataset.hsDifficulty === difficulty);
    });

    // Monthly best
    const monthlyBest = getMonthlyBest(difficulty);
    const lastMonthBest = getLastMonthBest(difficulty);

    let overallHTML = "";

    if (monthlyBest) {
        const user = data.users[monthlyBest.user];
        const avatarSvg = user ? getAvatarSvg(user.gender, user.avatar) : "";
        overallHTML += '<div class="hs-monthly">';
        overallHTML += '  <span class="hs-monthly__label">🏆 This Month\'s Best</span>';
        overallHTML += '  <div class="hs-monthly__player">';
        overallHTML += '    <span class="hs-monthly__avatar">' + avatarSvg + '</span>';
        overallHTML += '    <span class="hs-monthly__name">' + monthlyBest.user + '</span>';
        overallHTML += '    <span class="hs-monthly__score">' + monthlyBest.score + ' pts</span>';
        overallHTML += '  </div>';
        overallHTML += '</div>';
    } else {
        overallHTML += '<div class="hs-monthly">';
        overallHTML += '  <span class="hs-monthly__label">🏆 This Month\'s Best</span>';
        overallHTML += '  <span class="hs-monthly__empty">No scores yet this month</span>';
        overallHTML += '</div>';
    }

    if (lastMonthBest) {
        const user = data.users[lastMonthBest.user];
        const avatarSvg = user ? getAvatarSvg(user.gender, user.avatar) : "";
        overallHTML += '<div class="hs-monthly hs-monthly--last">';
        overallHTML += '  <span class="hs-monthly__label">📅 Last Month\'s Winner</span>';
        overallHTML += '  <div class="hs-monthly__player">';
        overallHTML += '    <span class="hs-monthly__avatar">' + avatarSvg + '</span>';
        overallHTML += '    <span class="hs-monthly__name">' + lastMonthBest.user + '</span>';
        overallHTML += '    <span class="hs-monthly__score">' + lastMonthBest.score + ' pts</span>';
        overallHTML += '  </div>';
        overallHTML += '</div>';
    }

    dom.hsOverallScore.innerHTML = overallHTML || "—";

    // Category list — personal scores + best player
    const categoryKeys = ["geography", "animals", "languages", "sports", "music", "food", "gaming", "fashion", "mixed"];
    let html = "";

    categoryKeys.forEach(cat => {
        const catInfo = CATEGORIES[cat];
        const personal = state.currentUser ? getPersonalBest(state.currentUser, cat, difficulty) : null;
        const overall = getOverallBest(cat, difficulty);

        html += '<div class="highscore-row">';
        html += '  <div class="highscore-row__left">';
        html += '    <span class="highscore-row__category">';
        html += '      <span class="highscore-row__icon">' + catInfo.icon + '</span> ' + catInfo.name;
        html += '    </span>';
        if (personal) {
            html += '    <span class="highscore-row__score">' + personal.score + ' pts</span>';
        } else {
            html += '    <span class="highscore-row__empty">No score yet</span>';
        }
        html += '  </div>';

        // Best player for this category
        if (overall) {
            const bestUser = data.users[overall.user];
            const avatarSvg = bestUser ? getAvatarSvg(bestUser.gender, bestUser.avatar) : "";
            html += '  <div class="highscore-row__best">';
            html += '    <span class="highscore-row__best-avatar">' + avatarSvg + '</span>';
            html += '    <span class="highscore-row__best-info">';
            html += '      <span class="highscore-row__best-name">' + overall.user + '</span>';
            html += '      <span class="highscore-row__best-score">' + overall.score + '</span>';
            html += '    </span>';
            html += '  </div>';
        }

        html += '</div>';
    });

    dom.hsList.innerHTML = html;
}

// Highscore tab clicks
document.querySelectorAll(".highscores__tab").forEach(tab => {
    tab.addEventListener("click", () => {
        renderHighscoresView(tab.dataset.hsDifficulty);
    });
});

// Back from highscores
document.getElementById("btn-back-from-hs").addEventListener("click", () => showView("start"));


// ==================== RESULT SCREEN BUTTONS ====================

document.getElementById("btn-play-again").addEventListener("click", startQuiz);

document.getElementById("btn-back-home").addEventListener("click", () => {
    updateHighscorePreview();
    showView("start");
});


// ==================== QUIT QUIZ LOGIC ====================

document.getElementById("btn-quit-quiz").addEventListener("click", () => {
    // Pause the timer while modal is open
    clearInterval(state.timerInterval);
    document.getElementById("quit-modal").classList.remove("hidden");
});

document.getElementById("btn-quit-cancel").addEventListener("click", () => {
    document.getElementById("quit-modal").classList.add("hidden");

    // Resume timer only if player hasn't answered yet
    if (!state.answered) {
        resumeTimer();
    }
});

document.getElementById("btn-quit-confirm").addEventListener("click", () => {
    clearInterval(state.timerInterval);
    document.getElementById("quit-modal").classList.add("hidden");
    updateHighscorePreview();
    showView("start");
});


// ==================== ANSWER CLICK HANDLER ====================

dom.answers.addEventListener("click", (e) => {
    const btn = e.target.closest(".answer-btn");
    if (btn && !btn.disabled) {
        handleAnswer(btn.dataset.index);
    }
});


// ==================== UTILITY FUNCTIONS ====================

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


// ==================== INITIALIZE ====================

// Check if user is already logged in
(function init() {
    const data = getGameData();
    if (data.currentUser && data.users[data.currentUser]) {
        state.currentUser = data.currentUser;
        enterGame();
    }
})();

import anime from "animejs";

// ─────────────────────────────────────────
// Confidence % Count-up Animation
// Triggered when confidence value appears
// ─────────────────────────────────────────
export const animateCounter = (selector, targetValue) => {
    const obj = { value: 0 };

    anime({
        targets: obj,
        value: targetValue,
        duration: 1000,
        easing: "easeOutCubic",
        round: 1,
        update: () => {
            const el = document.querySelector(selector);
            if (el) el.textContent = `${Math.round(obj.value)}%`;
        },
    });
};


// ─────────────────────────────────────────
// Progress Bar Fill Animation
// ─────────────────────────────────────────
export const animateProgressBar = (selector, targetWidth) => {
    anime({
        targets: selector,
        width: [`0%`, `${targetWidth}%`],
        duration: 1000,
        easing: "easeOutCubic",
    });
};


// ─────────────────────────────────────────
// Score Number Animate
// ─────────────────────────────────────────
export const animateScore = (selector, from, to) => {
    const obj = { value: from };

    anime({
        targets: obj,
        value: to,
        duration: 800,
        easing: "easeOutQuad",
        round: 1,
        update: () => {
            const el = document.querySelector(selector);
            if (el) el.textContent = Math.round(obj.value);
        },
    });
};
// ─────────────────────────────────────────
// Decrypting / Shuffling Animation
// ─────────────────────────────────────────
export const animateDecrypt = (selector, targetValue) => {
    const el = document.querySelector(selector);
    if (!el) return;

    const symbols = "01$#!?%&@#*";
    let iterations = 0;
    const maxIterations = 15;

    const interval = setInterval(() => {
        el.textContent = Array(3)
            .fill(0)
            .map(() => symbols[Math.floor(Math.random() * symbols.length)])
            .join("") + "%";

        iterations++;
        if (iterations >= maxIterations) {
            clearInterval(interval);
            // After shuffling, trigger the standard count up
            animateCounter(selector, targetValue);
        }
    }, 40);
};

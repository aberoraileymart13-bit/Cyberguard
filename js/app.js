const LESSON_IDS = ["phishing", "passwords", "accounts"];
const PROGRESS_KEY = "cyberguard.completedLessons";
const WELCOME_KEY = "cyberguard.welcomeDismissed";
const THEME_KEY = "cyberguard.theme";

const completedCount = document.querySelector("#completed-count");
const lessonTotal = document.querySelector("#lesson-total");
const progressBar = document.querySelector("#progress-bar");
const progressMessage = document.querySelector("#progress-message");
const nextStep = document.querySelector("#next-step");
const lessonButtons = [...document.querySelectorAll(".lesson-toggle")];

lessonTotal.textContent = String(LESSON_IDS.length);

function readCompletedLessons() {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY);
    if (!saved) return new Set();

    const value = JSON.parse(saved);
    if (!Array.isArray(value)) throw new TypeError("Saved lesson progress is not a list.");
    return new Set(value.filter((lessonId) => LESSON_IDS.includes(lessonId)));
  } catch (error) {
    console.error("Could not read saved lesson progress.", error);
    progressMessage.textContent = "Saved progress could not be loaded. You can continue, but your previous progress may not appear.";
    return new Set();
  }
}

const completedLessons = readCompletedLessons();

function renderProgress() {
  completedCount.textContent = String(completedLessons.size);
  progressBar.value = completedLessons.size;

  const firstIncomplete = LESSON_IDS.find((lessonId) => !completedLessons.has(lessonId));
  const lessonNames = {
    phishing: "Spot the suspicious email",
    passwords: "Make passwords work harder",
    accounts: "Turn on account protection"
  };
  nextStep.textContent = firstIncomplete ? lessonNames[firstIncomplete] : "All lessons complete. Great work!";

  for (const button of lessonButtons) {
    const complete = completedLessons.has(button.dataset.lesson);
    button.setAttribute("aria-pressed", String(complete));
    button.closest(".lesson-card").classList.toggle("is-complete", complete);
    button.innerHTML = complete
      ? 'Completed <span aria-hidden="true">✓</span>'
      : 'Mark as complete <span aria-hidden="true">→</span>';
  }
}

for (const button of lessonButtons) {
  button.addEventListener("click", () => {
    const lessonId = button.dataset.lesson;
    if (completedLessons.has(lessonId)) {
      completedLessons.delete(lessonId);
    } else {
      completedLessons.add(lessonId);
    }

    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify([...completedLessons]));
      progressMessage.textContent = "Your lesson progress is saved on this device.";
    } catch (error) {
      console.error("Could not save lesson progress.", error);
      progressMessage.textContent = "Progress changed, but could not be saved in this browser.";
    }
    renderProgress();
  });
}

renderProgress();

const themeToggle = document.querySelector("#theme-toggle");

function setTheme(theme, persist = false) {
  document.documentElement.dataset.theme = theme;
  const lightTheme = theme === "light";
  themeToggle.setAttribute("aria-label", lightTheme ? "Switch to dark theme" : "Switch to light theme");
  themeToggle.title = lightTheme ? "Switch to dark theme" : "Switch to light theme";

  if (persist) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.error("Could not save the selected theme.", error);
      progressMessage.textContent = "Theme changed, but this browser could not save your preference.";
    }
  }
}

let savedTheme = "dark";
try {
  savedTheme = localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
} catch (error) {
  console.error("Could not read the saved theme.", error);
}
setTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  setTheme(nextTheme, true);
});

const welcomeDialog = document.querySelector("#welcome-dialog");
const dismissWelcome = document.querySelector("#dismiss-welcome");

function rememberWelcomeDismissal() {
  try {
    localStorage.setItem(WELCOME_KEY, "true");
  } catch (error) {
    console.error("Could not save the welcome dialog preference.", error);
  }
}

dismissWelcome.addEventListener("click", () => welcomeDialog.close());
welcomeDialog.addEventListener("close", rememberWelcomeDismissal);

try {
  if (localStorage.getItem(WELCOME_KEY) !== "true") welcomeDialog.showModal();
} catch (error) {
  console.error("Could not read the welcome dialog preference.", error);
  welcomeDialog.showModal();
}

const quizForm = document.querySelector("#quiz-form");
const quizFeedback = document.querySelector("#quiz-feedback");

quizForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const answer = new FormData(quizForm).get("quiz-answer");
  if (!answer) {
    quizFeedback.textContent = "Choose an answer to check your instincts.";
    return;
  }

  if (answer === "verify") {
    quizFeedback.textContent = "That’s right. Use a trusted route you navigate to yourself.";
    quizFeedback.dataset.result = "correct";
  } else {
    quizFeedback.textContent = "Not quite. Avoid the email link and verify through the official app or website.";
    quizFeedback.dataset.result = "incorrect";
  }
});

const passwordOutput = document.querySelector("#password-output");
const passwordLength = document.querySelector("#password-length");
const passwordFeedback = document.querySelector("#password-feedback");
const copyButton = document.querySelector("#copy-password");
const passwordAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*+-=?";

function generatePassword(length) {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error("Secure random number generation is not available in this browser.");
  }

  let password = "";
  const cutoff = Math.floor(256 / passwordAlphabet.length) * passwordAlphabet.length;
  const bytes = new Uint8Array(1);

  while (password.length < length) {
    crypto.getRandomValues(bytes);
    if (bytes[0] < cutoff) password += passwordAlphabet[bytes[0] % passwordAlphabet.length];
  }

  return password;
}

document.querySelector("#generate-password").addEventListener("click", () => {
  try {
    passwordOutput.value = generatePassword(Number(passwordLength.value));
    copyButton.disabled = false;
    passwordFeedback.textContent = "Generated locally. Consider saving it in a trusted password manager.";
  } catch (error) {
    console.error("Could not generate a password.", error);
    passwordFeedback.textContent = error.message;
  }
});

copyButton.addEventListener("click", async () => {
  if (!passwordOutput.value) return;

  try {
    await navigator.clipboard.writeText(passwordOutput.value);
    passwordFeedback.textContent = "Password copied to the clipboard.";
  } catch (error) {
    console.error("Could not copy the password.", error);
    passwordFeedback.textContent = "Copy was blocked by the browser. Select the password and copy it manually.";
  }
});

// Password checks stay in memory only; this file never persists or transmits input.
(function () {
  "use strict";
  const input = document.querySelector("#password-input");
  const commonPasswords = new Set(["123456", "password", "qwerty", "letmein", "welcome", "admin", "password123", "abc123"]);
  const rules = [
    ["length", (value) => value.length >= 12],
    ["upper", (value) => /[A-Z]/.test(value)],
    ["lower", (value) => /[a-z]/.test(value)],
    ["number", (value) => /\d/.test(value)],
    ["symbol", (value) => /[^A-Za-z0-9]/.test(value)],
    ["unique", (value) => value.length > 0 && !commonPasswords.has(value.toLowerCase())]
  ];
  window.CyberGuardPassword = {
    evaluate(value) {
      const checks = rules.map(([id, test]) => ({ id, passed: test(value) }));
      const rulesPassed = checks.every((check) => check.passed);
      const score = Math.min(4, Math.floor(checks.filter((check) => check.passed).length * 4 / rules.length));
      const strong = rulesPassed && score >= 3;
      const veryStrong = Boolean(value) && rulesPassed && score === 4;
      const label = !value ? "Enter a password" : veryStrong ? "Very Strong"
        : score >= 3 && rulesPassed ? "Strong" : score >= 2 ? "Good" : score === 1 ? "Fair" : "Weak";
      const percent = Math.min(veryStrong ? 100 : 80, Math.round(score / 4 * 100));
      return { score, percent, strong, rulesPassed, veryStrong, label, checks };
    }
  };
  if (!input) return;
  const meter = document.querySelector("#strength-meter");
  const label = document.querySelector("#strength-label");
  const percentLabel = document.querySelector("#strength-percent");
  const checklist = document.querySelector("#password-rules");

  function evaluate() {
    const value = input.value;
    const rating = window.CyberGuardPassword.evaluate(value);
    rating.checks.forEach(({ id, passed }) => {
      const item = checklist.querySelector(`[data-rule="${id}"]`);
      item.classList.toggle("rule-pass", passed);
      item.querySelector(".rule-state").textContent = passed ? "Pass" : "Not met";
    });
    meter.querySelector(".progress-fill").style.width = `${rating.percent}%`;
    meter.setAttribute("aria-valuenow", String(rating.percent));
    label.textContent = rating.label;
    percentLabel.textContent = `${rating.percent}%`;
  }

  function generatePassword() {
    const groups = [
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz", "0123456789",
      "!@#$%^&*()-_=+[]{};:,.<>/?"
    ];
    const alphabet = groups.join("");
    function randomIndex(max) {
      const range = 0x100000000;
      const limit = range - (range % max);
      const value = new Uint32Array(1);
      do { crypto.getRandomValues(value); } while (value[0] >= limit);
      return value[0] % max;
    }
    const chars = groups.map((group) => group[randomIndex(group.length)]);
    while (chars.length < 20) chars.push(alphabet[randomIndex(alphabet.length)]);
    for (let index = chars.length - 1; index > 0; index -= 1) {
      const swap = randomIndex(index + 1);
      [chars[index], chars[swap]] = [chars[swap], chars[index]];
    }
    input.value = chars.join("");
    evaluate();
  }

  input.addEventListener("input", evaluate);
  document.querySelector("#toggle-password").addEventListener("click", (event) => {
    const visible = input.type === "text";
    input.type = visible ? "password" : "text";
    event.currentTarget.setAttribute("aria-label", visible ? "Show password" : "Hide password");
    event.currentTarget.textContent = visible ? "Show" : "Hide";
  });
  document.querySelector("#generate-password").addEventListener("click", generatePassword);
  document.querySelector("#copy-password").addEventListener("click", async () => {
    if (!input.value) {
      window.CyberGuard.showToast("Enter or generate a password before copying.");
      return;
    }
    if (window.CyberGuard.isEasyReading() && !window.confirm("Copy this password to your clipboard?")) return;
    try {
      await navigator.clipboard.writeText(input.value);
      window.CyberGuard.showToast("Password copied to your clipboard.");
    } catch (error) {
      input.select();
      const copied = document.execCommand("copy");
      if (!copied) {
        window.CyberGuard.showToast("Copy was blocked. Select and copy the password manually.");
        return;
      }
      window.CyberGuard.showToast("Password copied to your clipboard.");
    }
  });
  evaluate();
})();

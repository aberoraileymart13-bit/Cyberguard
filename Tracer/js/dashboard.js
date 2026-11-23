(function () {
  "use strict";
  const moduleNames = {
    phishing: "Phishing 101",
    privacy: "Data Privacy Basics",
    passwords: "Password Security",
    hardening: "Account Hardening"
  };
  const progress = window.CyberGuardData.getProgress();
  const completedLessons = window.CyberGuardData.getCompletedLessons();
  const totalLessons = Object.values(completedLessons).reduce((total, lessons) => total + lessons.length, 0);
  const completedModules = Object.values(progress).filter((value) => value === 100).length;
  document.querySelector("#dashboard-lessons").textContent = String(totalLessons);
  document.querySelector("#dashboard-modules-completed").textContent = `${completedModules} of ${Object.keys(progress).length}`;
  document.querySelector("#dashboard-best-score").textContent = `${window.CyberGuardData.getBestScore()}%`;
  const container = document.querySelector("#dashboard-module-progress");
  Object.entries(progress).forEach(([id, value]) => {
    const item = document.createElement("article");
    item.className = "progress-item";
    const heading = document.createElement("div");
    heading.className = "form-row";
    const name = document.createElement("strong");
    name.textContent = moduleNames[id];
    const status = document.createElement("span");
    status.className = "muted";
    status.textContent = `${value}% · ${completedLessons[id].length}/${window.CyberGuardData.getLessonCount(id)} lessons`;
    heading.append(name, status);
    const track = document.createElement("div");
    track.className = "progress-track";
    track.setAttribute("role", "progressbar");
    track.setAttribute("aria-label", `${moduleNames[id]} progress`);
    track.setAttribute("aria-valuemin", "0");
    track.setAttribute("aria-valuemax", "100");
    track.setAttribute("aria-valuenow", String(value));
    const fill = document.createElement("div");
    fill.className = "progress-fill";
    fill.style.width = `${value}%`;
    track.append(fill);
    const action = document.createElement("a");
    action.className = "button button-secondary button-small";
    action.textContent = value === 0 ? "Start" : value === 100 ? "Review" : "Continue";
    const nextIndex = value === 100 ? 0 : completedLessons[id].length;
    action.href = `lesson.html?m=${encodeURIComponent(id)}&l=${nextIndex + 1}`;
    item.append(heading, track, action);
    container.append(item);
  });
  const best = window.CyberGuardData.getBestScore();
  const badges = window.CyberGuardData.getBadges(progress, best);
  const badgeContainer = document.querySelector("#dashboard-badges");
  badges.forEach((name) => {
    const badge = document.createElement("span");
    badge.className = "tag";
    badge.textContent = name;
    badgeContainer.append(badge);
  });
  const streak = window.CyberGuardData.getStreak();
  document.querySelector("#dashboard-streak").textContent = `Learning streak: ${streak} day${streak === 1 ? "" : "s"}`;
})();

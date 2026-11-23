(function () {
  "use strict";
  const moduleNames = {
    phishing: "Phishing 101",
    privacy: "Data Privacy Basics",
    passwords: "Password Security",
    hardening: "Account Hardening"
  };
  const progress = window.CyberGuardData.getProgress();
  const completed = window.CyberGuardData.getCompletedLessons();
  const totalModules = Object.values(progress).filter((value) => value === 100).length;
  document.querySelector("#profile-modules").textContent = `${totalModules} of ${Object.keys(progress).length}`;
  document.querySelector("#profile-best").textContent = `${window.CyberGuardData.getBestScore()}%`;
  const streak = window.CyberGuardData.getStreak();
  document.querySelector("#training-streak").textContent = `${streak} day${streak === 1 ? "" : "s"}`;

  const moduleContainer = document.querySelector("#module-progress");
  Object.entries(progress).forEach(([id, value]) => {
    const item = document.createElement("article");
    item.className = "progress-item";
    const heading = document.createElement("div");
    heading.className = "form-row";
    const name = document.createElement("strong");
    name.textContent = moduleNames[id];
    const count = document.createElement("span");
    count.className = "muted";
    count.textContent = `${completed[id].length} of ${window.CyberGuardData.getLessonCount(id)} lessons`;
    heading.append(name, count);
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
    item.append(heading, track);
    moduleContainer.append(item);
  });

  const badges = window.CyberGuardData.getBadges(progress, window.CyberGuardData.getBestScore());
  const badgeContainer = document.querySelector("#achievement-badges");
  document.querySelector("#badges-empty").hidden = badges.length > 0;
  badges.forEach((name) => {
    const badge = document.createElement("span");
    badge.className = "tag";
    badge.textContent = name;
    badgeContainer.append(badge);
  });

  const certificate = document.querySelector("#certificate-button");
  const certificateMessage = document.querySelector("#certificate-message");
  if (totalModules === Object.keys(progress).length) {
    certificate.hidden = false;
    certificateMessage.textContent = "You completed all four training modules.";
    certificate.addEventListener("click", () => {
      const profileName = window.CyberGuardData.getProfile().displayName || "Learner";
      const safeName = profileName.replace(/[&<>"']/g, (character) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
      }[character]));
      const themeStyles = getComputedStyle(document.documentElement);
      const colors = {
        bg: themeStyles.getPropertyValue("--color-bg").trim(),
        panel: themeStyles.getPropertyValue("--color-panel").trim(),
        text: themeStyles.getPropertyValue("--color-text").trim(),
        accent: themeStyles.getPropertyValue("--color-accent").trim()
      };
      const documentText = `<!doctype html><html lang="en"><meta charset="utf-8"><title>CyberGuard Training Certificate</title><style>:root{--certificate-bg:${colors.bg};--certificate-panel:${colors.panel};--certificate-text:${colors.text};--certificate-accent:${colors.accent}}body{font-family:Georgia,serif;text-align:center;padding:12vh 8vw;color:var(--certificate-text);background:var(--certificate-bg)}main{border:8px double var(--certificate-accent);background:var(--certificate-panel);padding:5rem 2rem}h1{font-size:2.5rem}p{font-size:1.2rem}@media print{body{padding:0}}</style><main><h1>Certificate of Completion</h1><p>This certifies that</p><h2>${safeName}</h2><p>has completed all CyberGuard security awareness training modules.</p><p>Issued ${new Date().toLocaleDateString()}</p></main></html>`;
      const url = URL.createObjectURL(new Blob([documentText], { type: "text/html" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "cyberguard-training-certificate.html";
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }

  const events = window.CyberGuardData.getActivity();
  const list = document.querySelector("#activity-list");
  document.querySelector("#activity-empty").hidden = events.length > 0;
  events.slice(0, 15).forEach((event) => {
    const item = document.createElement("li");
    const description = document.createElement("span");
    description.textContent = event.type;
    const time = document.createElement("time");
    const date = new Date(event.at);
    if (!Number.isNaN(date.getTime())) {
      time.dateTime = date.toISOString();
      time.textContent = date.toLocaleString();
    }
    item.append(description, time);
    list.append(item);
  });
})();

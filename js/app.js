// Shared navigation, local preferences, notifications, and portal search.
(function () {
  "use strict";
  const themes = ["violet", "ocean", "forest", "sand", "crimson"];
  const modes = ["light", "dark", "system"];
  const defaultSettings = {
    fontSize: "medium", readingTextSize: null, easyReading: false,
    highContrast: false, quizSound: true, theme: "violet", mode: "dark"
  };
  const pages = [
    ["Dashboard", "index.html"], ["Projects", "projects.html"], ["Resources", "resources.html"],
    ["Training", "training.html"], ["Quiz", "quiz.html"], ["Password Tools", "password-tools.html"],
    ["Ethics & References", "ethics.html"], ["My Progress", "profile.html"], ["Settings", "settings.html"],
    ["Is this site safe?", "is-this-site-safe.html"], ["Is this message a scam?", "scam-checker.html"],
    ["Safety checklist", "safety-checklist.html"]
  ];
  function readSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem("cyberguard-settings") || "{}");
      const settings = { ...defaultSettings, ...(saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {}) };
      if (!themes.includes(settings.theme)) settings.theme = "violet";
      if (!["A", "A+", "A++"].includes(settings.readingTextSize)) settings.readingTextSize = null;
      settings.easyReading = Boolean(settings.easyReading);
      if (!saved || typeof saved !== "object" || Array.isArray(saved) || !modes.includes(saved.mode)) {
        settings.mode = saved && saved.lightTheme ? "light" : "dark";
      }
      delete settings.lightTheme;
      return settings;
    }
    catch (error) { console.warn("Could not read saved preferences; using defaults.", error); return { ...defaultSettings }; }
  }
  function applySettings(settings) {
    const standardSizes = { A: "16px", "A+": "18px", "A++": "20px" };
    const easySizes = { A: "20px", "A+": "22px", "A++": "24px" };
    const legacySizes = { small: "14px", medium: "16px", large: "18px" };
    const readingTextSize = settings.readingTextSize || (settings.easyReading ? "A" : null);
    const size = readingTextSize
      ? (settings.easyReading ? easySizes : standardSizes)[readingTextSize]
      : legacySizes[settings.fontSize] || "16px";
    document.documentElement.style.setProperty("--font-size", size);
    document.documentElement.dataset.experience = settings.easyReading ? "easy" : "standard";
    document.body.classList.toggle("high-contrast", Boolean(settings.highContrast));
    const theme = themes.includes(settings.theme) ? settings.theme : "violet";
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.mode = theme === "crimson" ? "dark" : modes.includes(settings.mode) ? settings.mode : "dark";
    updateThemeToggle();
  }
  function saveSettings(settings, skipConfirmation = false) {
    if (document.documentElement.dataset.experience === "easy" &&
        JSON.stringify(settings) !== JSON.stringify(readSettings()) &&
        !skipConfirmation && !window.confirm("Change this setting?")) {
      applySettings(readSettings());
      updateReadingControls(readSettings());
      updateAppearanceControls(readSettings());
      return false;
    }
    localStorage.setItem("cyberguard-settings", JSON.stringify(settings));
    applySettings(settings);
    updateReadingControls(settings);
    window.dispatchEvent(new CustomEvent("cyberguard:settings", { detail: settings }));
    return true;
  }
  function resolvedMode() {
    const mode = document.documentElement.dataset.mode;
    return mode === "system" ? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark") : mode;
  }
  function updateThemeToggle() {
    const button = document.querySelector(".theme-toggle");
    if (!button) return;
    const crimson = document.documentElement.dataset.theme === "crimson";
    const nextMode = resolvedMode() === "light" ? "dark" : "light";
    button.disabled = crimson;
    button.textContent = document.documentElement.dataset.experience === "easy"
      ? "Change color mode" : nextMode === "light" ? "☀" : "☾";
    button.setAttribute("aria-label", crimson ? "Crimson Noir uses dark mode only" : `Switch to ${nextMode} mode`);
    button.title = crimson ? "Crimson Noir uses dark mode only" : `Switch to ${nextMode} mode`;
    button.setAttribute("aria-pressed", String(resolvedMode() === "light"));
  }
  function setupThemeToggle() {
    const notification = document.querySelector("#notification-button");
    if (!notification || document.querySelector(".theme-toggle")) return;
    const button = document.createElement("button");
    button.className = "icon-button theme-toggle";
    button.type = "button";
    notification.insertAdjacentElement("afterend", button);
    button.addEventListener("click", () => {
      const settings = readSettings();
      if (settings.theme === "crimson") return;
      settings.mode = resolvedMode() === "light" ? "dark" : "light";
      if (!saveSettings(settings)) return;
      const modeControl = document.querySelector("#theme-mode-setting");
      if (modeControl) modeControl.value = settings.mode;
      updateAppearanceControls(settings);
      showToast(`Switched to ${settings.mode} mode.`);
    });
    window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", () => {
      if (document.documentElement.dataset.mode === "system") updateThemeToggle();
    });
    updateThemeToggle();
  }
  function updateReadingControls(settings) {
    const toggle = document.querySelector("#easy-reading-toggle");
    if (toggle) {
      toggle.textContent = `Easy Reading: ${settings.easyReading ? "On" : "Off"}`;
      toggle.setAttribute("aria-pressed", String(settings.easyReading));
    }
    document.querySelectorAll("[data-reading-size]").forEach((button) => {
      const selectedSize = settings.readingTextSize || (settings.fontSize === "large" ? "A+" : "A");
      button.setAttribute("aria-pressed", String(button.dataset.readingSize === selectedSize));
    });
  }
  function setWelcomeSeen() {
    try { localStorage.setItem("cyberguard-welcome-seen", "true"); }
    catch (error) { console.warn("Could not save the welcome preference.", error); }
  }
  function setupWelcomeDialog() {
    try { if (localStorage.getItem("cyberguard-welcome-seen") === "true") return; }
    catch (error) { console.warn("Could not read the welcome preference.", error); }
    const dialog = document.createElement("dialog");
    dialog.className = "modal welcome-dialog";
    dialog.setAttribute("aria-labelledby", "welcome-title");
    dialog.innerHTML = `<div class="modal-content">
      <h2 id="welcome-title">How would you like to read this site?</h2>
      <p>Choose the reading style that works best for you. You can change it at any time.</p>
      <div class="welcome-options">
        <button class="button button-secondary" type="button" data-welcome-mode="standard">Standard</button>
        <button class="button" type="button" data-welcome-mode="easy">Easy Reading</button>
        <button class="button button-secondary" type="button" data-age-options>Choose by age</button>
      </div>
      <section class="age-suggestions" hidden aria-live="polite">
        <h3>Choose an age range</h3>
        <div class="welcome-options">
          <button class="button button-secondary" type="button" data-age="under18">Under 18</button>
          <button class="button button-secondary" type="button" data-age="adult">18–59</button>
          <button class="button button-secondary" type="button" data-age="older">60 and over</button>
        </div>
        <p class="age-suggestion" hidden></p>
        <div class="welcome-options age-confirmation" hidden>
          <button class="button" type="button" data-confirm-suggestion>Use this mode</button>
          <button class="button button-secondary" type="button" data-age-back>Choose another age</button>
        </div>
      </section>
      <button class="text-link welcome-close" type="button" data-welcome-close>Continue with current settings</button>
    </div>`;
    document.body.append(dialog);
    dialog.addEventListener("close", setWelcomeSeen);
    dialog.addEventListener("cancel", setWelcomeSeen);
    dialog.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      dialog.close();
    });
    dialog.querySelectorAll("[data-welcome-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        const settings = readSettings();
        settings.easyReading = button.dataset.welcomeMode === "easy";
        saveSettings(settings, true);
        dialog.close();
      });
    });
    const agePanel = dialog.querySelector(".age-suggestions");
    dialog.querySelector("[data-age-options]").addEventListener("click", () => {
      agePanel.hidden = false;
      dialog.querySelector("[data-age='under18']").focus();
    });
    dialog.querySelectorAll("[data-age]").forEach((button) => {
      button.addEventListener("click", () => {
        const suggestedEasy = button.dataset.age === "older";
        const suggestion = dialog.querySelector(".age-suggestion");
        suggestion.textContent = `We suggest ${suggestedEasy ? "Easy Reading" : "Standard"} for this age range. You choose whether to use it.`;
        suggestion.hidden = false;
        dialog.querySelector(".age-confirmation").hidden = false;
        dialog.dataset.suggestedMode = suggestedEasy ? "easy" : "standard";
        dialog.querySelector("[data-confirm-suggestion]").focus();
      });
    });
    dialog.querySelector("[data-confirm-suggestion]").addEventListener("click", () => {
      const settings = readSettings();
      settings.easyReading = dialog.dataset.suggestedMode === "easy";
      saveSettings(settings, true);
      dialog.close();
    });
    dialog.querySelector("[data-age-back]").addEventListener("click", () => {
      dialog.querySelector(".age-suggestion").hidden = true;
      dialog.querySelector(".age-confirmation").hidden = true;
      dialog.querySelector("[data-age='under18']").focus();
    });
    dialog.querySelector("[data-welcome-close]").addEventListener("click", () => dialog.close());
    dialog.showModal();
  }
  function setupReadingControls() {
    const notification = document.querySelector("#notification-button");
    if (!notification || document.querySelector(".reading-controls")) return;
    const controls = document.createElement("div");
    controls.className = "reading-controls";
    controls.setAttribute("aria-label", "Reading controls");
    controls.innerHTML = `<button class="reading-toggle" id="easy-reading-toggle" type="button" aria-pressed="false">Easy Reading: Off</button>
      <div class="text-size-controls" role="group" aria-label="Text size">
        <button type="button" data-reading-size="A" aria-label="Text size A">A</button>
        <button type="button" data-reading-size="A+" aria-label="Text size A plus">A+</button>
        <button type="button" data-reading-size="A++" aria-label="Text size A plus plus">A++</button>
      </div>`;
    notification.insertAdjacentElement("afterend", controls);
    const toggle = controls.querySelector("#easy-reading-toggle");
    toggle.addEventListener("click", () => {
      const settings = readSettings();
      const next = !settings.easyReading;
      if (!window.confirm(`Turn Easy Reading ${next ? "on" : "off"}?`)) return;
      settings.easyReading = next;
      settings.readingTextSize = settings.readingTextSize || "A";
      if (saveSettings(settings, true)) showToast(`Easy Reading is ${next ? "on" : "off"}.`);
    });
    controls.querySelectorAll("[data-reading-size]").forEach((button) => {
      button.addEventListener("click", () => {
        const settings = readSettings();
        settings.readingTextSize = button.dataset.readingSize;
        settings.fontSize = "medium";
        if (saveSettings(settings)) showToast(`Text size ${button.dataset.readingSize} selected.`);
      });
    });
    updateReadingControls(readSettings());
  }
  function navLink(label, href, icon, current) {
    const active = current === href;
    return `<a class="nav-link" href="${href}"${active ? ' aria-current="page"' : ""}><span class="nav-icon" aria-hidden="true">${icon}</span>${label}</a>`;
  }
  function renderNavigation() {
    const current = location.pathname.split("/").pop() || "index.html";
    const sidebar = document.querySelector("[data-sidebar]");
    if (!sidebar) return;
    const easy = document.documentElement.dataset.experience === "easy";
    if (easy) {
      const easyPages = [
        ["Home", "index.html"], ["Learn", "training.html"], ["Practice", "quiz.html"],
        ["Is it a scam?", "scam-checker.html"], ["Passwords", "password-tools.html"],
        ["About this site", "is-this-site-safe.html"]
      ];
      sidebar.innerHTML = `<a class="brand" href="index.html"><span class="brand-main">CYBERGUARD</span><span class="brand-sub">Security learning</span></a>
        <nav aria-label="Main navigation"><ul class="nav-list">${easyPages.map(([label, href]) => `<li>${navLink(label, href, "", current)}</li>`).join("")}</ul></nav>`;
      return;
    }
    const isTraining = ["training.html", "quiz.html", "lesson.html", "phishing-lab.html"].includes(current);
    sidebar.innerHTML = `<a class="brand" href="index.html" aria-label="CyberGuard x TechFlow home"><span class="brand-main">◆ CYBER<span>GUARD</span></span><span class="brand-sub">× 🚀 TechFlow</span></a>
      <nav aria-label="Main navigation"><ul class="nav-list">
        <li>${navLink("Dashboard", "index.html", "⌂", current)}</li><li>${navLink("Projects", "projects.html", "▣", current)}</li>
        <li>${navLink("Resources", "resources.html", "▤", current)}</li>
        <li><button class="nav-toggle" type="button" aria-expanded="${isTraining}" aria-controls="training-submenu"><span class="nav-icon" aria-hidden="true">▧</span>Training <span class="chevron" aria-hidden="true">⌄</span></button>
          <ul class="submenu${isTraining ? "" : " hidden"}" id="training-submenu"><li>${navLink("Training Overview", "training.html", "›", current)}</li><li>${navLink("Phishing Lab", "phishing-lab.html", "›", current)}</li><li>${navLink("Quiz", "quiz.html", "›", current)}</li></ul></li>
        <li>${navLink("Password Tools", "password-tools.html", "▣", current)}</li>
        <li>${navLink("Is this message a scam?", "scam-checker.html", "?", current)}</li>
        <li>${navLink("Safety checklist", "safety-checklist.html", "✓", current)}</li>
        <li>${navLink("Is this site safe?", "is-this-site-safe.html", "◇", current)}</li>
        <li>${navLink("Ethics & References", "ethics.html", "◇", current)}</li>
        <li>${navLink("My Progress", "profile.html", "◉", current)}</li></ul></nav>
      <div class="sidebar-bottom">${navLink("Settings", "settings.html", "⚙", current)}</div>`;
  }
  function showToast(message) {
    let region = document.querySelector(".toast-region");
    if (!region) {
      region = document.createElement("div"); region.className = "toast-region";
      region.setAttribute("role", "status"); region.setAttribute("aria-live", "polite"); document.body.append(region);
    }
    const toast = document.createElement("div"); toast.className = "toast"; toast.textContent = message;
    region.append(toast);
    if (document.documentElement.dataset.experience === "easy") {
      const dismiss = document.createElement("button");
      dismiss.type = "button";
      dismiss.className = "button button-small";
      dismiss.textContent = "Dismiss";
      dismiss.addEventListener("click", () => toast.remove());
      toast.append(dismiss);
    } else window.setTimeout(() => toast.remove(), 3500);
  }
  function renderGreeting() {
    const name = window.CyberGuardData.getProfile().displayName;
    document.querySelectorAll(".welcome").forEach((node) => {
      node.textContent = name ? `Welcome, ${name}` : "Welcome";
    });
  }
  function setupNotifications() {
    const button = document.querySelector("#notification-button");
    if (!button || button.dataset.ready) return;
    button.dataset.ready = "true";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", "notification-menu");
    button.insertAdjacentHTML("afterend", `<div class="dropdown-menu notification-menu hidden" id="notification-menu" role="region" aria-label="Notifications"></div>`);
    const names = { phishing: "Phishing 101", privacy: "Data Privacy Basics", passwords: "Password Security", hardening: "Account Hardening" };
    const menu = document.querySelector("#notification-menu");
    button.textContent = document.documentElement.dataset.experience === "easy" ? "Notifications" : "🔔";
    const badge = document.createElement("span");
    badge.className = "unread-badge"; badge.setAttribute("aria-hidden", "true");
    function render() {
      const progress = window.CyberGuardData.getProgress();
      const notices = Object.entries(progress)
        .filter(([, value]) => value < 100)
        .map(([id, value]) => ({ label: `${value ? "Continue" : "Start"} ${names[id]} (${value}%)`, href: "training.html" }));
      const best = window.CyberGuardData.getBestScore();
      if (best < 80) notices.push({ label: best ? `Improve your quiz best (${best}%)` : "Try the knowledge quiz", href: "quiz.html" });
      button.setAttribute("aria-label", notices.length ? `Notifications, ${notices.length} items` : "Notifications");
      badge.textContent = String(notices.length);
      badge.hidden = notices.length === 0;
      if (!badge.parentElement) button.append(badge);
      menu.replaceChildren();
      const heading = document.createElement("strong");
      heading.textContent = notices.length ? `Learning reminders (${notices.length})` : "You're all caught up.";
      menu.append(heading);
      notices.forEach((notice) => {
        const link = document.createElement("a");
        link.href = notice.href; link.textContent = notice.label; menu.append(link);
      });
    }
    render();
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") === "true";
      if (!open) closeDropdowns(button);
      button.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("hidden", open);
    });
    window.addEventListener("cyberguard:data", render);
  }
  function closeDropdowns(target) {
    document.querySelectorAll(".dropdown-menu:not(.hidden)").forEach((menu) => {
      const button = menu.id && document.querySelector(`[aria-controls="${menu.id}"]`);
      const search = menu.id === "search-results" ? document.querySelector("#site-search") : null;
      if (target && (menu.contains(target) || button?.contains(target) || search?.contains(target))) return;
      menu.classList.add("hidden");
      if (button) button.setAttribute("aria-expanded", "false");
    });
  }
  function setupDropdownDismissal() {
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeDropdowns(); });
    document.addEventListener("click", (event) => {
      closeDropdowns(event.target instanceof Element ? event.target : null);
    });
  }
  function setupSearch() {
    const search = document.querySelector("#site-search");
    if (!search) return;
    search.setAttribute("aria-label", "Search pages, modules, and resources. Press slash to focus.");
    search.placeholder = "Search pages, modules, resources…";
    const catalog = [
      ...pages,
      ["Phishing Lab", "phishing-lab.html"],
      ["Phishing 101 training module", "training.html"],
      ["Data Privacy Basics training module", "training.html"],
      ["Password Security training module", "training.html"],
      ["Account Hardening training module", "training.html"],
      ["Phishing and scam resources", "resources.html"],
      ["Cyberbullying and identity theft resources", "resources.html"]
    ].map(([label, href]) => ({ label, href }));
    const results = document.createElement("div");
    results.className = "dropdown-menu search-results hidden";
    results.id = "search-results";
    results.setAttribute("role", "list");
    results.setAttribute("aria-label", "Search results");
    search.closest(".search-box").append(results);
    function runSearch() {
      const query = search.value.trim().toLowerCase();
      document.querySelectorAll(".quick-card, [data-module], details, main article").forEach((node) => {
        node.hidden = Boolean(query) && !node.textContent.toLowerCase().includes(query);
      });
      results.replaceChildren();
      catalog.filter((entry) => entry.label.toLowerCase().includes(query)).slice(0, 6).forEach((entry) => {
        const link = document.createElement("a");
        link.href = entry.href; link.textContent = entry.label; link.setAttribute("role", "option"); results.append(link);
      });
      results.classList.toggle("hidden", !query || results.childElementCount === 0);
    }
    search.addEventListener("input", runSearch);
    search.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      const query = search.value.trim().toLowerCase();
      const match = catalog.find((entry) => entry.label.toLowerCase().includes(query));
      if (match) location.href = match.href;
      else if (query) showToast("No matching page, module, or resource found.");
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        event.preventDefault(); search.focus();
      }
    });
  }
  function updateAppearanceControls(settings) {
    const radios = [...document.querySelectorAll(".theme-option[role='radio']")];
    radios.forEach((radio) => {
      const selected = radio.dataset.theme === settings.theme;
      radio.setAttribute("aria-checked", String(selected));
      radio.tabIndex = selected ? 0 : -1;
    });
    const mode = document.querySelector("#theme-mode-setting");
    const help = document.querySelector("#theme-mode-help");
    if (mode) {
      mode.value = settings.theme === "crimson" ? "dark" : settings.mode;
      mode.disabled = settings.theme === "crimson";
    }
    if (help) {
      help.textContent = settings.theme === "crimson"
        ? "Crimson Noir is dark-only. Your selected mode will be restored if you choose another theme."
        : "Device default follows your system appearance and updates automatically.";
    }
  }
  function setupSettings() {
    const settings = readSettings();
    applySettings(settings);
    const font = document.querySelector("#font-size-setting");
    const contrast = document.querySelector("#high-contrast-setting");
    const sound = document.querySelector("#quiz-sound-setting");
    const name = document.querySelector("#display-name-setting");
    const fontHelp = document.querySelector("#font-size-help");
    function updateFontSetting(currentSettings) {
      if (!font) return;
      font.value = currentSettings.fontSize;
      font.disabled = currentSettings.easyReading || Boolean(currentSettings.readingTextSize);
      if (fontHelp) fontHelp.textContent = font.disabled
        ? "Use the A, A+, and A++ controls in the header to change text size."
        : "Choose the base text size used across the portal.";
    }
    updateFontSetting(settings);
    window.addEventListener("cyberguard:settings", (event) => updateFontSetting(event.detail));
    if (contrast) contrast.checked = settings.highContrast;
    if (sound) sound.checked = settings.quizSound;
    if (name) name.value = window.CyberGuardData.getProfile().displayName;
    updateAppearanceControls(settings);
    font?.addEventListener("change", () => {
      const next = { ...readSettings(), fontSize: font.value, readingTextSize: null };
      if (saveSettings(next)) showToast("Your preferences have been saved.");
      else font.value = readSettings().fontSize;
    });
    contrast?.addEventListener("change", () => {
      const next = { ...readSettings(), highContrast: contrast.checked };
      if (saveSettings(next)) showToast("Your preferences have been saved.");
      else contrast.checked = readSettings().highContrast;
    });
    sound?.addEventListener("change", () => {
      const next = { ...readSettings(), quizSound: sound.checked };
      if (saveSettings(next)) showToast("Your preferences have been saved.");
      else sound.checked = readSettings().quizSound;
    });
    const themeOptions = document.querySelector("#theme-options");
    themeOptions?.addEventListener("click", (event) => {
      const radio = event.target.closest(".theme-option[role='radio']");
      if (!radio) return;
      const next = { ...readSettings(), theme: radio.dataset.theme };
      if (saveSettings(next)) {
        updateAppearanceControls(next);
        showToast(`${radio.textContent.trim()} theme saved.`);
      }
    });
    themeOptions?.addEventListener("keydown", (event) => {
      const radio = event.target.closest(".theme-option[role='radio']");
      if (!radio || !["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const radios = [...themeOptions.querySelectorAll(".theme-option[role='radio']")];
      const current = radios.indexOf(radio);
      const nextIndex = event.key === "Home" ? 0
        : event.key === "End" ? radios.length - 1
          : (current + (["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1) + radios.length) % radios.length;
      radios[nextIndex].focus();
      radios[nextIndex].click();
    });
    document.querySelector("#theme-mode-setting")?.addEventListener("change", (event) => {
      const next = { ...readSettings(), mode: event.currentTarget.value };
      if (saveSettings(next)) {
        updateAppearanceControls(next);
        showToast("Color mode saved.");
      }
    });
    name?.addEventListener("change", () => {
      if (document.documentElement.dataset.experience === "easy" &&
          !window.confirm("Save this greeting on this device?")) {
        name.value = window.CyberGuardData.getProfile().displayName;
        return;
      }
      window.CyberGuardData.setDisplayName(name.value);
      renderGreeting();
      showToast("Your greeting has been saved on this device.");
    });
    document.querySelector("#download-data-button")?.addEventListener("click", () => {
      if (document.documentElement.dataset.experience === "easy" &&
          !window.confirm("Download a copy of your local data to this device?")) return;
      window.CyberGuardData.downloadData(readSettings());
      showToast("Your local data download is ready.");
    });
    const dialog = document.querySelector("#reset-progress-dialog");
    document.querySelector("#reset-progress-button")?.addEventListener("click", () => {
      dialog.showModal();
      document.querySelector("#reset-progress-confirm").focus();
    });
    document.querySelector("#reset-progress-form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = document.querySelector("#reset-progress-confirm");
      const error = document.querySelector("#reset-progress-error");
      if (input.value !== "RESET MY PROGRESS") {
        error.textContent = "Type RESET MY PROGRESS exactly to confirm.";
        input.focus();
        return;
      }
      window.CyberGuardData.resetProgress();
      dialog.close();
      document.querySelector("#reset-progress-form").reset();
      renderGreeting();
      showToast("Your learning progress has been reset.");
    });
    document.querySelector("[data-close-reset]")?.addEventListener("click", () => dialog.close());
  }
  function init() {
    setupSettings();
    renderNavigation();
    setupReadingControls();
    setupWelcomeDialog();
    document.querySelectorAll(".footer").forEach((footer) => {
      if (footer.querySelector(".trust-footer-line")) return;
      const line = document.createElement("p");
      line.className = "trust-footer-line";
      line.innerHTML = `Questions about safety? <a href="is-this-site-safe.html">Is this site safe?</a>`;
      footer.prepend(line);
    });
    document.querySelector("#print-checklist-button")?.addEventListener("click", () => window.print());
    renderGreeting();
    setupNotifications();
    setupSearch();
    setupDropdownDismissal();
    setupThemeToggle();
    document.querySelector(".mobile-toggle")?.addEventListener("click", () => {
      const sidebar = document.querySelector("[data-sidebar]");
      const open = sidebar.classList.toggle("is-open");
      document.querySelector(".mobile-toggle").setAttribute("aria-expanded", String(open));
    });
    document.querySelector("[data-sidebar]")?.addEventListener("click", (event) => {
      const button = event.target.closest(".nav-toggle");
      if (!button) return;
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      document.querySelector("#training-submenu").classList.toggle("hidden", expanded);
    });
    const mobileToggle = document.querySelector(".mobile-toggle");
    if (document.documentElement.dataset.experience === "easy" && mobileToggle) {
      mobileToggle.textContent = "Navigation";
      mobileToggle.setAttribute("aria-label", "Open navigation menu");
    }
    window.addEventListener("cyberguard:settings", () => {
      renderNavigation();
      const notification = document.querySelector("#notification-button");
      if (notification) notification.textContent = document.documentElement.dataset.experience === "easy" ? "Notifications" : "🔔";
      updateThemeToggle();
      if (document.documentElement.dataset.experience === "easy" && mobileToggle) mobileToggle.textContent = "Navigation";
      else if (mobileToggle) mobileToggle.textContent = "☰";
    });
  }
  window.CyberGuard = { readSettings, saveSettings, showToast, isEasyReading: () => document.documentElement.dataset.experience === "easy" };
  document.addEventListener("DOMContentLoaded", init);
})();

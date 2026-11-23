// All learning data belongs to one local profile and stays in this browser.
(function () {
  "use strict";
  const PROFILE_KEY = "tracer-local-profile-v1";
  const MODULES = ["phishing", "privacy", "passwords", "hardening"];
  const LESSON_COUNTS = { phishing: 5, privacy: 4, passwords: 4, hardening: 4 };
  const LESSONS_PER_MODULE = 4;

  function emptyProfile() {
    return {
      displayName: "",
      completedLessons: {},
      bestQuizScore: 0,
      phishingLabBestScore: 0,
      activity: []
    };
  }
  function getProfile() {
    try {
      const saved = JSON.parse(localStorage.getItem(PROFILE_KEY) || "null");
      if (!saved || typeof saved !== "object" || Array.isArray(saved)) return emptyProfile();
      const empty = emptyProfile();
      return {
        ...empty,
        ...saved,
        displayName: typeof saved.displayName === "string" ? saved.displayName : "",
        completedLessons: saved.completedLessons && typeof saved.completedLessons === "object" ? saved.completedLessons : {},
        activity: Array.isArray(saved.activity) ? saved.activity.filter((event) => event && typeof event.type === "string") : []
      };
    } catch (error) {
      console.warn("Could not read local progress; using an empty profile.", error);
      return emptyProfile();
    }
  }
  function saveProfile(profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent("cyberguard:data"));
    return profile;
  }
  function getCompletedLessons() {
    const saved = getProfile().completedLessons;
    return Object.fromEntries(MODULES.map((module) => [
      module, Array.isArray(saved[module])
        ? Array.from(new Set(saved[module].filter((id) => typeof id === "string"))).slice(0, LESSON_COUNTS[module])
        : []
    ]));
  }
  function getProgress() {
    const completed = getCompletedLessons();
    return Object.fromEntries(MODULES.map((module) => [
      module, Math.round(Math.min(LESSON_COUNTS[module], completed[module].length) / LESSON_COUNTS[module] * 100)
    ]));
  }
  function localDateKey(date) {
    const value = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(value.getTime())) return "";
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
  }
  function getActivity() { return getProfile().activity; }
  function recordActivity(type) {
    if (typeof type !== "string" || !type) throw new Error("Cannot save empty activity.");
    const profile = getProfile();
    const now = new Date();
    profile.activity.unshift({ type, at: now.toISOString(), dateKey: localDateKey(now) });
    profile.activity = profile.activity.slice(0, 100);
    saveProfile(profile);
  }
  function completeLesson(module, lessonId, title) {
    if (!MODULES.includes(module) || typeof lessonId !== "string" || !lessonId) {
      throw new Error("Cannot save an invalid training lesson.");
    }
    const profile = getProfile();
    const completed = getCompletedLessons();
    if (completed[module].includes(lessonId)) return getProgress();
    completed[module].push(lessonId);
    profile.completedLessons = completed;
    const now = new Date();
    profile.activity.unshift({ type: `Lesson completed: ${title}`, at: now.toISOString(), dateKey: localDateKey(now) });
    profile.activity = profile.activity.slice(0, 100);
    saveProfile(profile);
    return getProgress();
  }
  function scoreValue(value) {
    const score = Number(value);
    return Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : 0;
  }
  function getBestScore() { return scoreValue(getProfile().bestQuizScore); }
  function saveBestScore(score) {
    const profile = getProfile();
    profile.bestQuizScore = Math.max(getBestScore(), scoreValue(score));
    saveProfile(profile);
    return profile.bestQuizScore;
  }
  function getPhishingLabBestScore() { return scoreValue(getProfile().phishingLabBestScore); }
  function savePhishingLabBestScore(score) {
    const value = Number(score);
    if (!Number.isFinite(value)) throw new Error("Cannot save an invalid Phishing Lab score.");
    const profile = getProfile();
    profile.phishingLabBestScore = Math.max(getPhishingLabBestScore(), scoreValue(value));
    const now = new Date();
    profile.activity.unshift({ type: `Phishing Lab completed: ${scoreValue(value)}%`, at: now.toISOString(), dateKey: localDateKey(now) });
    profile.activity = profile.activity.slice(0, 100);
    saveProfile(profile);
    return profile.phishingLabBestScore;
  }
  function setDisplayName(value) {
    const profile = getProfile();
    profile.displayName = typeof value === "string" ? value.trim().slice(0, 40) : "";
    saveProfile(profile);
    return profile.displayName;
  }
  function getBadges(progress = getProgress(), bestScore = getBestScore()) {
    const activity = getActivity();
    const badges = [];
    if (activity.some((event) => event.type.startsWith("Lesson completed:"))) badges.push("First Lesson");
    if (activity.some((event) => event.type.startsWith("Training scenario completed:"))) badges.push("Scenario Explorer");
    if (activity.some((event) => event.type.startsWith("Phishing Lab completed:"))) badges.push("Phishing Lab Analyst");
    Object.entries(progress).forEach(([module, value]) => {
      if (Number(value) === 100) badges.push(`${module[0].toUpperCase()}${module.slice(1)} Complete`);
    });
    if (activity.some((event) => event.type === "Quiz attempt")) badges.push("First Quiz");
    if (bestScore === 100) badges.push("Perfect Score");
    if (Object.values(progress).every((value) => Number(value) === 100)) badges.push("Training Complete");
    return badges;
  }
  function getStreak() {
    const dateKeys = new Set(getActivity()
      .filter((event) => event.type.startsWith("Lesson completed:") ||
        event.type.startsWith("Training scenario completed:") ||
        event.type.startsWith("Phishing Lab completed:") || event.type === "Quiz attempt")
      .map((event) => event.dateKey || (event.at ? localDateKey(event.at) : ""))
      .filter(Boolean));
    const day = new Date();
    if (!dateKeys.has(localDateKey(day))) day.setDate(day.getDate() - 1);
    let streak = 0;
    while (dateKeys.has(localDateKey(day))) {
      streak += 1;
      day.setDate(day.getDate() - 1);
    }
    return streak;
  }
  function resetProgress() {
    const profile = getProfile();
    const displayName = profile.displayName;
    saveProfile({ ...emptyProfile(), displayName });
  }
  function downloadData(settings) {
    const payload = {
      format: "tracer-local-data",
      exportedAt: new Date().toISOString(),
      profile: getProfile(),
      settings
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "tracer-my-data.json";
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  window.CyberGuardData = {
    PROFILE_KEY, MODULES, LESSONS_PER_MODULE, getLessonCount: (module) => LESSON_COUNTS[module] || LESSONS_PER_MODULE,
    getProfile, getCompletedLessons,
    getProgress, completeLesson, getBestScore, saveBestScore,
    getPhishingLabBestScore, savePhishingLabBestScore, getActivity,
    recordActivity, getBadges, getStreak, setDisplayName, resetProgress,
    downloadData, localDateKey
  };
})();

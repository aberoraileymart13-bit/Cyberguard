// Lesson reader, randomized knowledge checks, and lesson completion flow.
(function () {
  "use strict";
  const moduleNames = {
    phishing: "Phishing 101", privacy: "Data Privacy Basics",
    passwords: "Password Security", hardening: "Account Hardening"
  };
  const illustrationParts = {
    message: '<rect x="22" y="25" width="116" height="76" rx="8"/><path d="m25 32 55 42 55-42M25 96l38-31m72 31L97 65"/><circle cx="127" cy="27" r="13"/><path d="m123 27 3 3 6-7"/>',
    link: '<path d="M56 77 44 89a20 20 0 0 1-28-28l24-24a20 20 0 0 1 28 0"/><path d="m104 49 12-12a20 20 0 0 1 28 28l-24 24a20 20 0 0 1-28 0"/><path d="m53 83 54-54"/>',
    clock: '<circle cx="80" cy="64" r="48"/><path d="M80 34v32l23 13"/><path d="M80 9v9m55 46h9"/>',
    shield: '<path d="M80 15 126 32v34c0 29-20 47-46 61C54 113 34 95 34 66V32z"/><path d="m57 66 16 16 32-35"/>',
    footprint: '<path d="M51 78c-9 10-17 19-17 29 0 8 7 14 16 14 13 0 24-17 24-29 0-12-13-21-23-14Z"/><path d="M98 54c-8 12-13 22-10 32 2 8 11 12 20 9 12-4 18-22 14-33-4-12-18-18-24-8Z"/><circle cx="41" cy="61" r="6"/><circle cx="53" cy="52" r="6"/><circle cx="68" cy="53" r="5"/><circle cx="96" cy="34" r="6"/><circle cx="109" cy="27" r="6"/><circle cx="123" cy="31" r="5"/>',
    controls: '<path d="M25 38h110M25 64h110M25 90h110"/><circle cx="61" cy="38" r="9"/><circle cx="105" cy="64" r="9"/><circle cx="53" cy="90" r="9"/>',
    share: '<circle cx="43" cy="64" r="14"/><circle cx="116" cy="36" r="14"/><circle cx="116" cy="93" r="14"/><path d="m56 59 47-18M56 70l47 18"/>',
    key: '<circle cx="56" cy="57" r="29"/><circle cx="56" cy="57" r="10"/><path d="m78 77 49 49m-18-18 13-13m-25 1 13-13"/>',
    device: '<rect x="48" y="14" width="64" height="101" rx="9"/><path d="M69 25h22M74 102h12"/><circle cx="80" cy="63" r="17"/><path d="m72 63 6 6 11-13"/>',
    network: '<circle cx="80" cy="62" r="16"/><circle cx="34" cy="31" r="10"/><circle cx="127" cy="31" r="10"/><circle cx="34" cy="103" r="10"/><circle cx="127" cy="103" r="10"/><path d="m67 53-25-16m51 16 25-16M67 71l-25 25m51-25 25 25"/>'
  };
  function shuffle(items) {
    const result = items.slice();
    for (let index = result.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1));
      [result[index], result[target]] = [result[target], result[index]];
    }
    return result;
  }
  function makeLessonUrl(module, index) {
    return `lesson.html?m=${encodeURIComponent(module)}&l=${index + 1}`;
  }
  function showError(message) {
    const error = document.querySelector("#lesson-error");
    error.textContent = message;
    error.hidden = false;
  }

  const params = new URLSearchParams(window.location.search);
  const module = params.get("m");
  const lessonIndex = Number(params.get("l") || 1) - 1;
  const moduleLessons = window.CyberGuardLessons.modules[module];
  if (!moduleNames[module] || !Array.isArray(moduleLessons) || !Number.isInteger(lessonIndex) || !moduleLessons[lessonIndex]) {
    showError("That lesson could not be found. Choose a module from the training overview.");
    document.querySelector("#lesson-title").textContent = "Lesson unavailable";
    document.querySelector("#lesson-title").focus();
    return;
  }
  const lesson = moduleLessons[lessonIndex];
  const completed = window.CyberGuardData.getCompletedLessons();
  const alreadyComplete = completed[module].includes(lesson.id);
  const completedCount = completed[module].length;
  document.title = `${lesson.title} | ${moduleNames[module]}`;
  document.querySelector("#lesson-module").textContent = `${moduleNames[module]} · Lesson ${lessonIndex + 1} of ${moduleLessons.length}`;
  document.querySelector("#lesson-title").textContent = lesson.title;
  document.querySelector("#lesson-meta").textContent = `${lesson.duration} · Progress: ${completedCount} of ${moduleLessons.length} lessons complete`;
  document.querySelector("#lesson-content").hidden = false;
  document.querySelector("#lesson-title").focus();

  const figure = document.querySelector("#lesson-illustration");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 160 128");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<g>${illustrationParts[lesson.illustration] || illustrationParts.shield}</g>`;
  const caption = document.createElement("figcaption");
  caption.textContent = `${lesson.title}: a visual reminder to pause, check, and act safely.`;
  figure.append(svg, caption);
  const paragraphs = document.querySelector("#lesson-paragraphs");
  lesson.paragraphs.forEach((text) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    paragraphs.append(paragraph);
  });
  const lessonParagraphs = [...paragraphs.querySelectorAll("p")];
  const glossary = {
    phishing: "A fake message that tries to trick you into sharing information or opening a harmful link.",
    "one-time code": "A short code used once to prove it is you. Never share it with a caller or message sender.",
    domain: "The main name in a website address, such as example.com.",
    domains: "The main names in website addresses, such as example.com.",
    "multi-factor authentication": "An extra sign-in check, such as an app prompt or security key.",
    "multifactor authentication": "An extra sign-in check, such as an app prompt or security key.",
    mfa: "An extra sign-in check, such as an app prompt or security key.",
    impersonation: "Pretending to be a person or organization you trust.",
    encryption: "A way to scramble information so others cannot easily read it.",
    "digital footprint": "Information about you that is left online.",
    permission: "What an app is allowed to see or use on your device.",
    permissions: "What an app is allowed to see or use on your device.",
    passphrase: "A long password made from a group of words.",
    malware: "Software made to harm a device or steal information.",
    "data breach": "An event where private information is exposed or taken.",
    "identity theft": "When someone uses your personal information while pretending to be you.",
    "qr code": "A square pattern a phone camera can scan to open information or a link.",
    credentials: "The details you use to sign in, such as a username and password.",
    macro: "An automatic action that a document can run.",
    macros: "Automatic actions that a document can run.",
    "recovery code": "A backup code that can help you get back into an account.",
    "recovery codes": "Backup codes that can help you get back into an account."
  };
  const glossaryPattern = new RegExp(`\\b(${Object.keys(glossary).sort((a, b) => b.length - a.length).join("|")})\\b`, "gi");
  lessonParagraphs.forEach((paragraph) => {
    const text = paragraph.textContent;
    const fragment = document.createDocumentFragment();
    let cursor = 0;
    for (const match of text.matchAll(glossaryPattern)) {
      fragment.append(document.createTextNode(text.slice(cursor, match.index)));
      const term = document.createElement("abbr");
      const definition = glossary[match[0].toLowerCase()];
      term.className = "glossary-term";
      term.tabIndex = 0;
      term.title = definition;
      term.setAttribute("aria-label", `${match[0]}: ${definition}`);
      term.textContent = match[0];
      fragment.append(term);
      cursor = match.index + match[0].length;
    }
    fragment.append(document.createTextNode(text.slice(cursor)));
    paragraph.replaceChildren(fragment);
  });
  const readingArticle = document.querySelector(".lesson-reading");
  const easyControls = document.createElement("div");
  easyControls.className = "easy-lesson-controls";
  easyControls.hidden = true;
  easyControls.innerHTML = `<span class="easy-idea-count" aria-live="polite"></span>
    <button class="button button-secondary" type="button" data-easy-back>Back</button>
    <button class="button" type="button" data-easy-next>Next</button>`;
  readingArticle.append(easyControls);
  let easyIdeaIndex = 0;
  let easyReviewMode = false;
  const scenarioSection = document.querySelector("#scenario-section");
  const knowledgeSection = document.querySelector("#knowledge-heading").closest("section");
  function updateEasyLesson() {
    const easy = window.CyberGuard?.isEasyReading() || false;
    readingArticle.classList.toggle("easy-lesson-reading", easy);
    easyControls.hidden = !easy;
    if (!easy) {
      lessonParagraphs.forEach((paragraph) => { paragraph.hidden = false; });
      knowledgeSection.hidden = false;
      scenarioSection.hidden = !lesson.scenarioId;
      return;
    }
    lessonParagraphs.forEach((paragraph, index) => {
      paragraph.hidden = easyReviewMode || index !== easyIdeaIndex;
    });
    readingArticle.querySelector(".easy-idea-count").textContent = easyReviewMode
      ? "Practice and knowledge check"
      : `Idea ${easyIdeaIndex + 1} of ${lessonParagraphs.length}`;
    knowledgeSection.hidden = !easyReviewMode;
    scenarioSection.hidden = !easyReviewMode || !lesson.scenarioId;
    const back = easyControls.querySelector("[data-easy-back]");
    const next = easyControls.querySelector("[data-easy-next]");
    back.disabled = easyReviewMode ? false : easyIdeaIndex === 0;
    back.textContent = easyReviewMode ? "Back to lesson" : "Back";
    next.hidden = easyReviewMode;
    next.textContent = easyIdeaIndex === lessonParagraphs.length - 1 ? "Go to practice" : "Next";
  }
  easyControls.querySelector("[data-easy-back]").addEventListener("click", () => {
    if (easyReviewMode) {
      easyReviewMode = false;
      easyIdeaIndex = lessonParagraphs.length - 1;
    } else if (easyIdeaIndex > 0) easyIdeaIndex -= 1;
    updateEasyLesson();
    easyControls.querySelector("[data-easy-next]").focus();
  });
  easyControls.querySelector("[data-easy-next]").addEventListener("click", () => {
    if (easyIdeaIndex < lessonParagraphs.length - 1) easyIdeaIndex += 1;
    else easyReviewMode = true;
    updateEasyLesson();
    (easyReviewMode ? document.querySelector("#quiz-start") : easyControls.querySelector("[data-easy-back]")).focus();
  });
  document.addEventListener("DOMContentLoaded", updateEasyLesson);
  window.addEventListener("cyberguard:settings", updateEasyLesson);
  const readAloud = document.querySelector("#read-aloud-button");
  const canReadAloud = typeof window.speechSynthesis?.speak === "function" &&
    typeof window.SpeechSynthesisUtterance === "function";
  if (canReadAloud) {
    readAloud.hidden = false;
    readAloud.addEventListener("click", () => {
      const visibleIdeas = lessonParagraphs.filter((paragraph) => !paragraph.hidden);
      const ideasToRead = visibleIdeas.length ? visibleIdeas : lessonParagraphs;
      const spokenText = [lesson.title, ...ideasToRead.map((paragraph) => paragraph.textContent)]
        .join(". ");
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(spokenText));
    });
  }

  const quizStart = document.querySelector("#quiz-start");
  const quiz = document.querySelector("#lesson-quiz");
  const questionContent = document.querySelector("#question-content");
  const questionFeedback = document.querySelector("#question-feedback");
  const completionFeedback = document.querySelector("#completion-feedback");
  let questions = [];
  let questionIndex = 0;
  const mastered = new Set();
  function prepareQuestions() {
    questions = shuffle(lesson.questions).map((question) => {
      const choices = shuffle(question.choices.map((label, index) => ({ label, correct: index === question.answer })));
      return { ...question, choices, answer: choices.findIndex((choice) => choice.correct) };
    });
  }
  function renderQuestion() {
    questionContent.replaceChildren();
    questionFeedback.textContent = "";
    if (questionIndex >= questions.length) {
      const done = document.createElement("h3");
      done.textContent = "Knowledge check complete";
      done.tabIndex = -1;
      const message = document.createElement("p");
      message.textContent = alreadyComplete
        ? "You answered every question correctly. This lesson is already complete."
        : "You answered every question correctly. You can now mark this lesson complete.";
      const completeButton = document.createElement("button");
      completeButton.type = "button";
      completeButton.className = "button";
      completeButton.textContent = alreadyComplete ? "Lesson already complete" : "Mark lesson complete";
      completeButton.disabled = alreadyComplete;
      completeButton.addEventListener("click", () => {
        if (window.CyberGuard?.isEasyReading() && !window.confirm("Mark this lesson complete and save your progress on this device?")) return;
        window.CyberGuardData.completeLesson(module, lesson.id, lesson.title);
        const latest = window.CyberGuardData.getCompletedLessons();
        document.querySelector("#lesson-meta").textContent = `${lesson.duration} · Progress: ${latest[module].length} of ${moduleLessons.length} lessons complete`;
        completionFeedback.textContent = `Lesson complete. ${moduleNames[module]} progress is ${window.CyberGuardData.getProgress()[module]}%. Your progress and activity are saved in this browser.`;
        completionFeedback.focus();
        completeButton.textContent = "Lesson complete";
        completeButton.disabled = true;
        if (window.CyberGuard) window.CyberGuard.showToast("Lesson completed. Progress and badges updated.");
      });
      questionContent.append(done, message, completeButton);
      done.focus();
      return;
    }
    const question = questions[questionIndex];
    document.querySelector("#question-count").textContent = `Question ${questionIndex + 1} of ${questions.length}`;
    const fieldset = document.createElement("fieldset");
    fieldset.className = "lesson-question";
    const legend = document.createElement("legend");
    legend.textContent = question.prompt;
    fieldset.append(legend);
    const choices = document.createElement("div");
    choices.className = "lesson-choices";
    question.choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "button button-secondary lesson-choice";
      button.textContent = choice.label;
      button.addEventListener("click", () => {
        if (mastered.has(questionIndex)) return;
        if (index === question.answer) {
          mastered.add(questionIndex);
          choices.querySelectorAll("button").forEach((item) => { item.classList.remove("quiz-choice-wrong"); });
          button.classList.add("quiz-choice-correct");
          choices.querySelectorAll("button").forEach((item) => { item.disabled = true; });
          questionFeedback.textContent = `Correct. ${question.explanation}`;
          const next = document.createElement("button");
          next.type = "button";
          next.className = "button section";
          next.textContent = questionIndex + 1 === questions.length ? "Finish knowledge check" : "Next question";
          next.addEventListener("click", () => { questionIndex += 1; renderQuestion(); });
          questionContent.append(next);
          next.focus();
        } else {
          button.classList.add("quiz-choice-wrong");
          questionFeedback.textContent = `Not quite. ${question.explanation} Choose another answer to continue.`;
          button.focus();
        }
      });
      choices.append(button);
    });
    fieldset.append(choices);
    questionContent.append(fieldset);
    legend.tabIndex = -1;
    legend.focus();
  }
  quizStart.addEventListener("click", () => {
    prepareQuestions();
    questionIndex = 0;
    mastered.clear();
    quizStart.hidden = true;
    quiz.hidden = false;
    renderQuestion();
  });

  if (lesson.scenarioId) {
    const scenario = window.CyberGuardLessons.scenarios[lesson.scenarioId];
    if (!scenario) throw new Error(`Scenario "${lesson.scenarioId}" is missing from lesson data.`);
    const section = document.querySelector("#scenario-section");
    section.hidden = false;
    document.querySelector("#scenario-intro").textContent = scenario.intro;
    const startButton = document.querySelector("#scenario-start");
    const scenarioPanel = document.querySelector("#scenario-panel");
    function startScenario() {
      scenarioPanel.hidden = false;
      startButton.hidden = true;
      window.CyberGuardScenario.start(scenarioPanel, scenario);
    }
    startButton.addEventListener("click", startScenario);
    scenarioPanel.addEventListener("cyberguard:scenario-choice", (event) => {
      if (!event.detail || !event.detail.choice) return;
      if (!window.CyberGuard?.isEasyReading()) window.CyberGuardData.recordActivity(`Scenario choice: ${event.detail.scenario}`);
      if (!lesson.scenarioId) return;
      if (event.detail.node && scenario.nodes[event.detail.node].choices.some((choice) =>
        choice.label === event.detail.choice && !choice.next
      )) {
        if (!window.CyberGuard?.isEasyReading()) window.CyberGuardData.recordActivity(`Training scenario completed: ${event.detail.scenario}`);
      }
    });
    if (params.get("scenario") === lesson.scenarioId) {
      startScenario();
    }
  }

  document.querySelector("#previous-lesson").href = lessonIndex > 0
    ? makeLessonUrl(module, lessonIndex - 1) : "training.html";
  document.querySelector("#previous-lesson").textContent = lessonIndex > 0 ? "Previous lesson" : "All modules";
  document.querySelector("#next-lesson").href = lessonIndex + 1 < moduleLessons.length
    ? makeLessonUrl(module, lessonIndex + 1) : "training.html";
  document.querySelector("#next-lesson").textContent = lessonIndex + 1 < moduleLessons.length ? "Next lesson" : "Back to training";
})();

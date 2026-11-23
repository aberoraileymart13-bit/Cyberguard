(function () {
  "use strict";
  const emails = [
    {
      sender: "Cedar & Finch Access Desk", address: "access@cedarfinch.example", date: "Today, 9:14 AM",
      subject: "Action needed: confirm your sign-in",
      paragraphs: [
        ["We noticed a sign-in attempt from a new device. Your access will be paused at noon unless you confirm your account."],
        ["Please ", { flag: "Review sign-in", id: "lookalike-link", destination: "https://accounts.cedarf1nch-login.example/verify", redFlag: true }, " and confirm your details."]
      ],
      phishing: true, lesson: { module: "phishing", number: 2, title: "Check links and attachments" }
    },
    {
      sender: "People Operations", address: "people@harborlight.example", date: "Today, 8:42 AM",
      subject: "Please review the updated team schedule",
      paragraphs: [
        ["Hello team, the on-call schedule for next month is ready. Please add any planned leave by Friday so we can coordinate coverage."],
        ["The schedule is in the usual staff workspace. You can also ", { flag: "view the team calendar", id: "legitimate-calendar", destination: "https://workspace.harborlight.example/calendar", redFlag: false }, "."]
      ],
      phishing: false, lesson: { module: "phishing", number: 1, title: "Spot the signals" }
    },
    {
      sender: "Records Office", address: "records@marblegate-archive.example", date: "Today, 7:56 AM",
      subject: "Final notice: storage access expires today",
      paragraphs: [
        ["Your shared archive has reached its limit. You must act before 5:00 PM today or all stored records will be permanently removed."],
        [{ flag: "before 5:00 PM today", id: "urgent-deadline", redFlag: true }, " Use the ", { flag: "Restore access", id: "urgent-link", destination: "https://marblegate-archive-help.example/session", redFlag: true }, " page to keep your files."]
      ],
      phishing: true, lesson: { module: "phishing", number: 3, title: "Resist urgency and impersonation" }
    },
    {
      sender: "Mira, Finance", address: "mira@harborlight.example", date: "Yesterday, 4:18 PM",
      subject: "Quarterly expense notes",
      paragraphs: [
        ["Hi, I added a short note to the expense guide about receipts for local travel. No action is needed today."],
        ["The guide is available in our normal finance folder: ", { flag: "open the expense guide", id: "legitimate-guide", destination: "https://files.harborlight.example/finance/expense-guide", redFlag: false }, ". Let me know if you spot anything out of date."]
      ],
      phishing: false, lesson: { module: "phishing", number: 1, title: "Spot the signals" }
    },
    {
      sender: "Billing Team", address: "billing@ridgeway-supplies.example", date: "Today, 10:03 AM",
      subject: "Invoice 80417 is overdue",
      paragraphs: [
        ["Our records show an unpaid invoice for $1,840.00. Please settle it today to avoid a late fee. We could not match this charge to a purchase order."],
        ["Attached: ", { flag: "Invoice_80417.pdf", id: "unexpected-invoice", redFlag: true }, ". To review the balance, use ", { flag: "View invoice", id: "invoice-link", destination: "https://ridgeway-payments.example/invoice/80417", redFlag: true }, "."]
      ],
      phishing: true, lesson: { module: "phishing", number: 2, title: "Check links and attachments" }
    },
    {
      sender: "Device Security", address: "alerts@cedarfinch-support.example", date: "Today, 10:11 AM",
      subject: "Repeated sign-in prompts detected",
      paragraphs: [
        ["We have received 28 sign-in approval requests for your account in the last few minutes. If this was you, approve the next prompt so we can stop the alerts."],
        [{ flag: "28 sign-in approval requests", id: "mfa-fatigue", redFlag: true }, " If you are busy, ", { flag: "approve the next prompt", id: "mfa-approve", destination: "https://identity-cedarfinch.example/approve", redFlag: true }, " and we will close the case."]
      ],
      phishing: true, lesson: { module: "passwords", number: 3, title: "Add multifactor authentication" }
    },
    {
      sender: "Facilities", address: "facilities@harborlight.example", date: "Yesterday, 2:30 PM",
      subject: "Water shutoff on Thursday morning",
      paragraphs: [
        ["Facilities will test the building water system from 8:00 to 8:30 AM on Thursday. Please fill bottles ahead of time if you will be in the office."],
        ["The notice is also posted on the lobby board. Questions? Reply to this address or contact the front desk using the number in the staff directory."]
      ],
      phishing: false, lesson: { module: "phishing", number: 1, title: "Spot the signals" }
    },
    {
      sender: "Shared Documents", address: "share@cedarfinch-docs.example", date: "Today, 11:06 AM",
      subject: "A document was shared with you",
      paragraphs: [
        ["A colleague has shared a confidential review packet. Scan the code below to view it on your phone; access closes in one hour."],
        [{ flag: "Scan the code to view the packet", id: "qr-instruction", redFlag: true }, " — ", { flag: "Open shared packet", id: "qr-link", destination: "https://cedarfinch-review.example/qr/open", redFlag: true }, "."]
      ],
      qr: true, phishing: true, lesson: { module: "phishing", number: 2, title: "Check links and attachments" }
    }
  ];
  const stage = document.querySelector("#email-stage");
  const feedback = document.querySelector("#lab-feedback");
  const results = document.querySelector("#lab-results");
  const progress = document.querySelector("#email-progress");
  const destinationStatus = document.querySelector("#destination-status");
  let index = 0;
  let hoveredLink = null;
  let focusedLink = null;
  const answers = [];
  const candidates = [];
  document.querySelector("#best-score").textContent = `${window.CyberGuardData.getPhishingLabBestScore()}%`;

  function lessonHref(lesson) {
    return `lesson.html?m=${encodeURIComponent(lesson.module)}&l=${lesson.number}`;
  }

  function makeFlagControl(segment) {
    const element = segment.destination ? document.createElement("a") : document.createElement("button");
    if (element.tagName === "A") {
      element.href = "#";
      element.setAttribute("role", "button");
      element.dataset.destination = segment.destination;
      element.setAttribute("aria-describedby", "destination-status");
    } else {
      element.type = "button";
    }
    element.className = segment.destination ? "mail-link mail-flag" : "mail-flag";
    element.textContent = segment.flag;
    element.dataset.flagId = segment.id;
    element.dataset.redFlag = String(segment.redFlag);
    element.setAttribute("aria-pressed", "false");
    element.addEventListener("click", (event) => {
      event.preventDefault();
      if (element.disabled || element.getAttribute("aria-disabled") === "true") return;
      const flagged = element.getAttribute("aria-pressed") !== "true";
      element.setAttribute("aria-pressed", String(flagged));
      const verb = flagged ? "Flagged" : "Unflagged";
      feedback.textContent = `${verb}: ${segment.flag}.`;
    });
    element.addEventListener("keydown", (event) => {
      if (element.tagName === "A" && event.key === " ") {
        event.preventDefault();
        element.click();
      }
    });
    if (segment.redFlag !== undefined) candidates.push({ emailIndex: index, segment });
    return element;
  }

  function renderEmail(email) {
    const article = document.createElement("article");
    article.className = "mail-message";
    article.setAttribute("aria-labelledby", "message-subject");
    const heading = document.createElement("h3");
    heading.id = "message-subject";
    heading.tabIndex = -1;
    heading.textContent = email.subject;
    const metadata = document.createElement("dl");
    metadata.className = "mail-metadata";
    [["From", `${email.sender} <${email.address}>`], ["Received", email.date], ["Subject", email.subject]].forEach(([term, value]) => {
      const dt = document.createElement("dt"); dt.textContent = term;
      const dd = document.createElement("dd"); dd.textContent = value;
      metadata.append(dt, dd);
    });
    const body = document.createElement("div");
    body.className = "mail-body";
    email.paragraphs.forEach((paragraph) => {
      const p = document.createElement("p");
      paragraph.forEach((segment) => {
        p.append(typeof segment === "string" ? document.createTextNode(segment) : makeFlagControl(segment));
      });
      body.append(p);
    });
    if (email.qr) {
      const qr = document.createElement("div");
      qr.className = "simulated-qr";
      qr.setAttribute("role", "img");
      qr.setAttribute("aria-label", "Illustration of a QR code; it is decorative and does not contain a scannable destination.");
      qr.textContent = "QR";
      body.append(qr);
    }
    const actions = document.createElement("fieldset");
    actions.className = "mail-actions";
    const legend = document.createElement("legend");
    legend.textContent = "What would you do with this message?";
    actions.append(legend);
    ["Report", "Delete", "Looks safe"].forEach((choice) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "button button-secondary";
      button.textContent = choice;
      button.addEventListener("click", () => submitChoice(choice, email, article));
      actions.append(button);
    });
    article.append(heading, metadata, body, actions);
    stage.replaceChildren(article);
    heading.focus();
  }

  function setDestination(element) {
    if (element && element.dataset.destination) {
      destinationStatus.textContent = `True destination: ${element.dataset.destination}. This simulated link will not open.`;
    } else {
      destinationStatus.textContent = "Link destination preview: focus or hover over a message link.";
    }
  }

  function updateDestinationPreview() {
    setDestination(hoveredLink || focusedLink);
  }

  function submitChoice(choice, email, article) {
    if (answers[index]) return;
    const marked = Array.from(article.querySelectorAll("[data-flag-id][aria-pressed='true']"));
    answers[index] = {
      choice,
      flagged: marked.map((element) => element.dataset.flagId)
    };
    article.querySelectorAll(".mail-flag").forEach((element) => {
      if (element.tagName === "BUTTON") element.disabled = true;
      else element.setAttribute("aria-disabled", "true");
    });
    article.querySelectorAll(".mail-actions button").forEach((button) => { button.disabled = true; });
    const expected = email.phishing ? "Report" : "Looks safe";
    const identified = marked.filter((element) => element.dataset.redFlag === "true").length;
    const expectedCount = article.querySelectorAll('[data-red-flag="true"]').length;
    const choiceFeedback = document.createElement("p");
    choiceFeedback.className = "mail-result";
    choiceFeedback.textContent = `${choice === expected ? "Good call." : `The recommended action was ${expected}.`} You flagged ${identified} of ${expectedCount} suspicious detail${expectedCount === 1 ? "" : "s"}.`;
    const lesson = document.createElement("a");
    lesson.href = lessonHref(email.lesson);
    lesson.textContent = `Review lesson: ${email.lesson.title}`;
    lesson.className = "mail-lesson-link";
    const next = document.createElement("button");
    next.type = "button";
    next.className = "button";
    next.textContent = index === emails.length - 1 ? "View results" : "Next email";
    next.addEventListener("click", () => {
      index += 1;
      if (index < emails.length) renderCurrent();
      else showResults();
    });
    article.append(choiceFeedback, lesson, next);
    feedback.textContent = `Email ${index + 1}: ${choice === expected ? "recommended action selected" : `recommended action: ${expected}`}.`;
    next.focus();
  }

  function renderCurrent() {
    progress.textContent = `Email ${index + 1} of ${emails.length}`;
    feedback.textContent = "";
    hoveredLink = null;
    focusedLink = null;
    setDestination(null);
    renderEmail(emails[index]);
  }

  function showResults() {
    const missed = [];
    const falseFlags = [];
    let correctChoices = 0;
    let correctFlags = 0;
    emails.forEach((email, emailIndex) => {
      const expectedChoice = email.phishing ? "Report" : "Looks safe";
      if (answers[emailIndex].choice === expectedChoice) correctChoices += 1;
    });
    candidates.forEach(({ emailIndex, segment }) => {
      const wasFlagged = answers[emailIndex].flagged.includes(segment.id);
      if (wasFlagged === segment.redFlag) correctFlags += 1;
      if (segment.redFlag && !wasFlagged) missed.push({ email: emails[emailIndex], segment });
      if (!segment.redFlag && wasFlagged) falseFlags.push({ email: emails[emailIndex], segment });
    });
    const score = Math.round((correctChoices + correctFlags) / (emails.length + candidates.length) * 100);
    let best = score;
    let persistenceError = "";
    const saveResult = !window.CyberGuard.isEasyReading() ||
      window.confirm("Save this Phishing Lab score and activity on this device?");
    if (saveResult) {
      try {
        best = window.CyberGuardData.savePhishingLabBestScore(score);
      } catch (error) {
        persistenceError = ` Your score could not be saved: ${error.message}`;
        console.error("Could not save Phishing Lab results.", error);
      }
    } else {
      persistenceError = " Your result was not saved.";
    }
    document.querySelector("#best-score").textContent = `${best}%`;
    progress.textContent = "All 8 emails reviewed";
    stage.replaceChildren();
    feedback.textContent = `Lab complete. Score: ${score}%.`;
    results.hidden = false;
    const heading = document.createElement("h2"); heading.id = "results-heading"; heading.textContent = "Your results";
    const scoreSummary = document.createElement("p");
    scoreSummary.className = "lab-score";
    scoreSummary.textContent = `Score: ${score}% · Recommended actions: ${correctChoices} of ${emails.length} · Flag decisions: ${correctFlags} of ${candidates.length}.`;
    const bestSummary = document.createElement("p");
    bestSummary.textContent = saveResult
      ? `Personal best: ${best}%. ${persistenceError ? "Your result could not be fully saved; the badge may not appear in your profile." : "You earned the Phishing Lab Analyst badge."}${persistenceError}`
      : `Personal best remains ${window.CyberGuardData.getPhishingLabBestScore()}%. Your result was not saved.`;
    const breakdown = document.createElement("div");
    breakdown.className = "lab-breakdown";
    const missedHeading = document.createElement("h3"); missedHeading.textContent = "Red flags you missed";
    const missedList = document.createElement("ul");
    if (missed.length) {
      missed.forEach(({ email, segment }) => {
        const item = document.createElement("li");
        item.append(document.createTextNode(`${email.subject}: ${segment.flag}. `));
        const lesson = document.createElement("a"); lesson.href = lessonHref(email.lesson); lesson.textContent = `Review ${email.lesson.title}`;
        item.append(lesson); missedList.append(item);
      });
    } else {
      const item = document.createElement("li"); item.textContent = "You spotted every suspicious detail."; missedList.append(item);
    }
    breakdown.append(missedHeading, missedList);
    if (falseFlags.length) {
      const falseHeading = document.createElement("h3"); falseHeading.textContent = "Details you flagged in legitimate messages";
      const falseList = document.createElement("ul");
      falseFlags.forEach(({ email, segment }) => {
        const item = document.createElement("li"); item.textContent = `${email.subject}: ${segment.flag}`;
        falseList.append(item);
      });
      breakdown.append(falseHeading, falseList);
    }
    results.replaceChildren(heading, scoreSummary, bestSummary, breakdown);
    results.setAttribute("tabindex", "-1");
    results.focus();
    results.scrollIntoView({ block: "nearest" });
  }

  const inbox = document.querySelector("#email-stage");
  inbox.addEventListener("pointerover", (event) => {
    hoveredLink = event.target.closest("[data-destination]");
    updateDestinationPreview();
  });
  inbox.addEventListener("pointerout", (event) => {
    if (event.target.closest("[data-destination]") && !event.relatedTarget?.closest?.("[data-destination]")) {
      hoveredLink = null;
      updateDestinationPreview();
    }
  });
  inbox.addEventListener("focusin", (event) => {
    focusedLink = event.target.closest("[data-destination]");
    updateDestinationPreview();
  });
  inbox.addEventListener("focusout", (event) => {
    if (event.target.closest("[data-destination]") && !event.relatedTarget?.closest?.("[data-destination]")) {
      focusedLink = null;
      updateDestinationPreview();
    }
  });
  renderCurrent();
})();

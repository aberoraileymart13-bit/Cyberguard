// One-question-at-a-time quiz with local best-score tracking and optional audio feedback.
(function () {
  "use strict";
  const questionBank = [
    { topic: "Scam detection", prompt: "An email claims your account will close in 10 minutes and asks you to sign in through a link. What is safest?", choices: ["Use the link before it expires", "Visit the service using its saved app or typed address", "Reply with your account details"], answer: 1, explanation: "Urgency and a sign-in link are common phishing signals. Open the service independently." },
    { topic: "Scam detection", prompt: "A caller says they are from IT and asks you to read out a one-time login code. What should you do?", choices: ["Share it if they know your name", "Decline and contact IT through a trusted channel", "Send it by text instead"], answer: 1, explanation: "One-time codes are for you only. Support staff should not ask you to disclose them." },
    { topic: "Scam detection", prompt: "A marketplace buyer sends a payment screenshot but the money is not in your account. What should you do?", choices: ["Ship after checking the screenshot", "Verify payment in your account before shipping", "Pay a small release fee"], answer: 1, explanation: "Screenshots can be forged. Verify the transaction directly with the payment provider." },
    { topic: "Passwords", prompt: "Which password approach is strongest for a unique account?", choices: ["Reuse a familiar password", "Use a long, unique password stored in a password manager", "Add the current year to your name"], answer: 1, explanation: "Length and uniqueness reduce the impact of reused or guessed credentials." },
    { topic: "Passwords", prompt: "What is the safest way to use multi-factor authentication?", choices: ["Approve every prompt immediately", "Use an authenticator or security key and deny unexpected prompts", "Share backup codes with a coworker"], answer: 1, explanation: "Unexpected prompts can indicate an attempted login. Never approve one you did not initiate." },
    { topic: "Passwords", prompt: "You receive an unexpected password-reset email. What is a good next step?", choices: ["Click the email link", "Go directly to the service and check your account", "Forward it to friends"], answer: 1, explanation: "Use a trusted app or address rather than an unexpected email link." },
    { topic: "Online privacy", prompt: "A free app requests access to your contacts and location, although it is a flashlight. What should you do?", choices: ["Grant all access", "Deny permissions that are not needed", "Share your contacts but not location"], answer: 1, explanation: "Grant only permissions needed for the app's functionality, and review them periodically." },
    { topic: "Online privacy", prompt: "Which detail is safest to share publicly on a social profile?", choices: ["Your home address", "Your live travel schedule", "A general interest or hobby"], answer: 2, explanation: "Personal schedules and location details can create privacy and physical safety risks." },
    { topic: "Online privacy", prompt: "You need to use public Wi-Fi for sensitive work. Which action helps protect your account?", choices: ["Use a trusted VPN and HTTPS; avoid sensitive work on unknown networks", "Disable device updates", "Turn off your account's MFA"], answer: 0, explanation: "A trusted connection and HTTPS help protect traffic, but avoid sensitive actions on networks you do not trust." },
    { topic: "Scam detection", prompt: "A website address differs from the real company by one extra character. What is the safest choice?", choices: ["Continue if the logo looks familiar", "Stop and type the official address yourself", "Enter only your email first"], answer: 1, explanation: "Look-alike domains are used to impersonate real services. Navigate using a known-good address." },
    { topic: "Device security", prompt: "Your phone offers an operating-system security update. What is a good practice?", choices: ["Install updates from the device's official settings", "Ignore all updates", "Install an update file sent by an unknown caller"], answer: 0, explanation: "Install updates through the device maker's built-in updater and keep software supported." },
    { topic: "Scam detection", prompt: "A delivery text asks for a small fee through an unfamiliar link. What should you do?", choices: ["Pay quickly to avoid a return", "Check delivery status using the carrier's official app or site", "Reply with your card number"], answer: 1, explanation: "Unexpected delivery messages may be phishing. Verify through a trusted channel." },
    { topic: "Online privacy", prompt: "A social app asks to make your profile public by default. What should you do?", choices: ["Review privacy settings and share only what you intend", "Use the same password as your email", "Post your recovery codes"], answer: 0, explanation: "Review the audience and privacy settings before sharing personal information." },
    { topic: "Passwords", prompt: "You learn that one of your accounts was involved in a data breach. What should you do first?", choices: ["Change its password and any reused passwords", "Wait until the account is locked", "Post the old password to warn others"], answer: 0, explanation: "Replace exposed credentials with unique passwords and enable MFA." },
    { topic: "Passwords", prompt: "Where should you keep account recovery codes?", choices: ["In a secure place separate from the account", "In a public profile", "In a shared team chat"], answer: 0, explanation: "Recovery codes grant access and should be stored securely and privately." },
    { topic: "Scam detection", prompt: "A manager emails an urgent request to buy gift cards and send the codes. What is safest?", choices: ["Verify the request using a known contact method", "Reply to the email asking for a personal address", "Buy them before checking"], answer: 0, explanation: "Urgency and unusual payment requests are common impersonation tactics. Verify independently." },
    { topic: "Device security", prompt: "You need to step away from a shared computer. What should you do?", choices: ["Lock the screen", "Leave accounts open", "Save passwords in the browser for everyone"], answer: 0, explanation: "Locking the screen helps prevent others from accessing your signed-in accounts." },
    { topic: "Online privacy", prompt: "A website requests your date of birth but does not need it for its service. What is prudent?", choices: ["Provide it automatically", "Avoid sharing unnecessary personal information", "Use your account password as the date"], answer: 1, explanation: "Share only information that is necessary and understand how it will be used." },
    { topic: "Scam detection", prompt: "A QR code on a public poster opens a payment page. What should you check?", choices: ["The destination address and recipient before paying", "Only the page logo", "Whether the page uses urgent language"], answer: 0, explanation: "QR codes can hide destinations; verify the address and recipient before entering data." },
    { topic: "Passwords", prompt: "A browser asks whether to save a password on a public computer. What should you do?", choices: ["Decline and sign out when finished", "Save it for the next visitor", "Use a coworker's account"], answer: 0, explanation: "Do not leave credentials saved on shared devices, and sign out after use." },
    { topic: "Device security", prompt: "You find an unknown USB drive in a parking lot. What should you do?", choices: ["Plug it in to identify the owner", "Give it to the appropriate IT or security team", "Use it to transfer personal files"], answer: 1, explanation: "Unknown removable media can be unsafe. Follow your organization's reporting process." },
    { topic: "Online privacy", prompt: "A photo reveals your home address in the background. What should you consider before posting?", choices: ["Remove or obscure identifying details", "Add your travel dates", "Tag your home location"], answer: 0, explanation: "Photos can reveal location and other personal details beyond their subject." },
    { topic: "Scam detection", prompt: "A support pop-up tells you to call a number and install remote-access software. What is safest?", choices: ["Call the number shown", "Close the pop-up and contact support through its official site", "Share a one-time code"], answer: 1, explanation: "Fake support alerts can seek remote access. Contact support using a trusted route." },
    { topic: "Passwords", prompt: "Why should each account have a unique password?", choices: ["A breach at one site then won't directly expose other accounts", "It makes passwords easier to remember by reusing them", "Websites require the same password"], answer: 0, explanation: "Unique credentials limit credential-stuffing attacks after a service breach." },
    { topic: "Device security", prompt: "You receive an unexpected MFA approval request. What should you do?", choices: ["Deny it and report or investigate through a trusted channel", "Approve it to stop notifications", "Send the request to a friend"], answer: 0, explanation: "An unsolicited MFA request may indicate someone has your password." },
    { topic: "Online privacy", prompt: "A public post includes a boarding pass barcode. What is the safer choice?", choices: ["Keep it public because the name is visible anyway", "Remove it; barcodes can contain personal travel data", "Add your passport number"], answer: 1, explanation: "Barcodes may encode reservation details and should not be shared publicly." },
    { topic: "Scam detection", prompt: "A bank message asks you to confirm a password by email. What is the safest response?", choices: ["Email the password", "Use the bank's official app or phone number to check", "Reply with your security answers"], answer: 1, explanation: "Legitimate services should not ask for your password over email." },
    { topic: "Device security", prompt: "You must use a shared device to access an account. What should you do afterward?", choices: ["Sign out, close the session, and avoid saving credentials", "Leave the browser open", "Disable the account's security alerts"], answer: 0, explanation: "End your session and do not leave credentials or personal data behind." },
    { topic: "Online privacy", prompt: "An online quiz requests your childhood street and first pet. What is a concern?", choices: ["These may be password reset security answers", "They are required to load a quiz", "They make public Wi-Fi faster"], answer: 0, explanation: "Personal trivia can be used to guess account recovery answers." },
    { topic: "Passwords", prompt: "What is a useful way to create a memorable passphrase?", choices: ["Use several unrelated words and keep it unique", "Use a common quote with the current year", "Use your email address"], answer: 0, explanation: "A long, unique passphrase can be easier to remember and harder to guess." }
  ];

  let questions = [];
  let index = 0;
  let score = 0;
  let answered = false;
  const stage = document.querySelector("#quiz-stage");
  function bestScore() {
    return CyberGuardData.getBestScore();
  }
  function shuffle(items) {
    const shuffled = items.slice();
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swap = crypto.getRandomValues(new Uint32Array(1))[0] % (index + 1);
      [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]];
    }
    return shuffled;
  }
  function startAttempt() {
    questions = shuffle(questionBank).slice(0, 10).map((question) => {
      const choices = shuffle(question.choices.map((text, choiceIndex) => ({
        text, correct: choiceIndex === question.answer
      })));
      return { ...question, choices: choices.map((choice) => choice.text), answer: choices.findIndex((choice) => choice.correct) };
    });
    index = 0;
    score = 0;
    renderQuestion();
  }

  function playFeedback(correct) {
    const settings = window.CyberGuard ? window.CyberGuard.readSettings() : { quizSound: true };
    if (!settings.quizSound) return;
    try {
      const audio = new AudioContext();
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.frequency.value = correct ? 660 : 220;
      gain.gain.value = 0.07;
      oscillator.connect(gain);
      gain.connect(audio.destination);
      oscillator.start();
      oscillator.stop(audio.currentTime + 0.11);
      oscillator.onended = () => audio.close();
    } catch (error) {
      console.warn("Audio feedback is unavailable in this browser.", error);
    }
  }

  function renderQuestion() {
    answered = false;
    const question = questions[index];
    const percent = Math.round(index / questions.length * 100);
    stage.innerHTML = `
      <p class="muted">Question ${index + 1} of ${questions.length} · ${question.topic}</p>
      <div class="progress-track" role="progressbar" aria-label="Quiz progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><div class="progress-fill" style="width:${percent}%"></div></div>
      <h2 class="section" tabindex="-1" id="quiz-question-heading">${question.prompt}</h2>
      <div class="grid" id="quiz-choices">${question.choices.map((choice, choiceIndex) =>
        `<button class="button button-secondary quiz-choice" type="button" data-choice="${choiceIndex}">${choice}</button>`).join("")}</div>
      <div id="quiz-feedback" class="section" aria-live="polite"></div>`;
    stage.querySelectorAll(".quiz-choice").forEach((button) => button.addEventListener("click", () => answer(Number(button.dataset.choice))));
    stage.querySelector("#quiz-question-heading").focus();
  }

  function answer(choice) {
    if (answered) return;
    answered = true;
    const question = questions[index];
    const correct = choice === question.answer;
    if (correct) score += 1;
    playFeedback(correct);
    stage.querySelectorAll(".quiz-choice").forEach((button) => {
      button.disabled = true;
      const selected = Number(button.dataset.choice);
      if (selected === question.answer) button.classList.add("quiz-choice-correct");
      else if (selected === choice) button.classList.add("quiz-choice-wrong");
    });
    const feedback = document.querySelector("#quiz-feedback");
    feedback.innerHTML = `<p class="notice ${correct ? "" : "warning"}"><strong>${correct ? "Correct." : "Not quite."}</strong> ${question.explanation}</p><button class="button" id="next-question" type="button">${index + 1 === questions.length ? "See your score" : "Next question"}</button>`;
    document.querySelector("#next-question").addEventListener("click", () => {
      index += 1;
      if (index === questions.length) renderResult();
      else renderQuestion();
    });
  }

  function renderResult() {
    const percent = Math.round(score / questions.length * 100);
    const previousBest = bestScore();
    const newBest = Math.max(percent, previousBest);
    const saveResult = !window.CyberGuard?.isEasyReading() ||
      window.confirm("Save this quiz score and activity on this device?");
    if (saveResult) {
      CyberGuardData.saveBestScore(percent);
      CyberGuardData.recordActivity("Quiz attempt");
    }
    stage.innerHTML = `<div class="card"><span class="tag">Quiz complete</span><h2 class="section">You scored ${score} out of ${questions.length} (${percent}%)</h2><p class="muted">${percent >= 80 ? "Great work—keep using these habits in your daily online activity." : "Review the explanations and try again to strengthen your security habits."}</p>${saveResult ? `<p>Best score: <strong>${newBest}%</strong></p>` : "<p>This result was not saved.</p>"}<button class="button" id="retry-quiz" type="button">Try again</button></div>`;
    document.querySelector("#retry-quiz").addEventListener("click", () => {
      startAttempt();
    });
  }

  if (stage) startAttempt();
})();

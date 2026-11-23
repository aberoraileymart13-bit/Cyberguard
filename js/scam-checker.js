(function () {
  "use strict";
  const questions = [
    { prompt: "Did this call, text, email, or pop-up arrive when you did not expect it?", warning: false },
    { prompt: "Does it rush you, threaten you, or tell you to keep it secret?", warning: true },
    { prompt: "Does it ask for money, gift cards, a fee, or a payment to claim something?", warning: true },
    { prompt: "Does it ask for your password, a one-time code, remote access, or an app install?", warning: true },
    { prompt: "Does a link ask for personal, bank, or sign-in details?", warning: true }
  ];
  const heading = document.querySelector("#checker-question");
  const progress = document.querySelector("#checker-progress");
  const answersBox = document.querySelector("#checker-answers");
  const result = document.querySelector("#checker-result");
  const restart = document.querySelector("#checker-restart");
  let index = 0;
  let warningCount = 0;
  let unexpected = false;

  function renderQuestion() {
    const question = questions[index];
    progress.textContent = `Question ${index + 1} of ${questions.length}`;
    heading.textContent = question.prompt;
    answersBox.replaceChildren();
    result.hidden = true;
    restart.hidden = true;
    ["Yes", "No"].forEach((answer) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "button button-secondary";
      button.textContent = answer;
      button.addEventListener("click", () => {
        if (answer === "Yes" && question.warning) warningCount += 1;
        if (answer === "Yes" && index === 0) unexpected = true;
        index += 1;
        if (index < questions.length) renderQuestion();
        else renderResult();
      });
      answersBox.append(button);
    });
    heading.focus();
  }
  function renderResult() {
    const highRisk = warningCount >= 2 || (warningCount > 0 && unexpected);
    const someRisk = warningCount > 0 || unexpected;
    progress.textContent = "Your answers were checked on this device. Nothing was sent or saved.";
    heading.textContent = highRisk ? "This could be a scam." : someRisk ? "Be careful and check first." : "No clear warning sign was found.";
    answersBox.replaceChildren();
    result.replaceChildren();
    const advice = document.createElement("p");
    advice.textContent = highRisk
      ? "Do not reply, click, pay, install software, or share information. Contact the real person or organization using a number or app you already trust."
      : someRisk
        ? "This guide cannot prove a message is genuine. Take time to check it using an independent, trusted source before you act."
        : "A message can still be deceptive even when these warning signs are missing. If it asks you to act, check with the real person or organization first.";
    const closing = document.createElement("strong");
    closing.textContent = "Stop. Think. Verify.";
    result.append(advice, closing);
    result.hidden = false;
    restart.hidden = false;
    restart.focus();
  }
  restart.addEventListener("click", () => {
    index = 0;
    warningCount = 0;
    unexpected = false;
    renderQuestion();
  });
  renderQuestion();
})();

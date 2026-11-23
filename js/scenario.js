// Reusable, accessible branching-scenario renderer.
(function () {
  "use strict";
  function start(container, scenario) {
    if (!container || !scenario || !scenario.nodes || !scenario.nodes[scenario.start]) {
      throw new Error("The requested training scenario is unavailable.");
    }
    container.replaceChildren();
    const heading = document.createElement("h3");
    heading.textContent = scenario.title;
    heading.tabIndex = -1;
    const intro = document.createElement("p");
    intro.textContent = scenario.intro;
    const content = document.createElement("div");
    content.className = "scenario-step";
    content.setAttribute("aria-live", "polite");
    content.setAttribute("aria-atomic", "true");
    container.append(heading, intro, content);

    function renderNode(nodeId) {
      const node = scenario.nodes[nodeId];
      if (!node) throw new Error(`Scenario branch "${nodeId}" is missing.`);
      content.replaceChildren();
      const prompt = document.createElement("h4");
      prompt.textContent = node.prompt;
      prompt.tabIndex = -1;
      content.append(prompt);
      const choices = document.createElement("div");
      choices.className = "scenario-choices";
      choices.setAttribute("role", "group");
      choices.setAttribute("aria-label", "Choose what to do");
      node.choices.forEach((choice) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "button button-secondary";
        button.textContent = choice.label;
        button.addEventListener("click", () => renderChoice(choice, nodeId));
        choices.append(button);
      });
      content.append(choices);
      prompt.focus();
    }

    function renderChoice(choice, nodeId) {
      content.replaceChildren();
      const result = document.createElement("h4");
      result.textContent = "What happens next";
      result.tabIndex = -1;
      const consequence = document.createElement("p");
      consequence.textContent = choice.consequence;
      const expertHeading = document.createElement("h5");
      expertHeading.textContent = "What an expert would do";
      const expert = document.createElement("p");
      expert.textContent = choice.expert;
      const actions = document.createElement("div");
      actions.className = "scenario-choices";
      if (choice.next) {
        const next = document.createElement("button");
        next.type = "button";
        next.className = "button";
        next.textContent = "Continue scenario";
        next.addEventListener("click", () => renderNode(choice.next));
        actions.append(next);
      } else {
        const restart = document.createElement("button");
        restart.type = "button";
        restart.className = "button button-secondary";
        restart.textContent = "Try another path";
        restart.addEventListener("click", () => renderNode(scenario.start));
        actions.append(restart);
      }
      content.append(result, consequence, expertHeading, expert, actions);
      result.focus();
      container.dispatchEvent(new CustomEvent("cyberguard:scenario-choice", {
        bubbles: true, detail: { scenario: scenario.title, node: nodeId, choice: choice.label }
      }));
    }

    renderNode(scenario.start);
  }
  window.CyberGuardScenario = { start };
})();

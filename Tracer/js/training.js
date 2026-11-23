// Module progress is derived from completed lessons, never from overview clicks.
(function () {
  "use strict";
  const rows = Array.from(document.querySelectorAll("#modules-table tr[data-module]"));
  const modules = window.CyberGuardLessons.modules;
  const progress = window.CyberGuardData.getProgress();
  const completed = window.CyberGuardData.getCompletedLessons();

  function getStatus(value) {
    if (value === 0) return { label: "Not Started", className: "status-not-started", action: "Start", filter: "not-started" };
    if (value === 100) return { label: "Completed", className: "status-completed", action: "Review", filter: "completed" };
    return { label: "In Progress", className: "status-in-progress", action: "Continue", filter: "in-progress" };
  }

  function renderRow(row) {
    const moduleId = row.dataset.module;
    const value = progress[moduleId];
    const status = getStatus(value);
    const track = row.querySelector('[role="progressbar"]');
    track.setAttribute("aria-valuenow", String(value));
    track.querySelector(".progress-fill").style.width = `${value}%`;
    row.querySelector(".progress-label").textContent = `${value}% (${completed[moduleId].length}/${modules[moduleId].length} lessons)`;
    const statusElement = row.querySelector(".status");
    statusElement.textContent = status.label;
    statusElement.className = `status ${status.className}`;
    const nextIndex = value === 100 ? 0 : modules[moduleId].findIndex((lesson) => !completed[moduleId].includes(lesson.id));
    const action = row.querySelector(".module-action");
    action.textContent = status.action;
    action.href = `lesson.html?m=${encodeURIComponent(moduleId)}&l=${Math.max(0, nextIndex) + 1}`;
    row.dataset.status = status.filter;
  }

  function applyFilters() {
    const query = document.querySelector("#module-filter").value.trim().toLowerCase();
    const selectedStatus = document.querySelector("#status-filter").value;
    rows.forEach((row) => {
      const nameMatches = row.querySelector("th").textContent.toLowerCase().includes(query);
      const statusMatches = selectedStatus === "all" || row.dataset.status === selectedStatus;
      row.hidden = !(nameMatches && statusMatches);
    });
  }

  rows.forEach(renderRow);
  document.querySelector("#module-filter").addEventListener("input", applyFilters);
  document.querySelector("#status-filter").addEventListener("change", applyFilters);
  applyFilters();
})();

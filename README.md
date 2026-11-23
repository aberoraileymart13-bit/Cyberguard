# Tracer

Tracer is a no-build website made with plain HTML, CSS, and vanilla JavaScript. Serve the folder locally (for example, run `python -m http.server` from the project directory) and open `http://localhost:8000`.

## Privacy

No accounts, no cookies, no tracking, and nothing leaves your device. Learning progress, quiz scores, badges, streaks, activity, and your optional greeting are stored in one local profile in `localStorage`. Display preferences are also stored locally. Password Tools work in the current page and never save or transmit the text you enter; use made-up passwords only.

Our hosting provider may keep standard server logs, such as IP addresses. This site itself sets no cookies and runs no analytics.

Use **Settings → Download my data** to save a JSON copy of your local profile and preferences. Use **Settings → Reset my progress** and type `RESET MY PROGRESS` to clear learning data while retaining your optional greeting and display preferences. Clearing the browser's local storage for this site removes all local data.

## Features

- Four learning modules with progress, lessons, knowledge checks, and branching scenarios.
- A security quiz and simulated Phishing Lab with best scores saved locally.
- My Progress with module completion, quiz score, earned badges, learning streak, certificate, and recent activity.
- Five appearance themes with light, dark, and device-default modes, plus a top-bar quick toggle.
- Local display preferences, optional greeting, accessible search, and progress-based notifications.
- Password generator and strength checklist. Inputs remain in memory on the Password Tools page only.
- Optional Easy Reading with a first-visit choice, larger text, simpler navigation, one idea at a time in lessons, and local text-size controls.
- A private yes-or-no scam checker, a site-safety and privacy page, and a large-print printable safety checklist.
- A website-checking lesson, scam guidance for common approaches, and read-aloud on lessons when the browser supports speech.

## Inclusive reading

Easy Reading is an optional view of the same pages. It supports different reading, vision, motor, and attention needs with clear labels, larger text and click targets, more line spacing, reduced motion, simple language, glossary explanations, and focused lesson steps. The first-visit dialog offers age-based suggestions only; a reader must confirm a mode, and can always change it in the header. See [Ethics & References](./ethics.html) for the reasoning.

## How to test

1. Start a local static server with `python -m http.server` in the project directory and open `http://localhost:8000`. No install, build, account, or network connection is required.
2. Open Settings. Set a name and confirm the top bar changes; clear it and confirm the greeting returns to “Welcome”. Switch themes and modes, reload to verify persistence, and confirm Device default follows system appearance. Crimson Noir should force dark mode and disable the mode selector.
3. Open Training and complete one lesson's knowledge check. Confirm progress and activity update on My Progress and the dashboard, then reload to verify they remain.
4. Take the quiz and complete the Phishing Lab. Confirm best scores, badges, activity, and notification reminders reflect the locally saved results.
5. Complete all lessons in every module and confirm the certificate becomes available on My Progress.
6. On Password Tools, verify the privacy notice is visible, generate and copy a password, and try the strength checker with a made-up password. Confirm there is no Save to Vault option.
7. Download my data and inspect the JSON file. Reset progress by typing the exact confirmation phrase; verify progress, scores, badges, streak, and activity clear while the greeting and display preferences remain.
8. Use the site without network access and verify all pages and local features work. In browser DevTools, confirm no cookies are set and learning data is stored under `tracer-local-profile-v1` in localStorage.
9. Check navigation links and the 404 page. In the browser console, confirm there are no uncaught errors while opening Dashboard, Training, a lesson, Quiz, Phishing Lab, Password Tools, My Progress, Settings, Ethics, and the 404 page.
10. Use the first-visit dialog with keyboard only. Confirm Tab stays inside it, Escape closes it, and it does not return on another page. Test both direct mode choices and age suggestions; an age suggestion must not apply until confirmed.
11. Turn Easy Reading on and reload. Confirm it persists, the sidebar has six labelled links, header controls remain visible, text sizes A/A+/A++ apply, toasts remain until dismissed, and settings or saved quiz/lesson changes ask first.
12. At 200% browser zoom, use keyboard only to visit the checker, website lesson, safety page, and checklist. Check that controls are reachable, labels are visible, the checker ends with “Stop. Think. Verify.”, and the checklist prints in large type.

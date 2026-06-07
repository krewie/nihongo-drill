function showLanguage(lang) {
  document
    .querySelectorAll("template.memo-page")
    .forEach(page => page.classList.remove("active"));

  document
    .querySelectorAll(`template.memo-page[lang="${lang}"]`)
    .forEach(page => page.classList.add("active"));

  window.renderActiveTemplates();
}

// Example keyboard shortcuts
document.addEventListener("keydown", event => {
  if (event.key === "j") {
    showLanguage("ja");
  }

  if (event.key === "e") {
    showLanguage("en");
  }

  if (event.key === "b") {
    showBothLanguages();
  }
});

function showBothLanguages() {
  document
    .querySelectorAll("template.memo-page")
    .forEach(page => page.classList.add("active"));

  window.renderActiveTemplates();
}
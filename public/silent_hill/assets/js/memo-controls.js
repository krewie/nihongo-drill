let currentLang = "ja";
let showAllLanguages = true;

let currentPageMode = "slice"; // "all" or "slice"
let currentPageIndex = 0;

function getAllPages() {
  return Array.from(document.querySelectorAll("template.memo-page"));
}

function getAvailableLanguages() {
  return Array.from(
    new Set(getAllPages().map(page => page.getAttribute("lang")))
  );
}

function getPagesForLanguage(lang) {
  return Array.from(
    document.querySelectorAll(`template.memo-page[lang="${lang}"]`)
  );
}

function getRelevantLanguages() {
  if (showAllLanguages) {
    return getAvailableLanguages();
  }

  return [currentLang];
}

function clearActivePages() {
  getAllPages().forEach(page => page.classList.remove("active"));
}

function getMaxPageCount() {
  return Math.max(
    ...getRelevantLanguages().map(lang => getPagesForLanguage(lang).length)
  );
}

function updateActivePages() {
  clearActivePages();

  const languages = getRelevantLanguages();
  const maxPageCount = getMaxPageCount();

  if (maxPageCount === 0) {
    updateControlLabels();
    window.renderActiveTemplates();
    return;
  }

  if (currentPageIndex < 0) {
    currentPageIndex = maxPageCount - 1;
  }

  if (currentPageIndex >= maxPageCount) {
    currentPageIndex = 0;
  }

  for (const lang of languages) {
    const pages = getPagesForLanguage(lang);

    if (currentPageMode === "all") {
      pages.forEach(page => page.classList.add("active"));
    } else {
      if (pages[currentPageIndex]) {
        pages[currentPageIndex].classList.add("active");
      }
    }
  }

  updateControlLabels();
  window.renderActiveTemplates();
}

function setLanguage(lang) {
  currentLang = lang;
  showAllLanguages = false;
  currentPageIndex = 0;
  updateActivePages();
}

function toggleLanguageMode() {
  showAllLanguages = !showAllLanguages;
  currentPageIndex = 0;
  updateActivePages();
}

function togglePageMode() {
  currentPageMode = currentPageMode === "all" ? "slice" : "all";
  currentPageIndex = 0;
  updateActivePages();
}

function nextPage() {
  if (currentPageMode !== "slice") {
    return;
  }

  const maxPageCount = getMaxPageCount();

  if (maxPageCount === 0) {
    return;
  }

  currentPageIndex = (currentPageIndex + 1) % maxPageCount;
  updateActivePages();
}

function previousPage() {
  if (currentPageMode !== "slice") {
    return;
  }

  const maxPageCount = getMaxPageCount();

  if (maxPageCount === 0) {
    return;
  }

  currentPageIndex = (currentPageIndex - 1 + maxPageCount) % maxPageCount;
  updateActivePages();
}

function updateControlLabels() {
  const languageModeButton = document.querySelector(
    '[data-action="toggle-language-mode"]'
  );

  const pageModeButton = document.querySelector(
    '[data-action="toggle-page-mode"]'
  );

  const prevButton = document.querySelector('[data-action="prev"]');
  const nextButton = document.querySelector('[data-action="next"]');

  if (languageModeButton) {
    languageModeButton.textContent = showAllLanguages
      ? "Single Language"
      : "All Languages";
  }

  if (pageModeButton) {
    pageModeButton.textContent =
      currentPageMode === "all" ? "Show One" : "Show All";
  }

  const isSliceMode = currentPageMode === "slice";

  if (prevButton) {
    prevButton.disabled = !isSliceMode;
  }

  if (nextButton) {
    nextButton.disabled = !isSliceMode;
  }
}

document
  .querySelectorAll(".memo-controls button[data-lang]")
  .forEach(button => {
    button.addEventListener("click", () => {
      setLanguage(button.dataset.lang);
    });
  });

document
  .querySelector('[data-action="toggle-language-mode"]')
  .addEventListener("click", toggleLanguageMode);

document
  .querySelector('[data-action="toggle-page-mode"]')
  .addEventListener("click", togglePageMode);

document
  .querySelector('[data-action="prev"]')
  .addEventListener("click", previousPage);

document
  .querySelector('[data-action="next"]')
  .addEventListener("click", nextPage);

updateActivePages();
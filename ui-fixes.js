// ============================================================================
// UI FIXES
// Keeps the existing script.js untouched so the Google Sheets URL is preserved.
// ============================================================================

const uiMobileNav = document.querySelector(".mobile-nav");
const oldUiToggle = document.querySelector(".nav-toggle");
const uiBackToTop = document.querySelector(".back-to-top");

let uiToggle = oldUiToggle;


// ============================================================================
// MENU BUTTON
// Clone the button once to remove the older click handler from script.js.
// This prevents double toggling and keeps the X animation in sync.
// ============================================================================

if (oldUiToggle) {
  uiToggle = oldUiToggle.cloneNode(true);
  oldUiToggle.replaceWith(uiToggle);
}


function uiMenuIsOpen() {
  return uiMobileNav?.classList.contains("open") || false;
}


function uiSetMenuAria() {
  if (!uiToggle) {
    return;
  }

  const isSerbian = document.documentElement.lang === "sr";
  const isOpen = uiMenuIsOpen();

  uiToggle.setAttribute("aria-expanded", String(isOpen));
  uiToggle.setAttribute(
    "aria-label",
    isOpen
      ? (isSerbian ? "Zatvori meni" : "Close menu")
      : (isSerbian ? "Otvori meni" : "Open menu")
  );
}


function uiOpenMenu() {
  if (!uiMobileNav || !uiToggle) {
    return;
  }

  uiMobileNav.classList.add("open");
  document.body.classList.add("menu-open");

  uiSetMenuAria();
}


function uiCloseMenu() {
  if (!uiMobileNav || !uiToggle) {
    return;
  }

  uiMobileNav.classList.remove("open");
  document.body.classList.remove("menu-open");

  uiSetMenuAria();
}


uiToggle?.addEventListener("click", () => {
  if (uiMenuIsOpen()) {
    uiCloseMenu();
  } else {
    uiOpenMenu();
  }
});


// Close the menu before following a section link.
// The old script.js can also receive the click; both end in the same closed state.
uiMobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", uiCloseMenu);
});


window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    uiCloseMenu();
  }
});


// If the browser restores a page from its back-forward cache,
// make sure the page is not left in a locked-scroll state.
window.addEventListener("pageshow", () => {
  uiCloseMenu();
});


// Keep the aria label correct after switching EN / SR.
document.querySelectorAll(".lang-btn").forEach((button) => {
  button.addEventListener("click", () => {
    window.requestAnimationFrame(uiSetMenuAria);
  });
});


// ============================================================================
// BACK TO TOP
// The old #top target is a fixed header, so browsers do not always scroll.
// Use scrollTo directly instead.
// ============================================================================

uiBackToTop?.addEventListener("click", (event) => {
  event.preventDefault();

  uiCloseMenu();

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  });

  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }
});


uiSetMenuAria();

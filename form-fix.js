// ============================================================================
// GOOGLE SHEETS FORM UX FIX
// ============================================================================
//
// script.js remains untouched, including your Google Apps Script /exec URL.
//
// Google Apps Script can take several seconds to finish a redirected no-cors
// request in Safari. This handler uses sendBeacon when available, so the
// browser can queue the POST immediately without leaving the button on
// "Sending..." for a long time.
// ============================================================================

const quickForm = document.querySelector("#training-form");
const quickSubmitButton = quickForm?.querySelector(".form-submit");
const quickFormStatus = document.querySelector("#form-status");


function quickText() {
  const isSerbian = document.documentElement.lang === "sr";

  return isSerbian
    ? {
        setup: "Google Sheets još nije povezan.",
        success: "Prijava je uspešno poslata. Marko će vam se javiti uskoro.",
        error: "Prijava nije mogla da se pošalje. Pokušajte ponovo ili kontaktirajte Marka.",
        bot: "Hvala. Vaša prijava je primljena."
      }
    : {
        setup: "Google Sheets is not connected yet.",
        success: "Application sent successfully. Marko will get back to you soon.",
        error: "The application could not be sent. Please try again or contact Marko.",
        bot: "Thank you. Your application has been received."
      };
}


function quickSetState(state, message = "") {
  if (typeof setFormState === "function") {
    setFormState(state, message);
    return;
  }

  if (!quickSubmitButton || !quickFormStatus) {
    return;
  }

  const loading = state === "loading";

  quickSubmitButton.disabled = loading;
  quickSubmitButton.classList.toggle("is-loading", loading);

  quickFormStatus.textContent = message;
  quickFormStatus.classList.remove("success", "error");

  if (state === "success") {
    quickFormStatus.classList.add("success");
  }

  if (state === "error") {
    quickFormStatus.classList.add("error");
  }
}


async function quickFetchFallback(url, body, copy) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);

  try {
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      body,
      signal: controller.signal
    });

    quickForm.reset();
    quickSetState("success", copy.success);
  } catch (error) {
    console.error("Training application error:", error);
    quickSetState("error", copy.error);
  } finally {
    window.clearTimeout(timeout);
  }
}


quickForm?.addEventListener(
  "submit",
  (event) => {
    // Run before the older submit listener from script.js.
    event.preventDefault();
    event.stopImmediatePropagation();

    const copy = quickText();

    if (!quickForm.checkValidity()) {
      quickForm.reportValidity();
      return;
    }

    if (
      typeof GOOGLE_SHEETS_WEB_APP_URL === "undefined" ||
      !GOOGLE_SHEETS_WEB_APP_URL.startsWith("https://script.google.com/macros/s/")
    ) {
      quickSetState("error", copy.setup);
      return;
    }

    const data = new FormData(quickForm);

    data.append("submittedAtClient", new Date().toISOString());
    data.append("source", window.location.href);
    data.append("language", document.documentElement.lang || "en");

    // Honeypot spam protection.
    if (String(data.get("website") || "").trim()) {
      quickForm.reset();
      quickSetState("success", copy.bot);
      return;
    }

    const params = new URLSearchParams();

    for (const [key, value] of data.entries()) {
      params.append(key, String(value));
    }

    quickSetState("loading", "");

    if ("sendBeacon" in navigator) {
      const body = new Blob(
        [params.toString()],
        { type: "application/x-www-form-urlencoded;charset=UTF-8" }
      );

      const accepted = navigator.sendBeacon(
        GOOGLE_SHEETS_WEB_APP_URL,
        body
      );

      if (accepted) {
        // Browser accepted the request into its delivery queue.
        window.setTimeout(() => {
          quickForm.reset();
          quickSetState("success", copy.success);
        }, 650);

        return;
      }
    }

    // Fallback for browsers that do not support sendBeacon.
    quickFetchFallback(
      GOOGLE_SHEETS_WEB_APP_URL,
      params,
      copy
    );
  },
  true
);


// Never restore the page with the button stuck on "Sending...".
window.addEventListener("pageshow", () => {
  if (quickSubmitButton?.classList.contains("is-loading")) {
    quickSetState("idle", "");
  }
});

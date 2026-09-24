// ============================================================================
// FAST GOOGLE SHEETS SUBMIT + ADULT ATHLETE FORM LOGIC
// ============================================================================
//
// IMPORTANT:
// script.js stays untouched, including the Google Apps Script /exec URL.
//
// 1. Adult athlete (18+) -> parent/guardian name is optional.
// 2. Minor athlete (<18) -> parent/guardian name is required.
// 3. For an adult who leaves that field blank, the athlete's own name is sent
//    as the contact name so the existing Apps Script backend still accepts it.
// 4. Safari no longer waits for Google's redirected no-cors response.
//    sendBeacon queues the POST and the UI confirms it almost immediately.
// ============================================================================

const quickForm = document.querySelector("#training-form");
const quickSubmitButton = quickForm?.querySelector(".form-submit");
const quickFormStatus = document.querySelector("#form-status");

const athleteNameInput = document.querySelector("#athleteName");
const athleteAgeInput = document.querySelector("#athleteAge");
const parentNameInput = document.querySelector("#parentName");
const parentNameLabel = document.querySelector("#parentNameLabel");


function quickCopy() {
  const isSerbian = document.documentElement.lang === "sr";

  return isSerbian
    ? {
        setup: "Google Sheets još nije povezan.",
        success: "Prijava je uspešno poslata. Marko će vam se javiti uskoro.",
        error: "Prijava nije mogla da se pošalje. Pokušajte ponovo ili kontaktirajte Marka.",
        bot: "Hvala. Vaša prijava je primljena.",
        parentLabel: "Ime roditelja / staratelja (obavezno samo za mlađe od 18)"
      }
    : {
        setup: "Google Sheets is not connected yet.",
        success: "Application sent successfully. Marko will get back to you soon.",
        error: "The application could not be sent. Please try again or contact Marko.",
        bot: "Thank you. Your application has been received.",
        parentLabel: "Parent / guardian name (required only if under 18)"
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


function isAdultAthlete() {
  const age = Number(athleteAgeInput?.value || 0);

  return Number.isFinite(age) && age >= 18;
}


function syncParentRequirement() {
  if (!parentNameInput || !parentNameLabel) {
    return;
  }

  const copy = quickCopy();
  const adult = isAdultAthlete();

  parentNameLabel.textContent = copy.parentLabel;
  parentNameInput.required = !adult;
  parentNameInput.setAttribute("aria-required", String(!adult));
}


function showQueuedSuccess(copy) {
  window.setTimeout(() => {
    quickForm.reset();
    syncParentRequirement();
    quickSetState("success", copy.success);
  }, 300);
}


athleteAgeInput?.addEventListener("input", syncParentRequirement);
athleteAgeInput?.addEventListener("change", syncParentRequirement);


// The normal language script runs first. Re-apply our conditional label after it.
document.querySelectorAll(".lang-btn").forEach((button) => {
  button.addEventListener("click", () => {
    window.setTimeout(syncParentRequirement, 0);
  });
});


syncParentRequirement();


quickForm?.addEventListener(
  "submit",
  (event) => {
    // Capture phase: stop the older fetch handler in script.js.
    event.preventDefault();
    event.stopImmediatePropagation();

    syncParentRequirement();

    const copy = quickCopy();

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

    // Existing Apps Script currently expects parentName to contain a value.
    // For an adult athlete, use the athlete's own name when the optional
    // parent/guardian field is left blank.
    if (
      isAdultAthlete() &&
      !String(data.get("parentName") || "").trim()
    ) {
      data.set(
        "parentName",
        String(data.get("athleteName") || "").trim()
      );
    }

    // Honeypot spam protection.
    if (String(data.get("website") || "").trim()) {
      quickForm.reset();
      syncParentRequirement();
      quickSetState("success", copy.bot);
      return;
    }

    const params = new URLSearchParams();

    for (const [key, value] of data.entries()) {
      params.append(key, String(value));
    }

    quickSetState("loading", "");

    // Fast path: Safari/iPhone/Chrome all support sendBeacon.
    if ("sendBeacon" in navigator) {
      const body = new Blob(
        [params.toString()],
        {
          type: "application/x-www-form-urlencoded;charset=UTF-8"
        }
      );

      const queued = navigator.sendBeacon(
        GOOGLE_SHEETS_WEB_APP_URL,
        body
      );

      if (queued) {
        showQueuedSuccess(copy);
        return;
      }
    }

    // Fallback: start the no-cors POST, but do not wait for Google's redirect.
    try {
      fetch(
        GOOGLE_SHEETS_WEB_APP_URL,
        {
          method: "POST",
          mode: "no-cors",
          keepalive: true,
          body: params
        }
      ).catch((error) => {
        console.error("Background training application error:", error);
      });

      showQueuedSuccess(copy);
    } catch (error) {
      console.error("Training application error:", error);
      quickSetState("error", copy.error);
    }
  },
  true
);


// Safari may restore a page from memory. Never leave the button loading.
window.addEventListener("pageshow", () => {
  syncParentRequirement();

  if (quickSubmitButton?.classList.contains("is-loading")) {
    quickSetState("idle", "");
  }
});

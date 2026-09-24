// ============================================================================
// FORM FIX V2
// Adult/minor logic + fast Google Apps Script submission
// ============================================================================

const formV2 = document.querySelector("#training-form");
const submitV2 = formV2?.querySelector(".form-submit");
const statusV2 = document.querySelector("#form-status");

const athleteNameV2 = document.querySelector("#athleteName");
const athleteAgeV2 = document.querySelector("#athleteAge");
const parentNameV2 = document.querySelector("#parentName");
const parentLabelV2 = document.querySelector("#parentNameLabel");


function copyV2() {
  const sr = document.documentElement.lang === "sr";

  return sr
    ? {
        parent:
          "Ime roditelja / staratelja (ako je sportista mlađi od 18 godina)",
        parentMissing:
          "Za sportistu mlađeg od 18 godina unesite ime roditelja ili staratelja.",
        setup:
          "Google Sheets još nije povezan.",
        success:
          "Prijava je uspešno poslata. Marko će vam se javiti uskoro."
      }
    : {
        parent:
          "Parent / Guardian name (if the athlete is under 18)",
        parentMissing:
          "For an athlete under 18, enter the parent or guardian name.",
        setup:
          "Google Sheets is not connected yet.",
        success:
          "Application sent successfully. Marko will get back to you soon."
      };
}


function setStateV2(state, message = "") {
  if (!submitV2 || !statusV2) {
    return;
  }

  const loading = state === "loading";

  submitV2.disabled = loading;
  submitV2.classList.toggle("is-loading", loading);

  statusV2.textContent = message;
  statusV2.classList.remove("success", "error");

  if (state === "success") {
    statusV2.classList.add("success");
  }

  if (state === "error") {
    statusV2.classList.add("error");
  }
}


function ageV2() {
  return Number(athleteAgeV2?.value || 0);
}


function isMinorV2() {
  const value = ageV2();

  return Number.isFinite(value) && value > 0 && value < 18;
}


function syncParentV2() {
  if (!parentNameV2 || !parentLabelV2) {
    return;
  }

  const copy = copyV2();
  const minor = isMinorV2();

  parentLabelV2.textContent = copy.parent;
  parentNameV2.required = minor;
  parentNameV2.setAttribute("aria-required", String(minor));

  if (!minor) {
    parentNameV2.setCustomValidity("");
  }
}


function ensureHiddenTargetV2() {
  let iframe = document.querySelector("#google-sheet-submit-target");

  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = "google-sheet-submit-target";
    iframe.name = "google-sheet-submit-target";
    iframe.hidden = true;
    iframe.setAttribute("aria-hidden", "true");

    document.body.appendChild(iframe);
  }

  return iframe;
}


function postToSheetV2(data) {
  ensureHiddenTargetV2();

  const postForm = document.createElement("form");

  postForm.method = "POST";
  postForm.action = GOOGLE_SHEETS_WEB_APP_URL;
  postForm.target = "google-sheet-submit-target";
  postForm.style.display = "none";

  for (const [key, value] of data.entries()) {
    const input = document.createElement("input");

    input.type = "hidden";
    input.name = key;
    input.value = String(value);

    postForm.appendChild(input);
  }

  document.body.appendChild(postForm);
  postForm.submit();

  window.setTimeout(() => {
    postForm.remove();
  }, 1500);
}


athleteAgeV2?.addEventListener("input", syncParentV2);
athleteAgeV2?.addEventListener("change", syncParentV2);

parentNameV2?.addEventListener("input", () => {
  parentNameV2.setCustomValidity("");
});


document.querySelectorAll(".lang-btn").forEach((button) => {
  button.addEventListener("click", () => {
    window.setTimeout(syncParentV2, 0);
  });
});


syncParentV2();


formV2?.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    syncParentV2();

    const copy = copyV2();
    const minor = isMinorV2();

    if (
      minor &&
      !String(parentNameV2?.value || "").trim()
    ) {
      parentNameV2.setCustomValidity(copy.parentMissing);
      parentNameV2.reportValidity();
      parentNameV2.focus();
      return;
    }

    parentNameV2?.setCustomValidity("");

    if (!formV2.checkValidity()) {
      formV2.reportValidity();
      return;
    }

    if (
      typeof GOOGLE_SHEETS_WEB_APP_URL === "undefined" ||
      !GOOGLE_SHEETS_WEB_APP_URL.startsWith(
        "https://script.google.com/macros/s/"
      )
    ) {
      setStateV2("error", copy.setup);
      return;
    }

    const data = new FormData(formV2);

    if (
      !minor &&
      !String(data.get("parentName") || "").trim()
    ) {
      data.set(
        "parentName",
        String(data.get("athleteName") || "").trim()
      );
    }

    data.append(
      "submittedAtClient",
      new Date().toISOString()
    );

    data.append(
      "source",
      window.location.href
    );

    data.append(
      "language",
      document.documentElement.lang || "en"
    );

    if (String(data.get("website") || "").trim()) {
      formV2.reset();
      syncParentV2();
      setStateV2("success", copy.success);
      return;
    }

    setStateV2("loading", "");

    postToSheetV2(data);

    window.setTimeout(() => {
      formV2.reset();
      syncParentV2();
      setStateV2("success", copy.success);
    }, 350);
  },
  true
);


window.addEventListener("pageshow", () => {
  syncParentV2();

  if (submitV2?.classList.contains("is-loading")) {
    setStateV2("idle", "");
  }
});

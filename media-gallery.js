// ============================================================================
// CAREER TEXT + MEDIA GALLERY / LIGHTBOX
// ============================================================================

(function () {
  // --------------------------------------------------------------------------
  // Career and media translations
  // --------------------------------------------------------------------------
  if (typeof translations !== "undefined") {
    Object.assign(translations.en, {
      careerNCAA: "NCAA DIVISION",
      careerSabacLabel: "DOUBLE TITLE",
      careerInternational: "INTERNATIONAL",
      careerClubSabac: "Water Polo Club Šabac",
      career1:
        "Student-athlete with a strong leadership presence, serving as a defensive anchor through communication, composure and consistency.",
      career2:
        "Won the Serbian Championship and Serbian Cup to complete the double while contributing as a defender.",
      career3:
        "First defender and key contributor to the team's promotion to a higher league.",
      career4:
        "Competed with Serbia's junior national team at international tournaments and youth championships.",
      videoClipsEyebrow: "TRAINING CLIPS",
      videoClipsTitle: "Some of the goals scored for the national team"
    });

    Object.assign(translations.sr, {
      careerNCAA: "NCAA DIVIZIJA",
      careerSabacLabel: "DUPLA KRUNA",
      careerInternational: "MEĐUNARODNO",
      careerClubSabac: "Vaterpolo klub Šabac",
      career1:
        "Student-sportista sa izraženim liderskim prisustvom i ulogom oslonca odbrane, kroz komunikaciju, smirenost i konstantnost.",
      career2:
        "Osvojio prvenstvo Srbije i Kup Srbije, kompletirajući duplu krunu kao bek.",
      career3:
        "Prvi bek i ključni igrač u plasmanu ekipe u viši rang takmičenja.",
      career4:
        "Nastupao za juniorsku reprezentaciju Srbije na međunarodnim turnirima i prvenstvima mlađih kategorija.",
      videoClipsEyebrow: "SNIMCI",
      videoClipsTitle: "Neki od golova postignuti za reprezentaciju"
    });

    if (typeof setActiveLanguage === "function") {
      setActiveLanguage(document.documentElement.lang || "en");
    }
  }

  // --------------------------------------------------------------------------
  // Image lightbox
  // --------------------------------------------------------------------------
  const items = Array.from(document.querySelectorAll(".gallery-item"));
  const lightbox = document.querySelector("#image-lightbox");
  const lightboxImage = lightbox?.querySelector(".lightbox-image");
  const closeButton = lightbox?.querySelector(".lightbox-close");
  const prevButton = lightbox?.querySelector(".lightbox-prev");
  const nextButton = lightbox?.querySelector(".lightbox-next");

  let currentIndex = 0;
  let lastFocusedElement = null;

  if (!lightbox || !lightboxImage || items.length === 0) {
    return;
  }

  items.forEach((item, index) => {
    const image = item.querySelector("img");
    const description = image?.alt || "Gallery image";

    item.setAttribute("aria-label", `Open image: ${description}`);

    item.addEventListener("click", () => {
      openLightbox(index, item);
    });
  });

  function showImage(index) {
    currentIndex = (index + items.length) % items.length;

    const item = items[currentIndex];
    const thumbnail = item.querySelector("img");
    const fullSource = item.dataset.full || thumbnail?.src || "";
    const description = thumbnail?.alt || "";

    lightboxImage.src = fullSource;
    lightboxImage.alt = description;
  }

  function openLightbox(index, trigger) {
    lastFocusedElement = trigger;
    showImage(index);

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");

    closeButton?.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");

    lightboxImage.src = "";
    lastFocusedElement?.focus();
  }

  closeButton?.addEventListener("click", closeLightbox);
  prevButton?.addEventListener("click", () => showImage(currentIndex - 1));
  nextButton?.addEventListener("click", () => showImage(currentIndex + 1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      showImage(currentIndex - 1);
    }

    if (event.key === "ArrowRight") {
      showImage(currentIndex + 1);
    }
  });
})();

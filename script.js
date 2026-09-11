// ============================================================================
// GOOGLE SHEETS CONNECTION
// ============================================================================

// After deploying the Google Apps Script, paste its /exec URL here.
// Example: https://script.google.com/macros/s/AKfycb.../exec
const GOOGLE_SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwfh6o7wg7IcPYpX2-Acrc6UhFNvLkXDji6zni3HlHNIUBHUXxq-72vXLjY2BRObJJ5/exec";


// ============================================================================
// PAGE ELEMENTS
// ============================================================================

const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const form = document.querySelector("#training-form");
const formStatus = document.querySelector("#form-status");
const submitButton = form?.querySelector(".form-submit");
const langButtons = document.querySelectorAll(".lang-btn");

const savedLanguage = localStorage.getItem("markoSiteLang");
const defaultLanguage = savedLanguage || document.documentElement.lang || "en";


// ============================================================================
// TRANSLATIONS
// ============================================================================

const translations = {
  en: {
    brandName: "MARKO ILIC",
    brandTagline: "WATER POLO COACHING",

    navTraining: "Training",
    navAbout: "About",
    navCareer: "Career",
    navMedia: "Media",
    navContact: "Contact",
    navApply: "Apply",

    menuLabel: "Menu",
    mobileMenuEyebrow: "TRAIN • COMPETE • DEVELOP",
    menuReach: "Reach out",
    menuInstagram: "Instagram",

    heroEyebrow: "ELITE DEVELOPMENT • PRIVATE COACHING • YOUTH TRAINING",
    heroTitle: "BUILD THE PLAYER.<br>BUILD THE PERSON.",
    heroLead: "Individual and small-group training focused on technique, decision-making, conditioning and confidence.",
    heroApply: "Apply for training",
    heroMeet: "Meet the coach",
    badgePrivate: "Private work",
    badgeSmallGroup: "Small group",
    badgePrep: "Performance prep",
    scrollLabel: "Scroll",

    announcementEyebrow: "NOW ACCEPTING APPLICATIONS",
    announcementTitle: "Training for future champions",
    announcementText: "Complete the short parent or guardian application below. Just a few steps separate you from noticeable progress.",
    announcementLink: "APPLICATION FORM →",

    programsEyebrow: "TRAINING",
    programsTitle: "Focused development, not generic workouts.",
    programsIntro: "Every session is built around the athlete's current level and goals, with emphasis on technique, decision-making, movement and confidence.",

    program1Title: "Private training",
    program1Text: "1-on-1 work with highly specific technical corrections and a tailored plan.",
    program1Item1: "Passing and shooting mechanics",
    program1Item2: "Leg strength, balance and body position",
    program1Item3: "Position-specific development",

    program2Title: "Small group",
    program2Text: "Competitive repetitions with more decisions, movement and game-like situations.",
    program2Item1: "2 to 6 athletes",
    program2Item2: "Decision-making under pressure",
    program2Item3: "Competitive technical drills",

    program3Title: "Performance prep",
    program3Text: "Targeted work for tryouts, camps, the upcoming season or higher-level competition.",
    program3Item1: "Game-specific conditioning",
    program3Item2: "Confidence and preparation",
    program3Item3: "Individual development plan",

    standardEyebrow: "THE STANDARD",
    standardQuote: "Train with purpose. Compete with confidence.",

    portraitTag: "COACH • ATHLETE • MENTOR",
    aboutEyebrow: "ABOUT MARKO",
    aboutTitle: "Experience in Europe and the United States.",
    aboutLead: "Marko Ilic is a water polo coach and former high-level athlete focused on technical growth, discipline and long-term player development.",
    aboutText1: "As head coach of 18U teams at Channel Islands United, he worked on fundamentals, tactics and a culture of accountability and growth.",
    aboutText2: "He has coached at camps across Texas and California, and in Serbia he led water polo and swimming programs for young athletes.",
    aboutText3: "His private coaching combines technical detail, physical preparation and confidence-building in a demanding but supportive environment.",
    stat1: "Coaching experience",
    stat2: "Player development",
    stat3: "Individual attention",

    careerEyebrow: "CAREER",
    careerTitle: "Playing experience that informs coaching.",
    careerCountry: "SERBIA",
    careerNational: "NATIONAL",
    careerClubSabac: "Water Polo Club Sabac",
    careerClubZemun: "Water Polo Club Zemun",
    careerJuniorTeam: "Serbian National Junior Team",
    career1: "Player in 2024–2025 and coach since 2025.",
    career2: "Won the national championship and cup double while competing as a defender.",
    career3: "Captained the team and helped lead it to promotion to a higher league.",
    career4: "Participated in international tournaments and youth championships.",

    mediaEyebrow: "MEDIA",
    mediaTitle: "On deck and in the water.",
    mediaIntro: "A selection of playing and coaching moments.",
    videoEyebrow: "VIDEO",
    videoTitle: "Interview after the game",

    applyEyebrow: "APPLICATION",
    applyTitle: "Apply for training.",
    applyText: "Use the form to register yourself or your child for training. For questions, suggestions or consultations, you can contact me at any time using the details below.",
    privacyTitle: "The hardest part is starting",
    privacyQuote: "“He who dares can; he who knows no fear moves forward.”",
    privacyAuthor: "Serbian Field Marshal Živojin Mišić",
    quickContact: "Quick contact",

    fieldAthleteName: "Athlete full name *",
    fieldAthleteAge: "Athlete age *",
    fieldParentName: "Parent / guardian name or your name *",
    fieldEmail: "Contact email *",
    fieldPhone: "Phone *",
    fieldTrainingType: "Preferred training *",
    fieldExperience: "Sports experience *",
    fieldMessage: "Goals or questions",

    optSelect: "Select an option",
    optPrivate: "Private 1-on-1",
    optSmallGroup: "Small group",
    optPerformance: "Performance prep",
    optNotSure: "Not sure yet",

    optExperienceSelect: "Select experience level",
    optBeginner: "Beginner / new to the world of sport",
    optOneTwo: "1–2 years",
    optThreeFour: "3–4 years",
    optFivePlus: "5+ years",

    messagePlaceholder: "Tell us what the athlete would like to improve, preferred days and times, or anything else relevant to training.",
    consentText: "I am the athlete, parent or guardian, or I am authorized to submit this application, and I agree to be contacted about training. *",
    submitLabel: "Submit application",
    submitLoading: "Sending...",

    contactEyebrow: "CONTACT",
    contactTitle: "Let's make something big.",
    contactEmailLabel: "Email",
    contactInstagramLabel: "Instagram",
    contactLinkedInLabel: "LinkedIn",
    contactName: "Marko Ilic",

    footerText: "© <span id=\"year\"></span> Marko Ilic. Design: Drakula.",
    backToTop: "BACK TO TOP ↑",

    statusNeedsSetup: "Google Sheets is not connected yet. Add your Apps Script Web App URL in script.js.",
    statusSuccess: "Application sent. Marko can follow up using the contact information you provided.",
    statusBot: "Thank you. Your application has been received.",
    statusError: "The application could not be sent. Please try again or contact Marko by email.",

    openMenuAria: "Open menu",
    closeMenuAria: "Close menu"
  },

  sr: {
    brandName: "MARKO ILIĆ",
    brandTagline: "VATERPOLO TRENINZI",

    navTraining: "Treninzi",
    navAbout: "O Marku",
    navCareer: "Karijera",
    navMedia: "Mediji",
    navContact: "Kontakt",
    navApply: "Prijava",

    menuLabel: "Meni",
    mobileMenuEyebrow: "TRENIRAJ • TAKMIČI SE • NAPREDUJ",
    menuReach: "Kontakt",
    menuInstagram: "Instagram",

    heroEyebrow: "ELITNI RAZVOJ • PRIVATNI TRENING • RAD SA MLAĐIMA",
    heroTitle: "IZGRADI IGRAČA.<br>IZGRADI ČOVEKA.",
    heroLead: "Individualni i grupni treninzi usmereni na tehniku, donošenje odluka, kondiciju i samopouzdanje.",
    heroApply: "Prijavi se za trening",
    heroMeet: "Upoznaj trenera",
    badgePrivate: "Individualni rad",
    badgeSmallGroup: "Mala grupa",
    badgePrep: "Priprema performansi",
    scrollLabel: "Skrol",

    announcementEyebrow: "PRIJAVE SU OTVORENE",
    announcementTitle: "Treninzi za buduće šampione",
    announcementText: "Popunite kratku prijavu za roditelja ili staratelja ispod. Par koraka vas deli od osetnog napretka.",
    announcementLink: "FORMA ZA PRIJAVU →",

    programsEyebrow: "TRENINZI",
    programsTitle: "Fokusiran razvoj, ne generični treninzi.",
    programsIntro: "Svaki trening se pravi prema trenutnom nivou i ciljevima sportiste, sa fokusom na tehniku, donošenje odluka, kretanje i samopouzdanje.",

    program1Title: "Privatni trening",
    program1Text: "1 na 1 rad sa veoma preciznim tehničkim korekcijama i planom prilagođenim igraču.",
    program1Item1: "Mehanika dodavanja i šuta",
    program1Item2: "Noge, balans i položaj tela",
    program1Item3: "Razvoj po poziciji",

    program2Title: "Mala grupa",
    program2Text: "Takmičarski ponavljaji sa više odluka, kretanja i situacija nalik utakmici.",
    program2Item1: "2 do 6 sportista",
    program2Item2: "Donošenje odluka pod pritiskom",
    program2Item3: "Takmičarske tehničke vežbe",

    program3Title: "Priprema za performans",
    program3Text: "Ciljani rad za probe, kampove, novu sezonu ili viši nivo takmičenja.",
    program3Item1: "Kondicija specifična za igru",
    program3Item2: "Samopouzdanje i priprema",
    program3Item3: "Individualni plan razvoja",

    standardEyebrow: "STANDARD",
    standardQuote: "Treniraj sa svrhom. Takmiči se sa samopouzdanjem.",

    portraitTag: "TRENER • SPORTISTA • MENTOR",
    aboutEyebrow: "O MARKU",
    aboutTitle: "Iskustvo u Evropi i Sjedinjenim Državama.",
    aboutLead: "Marko Ilić je vaterpolo trener i bivši vrhunski sportista fokusiran na tehnički razvoj, disciplinu i dugoročni napredak igrača.",
    aboutText1: "Kao glavni trener 18U timova u Channel Islands United radio je na osnovama, taktici i kulturi odgovornosti i napretka.",
    aboutText2: "Radio je na kampovima širom Teksasa i Kalifornije, a u Srbiji je vodio vaterpolo i plivačke programe za mlade sportiste.",
    aboutText3: "Njegov privatni rad spaja tehničku preciznost, fizičku pripremu i izgradnju samopouzdanja u zahtevnom, ali podsticajnom okruženju.",
    stat1: "Trenersko iskustvo",
    stat2: "Razvoj igrača",
    stat3: "Individualna pažnja",

    careerEyebrow: "KARIJERA",
    careerTitle: "Igračko iskustvo koje oblikuje trenerski pristup.",
    careerCountry: "SRBIJA",
    careerNational: "REPREZENTACIJA",
    careerClubSabac: "Vaterpolo klub Šabac",
    careerClubZemun: "Vaterpolo klub Zemun",
    careerJuniorTeam: "Juniorska reprezentacija Srbije",
    career1: "Igrač u sezoni 2024–2025 i trener od 2025.",
    career2: "Osvojio državno prvenstvo i kup, odnosno duplu krunu, kao igrač na poziciji beka.",
    career3: "Bio kapiten tima i pomogao ekipi da uđe u viši rang takmičenja.",
    career4: "Učešće na međunarodnim turnirima i juniorskim prvenstvima.",

    mediaEyebrow: "MEDIJI",
    mediaTitle: "Na ivici bazena i u vodi.",
    mediaIntro: "Izbor igračkih i trenerskih trenutaka.",
    videoEyebrow: "VIDEO",
    videoTitle: "Intervju posle utakmice",

    applyEyebrow: "PRIJAVA",
    applyTitle: "Prijavi se za trening.",
    applyText: "Koristite formu da prijavite sebe ili dete za trening. Za svako pitanje, sugestiju ili konsultacije možete me kontaktirati u svakom momentu i preko dole navedenih kontakata.",
    privacyTitle: "Najteže je početi",
    privacyQuote: "„Ko sme taj može, ko ne zna za strah taj ide napred.”",
    privacyAuthor: "Srpski vojvoda Živojin Mišić",
    quickContact: "Brz kontakt",

    fieldAthleteName: "Ime i prezime sportiste *",
    fieldAthleteAge: "Godine sportiste *",
    fieldParentName: "Ime roditelja / staratelja ili vaše ime *",
    fieldEmail: "Email za kontakt *",
    fieldPhone: "Telefon *",
    fieldTrainingType: "Željeni tip treninga *",
    fieldExperience: "Sportsko iskustvo *",
    fieldMessage: "Ciljevi ili pitanja",

    optSelect: "Izaberite opciju",
    optPrivate: "Privatni 1 na 1",
    optSmallGroup: "Mala grupa",
    optPerformance: "Priprema performansi",
    optNotSure: "Još nisam siguran",

    optExperienceSelect: "Izaberite nivo iskustva",
    optBeginner: "Početnik / novo dete u svetu sporta",
    optOneTwo: "1–2 godine",
    optThreeFour: "3–4 godine",
    optFivePlus: "5+ godina",

    messagePlaceholder: "Napišite šta sportista želi da unapredi, koji termini odgovaraju ili bilo šta drugo važno za trening.",
    consentText: "Ja sam sportista, roditelj ili staratelj, ili sam ovlašćen da pošaljem ovu prijavu, i saglasan sam da budem kontaktiran u vezi sa treninzima. *",
    submitLabel: "Pošalji prijavu",
    submitLoading: "Slanje...",

    contactEyebrow: "KONTAKT",
    contactTitle: "Hajde da napravimo nešto veliko.",
    contactEmailLabel: "Email",
    contactInstagramLabel: "Instagram",
    contactLinkedInLabel: "LinkedIn",
    contactName: "Marko Ilić",

    footerText: "© <span id=\"year\"></span> Marko Ilić. Dizajn: Drakula.",
    backToTop: "NA VRH ↑",

    statusNeedsSetup: "Google Sheets još nije povezan. Dodajte Apps Script Web App URL u script.js.",
    statusSuccess: "Prijava je poslata. Marko sada može da se javi preko kontakta koji ste ostavili.",
    statusBot: "Hvala. Vaša prijava je primljena.",
    statusError: "Prijava nije mogla da se pošalje. Pokušajte ponovo ili kontaktirajte Marka mejlom.",

    openMenuAria: "Otvori meni",
    closeMenuAria: "Zatvori meni"
  }
};


// ============================================================================
// HEADER AND FULL-SCREEN MENU
// ============================================================================

function updateHeader() {
  header?.classList.toggle("scrolled", window.scrollY > 40);
}

function getCurrentDictionary() {
  const currentLanguage = document.documentElement.lang || "en";
  return translations[currentLanguage] || translations.en;
}

function updateMenuAriaLabel() {
  const isOpen = navToggle?.getAttribute("aria-expanded") === "true";
  const dictionary = getCurrentDictionary();

  navToggle?.setAttribute(
    "aria-label",
    isOpen ? dictionary.closeMenuAria : dictionary.openMenuAria
  );
}

function openMenu() {
  navToggle?.setAttribute("aria-expanded", "true");
  mobileNav?.classList.add("open");
  document.body.classList.add("menu-open");

  updateMenuAriaLabel();
}

function closeMenu() {
  navToggle?.setAttribute("aria-expanded", "false");
  mobileNav?.classList.remove("open");
  document.body.classList.remove("menu-open");

  updateMenuAriaLabel();
}


// ============================================================================
// LANGUAGE SWITCHER
// ============================================================================

function setActiveLanguage(language) {
  const dictionary = translations[language] || translations.en;

  document.documentElement.lang = language;
  localStorage.setItem("markoSiteLang", language);

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;

    if (dictionary[key]) {
      element.textContent = dictionary[key];
    }
  });

  document.querySelectorAll("[data-i18n-html]").forEach((element) => {
    const key = element.dataset.i18nHtml;

    if (dictionary[key]) {
      element.innerHTML = dictionary[key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;

    if (dictionary[key]) {
      element.setAttribute("placeholder", dictionary[key]);
    }
  });

  langButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === language);
  });

  if (language === "sr") {
    document.title = "Marko Ilić | Vaterpolo trener";

    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        "Marko Ilić privatni i grupni treninzi, razvoj sportista i prijava za treninge."
      );
  } else {
    document.title = "Marko Ilic | Water Polo Coach";

    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        "Marko Ilic coaching, athlete development, private lessons and training applications."
      );
  }

  updateMenuAriaLabel();

  const year = document.querySelector("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }
}


// ============================================================================
// FORM STATUS
// ============================================================================

function setFormState(state, message = "") {
  if (!submitButton || !formStatus) {
    return;
  }

  const loading = state === "loading";

  submitButton.disabled = loading;
  submitButton.classList.toggle("is-loading", loading);

  formStatus.textContent = message;
  formStatus.classList.remove("success", "error");

  if (state === "success") {
    formStatus.classList.add("success");
  }

  if (state === "error") {
    formStatus.classList.add("error");
  }
}


// ============================================================================
// EVENT LISTENERS
// ============================================================================

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";

  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
});

mobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveLanguage(button.dataset.lang || "en");
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

setActiveLanguage(defaultLanguage);


// ============================================================================
// APPLICATION FORM -> GOOGLE SHEETS
// ============================================================================

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const currentLanguage = document.documentElement.lang || "en";
  const dictionary = translations[currentLanguage] || translations.en;

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (!GOOGLE_SHEETS_WEB_APP_URL.startsWith("https://script.google.com/macros/s/")) {
    setFormState("error", dictionary.statusNeedsSetup);
    return;
  }

  const data = new FormData(form);

  data.append("submittedAtClient", new Date().toISOString());
  data.append("source", window.location.href);
  data.append("language", currentLanguage);

  // Honeypot protection: bots often fill hidden inputs.
  if (String(data.get("website") || "").trim()) {
    form.reset();
    setFormState("success", dictionary.statusBot);
    return;
  }

  const params = new URLSearchParams();

  for (const [key, value] of data.entries()) {
    params.append(key, String(value));
  }

  try {
    setFormState("loading", "");

    await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      body: params
    });

    form.reset();
    setFormState("success", dictionary.statusSuccess);
  } catch (error) {
    console.error("Training application error:", error);
    setFormState("error", dictionary.statusError);
  }
});

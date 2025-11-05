(function () {
  const THEME_KEY = "cats-fanpage-theme";

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
  }

  function getStoredTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (_) { return null; }
  }

  function resolveInitialTheme() {
    const stored = getStoredTheme();
    if (stored === "light" || stored === "dark") return stored;
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }

  // Initialize theme
  setTheme(resolveInitialTheme());

  // Theme toggle
  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      setTheme(next);
      toggle.textContent = next === "dark" ? "🌙" : "☀️";
    });
  }

  // Random fact
  const facts = [
    "Cats sleep for 12–16 hours a day.",
    "A group of cats is called a clowder.",
    "Each cat's nose print is unique.",
    "Cats can rotate their ears 180 degrees.",
    "The oldest known pet cat existed 9,500 years ago.",
    "Cats have a third eyelid called the nictitating membrane.",
    "A cat can jump up to six times its length.",
    "Purring may help cats heal by promoting bone regeneration.",
    "Cats walk like camels and giraffes: both right legs move first.",
  ];

  function randomFact() {
    return facts[Math.floor(Math.random() * facts.length)];
  }

  const factBtn = document.getElementById("fact-button");
  const factOut = document.getElementById("fact-output");
  if (factBtn && factOut) {
    factBtn.addEventListener("click", () => {
      factOut.textContent = randomFact();
    });
  }

  // Lightbox
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");
  function openLightbox(src) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.removeAttribute("src");
    document.body.style.overflow = "";
  }
  document.addEventListener("click", (e) => {
    const link = e.target.closest && e.target.closest(".lightbox-link");
    if (link) {
      e.preventDefault();
      const full = link.getAttribute("data-full");
      if (full) openLightbox(full);
    }
  });
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  // Contact form validation (client-side only)
  const form = document.getElementById("contact-form");
  if (form) {
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");
    const errName = document.getElementById("error-name");
    const errEmail = document.getElementById("error-email");
    const errMessage = document.getElementById("error-message");
    const status = document.getElementById("form-status");

    function validateEmail(v) {
      return /.+@.+\..+/.test(v);
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      if (!name.value.trim()) { ok = false; errName.textContent = "Please enter your name."; } else { errName.textContent = ""; }
      if (!email.value.trim() || !validateEmail(email.value)) { ok = false; errEmail.textContent = "Enter a valid email address."; } else { errEmail.textContent = ""; }
      if (!message.value.trim()) { ok = false; errMessage.textContent = "Please write a message."; } else { errMessage.textContent = ""; }
      if (!ok) { status.textContent = ""; return; }
      status.textContent = "Thanks! Your (demo) message is ready to be sent.";
      form.reset();
    });
  }
})();



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

  // Compliments dataset (bootstrapped, can be extended by user)
  const STORAGE_KEY = 'cmp-pro-data';
  function loadCompliments() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return null;
  }
  function saveCompliments(obj) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); } catch (_) {}
  }

  let compliments = loadCompliments() || {
    study: [
      "Your curiosity is your superpower—keep asking great questions.",
      "You turn complex topics into clear, simple ideas. That's real skill.",
      "Your consistency beats motivation every time—well done showing up.",
      "Your notes could teach a class. Seriously impressive.",
      "You learn fast and explain even faster. A+ teammate energy.",
    ],
    career: [
      "You bring clarity to chaos—people trust you for a reason.",
      "Your work ethic quietly sets the standard for the room.",
      "You don't just solve problems—you make better ones impossible.",
      "Your presence makes teams braver and projects smoother.",
      "Your judgment is solid—I'd ship anything with you on it.",
    ],
    wellness: [
      "You are allowed to take up space—rest is part of progress.",
      "Your kindness has a ripple effect you'll never fully see.",
      "Small steps count. You're building something beautiful.",
      "Your calm is contagious. People feel safe around you.",
      "You're doing great—be as gentle to yourself as you are to others.",
    ],
  };

  function getAllCompliments() {
    return Object.values(compliments).flat();
  }

  function getRandomCompliment(category) {
    const pool = category && category !== "all" ? (compliments[category] || getAllCompliments()) : getAllCompliments();
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // Category chips (support dynamic categories)
  const chipGroup = document.querySelector('.chip-group');
  let currentCategory = 'all';
  function setActiveChip(category) {
    const buttons = chipGroup ? Array.from(chipGroup.querySelectorAll('.chip')) : [];
    buttons.forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
    const match = chipGroup && chipGroup.querySelector(`.chip[data-category="${category}"]`);
    if (match) { match.classList.add('is-active'); match.setAttribute('aria-selected', 'true'); }
    currentCategory = category;
  }
  function ensureChip(category) {
    if (!chipGroup) return;
    if (category === 'all') return;
    if (chipGroup.querySelector(`.chip[data-category="${category}"]`)) return;
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', 'false');
    btn.setAttribute('data-category', category);
    btn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    chipGroup.appendChild(btn);
  }
  function renderChipsFromData() {
    Object.keys(compliments).forEach(cat => ensureChip(cat));
  }
  renderChipsFromData();
  if (chipGroup) {
    chipGroup.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      const cat = chip.getAttribute('data-category') || 'all';
      setActiveChip(cat);
    });
  }

  // Compliment generation + copy
  const out = document.getElementById('compliment-output');
  const btn = document.getElementById('compliment-button');
  const copyBtn = document.getElementById('copy-button');
  const copyStatus = document.getElementById('copy-status');

  function showCompliment() {
    const text = getRandomCompliment(currentCategory);
    if (!out) return;
    out.textContent = text + ' ' + pickEmoji(currentCategory);
    out.classList.remove('animate');
    // reflow
    void out.offsetWidth;
    out.classList.add('animate');
  }

  function pickEmoji(category) {
    if (category === 'study') return '📚✨';
    if (category === 'career') return '🚀💼';
    if (category === 'wellness') return '🌿💖';
    return '⭐️';
  }

  if (btn) btn.addEventListener('click', showCompliment);
  if (copyBtn && out) {
    copyBtn.addEventListener('click', async () => {
      const text = out.textContent?.trim();
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        copyStatus.textContent = 'Copied!';
      } catch (_) {
        copyStatus.textContent = 'Press Ctrl+C to copy.';
      }
      setTimeout(() => { copyStatus.textContent = ''; }, 1600);
    });
  }

  // Custom category editor
  const newCat = document.getElementById('new-category');
  const newCompliment = document.getElementById('new-compliment');
  const addBtn = document.getElementById('add-compliment');
  const editorStatus = document.getElementById('editor-status');
  function normalizeCategory(v) {
    return (v || '').trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
  }
  function showEditorStatus(msg) {
    if (!editorStatus) return;
    editorStatus.textContent = msg;
    setTimeout(() => { editorStatus.textContent = ''; }, 1600);
  }
  if (addBtn && newCat && newCompliment) {
    addBtn.addEventListener('click', () => {
      const rawCat = newCat.value;
      const cat = normalizeCategory(rawCat);
      const text = newCompliment.value.trim();
      if (!cat) { showEditorStatus('Enter a category name.'); return; }
      if (!text) { showEditorStatus('Write a compliment to add.'); return; }
      if (!compliments[cat]) compliments[cat] = [];
      compliments[cat].push(text);
      saveCompliments(compliments);
      ensureChip(cat);
      setActiveChip(cat);
      showEditorStatus('Added!');
      newCompliment.value = '';
      showCompliment();
    });
  }

  // Removed lightbox logic for compliment-focused page

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



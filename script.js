document.addEventListener("DOMContentLoaded", async () => {

  // Nasconde il sito finché il loader è attivo
  document.body.classList.add("loading");

  const loader = document.getElementById("loader");
  const calendarContainer = document.getElementById("calendar");
  const searchInput = document.getElementById("search-input");
  const daySelect = document.getElementById("day-select");

  /* =============================
        🌙 TEMA SALVATO
  ============================== */
  const themeToggle = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") document.body.classList.add("dark-mode");
  themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const theme = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", theme);
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  });

  /* =============================
        📥 CARICA ORARIO + CACHE
  ============================== */
  async function loadOrario() {
    let data = null;

    const cached = localStorage.getItem("orarioCache");
    if (cached) {
      try { data = JSON.parse(cached); } catch {}
    }

    try {
      const res = await fetch("orario.json", { cache: "no-store" });
      const fresh = await res.json();

      if (JSON.stringify(fresh) !== JSON.stringify(data))
        localStorage.setItem("orarioCache", JSON.stringify(fresh));

      data = fresh;

    } catch {
      console.warn("Offline → uso cache locale");
    }

    return data;
  }

  /* =============================
        📦 CREA CARD
  ============================== */
  function createCard(item, i) {
    const card = document.createElement("div");
    card.classList.add("card");

    const date = new Date(item.data + "T00:00:00");
    const dayName = date.toLocaleDateString("it-IT", { weekday: "long" });
    const formattedDate = `${dayName} ${date.toLocaleDateString("it-IT")}`;

    card.innerHTML = `
      <div class="date">${formattedDate}</div>
      <div class="lesson">
        <strong>${item.materia}</strong><br>
        ${item.docente}<br>
        ${item.orario}<br>
        ${item.sede}
      </div>
    `;

    calendarContainer.appendChild(card);

    // Animazione card
    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, i * 60);
  }

  /* =============================
        🚀 RENDER + LOADER MINIMO
  ============================== */
  const start = performance.now();

  try {
    const data = await loadOrario();

    data.sort((a, b) => new Date(a.data) - new Date(b.data));
    data.forEach((item, i) => createCard(item, i));

    // loader minimo 1.5 secondi
    const elapsed = performance.now() - start;
    const minLoad = 1500;
    const remaining = Math.max(0, minLoad - elapsed);

    setTimeout(() => {
      loader.style.opacity = "0";
      document.body.classList.remove("loading");
      setTimeout(() => loader.style.display = "none", 500);
    }, remaining);

  } catch {
    calendarContainer.innerHTML = "<p>Errore nel caricamento</p>";
    document.body.classList.remove("loading");
    loader.style.display = "none";
  }

  /* =============================
        🔍 FILTRI
  ============================== */
  function applyFilters() {
    const text = searchInput.value.toLowerCase();
    const day = daySelect.value;

    document.querySelectorAll(".card").forEach(card => {
      const content = card.textContent.toLowerCase();
      const dateText = card.querySelector(".date").textContent.toLowerCase();

      const matchText = content.includes(text);
      const matchDay = (day === "all") || dateText.includes(day);

      card.style.display = matchText && matchDay ? "" : "none";
    });
  }

  searchInput.addEventListener("input", applyFilters);
  daySelect.addEventListener("change", applyFilters);

});

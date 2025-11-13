document.addEventListener("DOMContentLoaded", async () => {

  const loader = document.getElementById("loader");
  const calendarContainer = document.getElementById("calendar");
  const searchInput = document.getElementById("search-input");
  const daySelect = document.getElementById("day-select");

  /* =============================
     TEMA SCURO / CHIARO
  ============================== */
  const themeToggle = document.getElementById("theme-toggle");
  const currentTheme = localStorage.getItem("theme");

  if (currentTheme === "dark") document.body.classList.add("dark-mode");
  themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const theme = document.body.classList.contains("dark-mode") ? "dark" : "light";
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
    localStorage.setItem("theme", theme);
  });

  /* =============================
     CREA CARD DELLA LEZIONE
  ============================== */
  function createCard(item, index) {
    const card = document.createElement("div");
    card.classList.add("card");

    const date = new Date(item.data + "T00:00:00");

    const dayName = date.toLocaleDateString("it-IT", { weekday: "long" });
    const formattedDate = `${dayName} ${date.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })}`;

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

    // animazione
    requestAnimationFrame(() => {
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 50);
    });
  }

  /* =============================
     CARICA ORARIO + CACHE
  ============================== */
  async function loadOrario() {
    let data = null;

    const cached = localStorage.getItem("orarioCache");
    if (cached) {
      try {
        data = JSON.parse(cached);
      } catch {}
    }

    try {
      const response = await fetch("orario.json", { cache: "no-store" });
      const freshData = await response.json();

      if (JSON.stringify(freshData) !== JSON.stringify(data)) {
        localStorage.setItem("orarioCache", JSON.stringify(freshData));
      }

      data = freshData;
    } catch {
      console.warn("⚠️ Offline, uso cache locale");
    }

    return data;
  }

  /* =============================
     RENDER ORARIO
  ============================== */
  try {
    const data = await loadOrario();

    if (!data) {
      calendarContainer.innerHTML = "<p>Errore nel caricamento dell'orario.</p>";
      loader.style.display = "none";
      return;
    }

    data.sort((a, b) => new Date(a.data) - new Date(b.data));
    data.forEach((item, index) => createCard(item, index));

    loader.style.opacity = "0";
    setTimeout(() => loader.style.display = "none", 400);

  } catch (error) {
    console.error("Errore:", error);
    calendarContainer.innerHTML = "<p>Errore nel caricamento dell'orario.</p>";
    loader.style.display = "none";
  }

  /* =============================
     FILTRO TESTO
  ============================== */
  searchInput.addEventListener("input", () => {
    applyFilters();
  });

  /* =============================
     FILTRO GIORNO
  ============================== */
  daySelect.addEventListener("change", () => {
    applyFilters();
  });

  /* =============================
     FUNZIONE FILTRI COMBINATI
  ============================== */
  function applyFilters() {
    const textFilter = searchInput.value.toLowerCase();
    const dayFilter = daySelect.value;

    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
      const content = card.textContent.toLowerCase();
      const dateText = card.querySelector(".date").textContent.toLowerCase();

      const matchText = content.includes(textFilter);
      const matchDay = dayFilter === "all" || dateText.includes(dayFilter);

      card.style.display = matchText && matchDay ? "" : "none";
    });
  }

});

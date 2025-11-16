document.addEventListener("DOMContentLoaded", async () => {

  document.body.classList.add("loading"); // nasconde contenuti sotto al loader

  const loader = document.getElementById("loader");
  const calendarContainer = document.getElementById("calendar");
  const searchInput = document.getElementById("search-input");
  const daySelect = document.getElementById("day-select");

  /* 🌙 Tema salvato */
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

  /* Caricamento orario con cache */
  async function loadOrario() {
    let data = null;

    const cached = localStorage.getItem("orarioCache");
    if (cached) {
      try { data = JSON.parse(cached); } catch {}
    }

    try {
      const response = await fetch("orario.json", { cache: "no-store" });
      const fresh = await response.json();

      if (JSON.stringify(fresh) !== JSON.stringify(data)) {
        localStorage.setItem("orarioCache", JSON.stringify(fresh));
      }

      data = fresh;
    } catch {
      console.warn("Offline → cache locale");
    }

    return data;
  }

  /* CARD */
  function createCard(item, index) {
    const card = document.createElement("div");
    card.classList.add("card");

    const date = new Date(item.data + "T00:00:00");
    const dayName = date.toLocaleDateString("it-IT", { weekday: "long" });
    const formatted = `${dayName} ${date.toLocaleDateString("it-IT")}`;

    card.innerHTML = `
      <div class="date">${formatted}</div>
      <div class="lesson">
        <strong>${item.materia}</strong><br>
        ${item.docente}<br>
        ${item.orario}<br>
        ${item.sede}
      </div>
    `;

    calendarContainer.appendChild(card);

    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, index * 60);
  }

  /* RENDER + LOADER */
  const start = performance.now();

  try {
    const data = await loadOrario();
    data.sort((a, b) => new Date(a.data) - new Date(b.data));
    data.forEach((item, i) => createCard(item, i));

    const elapsed = performance.now() - start;
    const minTime = 1500;
    const remaining = Math.max(0, minTime - elapsed);

    setTimeout(() => {
      loader.style.opacity = "0";
      document.body.classList.remove("loading");
      setTimeout(() => loader.style.display = "none", 500);
    }, remaining);

  } catch {
    calendarContainer.innerHTML = "<p>Errore nel caricamento</p>";
    loader.style.display = "none";
    document.body.classList.remove("loading");
  }

  /* FILTRI */
  function applyFilters() {
    const text = searchInput.value.toLowerCase();
    const day = daySelect.value;

    document.querySelectorAll(".card").forEach(card => {
      const content = card.textContent.toLowerCase();
      const dateText = card.querySelector(".date").textContent.toLowerCase();

      const okText = content.includes(text);
      const okDay = (day === "all") || dateText.includes(day);

      card.style.display = okText && okDay ? "" : "none";
    });
  }

  searchInput.addEventListener("input", applyFilters);
  daySelect.addEventListener("change", applyFilters);

});

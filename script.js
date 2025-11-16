document.addEventListener("DOMContentLoaded", async () => {

  const loader = document.getElementById("loader");
  const calendarContainer = document.getElementById("calendar");
  const comunicazioniContainer = document.getElementById("comunicazioni");
  const searchInput = document.getElementById("search-input");
  const daySelect = document.getElementById("day-select");

  /* 🌙 Tema salvato */
  const themeToggle = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") document.body.classList.add("dark-mode");
  themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const theme = document.body.classList.contains("dark-mode") ? "dark" : "light";
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
    localStorage.setItem("theme", theme);
  });

  /* CARD ORARIO */
  function createCard(item, index) {
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

    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, index * 60);
  }

  /* BOX COMUNICAZIONI */
  function createComunicazione(msg) {
    const box = document.createElement("div");
    box.classList.add("com-box");

    box.innerHTML = `
      <h3>${msg.titolo}</h3>
      <p>${msg.testo}</p>
    `;

    comunicazioniContainer.appendChild(box);
  }

  async function loadComunicazioni() {
    try {
      const res = await fetch("comunicazioni.json", { cache: "no-store" });
      const data = await res.json();
      data.forEach(msg => createComunicazione(msg));
    } catch {}
  }

  /* CARICA ORARIO */
  async function loadOrario() {
    const res = await fetch("orario.json", { cache: "no-store" });
    return await res.json();
  }

  /* RENDER */
  const orario = await loadOrario();
  orario.sort((a, b) => new Date(a.data) - new Date(b.data));
  orario.forEach((item, i) => createCard(item, i));

  await loadComunicazioni();

  loader.style.opacity = "0";
  setTimeout(() => loader.style.display = "none", 400);

  /* FILTRI */
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

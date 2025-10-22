document.addEventListener("DOMContentLoaded", async () => {
  const loader = document.getElementById("loader");
  const calendarContainer = document.getElementById("calendar");
  const searchResults = document.getElementById("search-results");

  // Tema salvato
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

  try {
    // Caricamento dati orario
    const response = await fetch("orario.json");
    const data = await response.json();

    // Barra di caricamento
    const loadingBar = document.querySelector(".loading-bar");
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10; // incrementi casuali per effetto realistico
      if (progress >= 100) progress = 100;
      loadingBar.style.width = progress + "%";
      if (progress >= 100) {
        clearInterval(interval);
        loader.style.display = "none";
        calendarContainer.style.opacity = 1; // mostra il calendario
      }
    }, 100);

    // Creazione card del calendario
    data.forEach(item => {
      const card = document.createElement("div");
      card.classList.add("card");

      const date = new Date(item.data + "T00:00:00");
      const formattedDate = date.toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });

      card.innerHTML = `
        <div class="date">${formattedDate}</div>
        <div class="lesson"><strong>${item.materia}</strong><br>${item.docente}<br>${item.orario}<br>${item.sede}</div>
      `;
      calendarContainer.appendChild(card);
    });

    // 🔹 Funzione ricerca intelligente
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", () => {
      const filter = searchInput.value.toLowerCase();
      searchResults.innerHTML = ""; // pulisce i risultati

      if (filter === "") return; // se campo vuoto, non mostrare nulla

      data.forEach(item => {
        const text = `${item.materia} ${item.docente} ${item.orario} ${item.sede} ${item.data}`.toLowerCase();
        if (text.includes(filter)) {
          const resultCard = document.createElement("div");
          resultCard.classList.add("card");

          const formattedDate = new Date(item.data + "T00:00:00").toLocaleDateString("it-IT", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
          });

          resultCard.innerHTML = `
            <div class="date">${formattedDate}</div>
            <div class="lesson"><strong>${item.materia}</strong><br>${item.docente}<br>${item.orario}<br>${item.sede}</div>
          `;
          searchResults.appendChild(resultCard);
        }
      });
    });

  } catch (error) {
    calendarContainer.innerHTML = "<p>Errore nel caricamento dell'orario.</p>";
    loader.style.display = "none";
  }
});

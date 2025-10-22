document.addEventListener("DOMContentLoaded", async () => {
  const loader = document.getElementById("loader");
  const calendarContainer = document.getElementById("calendar");

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

  // Caricamento dati orario
  try {
    const response = await fetch("orario.json");
    const data = await response.json();

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

    // Nascondi loader
    setTimeout(() => {
      loader.style.display = "none";
    }, 2000);

    // Funzione ricerca
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", () => {
      const filter = searchInput.value.toLowerCase();
      const cards = document.querySelectorAll(".card");
      cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(filter) ? "" : "none";
      });
    });

  } catch (error) {
    calendarContainer.innerHTML = "<p>Errore nel caricamento dell'orario.</p>";
    loader.style.display = "none";
  }
});

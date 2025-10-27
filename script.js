document.addEventListener("DOMContentLoaded", async () => {
  const loader = document.getElementById("loader");
  const calendarContainer = document.getElementById("calendar");

  // === Gestione tema salvato ===
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

  // === Caricamento dati orario ===
  try {
    const response = await fetch("orario.json");
    const data = await response.json();

    // Ordina per data (facoltativo, ma utile)
    data.sort((a, b) => new Date(a.data) - new Date(b.data));

    // Crea le card ma le tiene inizialmente invisibili
    data.forEach((item, index) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.style.opacity = "0";
      card.style.transform = "translateY(10px)";
      card.style.transition = "opacity 0.6s ease, transform 0.6s ease";

      const date = new Date(item.data + "T00:00:00");
      const formattedDate = date.toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });

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
    });

    // Dopo il caricamento, nascondi il loader e mostra gradualmente le card
    setTimeout(() => {
      loader.style.display = "none";
      const cards = document.querySelectorAll(".card");
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, i * 100); // ritardo progressivo (100 ms tra una card e l’altra)
      });
    }, 2000);

    // === Funzione ricerca ===
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
    console.error("Errore nel caricamento dell'orario:", error);
    calendarContainer.innerHTML = "<p>Errore nel caricamento dell'orario.</p>";
    loader.style.display = "none";
  }
});

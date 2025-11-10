document.addEventListener("DOMContentLoaded", async () => {
  const loader = document.getElementById("loader");
  const calendarContainer = document.getElementById("calendar");

  // === Tema salvato ===
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

    // Ordina per data
    data.sort((a, b) => new Date(a.data) - new Date(b.data));

    // Crea card
    data.forEach((item, index) => {
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
        <div class="lesson">
          <strong>${item.materia}</strong><br>
          ${item.docente}<br>
          ${item.orario}<br>
          ${item.sede}
        </div>
      `;

      calendarContainer.appendChild(card);

      // Fade-in progressivo
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 100);
    });

    // === Nuovo loader con fade-out rapido ===
    setTimeout(() => {
      loader.style.opacity = "0";
      setTimeout(() => loader.style.display = "none", 500);
    }, 1000);

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

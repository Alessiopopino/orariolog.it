document.addEventListener("DOMContentLoaded", async () => {
  const loader = document.getElementById("loader");
  const calendarContainer = document.getElementById("calendar");
  const searchInput = document.getElementById("search-input");

  /* =============================
     ✅ TEMA SALVATO
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
     ✅ FUNZIONE PER CREARE UNA CARD
  ============================== */
  function createCard(item, index) {
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

    // Fade-in più leggero e più fluido
    requestAnimationFrame(() => {
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 50);
    });
  }

  /* =============================
     ✅ CARICAMENTO ORARIO CON CACHE
  ============================== */

  async function loadOrario() {
    let data = null;

    // 1️⃣ Se c’è la cache → uso quella
    const cached = localStorage.getItem("orarioCache");
    if (cached) {
      try {
        data = JSON.parse(cached);
      } catch {}
    }

    // 2️⃣ Carico online (e aggiorno cache)
    try {
      const response = await fetch("orario.json", { cache: "no-store" });
      const freshData = await response.json();

      // Se i dati online sono diversi → aggiorno la cache
      if (JSON.stringify(freshData) !== JSON.stringify(data)) {
        localStorage.setItem("orarioCache", JSON.stringify(freshData));
      }

      data = freshData;
    } catch (err) {
      console.warn("⚠️ Nessuna connessione, uso cache locale.");
    }

    return data;
  }

  /* =============================
     ✅ CARICA E RENDERIZZA ORARIO
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

    // Loader che sparisce appena tutto è pronto (più veloce)
    loader.style.opacity = "0";
    setTimeout(() => loader.style.display = "none", 400);

  } catch (error) {
    console.error("Errore:", error);
    calendarContainer.innerHTML = "<p>Errore nel caricamento dell'orario.</p>";
    loader.style.display = "none";
  }

  /* =============================
     ✅ FILTRO DI RICERCA SUPER VELOCE
  ============================== */
  searchInput.addEventListener("input", () => {
    const filter = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(filter) ? "" : "none";
    });
  });

});

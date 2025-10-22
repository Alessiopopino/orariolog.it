document.addEventListener("DOMContentLoaded", async () => {
  const loader = document.getElementById("loader");
  const calendarContainer = document.getElementById("calendar");
  const searchResults = document.getElementById("search-results");
  const searchInput = document.getElementById("search-input");

  let data = []; // array globale dei dati

  try {
    const response = await fetch("orario.json");
    data = await response.json();

    // Barra caricamento animata
    const loadingBar = document.querySelector(".loading-bar");
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) progress = 100;
      loadingBar.style.width = progress + "%";
      if (progress >= 100) {
        clearInterval(interval);
        loader.style.display = "none";
        calendarContainer.style.opacity = 1;
      }
    }, 100);

    // Popola il calendario principale
    data.forEach(item => {
      const card = document.createElement("div");
      card.classList.add("card");
      const formattedDate = new Date(item.data + "T00:00:00").toLocaleDateString("it-IT", {
        day: "2-digit", month: "2-digit", year: "numeric"
      });
      card.innerHTML = `
        <div class="date">${formattedDate}</div>
        <div class="lesson"><strong>${item.materia}</strong><br>${item.docente}<br>${item.orario}<br>${item.sede}</div>
      `;
      calendarContainer.appendChild(card);
    });

    // Funzione ricerca live
    searchInput.addEventListener("input", () => {
      const filter = searchInput.value.toLowerCase();
      searchResults.innerHTML = ""; // reset risultati

      if (!filter) return;

      data.forEach(item => {
        const combined = `${item.materia} ${item.docente} ${item.orario} ${item.sede} ${item.data}`.toLowerCase();
        if (combined.includes(filter)) {
          const resultCard = document.createElement("div");
          resultCard.classList.add("card");
          const formattedDate = new Date(item.data + "T00:00:00").toLocaleDateString("it-IT", {
            day: "2-digit", month: "2-digit", year: "numeric"
          });
          resultCard.innerHTML = `
            <div class="date">${formattedDate}</div>
            <div class="lesson"><strong>${item.materia}</strong><br>${item.docente}<br>${item.orario}<br>${item.sede}</div>
          `;
          searchResults.appendChild(resultCard);
        }
      });
    });

  } catch (err) {
    calendarContainer.innerHTML = "<p>Errore nel caricamento dell'orario.</p>";
    loader.style.display = "none";
  }
});

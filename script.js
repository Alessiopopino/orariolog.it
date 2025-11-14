document.addEventListener("DOMContentLoaded", () => {

  const calendar = document.getElementById("calendar");
  const searchInput = document.getElementById("search-input");
  const daySelect = document.getElementById("day-select");
  const teacherSelect = document.getElementById("teacher-select");
  const filterButtons = document.querySelectorAll(".filter-toggle");

  // Accordion per le sezioni filtro
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const content = btn.nextElementSibling;
      content.style.display = content.style.display === "block" ? "none" : "block";
    });
  });

  // Carica JSON
  fetch("orario.json")
    .then(res => res.json())
    .then(data => {
      renderCalendar(data);
      populateTeacherFilter(data);
    });

  // Popola filtro docenti
  function populateTeacherFilter(data) {
    const teachers = [...new Set(data.map(x => x.docente))];
    teachers.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t.toLowerCase();
      opt.textContent = t;
      teacherSelect.appendChild(opt);
    });
  }

  // Rendering card
  function renderCalendar(data) {
    calendar.innerHTML = "";

    data.forEach(entry => {
      const card = document.createElement("div");
      card.className = "card";

      const date = new Date(entry.data)
        .toLocaleDateString("it-IT", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });

      card.innerHTML = `
        <div class="date">${date}</div>
        <div><strong>${entry.materia}</strong></div>
        <div>${entry.docente}</div>
        <div>${entry.orario}</div>
        <div>${entry.sede}</div>
      `;

      calendar.appendChild(card);

      // animazione comparsa
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, 100);
    });
  }

  // FILTRI combinati
  function filterResults() {
    fetch("orario.json")
      .then(res => res.json())
      .then(data => {

        const query = searchInput.value.toLowerCase();
        const selectedDay = daySelect.value;
        const selectedTeacher = teacherSelect.value;

        const filtered = data.filter(item => {

          const dateObj = new Date(item.data);
          const dayName = dateObj
            .toLocaleDateString("it-IT", { weekday: "long" })
            .toLowerCase();

          const matchesSearch =
            item.materia.toLowerCase().includes(query) ||
            item.docente.toLowerCase().includes(query) ||
            item.sede.toLowerCase().includes(query);

          const matchesDay =
            selectedDay === "all" || dayName === selectedDay;

          const matchesTeacher =
            selectedTeacher === "all" || item.docente.toLowerCase() === selectedTeacher;

          return matchesSearch && matchesDay && matchesTeacher;
        });

        renderCalendar(filtered);
      });
  }

  searchInput.addEventListener("input", filterResults);
  daySelect.addEventListener("change", filterResults);
  teacherSelect.addEventListener("change", filterResults);
});

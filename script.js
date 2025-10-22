
// Simple interactive rendering of orario.json
async function loadEvents(){
  const res = await fetch('orario.json');
  const events = await res.json();
  return events.map(e => ({...e, date:new Date(e.date)}));
}

function formatDate(d){
  return d.toISOString().slice(0,10);
}

function timeRange(e){
  return e.start ? e.start + (e.end ? ' - ' + e.end : '') : '';
}

function renderList(events){
  const container = document.getElementById('eventsList');
  container.innerHTML = '';
  events.sort((a,b)=> a.date - b.date || a.start.localeCompare(b.start));
  for(const e of events){
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `<div class="event-main">
        <div class="event-time">${formatDate(e.date)}<br/><span style="font-weight:500;font-size:13px">${timeRange(e)}</span></div>
        <div class="event-meta">
          <div class="event-title">${e.title}</div>
          <div class="event-sub">${e.teacher} • ${e.location}</div>
        </div>
      </div>
      <div style="text-align:right"><div class="event-sub">${e.notes || ''}</div></div>`;
    container.appendChild(card);
  }
}

function buildCalendar(events, year, month){
  // month: 0-based
  const start = new Date(year, month, 1);
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const startDay = start.getDay(); // 0 sunday
  const calendar = document.getElementById('calendar');
  calendar.innerHTML = '';
  // render blank days to align (make Monday first? We'll keep Sunday-first simple)
  for(let i=0;i<startDay;i++){
    const blank = document.createElement('div');
    blank.className='day';
    blank.innerHTML='';
    calendar.appendChild(blank);
  }
  for(let d=1; d<=daysInMonth; d++){
    const day = document.createElement('div');
    day.className='day';
    const dateObj = new Date(year, month, d);
    const iso = dateObj.toISOString().slice(0,10);
    day.innerHTML = `<div class="date">${iso}</div>`;
    const dayEvents = events.filter(ev => ev.date.toISOString().slice(0,10)===iso);
    for(const ev of dayEvents){
      const evEl = document.createElement('div');
      evEl.className='small-event';
      evEl.textContent = timeRange(ev) + ' • ' + ev.title;
      evEl.title = ev.teacher + ' • ' + ev.location;
      evEl.addEventListener('click',()=>{
        alert(`${ev.title}\n${ev.teacher}\n${ev.location}\n${iso} ${timeRange(ev)}`);
      });
      day.appendChild(evEl);
    }
    calendar.appendChild(day);
  }
}

function downloadJson(){
  fetch('orario.json').then(r=>r.blob()).then(blob=>{
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'orario.json'; document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  });
}

document.addEventListener('DOMContentLoaded', async ()=>{
  let events = await loadEvents();
  const search = document.getElementById('search');
  const toggle = document.getElementById('toggleView');
  const downloadBtn = document.getElementById('downloadJson');
  const listView = document.getElementById('listView');
  const calendarView = document.getElementById('calendarView');

  renderList(events);
  const now = new Date();
  buildCalendar(events, now.getFullYear(), now.getMonth());

  toggle.addEventListener('click', ()=>{
    if(listView.classList.contains('hidden')){
      listView.classList.remove('hidden');
      calendarView.classList.add('hidden');
      toggle.textContent = 'Visualizza calendario';
    } else {
      listView.classList.add('hidden');
      calendarView.classList.remove('hidden');
      toggle.textContent = 'Visualizza elenco';
    }
  });

  downloadBtn.addEventListener('click', downloadJson);

  search.addEventListener('input', ()=>{
    const q = search.value.trim().toLowerCase();
    if(!q){ renderList(events); return; }
    const filtered = events.filter(e=>{
      return e.title.toLowerCase().includes(q) ||
             (e.teacher||'').toLowerCase().includes(q) ||
             (e.location||'').toLowerCase().includes(q) ||
             formatDate(e.date).includes(q);
    });
    renderList(filtered);
    buildCalendar(filtered, new Date().getFullYear(), new Date().getMonth());
  });
});

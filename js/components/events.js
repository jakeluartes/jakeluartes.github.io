export function Events({ onEdit, onDelete }) {
  const elem = document.createElement("div");
  elem.className = "panel events";

  elem.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
    <div style="font-weight:600">Events</div>
    <div style="font-size:13px;color:rgba(255,255,255,0.6)">${new Date().toLocaleDateString()}</div>
  </div>
  <div class="events-list"></div>`;

  const listEl = elem.querySelector(".events-list");
  let events = [];

  function render() {
    listEl.innerHTML = "";
    events.sort((a,b)=> new Date(a.start)-new Date(b.start));
    events.forEach(ev => {
      const item = document.createElement("div");
      item.className = "event";
      item.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <div class="time">${window.GS.formatTime(ev.start)}${ev.end ? " â€” "+window.GS.formatTime(ev.end):""}</div>
            <div class="title">${ev.title}</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px">
            <button class="button" data-id="${ev.id}" style="font-size:12px">Edit</button>
            <button class="button" data-del="${ev.id}" style="font-size:12px;background:transparent;color:#ffb3b3;border-color:rgba(255,179,179,0.06)">Delete</button>
          </div>
        </div>`;
      listEl.appendChild(item);
    });

    // attach events
    listEl.querySelectorAll("[data-id]").forEach(b=>b.onclick = e => {
      const id = e.currentTarget.getAttribute("data-id");
      const ev = events.find(x=>x.id===id);
      onEdit?.(ev);
    });
    listEl.querySelectorAll("[data-del]").forEach(b=>b.onclick = e => {
      const id = e.currentTarget.getAttribute("data-del");
      onDelete?.(id);
    });
  }

  return {
    elem,
    setEvents(list) { events = list; },
    render
  };
}
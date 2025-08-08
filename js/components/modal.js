export function Modal({ event, onSave, onDelete }) {
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";

  const modal = document.createElement("div");
  modal.className = "panel modal";
  modal.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <div style="font-weight:600">${event ? "Edit Event" : "New Event"}</div>
      <button class="button" id="close">Close</button>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px">
      <input id="title" placeholder="Title" style="padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.03);background:transparent;color:inherit" />
      <input id="location" placeholder="Location" style="padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.03);background:transparent;color:inherit" />
      <div style="display:flex;gap:8px">
        <input id="start" type="datetime-local" style="flex:1;padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.03);background:transparent;color:inherit" />
        <input id="end" type="datetime-local" style="flex:1;padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.03);background:transparent;color:inherit" />
      </div>
      <textarea id="notes" placeholder="Notes" rows="4" style="padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.03);background:transparent;color:inherit"></textarea>
      <div style="display:flex;justify-content:flex-end;gap:8px">
        ${event ? '<button class="button" id="delete" style="background:transparent;color:#ffb3b3;border-color:rgba(255,179,179,0.06)">Delete</button>' : ''}
        <button class="button" id="save">Save</button>
      </div>
    </div>
  `;

  backdrop.appendChild(modal);

  // populate
  const title = modal.querySelector("#title");
  const location = modal.querySelector("#location");
  const start = modal.querySelector("#start");
  const end = modal.querySelector("#end");
  const notes = modal.querySelector("#notes");

  if (event) {
    title.value = event.title || "";
    location.value = event.location || "";
    start.value = toLocalDatetimeInput(new Date(event.start));
    end.value = event.end ? toLocalDatetimeInput(new Date(event.end)) : "";
    notes.value = event.notes || "";
  } else {
    const d = new Date();
    d.setMinutes(d.getMinutes() + (30 - (d.getMinutes() % 30)));
    start.value = toLocalDatetimeInput(d);
  }

  modal.querySelector("#close").onclick = () => close();
  modal.querySelector("#save").onclick = () => {
    const payload = {
      title: title.value || "Untitled",
      location: location.value,
      start: new Date(start.value).toISOString(),
      end: end.value ? new Date(end.value).toISOString() : null,
      notes: notes.value
    };
    onSave?.(payload);
  };
  const delBtn = modal.querySelector("#delete");
  if (delBtn) delBtn.onclick = () => onDelete?.();

  function toLocalDatetimeInput(d) {
    const pad = n => n.toString().padStart(2,"0");
    const y = d.getFullYear();
    const m = pad(d.getMonth()+1);
    const day = pad(d.getDate());
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    return `${y}-${m}-${day}T${hh}:${mm}`;
  }

  function close() {
    backdrop.remove();
  }

  return { elem: backdrop, close };
}
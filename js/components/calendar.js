export function Calendar({ onEventClick, onEventsChange }) {
  const elem = document.createElement("div");
  elem.className = "panel calendar";

  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  header.style.marginBottom = "12px";
  header.innerHTML = `<div style="font-weight:600">Day View</div><div style="color:rgba(255,255,255,0.6)">${new Date().toLocaleDateString()}</div>`;

  const grid = document.createElement("div");
  grid.className = "calendar-grid";

  elem.appendChild(header);
  elem.appendChild(grid);

  const HOUR_START = 7;
  const HOUR_END = 21;
  const HOUR_HEIGHT = 60; // px per hour
  const MIN_STEP = 5; // minutes snap

  // create hour rows
  for (let hour = HOUR_START; hour <= HOUR_END; hour++) {
    const row = document.createElement("div");
    row.className = "hour-line";
    row.style.height = `${HOUR_HEIGHT}px`;
    const label = document.createElement("div");
    label.className = "hour-label";
    const d = new Date();
    d.setHours(hour,0,0,0);
    label.textContent = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", hour12: true });
    row.appendChild(label);
    grid.appendChild(row);
  }
  grid.style.height = `${(HOUR_END - HOUR_START + 1) * HOUR_HEIGHT}px`;
  grid.style.position = "relative";

  let events = [];

  function render() {
    // clear existing absolute events
    grid.querySelectorAll(".event-abs").forEach(e => e.remove());

    events.forEach(ev => {
      const start = new Date(ev.start);
      const end = ev.end ? new Date(ev.end) : new Date(start.getTime() + 30*60000);
      const totalMinutesFromStart = (start.getHours() - HOUR_START) * 60 + start.getMinutes();
      const durationMinutes = Math.max(15, (end - start) / 60000);

      const top = (totalMinutesFromStart / 60) * HOUR_HEIGHT;
      const height = (durationMinutes / 60) * HOUR_HEIGHT;

      const evEl = document.createElement("div");
      evEl.className = "event-abs";
      evEl.style.top = `${top}px`;
      evEl.style.height = `${Math.max(24, height)}px`;
      evEl.setAttribute("data-id", ev.id);
      evEl.innerHTML = `<div class="time">${window.GS.formatTime(ev.start)}${ev.end ? " â€” " + window.GS.formatTime(ev.end) : ""}</div><div class="title">${ev.title}</div><div class="resize-handle" data-resize></div>`;
      grid.appendChild(evEl);

      // pointer-drag for moving
      let originPointer = null;
      let originTop = null;
      let originHeight = null;
      let mode = null; // 'move'|'resize'

      evEl.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        evEl.setPointerCapture(e.pointerId);
        originPointer = { x: e.clientX, y: e.clientY };
        originTop = parseFloat(evEl.style.top);
        originHeight = parseFloat(evEl.style.height);
        if (e.target && e.target.hasAttribute("data-resize")) mode = "resize";
        else mode = "move";
      });

      evEl.addEventListener("pointermove", (e) => {
        if (!originPointer) return;
        const dy = e.clientY - originPointer.y;
        if (mode === "move") {
          let newTop = originTop + dy;
          // clamp
          newTop = Math.max(0, Math.min(newTop, grid.clientHeight - originHeight));
          // snap to MIN_STEP
          const minutes = Math.round((newTop / HOUR_HEIGHT) * 60 / MIN_STEP) * MIN_STEP;
          newTop = (minutes / 60) * HOUR_HEIGHT;
          evEl.style.top = `${newTop}px`;
        } else if (mode === "resize") {
          let newHeight = originHeight + dy;
          newHeight = Math.max(24, Math.min(newHeight, grid.clientHeight - parseFloat(evEl.style.top)));
          const minutes = Math.round((newHeight / HOUR_HEIGHT) * 60 / MIN_STEP) * MIN_STEP;
          newHeight = (minutes / 60) * HOUR_HEIGHT;
          evEl.style.height = `${newHeight}px`;
        }
      });

      evEl.addEventListener("pointerup", (e) => {
        if (!originPointer) return;
        evEl.releasePointerCapture(e.pointerId);
        // compute new start and end from element position/height
        const newTop = parseFloat(evEl.style.top);
        const newHeight = parseFloat(evEl.style.height);
        const startMinutes = Math.round((newTop / HOUR_HEIGHT) * 60);
        const newStart = new Date();
        newStart.setHours(HOUR_START + Math.floor(startMinutes / 60), startMinutes % 60, 0, 0);
        const durationMinutes = Math.round((newHeight / HOUR_HEIGHT) * 60);
        const newEnd = new Date(newStart.getTime() + durationMinutes * 60000);

        // Update store
        window.GS.store.update(ev.id, { start: newStart.toISOString(), end: newEnd.toISOString() });

        originPointer = null;
        originTop = null;
        originHeight = null;
        mode = null;

        // refresh renderer and notify parent
        const list = window.GS.store.all();
        setEvents(list);
        onEventsChange?.(list);
      });

      // click handler to edit
      evEl.addEventListener("click", (e) => {
        // prevent click during drag
        if (originPointer) return;
        onEventClick?.(ev);
      });
    });
  }

  function setEvents(list) {
    events = Array.isArray(list) ? list.slice() : [];
    render();
  }

  return {
    elem,
    setEvents,
    reload() {
      const list = window.GS.store.all();
      setEvents(list);
      onEventsChange?.(list);
    },
    gotoToday() {
      elem.animate([{ transform: "translateY(-6px)" }, { transform: "translateY(0)" }], { duration: 250 });
    }
  };
}
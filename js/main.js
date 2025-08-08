import { Header } from "./components/header.js";
import { Sidebar } from "./components/sidebar.js";
import { Calendar } from "./components/calendar.js";
import { Events } from "./components/events.js";
import { Modal } from "./components/modal.js";

const app = document.getElementById("app");

const sidebar = Sidebar();
const main = document.createElement("div");
main.className = "main";

const eventsComp = Events({
  onEdit: openEditor,
  onDelete: (id) => {
    store.deleteEvent(id);
    calendar.reload();
    eventsComp.setEvents(store.all());
    eventsComp.render();
  },
});

const header = Header({
  onAdd: () => openEditor(),
  onToday: () => calendar.gotoToday(),
});

const calendar = Calendar({
  onEventClick: openEditor,
  onEventsChange: (list) => {
    eventsComp.setEvents(list);
    eventsComp.render();
  },
});

// Simple event store using localStorage
const store = {
  key: "glass-schedule-events",
  load() {
    const raw = localStorage.getItem(this.key);
    try {
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },
  save(list) {
    localStorage.setItem(this.key, JSON.stringify(list));
  },
  add(event) {
    const list = this.load();
    event.id = Date.now().toString();
    list.push(event);
    this.save(list);
    return event;
  },
  update(id, patch) {
    const list = this.load();
    const idx = list.findIndex((e) => e.id === id);
    if (idx > -1) {
      list[idx] = { ...list[idx], ...patch };
      this.save(list);
      return list[idx];
    }
  },
  deleteEvent(id) {
    const list = this.load().filter((e) => e.id !== id);
    this.save(list);
  },
  all() {
    return this.load();
  },
};

function openEditor(existingEvent) {
  const modal = Modal({
    event: existingEvent,
    onSave: (data) => {
      if (existingEvent?.id) {
        store.update(existingEvent.id, data);
      } else {
        store.add(data);
      }
      calendar.reload();
      eventsComp.setEvents(store.all());
      eventsComp.render();
      modal.close();
    },
    onDelete: () => {
      if (existingEvent?.id) {
        store.deleteEvent(existingEvent.id);
        calendar.reload();
        eventsComp.setEvents(store.all());
        eventsComp.render();
        modal.close();
      }
    },
  });
  document.body.appendChild(modal.elem);
}

// mount UI
app.appendChild(sidebar);
main.appendChild(header);
const row = document.createElement("div");
row.className = "row";
row.appendChild(calendar.elem);
row.appendChild(eventsComp.elem);
main.appendChild(row);
app.appendChild(main);

window.GS = {
  store,
  formatTime: (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", hour12: true });
  },
};

// initial render
calendar.setEvents(store.all());
eventsComp.setEvents(store.all());
eventsComp.render();

export { store };
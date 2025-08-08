export function Header({ onAdd, onToday }) {
  const el = document.createElement("div");
  el.className = "panel header";

  const left = document.createElement("div");
  left.style.display = "flex";
  left.style.flexDirection = "column";
  const title = document.createElement("div");
  title.className = "title";
  title.textContent = "Glass Scheduler";
  const subtitle = document.createElement("div");
  subtitle.style.fontSize = "13px";
  subtitle.style.color = "rgba(255,255,255,0.65)";
  subtitle.textContent = new Date().toLocaleDateString();
  left.appendChild(title);
  left.appendChild(subtitle);

  const controls = document.createElement("div");
  controls.className = "controls";
  const addBtn = document.createElement("button");
  addBtn.className = "button primary";
  addBtn.textContent = "New";
  addBtn.onclick = () => onAdd();
  const todayBtn = document.createElement("button");
  todayBtn.className = "button";
  todayBtn.textContent = "Today";
  todayBtn.onclick = onToday;

  controls.appendChild(todayBtn);
  controls.appendChild(addBtn);

  el.appendChild(left);
  el.appendChild(controls);

  return el;
}
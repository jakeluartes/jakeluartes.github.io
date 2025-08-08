export function Sidebar() {
  const el = document.createElement("aside");
  el.className = "panel sidebar";
  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
      <div style="width:44px;height:44px;border-radius:10px;background:linear-gradient(180deg,#2e3a47,#1b2630);display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,0.03)">GS</div>
      <div>
        <div style="font-weight:600">Hello</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.65)">Plan your day</div>
      </div>
    </div>

    <div style="margin-top:8px">
      <div style="font-size:12px;color:rgba(255,255,255,0.6);margin-bottom:6px">Quick filters</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="button">Today</button>
        <button class="button">Tomorrow</button>
        <button class="button">Work</button>
        <button class="button">Personal</button>
      </div>
    </div>

    <hr style="border:none;height:1px;background:rgba(255,255,255,0.02);margin:16px 0">

    <div style="font-size:12px;color:rgba(255,255,255,0.65)">Tips</div>
    <div style="margin-top:8px;font-size:13px;color:rgba(255,255,255,0.6)">
      Use the New button to add events. The app works offline once installed.
    </div>
  `;
  return el;
}
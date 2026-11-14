(function () {
  const btn = document.getElementById("soundToggle");
  function syncSound() {
    if (!btn) return;
    const on = Media.soundOn();
    btn.classList.toggle("off", !on);
    btn.querySelector(".lbl").textContent = on ? "Sound on" : "Sound off";
    document.querySelectorAll("video[data-main]").forEach(v => (v.muted = !on));
  }
  if (btn) btn.addEventListener("click", () => { Media.setSound(!Media.soundOn()); syncSound(); });
  syncSound();
  const yr = document.getElementById("yr"); if (yr) yr.textContent = new Date().getFullYear();
  // Press "/" to jump to search
  addEventListener("keydown", e => {
    const s = document.getElementById("search");
    if (e.key === "/" && s && document.activeElement !== s && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); s.focus(); }
    if (e.key === "Escape" && document.activeElement === s) s.blur();
  });
  window.UI = { syncSound };
})();

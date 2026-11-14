(function () {
  const btn = document.getElementById("soundToggle");
  function syncSound() {
    if (!btn) return;
    const on = Media.soundOn();
    btn.classList.toggle("off", !on);
    btn.querySelector(".lbl").textContent = on ? "Bunyi on" : "Bunyi off";
    document.querySelectorAll("video[data-main]").forEach(v => (v.muted = !on));
  }
  if (btn) btn.addEventListener("click", () => { Media.setSound(!Media.soundOn()); syncSound(); });
  syncSound();
  const yr = document.getElementById("yr"); if (yr) yr.textContent = new Date().getFullYear();
  window.UI = { syncSound };
})();

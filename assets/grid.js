// Render grid card + hover preview (video + bunyi)
(function () {
  const M = window.Media;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  let unlocked = false, current = null, hint = null;
  const unlock = () => {
    unlocked = true; document.documentElement.classList.add("audio-ok");
    if (hint) { hint.classList.remove("show"); }
    // Unmute the preview that is playing right now
    if (current && current.el && current.el.tagName === "VIDEO" && M.soundOn()) {
      current.el.muted = false; current.el.volume = 0; current.a.classList.remove("muted");
      current.el.play().catch(() => {}); fade(current.el, 1);
    }
  };
  function showHint() {
    if (unlocked || !M.soundOn()) return;
    if (!hint) {
      hint = document.createElement("div"); hint.className = "hint";
      hint.textContent = "Click anywhere to turn on sound";
      document.body.appendChild(hint);
    }
    requestAnimationFrame(() => hint.classList.add("show"));
  }
  ["pointerdown", "keydown"].forEach(e => window.addEventListener(e, unlock, { once: true, capture: true }));

  function fade(el, to, ms = 350) {
    const from = el.volume, t0 = performance.now();
    cancelAnimationFrame(el._fade);
    const step = t => {
      const k = Math.min(1, (t - t0) / ms);
      el.volume = Math.min(1, Math.max(0, from + (to - from) * k));
      if (k < 1) el._fade = requestAnimationFrame(step);
    };
    el._fade = requestAnimationFrame(step);
  }

  function card(v, i) {
    const a = document.createElement("a");
    a.className = "card";
    a.href = "video.html?id=" + encodeURIComponent(v.id);
    a.style.setProperty("--d", (i % 12) * 40 + "ms");
    a.innerHTML = `
      <div class="thumb">
        <div class="noposter"></div>
        <div class="media"></div>
        <span class="badge sound" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path class="w" d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"/></svg>
        </span>
        <span class="progress"><i></i></span>
      </div>
      <div class="meta">
        <h3></h3>
        <p></p>
        <div class="tags">${(v.tags || []).map(t => `<span>${t}</span>`).join("")}</div>
      </div>`;
    fill(a, v);
    if (v.xid && !v._resolved) a.classList.add("loading");
    M.resolve(v).then(() => { a.classList.remove("loading"); fill(a, v); });
    attachPreview(a, v);
    return a;
  }

  function fill(a, v) {
    a.querySelector("h3").textContent = v.title;
    a.querySelector(".meta p").textContent = v.creator || "";
    a.querySelector(".meta .tags").innerHTML = (v.tags || []).map(t => `<span>${t}</span>`).join("");
    const p = M.poster(v), th = a.querySelector(".thumb");
    if (p && !th.querySelector("img")) {
      const img = new Image(); img.alt = ""; img.loading = "lazy"; img.src = p;
      img.onload = () => img.classList.add("on");
      th.insertBefore(img, th.querySelector(".media"));
    }
  }

  function attachPreview(a, v) {
    const box = a.querySelector(".media");
    const bar = a.querySelector(".progress i");
    let el = null, timer = null;

    function start(withSound) {
      if (el) return;
      if (v.xid && !v._resolved) { M.resolve(v).then(() => a.matches(":hover") && start(withSound)); return; }
      a.classList.add("playing");
      const k = M.kind(v);
      const sound = withSound && M.soundOn();
      if (k === "file") {
        el = document.createElement("video");
        el.src = M.previewSrc(v); el.loop = true; el.playsInline = true; el.preload = "auto";
        el.muted = !sound; el.volume = 0;
        el.addEventListener("timeupdate", () => {
          if (el && el.duration) bar.style.width = (el.currentTime / el.duration) * 100 + "%";
        });
        el.addEventListener("error", () => { a.classList.add("noplay"); stop(); });
        el.addEventListener("playing", () => { a.classList.add("ready"); if (!el.muted) fade(el, 1); });
        box.appendChild(el);
        current = { a, el };
        el.play().catch(() => {
          // Browser blok bunyi sebelum user klik -> main senyap
          if (!el) return;
          el.muted = true; a.classList.add("muted"); showHint();
          el.play().catch(() => {});
        });
        if (el.muted) a.classList.add("muted");
      } else if (k === "x") {
        a.classList.remove("playing"); return; // tweet tanpa video: tiada preview
      } else {
        el = document.createElement("iframe");
        el.allow = "autoplay; encrypted-media; picture-in-picture";
        el.src = M.embedUrl(v, { preview: true, muted: !(sound && unlocked) });
        el.onload = () => a.classList.add("ready");
        if (!(sound && unlocked)) a.classList.add("muted");
        box.appendChild(el);
      }
    }
    function stop() {
      clearTimeout(timer);
      a.classList.remove("playing", "ready", "muted");
      bar.style.width = "0";
      if (!el) return;
      const dead = el; el = null;
      if (current && current.el === dead) current = null;
      if (dead.tagName === "VIDEO" && !dead.muted) {
        fade(dead, 0, 200);
        setTimeout(() => { dead.pause(); dead.removeAttribute("src"); dead.load(); dead.remove(); }, 220);
      } else {
        dead.remove();
      }
    }

    if (canHover) {
      a.addEventListener("mouseenter", () => { timer = setTimeout(() => start(true), 120); });
      a.addEventListener("mouseleave", stop);
      a.addEventListener("focus", () => start(true));
      a.addEventListener("blur", stop);
    } else {
      // Phone: auto-preview senyap bila card di tengah skrin
      const io = new IntersectionObserver(es => es.forEach(e => (e.isIntersecting ? start(false) : stop())),
        { rootMargin: "-40% 0px -40% 0px" });
      io.observe(a);
    }
  }

  function render(container, list) {
    container.innerHTML = "";
    list.forEach((v, i) => container.appendChild(card(v, i)));
    requestAnimationFrame(() => container.classList.add("in"));
  }

  window.Grid = { render };
})();

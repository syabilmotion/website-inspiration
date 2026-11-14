// Helpers: detect jenis video, ambil data X/Twitter, build player
(function () {
  const xRe = /(?:x|twitter|fxtwitter|vxtwitter)\.com\/([\w]+)\/status(?:es)?\/(\d+)/i;
  function xInfo(url) { const m = (url || "").match(xRe); return m ? { user: m[1], id: m[2] } : null; }
  function ytId(url) {
    const m = (url || "").match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
    return m ? m[1] : null;
  }
  function vimeoId(url) { const m = (url || "").match(/vimeo\.com\/(?:video\/)?(\d+)/); return m ? m[1] : null; }

  // Normalise data: bagi id/title default
  (window.VIDEOS || []).forEach((v, i) => {
    const x = xInfo(v.src);
    if (x) { v.tweet = v.src; v.link = v.link || v.src; v.xid = x.id; v.creator = v.creator || "@" + x.user; }
    v.id = v.id || (x ? x.user.toLowerCase() + "-" + x.id.slice(-6) : "video-" + (i + 1));
    v.title = v.title || (x ? "@" + x.user : "Video " + (i + 1));
  });

  function kind(v) {
    if (v.xid && !v.mp4) return "x";
    if (v.mp4) return "file";
    if (ytId(v.src)) return "youtube";
    if (vimeoId(v.src)) return "vimeo";
    return "file";
  }
  function fileSrc(v) { return v.mp4 || v.src; }
  function poster(v) {
    if (v.poster) return v.poster;
    const y = ytId(v.src);
    return y ? "https://i.ytimg.com/vi/" + y + "/hqdefault.jpg" : "";
  }
  function embedUrl(v, { preview = false, muted = false } = {}) {
    if (v.xid) return "https://platform.twitter.com/embed/Tweet.html?id=" + v.xid + "&theme=dark&dnt=true";
    const y = ytId(v.src);
    if (y) {
      const p = new URLSearchParams({ autoplay: 1, mute: muted ? 1 : 0, playsinline: 1, rel: 0, modestbranding: 1 });
      if (preview) { p.set("controls", 0); p.set("loop", 1); p.set("playlist", y); }
      return "https://www.youtube.com/embed/" + y + "?" + p;
    }
    const vm = vimeoId(v.src);
    if (vm) {
      const p = new URLSearchParams({ autoplay: 1, muted: muted ? 1 : 0, playsinline: 1, title: 0, byline: 0, portrait: 0 });
      if (preview) { p.set("background", 1); p.set("loop", 1); }
      return "https://player.vimeo.com/video/" + vm + "?" + p;
    }
    return "";
  }

  // ---- Ambil video dari tweet (fxtwitter, fallback vxtwitter) ----
  const CK = "xcache:";
  function clean(t) { return (t || "").replace(/https?:\/\/t\.co\/\S+/g, "").trim(); }
  async function fx(id) {
    const r = await fetch("https://api.fxtwitter.com/status/" + id);
    const j = await r.json(); const t = j.tweet; if (!t) throw 0;
    const vid = (t.media && (t.media.videos || []).find(m => m.url)) || null;
    return { mp4: vid && vid.url, poster: vid && vid.thumbnail_url, name: t.author && t.author.name,
             handle: t.author && t.author.screen_name, text: clean(t.text) };
  }
  async function vx(id) {
    const r = await fetch("https://api.vxtwitter.com/Twitter/status/" + id);
    const j = await r.json();
    const vid = (j.media_extended || []).find(m => m.type === "video" || m.type === "gif");
    return { mp4: vid && vid.url, poster: vid && vid.thumbnail_url, name: j.user_name,
             handle: j.user_screen_name, text: clean(j.text) };
  }
  const pending = {};
  function resolve(v) {
    if (!v.xid || v._resolved) return Promise.resolve(v);
    if (pending[v.id]) return pending[v.id];
    let cached = null; try { cached = JSON.parse(sessionStorage.getItem(CK + v.xid)); } catch (e) {}
    const job = (cached ? Promise.resolve(cached) : fx(v.xid).catch(() => vx(v.xid)))
      .then(d => {
        try { sessionStorage.setItem(CK + v.xid, JSON.stringify(d)); } catch (e) {}
        if (d.mp4) v.mp4 = d.mp4;
        if (!v.poster && d.poster) v.poster = d.poster;
        if (d.name && v.title.startsWith("@")) v.title = d.name;
        if (d.handle) v.creator = "@" + d.handle;
        if (!v.desc && d.text) v.desc = d.text;
        v._resolved = true; return v;
      })
      .catch(() => { v._resolved = true; return v; });
    pending[v.id] = job; return job;
  }

  function byId(id) { return (window.VIDEOS || []).find(v => v.id === id); }
  const KEY = "insp-sound";
  function soundOn() { try { return localStorage.getItem(KEY) !== "off"; } catch (e) { return true; } }
  function setSound(on) { try { localStorage.setItem(KEY, on ? "on" : "off"); } catch (e) {} }

  window.Media = { kind, fileSrc, poster, embedUrl, byId, resolve, soundOn, setSound };
})();

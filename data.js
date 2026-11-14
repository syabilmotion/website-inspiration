/*
  ====== TAMBAH / EDIT VIDEO KAU DI SINI ======
  Paling senang: tampal link X / Twitter je. Tajuk, creator, thumbnail & video
  akan diambil automatik dari tweet tu.

  Field (semua optional kecuali src):
    src     : link video — X/Twitter, YouTube, Vimeo, atau fail .mp4 terus
    id      : nama dalam URL (auto kalau kosong)
    title   : tajuk (auto dari tweet kalau kosong)
    creator : nama creator (auto dari tweet kalau kosong)
    tags    : kategori — guna nama dari CATEGORIES di bawah, boleh lebih dari satu
              (kategori juga ditambah automatik ikut kata kunci dalam tweet)
    poster  : gambar thumbnail (auto untuk X & YouTube)
    desc    : penerangan (auto = teks tweet)
*/
// Kategori yang keluar sebagai butang filter (ikut susunan ni)
window.CATEGORIES = ["Motion", "SaaS", "Motion Design", "App Demo", "3D"];

// Kata kunci dalam teks tweet -> kategori automatik
window.AUTO_TAGS = {
  "3D":            ["3d", "blender", "c4d", "cinema 4d", "octane", "redshift", "spline", "houdini", "unreal"],
  "SaaS":          ["saas", "b2b", "dashboard", "startup", "launch video", "product launch"],
  "App Demo":      ["app demo", "demo", "walkthrough", "ios app", "android app", "mobile app", "product video"],
  "Motion Design": ["motion design", "after effects", "aftereffects", "#ae", "animation", "animated", "kinetic", "typography"],
};

window.VIDEOS = [
  { src: "https://x.com/NevFlynn/status/2120884820905804128",       tags: ["Motion"] },
  { src: "https://x.com/Varcyyyy/status/2121287254584999975",       tags: ["Motion"] },
  { src: "https://x.com/bot/status/2120582957782200586",            tags: ["Motion"] },
  { src: "https://x.com/pranav_ae/status/2121217927215235104",      tags: ["Motion", "Motion Design"] },
  { src: "https://x.com/Aster_DEX/status/2121241977928986936",      tags: ["Motion", "App Demo"] },
  { src: "https://x.com/saifcreative_/status/2121198303757086787",  tags: ["Motion", "Motion Design"] },
  { src: "https://x.com/blak3shao/status/2120939694984675409",      tags: ["Motion"] },
  { src: "https://x.com/useforen/status/2121254397640417312",       tags: ["Motion", "SaaS", "App Demo"] },
  { src: "https://x.com/motionimo/status/2120924687697866800",      tags: ["Motion", "Motion Design"] },
  { src: "https://x.com/sendrhq/status/2120879508592931163",        tags: ["Motion", "SaaS", "App Demo"] },
  { src: "https://x.com/semochkin_alex/status/2121422872354890183", tags: ["Motion"] },
  { src: "https://x.com/yashxedits/status/2121270362000212225",     tags: ["Motion", "Motion Design"] },
  { src: "https://x.com/gmgnai/status/2121373204229070991",         tags: ["Motion"] },
  { src: "https://x.com/JohnnGfx/status/2121158228918583741",       tags: ["Motion", "Motion Design"] },
  { src: "https://x.com/BuffetDesigns/status/2121210613754212567",  tags: ["Motion", "SaaS", "App Demo"] },
];

# motion/inspo

Website inspirasi motion: grid video, **hover = preview video + bunyi**, klik = page penuh, scroll bawah = inspirasi lain.

## Tambah video
Edit `data.js` dan tampal link (X/Twitter, YouTube, Vimeo atau fail `.mp4`):

```js
{ src: "https://x.com/user/status/123...", tags: ["3D"] },
```

Untuk link X, tajuk, creator, thumbnail dan video diambil automatik melalui API awam fxtwitter (vxtwitter sebagai backup).
Kalau dua-dua gagal, page video akan tunjuk embed tweet.

## Jalankan
Fail statik sahaja, tak perlu build:

```bash
python3 -m http.server 8000
```

Atau publish dengan GitHub Pages (Settings → Pages → branch ini, folder `/`).

## Nota bunyi
Browser tak benarkan bunyi main sebelum pengunjung klik sekurang-kurangnya sekali,
sebab tu ada skrin "Masuk dengan bunyi" di awal.

# Cara Membuat Link GitHub yang Bisa Dibagikan ke Dosen

Hasil akhir yang kamu bagikan ke dosen adalah **link website live**, bukan link file:
`https://USERNAME.github.io/muga-coffee/`
Contoh: jika username kamu `budi123`, linknya `https://budi123.github.io/muga-coffee/`

Website bisa langsung dibuka dosen di HP/laptop tanpa install apa pun.

---

## Opsi A — Paling mudah (tanpa terminal): HP / Browser

1. Buka [github.com](https://github.com) → login → klik **+ → New repository**
2. Repository name: `muga-coffee` → pilih **Public** → centang **Add a README file** → **Create repository**
3. Klik **Add file → Upload files**, lalu drag **seluruh isi folder ini** (pastikan strukturnya tetap):
   ```
   index.html
   README.md
   css/style.css
   js/script.js
   ```
   > Tips: drag folder `css` dan `js` juga, jangan hanya file di root, supaya tampilan tidak rusak.
4. Klik **Commit changes** → repo jadi: `https://github.com/USERNAME/muga-coffee`
5. Aktifkan website live: **Settings → Pages → Source: Deploy from a branch → Branch: main / (root) → Save**
6. Tunggu 1–2 menit, website live di:
   `https://USERNAME.github.io/muga-coffee/`
7. Kirim link itu (plus link repo) ke dosen. Selesai 🎉

## Opsi B — Pakai Git (jika sudah install Git for Windows)

Buka PowerShell di folder ini, lalu jalankan (ganti USERNAME):

```powershell
git init
git add .
git commit -m "Muga Coffee - QR Code ordering UI/UX prototype"
git branch -M main
git remote add origin https://github.com/USERNAME/muga-coffee.git
git push -u origin main
```

Lalu aktifkan **Settings → Pages** seperti langkah 5 di atas.

## Checklist sebelum dibagikan ke dosen
- [ ] Buka link `https://USERNAME.github.io/muga-coffee/?meja=12` di HP — menu, keranjang, status, bayar, AI chat berfungsi
- [ ] Cek tab **Kasir/Admin** di bagian atas
- [ ] Pastikan `index.html` ada di root repo (bukan di dalam subfolder)

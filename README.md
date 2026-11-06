# ☕ Muga Coffee — Sistem Pemesanan Berbasis QR Code (UI/UX Prototype)

Website cafe modern **minimalis, bersih, elegan, dan mobile-first** untuk sistem pemesanan makanan & minuman.
Pelanggan **tidak perlu login**. Cukup scan QR Code di meja → meja terdeteksi otomatis → pilih menu → pesan → pantau status → bayar → transaksi tercatat ke dashboard kasir.

> Konsep utama: **Scan QR → Langsung Masuk ke Meja → Pilih Menu → Pesan → Pesanan Masuk ke Kasir → Pantau Status → Bayar → Transaksi Tercatat.**

## ✨ Fitur

### 👤 Sisi Pelanggan (mobile-first)
| Halaman | Keterangan |
|---|---|
| QR Scan / Entry Point | Simulasi scan QR, deteksi nomor meja otomatis (`?meja=12`), tanpa login |
| Menu Cafe | Kategori Semua/Makanan/Minuman/Snack/Dessert/Promo, pencarian, kartu menu + tombol Tambah |
| Detail Menu | Modal foto, harga, deskripsi, jumlah, catatan pesanan |
| Keranjang | Atur jumlah, hapus, subtotal, biaya layanan 5%, total, info Meja |
| Konfirmasi Pesanan | Popup "Pastikan pesanan Anda sudah benar" |
| Status Pesanan | Timeline Diterima → Diproses → Siap → Diantar → Selesai, nomor pesanan, estimasi |
| Pemanggilan Antrian | Banner "Pesanan #xxxx sudah siap!" / "...sedang diantar ke Meja X" |
| Pembayaran | Tunai, QRIS, E-Wallet, Transfer (simulasi payment gateway) |
| Pembayaran Berhasil | Nomor transaksi, meja, total, waktu, detail pesanan |
| AI Customer Service | Floating chat: rekomendasi menu (pedas/terlaris), harga, jam buka, status, cara bayar, promo |
| Membership (opsional) | Poin, level, riwayat, voucher, reward — tidak menghalangi pemesanan tanpa login |

### 🪑 Sisi Kasir / Admin (desktop/tablet)
- **Dashboard** — statistik Pesanan Baru / Diproses / Siap / Selesai
- **Pesanan** — kanban Baru → Diproses → Siap → Diantar → Selesai, nomor meja (`MEJA 12`) selalu terlihat
- **Menu Management** — aktif/nonaktif, hapus, tambah menu
- **Payment Management** — filter Menunggu / Diproses / Berhasil / Gagal
- **Laporan** — pendapatan, total pesanan, menu terlaris, grafik 7 hari, filter (hari/minggu/bulan/custom), Export CSV
- **Membership Management** — daftar member, poin, transaksi, status
- **AI Management** — sumber pengetahuan AI (menu, jam, promo, FAQ), pertanyaan pelanggan
- **Pengaturan** — info cafe, jam operasional, biaya layanan & pajak

## 🚀 Cara Menjalankan
1. Buka `index.html` langsung di browser, **atau**
2. Jalankan server lokal: `npx serve .` lalu buka URL-nya.

**Coba alur demo:**
1. Halaman QR Scan → klik **Mulai Pesan** (meja default 12, bisa diganti).
2. Pilih menu → **Tambah ke Keranjang** → atur jumlah/catatan.
3. **Pesan Sekarang → Konfirmasi** → lihat **Status Pesanan**.
4. Klik **Simulasi: Majukan Status** untuk meniru update kasir, lalu **Bayar Sekarang**.
5. Klik tab **🪑 Kasir / Admin** di atas untuk melihat pesanan yang sama masuk ke dashboard (kanban, laporan, dsb).

**Deteksi meja via URL** (seperti QR asli):
```
index.html?meja=12
index.html?meja=5   → membuka langsung sebagai Meja 5
```

## 🎨 Gaya Visual
- Background putih/off-white, aksen cokelat kopi & beige, teks gelap
- Hijau = berhasil/selesai, oranye/kuning = menunggu, merah = error/berbahaya
- Font modern **Plus Jakarta Sans** + **Fraunces** (judul), tanpa gradient berlebihan & dekorasi ramai
- Mobile-first untuk pelanggan (bottom navigation + tombol besar), responsive tablet/desktop untuk kasir (sidebar)

## 📁 Struktur
```
Muga-coffee/
├── index.html        # Semua halaman pelanggan + dashboard kasir (SPA prototype)
├── css/
│   └── style.css     # Design system Muga Coffee
├── js/
│   └── script.js     # Data menu, keranjang, status, pembayaran, AI, dashboard
└── README.md
```

## 📤 Publikasi ke GitHub
1. Buat repo baru di GitHub, lalu upload/push folder ini.
2. Aktifkan **Settings → Pages → Deploy from branch** (branch `main`, folder root) untuk membuka prototype ini sebagai website publik.
3. (Opsional) Tambahkan screenshot & link Figma di bagian repo ini untuk dokumentasi UI/UX.

## ⚠️ Catatan
Prototype ini **frontend-only (demo)** — data menu, pesanan, pembayaran, dan AI masih disimulasi di browser (local state). Belum terhubung ke backend, database, atau payment gateway asli.

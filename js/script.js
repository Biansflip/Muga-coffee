/* Muga Coffee — Demo UI/UX logic (frontend prototype, tanpa backend) */
const MENUS = [
  {id:1, name:"Nasi Goreng Spesial", desc:"Nasi goreng dengan telur, ayam, dan sayuran segar.", price:25000, cat:"Makanan", icon:"🍳", tag:"Terlaris"},
  {id:2, name:"Ayam Geprek", desc:"Ayam crispy digeprek sambal bawang. Pedasnya bisa diatur.", price:22000, cat:"Makanan", icon:"🌶️", tag:"Pedas"},
  {id:3, name:"Mie Pedas Manis", desc:"Mie tumis saus pedas manis dengan telur mata sapi.", price:24000, cat:"Makanan", icon:"🍜", tag:"Pedas"},
  {id:4, name:"Ayam Katsu Curry", desc:"Katsu renyah dengan saus kari Jepang yang gurih.", price:28000, cat:"Makanan", icon:"🍛"},
  {id:5, name:"Kopi Susu Gula Aren", desc:"Espresso, susu segar, dan gula aren asli. Signature Muga.", price:18000, cat:"Minuman", icon:"☕", tag:"Signature"},
  {id:6, name:"Cappuccino", desc:"Espresso dengan foam susu lembut dan taburan cokelat.", price:20000, cat:"Minuman", icon:"🥛"},
  {id:7, name:"Es Teh Manis", desc:"Teh melati segar disajikan dingin dengan es batu.", price:8000, cat:"Minuman", icon:"🧋"},
  {id:8, name:"Matcha Latte", desc:"Matcha premium dipadukan susu segar yang creamy.", price:22000, cat:"Minuman", icon:"🍵"},
  {id:9, name:"Kentang Goreng", desc:"Kentang goreng renyah dengan bumbu spesial.", price:15000, cat:"Snack", icon:"🍟"},
  {id:10, name:"Roti Bakar Coklat", desc:"Roti bakar lembut dengan lelehan cokelat melimpah.", price:17000, cat:"Snack", icon:"🍞"},
  {id:11, name:"Tiramisu", desc:"Dessert kopi klasik dengan mascarpone lembut.", price:26000, cat:"Dessert", icon:"🍰"},
  {id:12, name:"Cheesecake", desc:"Cheesecake lembut dengan saus stroberi segar.", price:28000, cat:"Dessert", icon:"🧀"},
  {id:13, name:"Paket Berdua Hemat", desc:"2 Kopi Susu + 2 Nasi Goreng + Kentang Goreng.", price:65000, cat:"Promo", icon:"🔥", tag:"Hemat"}
];
const CATS = ["Semua","Makanan","Minuman","Snack","Dessert","Promo"];
const STATUS_FLOW = ["Pesanan Diterima","Sedang Diproses","Pesanan Siap","Pesanan Diantar","Selesai"];
const STATUS_BADGE = {new:"Pesanan Baru",process:"Diproses",ready:"Siap",deliver:"Diantar",done:"Selesai"};
const NEXT_STATUS = {new:"process",process:"ready",ready:"deliver",deliver:"done",done:"done"};
const NEXT_LABEL = {new:"Terima & Proses Pesanan →",process:"Pesanan Siap →",ready:"Pesanan Diantar →",deliver:"Pesanan Selesai ✓",done:"Selesai ✓"};

let activeCat = "Semua";
let cart = []; // {id, qty, note}
let currentMeja = 12;
let currentOrder = null;
let detailId = null, detailQty = 1;
let activeAdminOrderId = null;
let payFilter = "Semua";

// Seed order kasir: 8 baru, 5 diproses, 3 siap, 25 selesai (41 total)
function seedOrders(){
  const base = [
    {id:"0012", meja:12, items:[{n:"Nasi Goreng Spesial",q:2},{n:"Es Teh Manis",q:2},{n:"Kentang Goreng",q:1}], total:75000, status:"new", time:"10.42", pay:"Menunggu", method:"Tunai"},
    {id:"0011", meja:7, items:[{n:"Kopi Susu Gula Aren",q:2},{n:"Tiramisu",q:1}], total:62000, status:"new", time:"10.39", pay:"Menunggu", method:"QRIS"},
    {id:"0013", meja:3, items:[{n:"Ayam Geprek",q:1},{n:"Es Teh Manis",q:2}], total:38000, status:"new", time:"10.44", pay:"Menunggu", method:"Tunai"},
    {id:"0010", meja:8, items:[{n:"Mie Pedas Manis",q:1},{n:"Kopi Susu Gula Aren",q:1}], total:42000, status:"process", time:"10.31", pay:"Diproses", method:"E-Wallet"},
    {id:"0009", meja:5, items:[{n:"Ayam Geprek",q:1},{n:"Matcha Latte",q:1}], total:44000, status:"ready", time:"10.22", pay:"Berhasil", method:"QRIS"},
    {id:"0008", meja:3, items:[{n:"Cappuccino",q:2},{n:"Cheesecake",q:1}], total:68000, status:"done", time:"09.58", pay:"Berhasil", method:"Tunai"}
  ];
  const orders = [...base];
  const need = {new:8, process:5, ready:3, done:25};
  const count = s => orders.filter(o=>o.status===s).length;
  let n = 100;
  ["new","process","ready","done"].forEach(s=>{
    while(count(s) < need[s]){
      orders.push({id:String(n++).padStart(4,"0"), meja:(n%15)+1, items:[{n:MENUS[n%MENUS.length].name,q:1},{n:MENUS[(n+3)%MENUS.length].name,q:1}], total:30000+(n%5)*5000, status:s, time:"0"+(8+(n%2))+"."+(10+(n%45)), pay:s==="done"?"Berhasil":(s==="new"?"Menunggu":"Diproses"), method:["Tunai","QRIS","E-Wallet","Transfer"][n%4]});
    }
  });
  return orders;
}
let orders = seedOrders();

const $ = id => document.getElementById(id);
const rp = n => "Rp" + Number(n||0).toLocaleString("id-ID");
function toast(msg){ const t=$("toast"); t.textContent=msg; t.classList.add("show"); clearTimeout(t._x); t._x=setTimeout(()=>t.classList.remove("show"),2600); }

/* ---------- Meja / QR entry ---------- */
(function initMeja(){
  const p = new URLSearchParams(location.search);
  const m = parseInt(p.get("meja")||p.get("table")||p.get("mejaId")||"12",10);
  if(!isNaN(m)) currentMeja = Math.min(30,Math.max(1,m));
  $("demoMejaInput").value = currentMeja;
  syncMeja();
})();
function syncMeja(){
  document.querySelectorAll(".meja-num").forEach(el=>el.textContent=currentMeja);
  const d=$("demoMejaInput"); if(d) d.value=currentMeja;
}
function applyMeja(){
  const v = parseInt($("demoMejaInput").value||"12",10);
  currentMeja = isNaN(v)?12:Math.min(30,Math.max(1,v));
  syncMeja(); if(currentOrder) currentOrder.meja=currentMeja;
  toast("✅ Meja terdeteksi: Meja "+currentMeja+" (dari QR Code)");
}

/* ---------- Mode pelanggan / kasir ---------- */
function setMode(mode){
  const cust = mode==="customer";
  $("customerApp").hidden = !cust;
  $("adminApp").hidden = cust;
  $("modeCustomerBtn").classList.toggle("active",cust);
  $("modeAdminBtn").classList.toggle("active",!cust);
  if(!cust){ renderAdminAll(); }
  window.scrollTo({top:0,behavior:"smooth"});
}

/* ---------- Navigasi pelanggan ---------- */
function showView(name){
  document.querySelectorAll("#customerApp .view").forEach(v=>v.classList.remove("active"));
  const el = $(name+"View"); if(el) el.classList.add("active");
  document.querySelectorAll(".bottom-nav .nav-item").forEach(b=>b.classList.toggle("active",b.dataset.nav===name||(name==="payment"&&b.dataset.nav==="status")||(name==="success"&&b.dataset.nav==="status")));
  if(name==="status") renderStatus();
  if(name==="cart") renderCart();
  if(name==="payment") renderPayment();
  window.scrollTo({top:0,behavior:"smooth"});
}

/* ---------- Menu ---------- */
function renderCats(){
  $("catChips").innerHTML = CATS.map(c=>`<button type="button" class="chip ${c===activeCat?"active":""}" onclick="setCat('${c}')">${c}</button>`).join("");
}
function setCat(c){ activeCat=c; renderCats(); renderMenus(); }
function renderMenus(){
  const q = ($("searchInput").value||"").toLowerCase();
  const list = MENUS.filter(m=>(activeCat==="Semua"||m.cat===activeCat)&&(m.name.toLowerCase().includes(q)||m.desc.toLowerCase().includes(q)));
  $("menuCount").textContent = list.length+" menu";
  $("menuGrid").innerHTML = list.length ? list.map(m=>`
    <article class="menu-card">
      <div class="menu-visual"><span class="menu-cat">${m.cat}</span>${m.tag?`<span class="menu-promo">${m.tag}</span>`:""}${m.icon}</div>
      <div class="menu-body"><h3>${m.name}</h3><p>${m.desc}</p><span class="price">${rp(m.price)}</span>
      <div class="menu-actions"><button type="button" class="btn btn-outline" onclick="openDetail(${m.id})">Detail</button><button type="button" class="btn btn-primary add-btn" aria-label="Tambah ${m.name}" onclick="addToCart(${m.id},1,'')">+</button><button type="button" class="btn btn-primary" onclick="addToCart(${m.id},1,'')">Tambah ke Keranjang</button></div></div>
    </article>`).join("")
  : `<div class="empty-state"><div class="empty-icon">🔍</div><h3>Menu tidak ditemukan</h3><p class="muted">Coba kata kunci atau kategori lain.</p></div>`;
}

/* ---------- Detail menu ---------- */
function openDetail(id){ detailId=id; detailQty=1; const m=MENUS.find(x=>x.id===id); $("detailVisual").textContent=m.icon; $("detailName").textContent=m.name; $("detailPrice").textContent=rp(m.price); $("detailDesc").textContent=m.desc; $("detailQty").textContent="1"; $("detailNote").value=""; $("detailModal").hidden=false; }
function closeDetail(){ $("detailModal").hidden=true; }
function changeDetailQty(d){ detailQty=Math.max(1,detailQty+d); $("detailQty").textContent=detailQty; }
function addFromDetail(){ addToCart(detailId,detailQty,$("detailNote").value.trim()); closeDetail(); }

/* ---------- Keranjang ---------- */
function addToCart(id,qty,note){
  const ex = cart.find(c=>c.id===id && c.note===note);
  if(ex) ex.qty+=qty; else cart.push({id,qty,note});
  updateCartBadge(); toast("🛒 Ditambahkan ke keranjang");
  renderCart();
}
function updateCartBadge(){
  const n = cart.reduce((a,c)=>a+c.qty,0);
  const b=$("cartCount"); b.textContent=n; b.hidden = n===0;
}
function cartTotals(){
  const sub = cart.reduce((a,c)=>{ const m=MENUS.find(x=>x.id===c.id); return a+(m?m.price*c.qty:0); },0);
  const fee = Math.round(sub*0.05);
  return {sub,fee,total:sub+fee};
}
function renderCart(){
  const empty = cart.length===0;
  $("emptyCart").hidden = !empty; $("cartWrap").hidden = empty;
  if(empty) return;
  $("cartList").innerHTML = cart.map((c,i)=>{
    const m=MENUS.find(x=>x.id===c.id); if(!m) return "";
    return `<div class="cart-item"><div class="cart-thumb">${m.icon}</div>
      <div class="cart-info"><b>${m.name}</b><small>${rp(m.price)}${c.note?" · “"+c.note+"”":""}</small></div>
      <div class="cart-controls"><button type="button" class="qty-btn" onclick="cartQty(${i},-1)">−</button><b>${c.qty}</b><button type="button" class="qty-btn" onclick="cartQty(${i},1)">+</button><button type="button" class="remove-btn" aria-label="Hapus" onclick="cartQty(${i},-999)">🗑️</button></div></div>`;
  }).join("");
  const t=cartTotals();
  $("subtotal").textContent=rp(t.sub); $("serviceFee").textContent=rp(t.fee); $("totalPay").textContent=rp(t.total);
}
function cartQty(i,d){ if(d===-999){ cart.splice(i,1); } else { cart[i].qty+=d; if(cart[i].qty<=0) cart.splice(i,1); } updateCartBadge(); renderCart(); }

/* ---------- Konfirmasi & pesanan ---------- */
function openConfirm(){
  if(!cart.length) return toast("Keranjang kosong");
  const t=cartTotals();
  $("confirmText").textContent = cart.length+" jenis menu · Total "+rp(t.total)+" · Meja "+currentMeja+". Pesanan akan langsung masuk ke dashboard kasir.";
  $("confirmModal").hidden=false;
}
function closeConfirm(){ $("confirmModal").hidden=true; }
function confirmOrder(){
  closeConfirm();
  const t=cartTotals();
  const num = String(12+orders.length).padStart(4,"0");
  currentOrder = {id:num, meja:currentMeja, items:cart.map(c=>{const m=MENUS.find(x=>x.id===c.id);return {n:m.name,q:c.qty,note:c.note};}), total:t.total, status:"new", step:0, note:$("globalNote").value.trim(), pay:"Menunggu", method:"Tunai", time:new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"})};
  orders.unshift({...currentOrder, status:"new"});
  cart=[]; updateCartBadge(); renderCart();
  toast("✅ Pesanan #"+num+" terkirim ke kasir!");
  showView("status");
}
function simulateAdvance(){
  if(!currentOrder) return;
  if(currentOrder.step>=4) return toast("Pesanan sudah Selesai ✓");
  currentOrder.step++;
  const map=["new","process","ready","deliver","done"];
  currentOrder.status=map[currentOrder.step];
  const o=orders.find(x=>x.id===currentOrder.id); if(o) o.status=currentOrder.status;
  toast("📦 Status diperbarui: "+STATUS_FLOW[currentOrder.step]);
  renderStatus(); renderAdminAll();
}
function renderStatus(){
  const has = !!currentOrder;
  $("noOrder").hidden=has; $("orderWrap").hidden=!has;
  if(!has) return;
  $("orderNumber").textContent="Pesanan #"+currentOrder.id;
  $("statusEta").textContent = currentOrder.step>=4?"Selesai":(currentOrder.step>=2?"5 menit":"5–10 menit");
  const bannerMsgs = ["✅ Pesanan #"+currentOrder.id+" sudah siap!","🚚 Pesanan Anda sedang diantar ke Meja "+currentMeja+".","🎉 Pesanan selesai. Terima kasih!"];
  $("statusBannerText").textContent = currentOrder.step>=4?bannerMsgs[2]:(currentOrder.step===3?bannerMsgs[1]:(currentOrder.step===2?bannerMsgs[0]:STATUS_FLOW[currentOrder.step]));
  $("statusTimeline").innerHTML = STATUS_FLOW.map((s,i)=>`<li class="${i<currentOrder.step?"done":(i===currentOrder.step?"current":"")}"><span class="t-dot">${i<currentOrder.step?"✓":(i+1)}</span><div class="t-body"><b>${s}</b><small>${i===0?"Pesanan diterima kasir":i===1?"Dapur mulai menyiapkan":i===2?"Pesanan siap diambil/diantar":i===3?"Diantar ke meja Anda":"Pesanan selesai dinikmati"}</small></div></li>`).join("");
  $("statusItems").innerHTML = currentOrder.items.map(it=>`<div class="row"><span>${it.n} × ${it.q}${it.note?` <small>· ${it.note}</small>`:""}</span><b>${rp((MENUS.find(m=>m.name===it.n)?.price||0)*it.q)}</b></div>`).join("");
  $("statusTotal").textContent=rp(currentOrder.total);
  $("statusNote").textContent = currentOrder.note?("Catatan: "+currentOrder.note):"";
}

/* ---------- Pembayaran ---------- */
function renderPayment(){
  const total = currentOrder?currentOrder.total:cartTotals().total;
  $("payTotal").textContent=rp(total); $("payBtnTotal").textContent=rp(total);
  $("payOrderInfo").textContent = currentOrder?("#"+currentOrder.id):"–";
  updatePayInfo();
}
function updatePayInfo(){
  const v=document.querySelector('input[name="pay"]:checked');
  const digital = v && v.value!=="Tunai";
  $("cashInfo").hidden=digital; $("digitalInfo").hidden=!digital;
}
document.querySelectorAll('input[name="pay"]').forEach(r=>r.addEventListener("change",updatePayInfo));
function processPayment(btnEl){
  const v=document.querySelector('input[name="pay"]:checked');
  const method=v?v.value:"Tunai";
  const btn=btnEl||$("payBtn"); const oldText=btn.innerHTML; btn.innerHTML="Memproses…"; btn.disabled=true;
  setTimeout(()=>{
    btn.disabled=false; btn.innerHTML=oldText;
    const total = currentOrder?currentOrder.total:cartTotals().total;
    const trx="TRX-"+Date.now().toString().slice(-6);
    const now=new Date();
    if(currentOrder){ currentOrder.pay="Berhasil"; currentOrder.method=method; const o=orders.find(x=>x.id===currentOrder.id); if(o){o.pay="Berhasil";o.method=method;} }
    $("successDetails").innerHTML=`<div class="row"><span>Nomor transaksi</span><b>${trx}</b></div><div class="row"><span>Nomor meja</span><b>Meja ${currentMeja}</b></div><div class="row"><span>Total pembayaran</span><b>${rp(total)}</b></div><div class="row"><span>Metode</span><b>${method}</b></div><div class="row"><span>Waktu transaksi</span><b>${now.toLocaleTimeString("id-ID")}</b></div><div class="row"><span>Status</span><span class="badge badge-done">Pembayaran Berhasil</span></div><h4 style="margin-top:12px">Detail pesanan</h4>${currentOrder?currentOrder.items.map(it=>`<div class="row"><span>${it.n} × ${it.q}</span><span>—</span></div>`).join(""):"—"}`;
    renderPayment(); renderAdminAll();
    showView("success");
  },1200);
}

/* ---------- AI Customer Service ---------- */
function toggleAI(){ $("aiPanel").hidden=!$("aiPanel").hidden; if(!$("aiPanel").hidden) $("aiInput").focus(); }
function aiBubble(cls,text){ const d=document.createElement("div"); d.className="ai-bubble "+cls; d.textContent=text; $("aiMessages").appendChild(d); $("aiMessages").scrollTop=$("aiMessages").scrollHeight; }
function aiAsk(q){ aiBubble("user",q); setTimeout(()=>aiBubble("ai",aiReply(q)),350); }
function sendAI(e){ e.preventDefault(); const q=$("aiInput").value.trim(); if(!q) return false; aiBubble("user",q); $("aiInput").value=""; setTimeout(()=>aiBubble("ai",aiReply(q)),450); return false; }
function aiReply(q){
  const s=q.toLowerCase();
  if(s.includes("pedas")) return "Kalau Anda suka makanan pedas, kami merekomendasikan Ayam Geprek 🌶️ (Rp22.000) dan Mie Pedas Manis 🍜 (Rp24.000). Level pedasnya bisa diatur di catatan pesanan, ya!";
  if(s.includes("terlaris")||s.includes("best")||s.includes("favorit")) return "Menu terlaris hari ini: 1) Nasi Goreng Spesial 🍳 (32×), 2) Kopi Susu Gula Aren ☕ (28×), 3) Ayam Geprek 🌶️ (19×). Mau saya bantu tambahkan ke keranjang?";
  if(s.includes("harga")||s.includes("berapa")||s.includes("mahal")) return "Harga mulai dari Rp8.000 (Es Teh) hingga Rp65.000 (Paket Berdua Hemat). Semua harga sudah tertera di kartu menu, sudah termasuk rasa enak 😊";
  if(s.includes("status")||s.includes("pesanan saya")||s.includes("di mana")) return currentOrder?("Status pesanan #"+currentOrder.id+" Anda saat ini: "+STATUS_FLOW[currentOrder.step]+" · Meja "+currentMeja+". Detail lengkapnya ada di tab Status 📦"):"Anda belum memiliki pesanan aktif. Silakan pilih menu dulu, ya!";
  if(s.includes("bayar")||s.includes("pembayaran")||s.includes("qris")||s.includes("tunai")) return "Pembayaran bisa Tunai di kasir, QRIS, E-Wallet (GoPay/OVO/DANA), atau Transfer Bank. Pilih metodenya di halaman pembayaran — statusnya otomatis diperbarui 💳";
  if(s.includes("jam")||s.includes("buka")||s.includes("operasional")) return "Kami buka Senin–Jumat 09.00–22.00 dan Sabtu–Minggu 08.00–23.00. Lokasi: Jl. Kenangan No. 12 🕐";
  if(s.includes("promo")||s.includes("diskon")||s.includes("voucher")) return "Promo hari ini: Beli 1 Kopi Susu gratis 1 Es Teh via QR ☕. Member juga dapat diskon 15% setiap Senin — membership bersifat opsional, tetap bisa pesan tanpa login!";
  if(s.includes("kopi")||s.includes("minum")) return "Untuk minuman, signature kami Kopi Susu Gula Aren (Rp18.000) ☕, lalu ada Cappuccino, Matcha Latte, dan Es Teh. Semua bisa dilihat di kategori Minuman.";
  if(s.includes("halo")||s.includes("hai")||s.includes("pagi")||s.includes("siang")) return "Halo! Selamat datang di Muga Coffee ☕ Ada yang bisa saya bantu — rekomendasi menu, info harga, status pesanan, atau cara pembayaran?";
  return "Siap! Saya bisa bantu memilih menu, menjelaskan menu & harga, memberi rekomendasi, mengecek status pesanan, dan membantu cara pembayaran. Coba tanya: “Menu pedas apa saja?” atau “Bagaimana cara bayar?”";
}

/* ---------- Admin ---------- */
const ADMIN_TITLES={dashboard:"Dashboard",orders:"Pesanan",menu:"Menu Management",payment:"Payment Management",report:"Laporan Transaksi",member:"Membership Management",ai:"AI Customer Service Management",settings:"Pengaturan"};
function showAdmin(page){
  document.querySelectorAll(".admin-page").forEach(p=>p.classList.remove("active"));
  $("admin-"+page).classList.add("active");
  document.querySelectorAll(".admin-link").forEach(b=>b.classList.toggle("active",b.dataset.admin===page));
  $("adminTitle").textContent=ADMIN_TITLES[page]||"Dashboard";
  renderAdminAll();
}
function renderAdminAll(){ renderStats(); renderKanban(); renderRecentOrders(); renderMenuTable(); renderPayments(); renderMembers(); renderReport(); }
function renderStats(){
  $("statNew").textContent=orders.filter(o=>o.status==="new").length;
  $("statProcess").textContent=orders.filter(o=>o.status==="process").length;
  $("statReady").textContent=orders.filter(o=>o.status==="ready").length;
  $("statDone").textContent=orders.filter(o=>o.status==="done").length;
  $("adminDate").textContent=new Date().toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"})+" · "+new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"});
}
function statusBadge(s){ const map={new:"badge-wait",process:"badge-process",ready:"badge-ready",deliver:"badge-process",done:"badge-done"}; return `<span class="badge ${map[s]||"badge-wait"}">${STATUS_BADGE[s]||s}</span>`; }
function renderKanban(){
  const cols={new:"colNew",process:"colProcess",ready:"colReady",deliver:"colDeliver",done:"colDone"};
  Object.entries(cols).forEach(([st,id])=>{
    const list=orders.filter(o=>o.status===st);
    $(id).innerHTML = list.length?list.slice(0,12).map(o=>`<button type="button" class="kanban-card" onclick="openAdminOrder('${o.id}')"><span class="meja-big">MEJA ${o.meja}</span><br><b>Pesanan #${o.id}</b> · ${o.time}<ul>${o.items.map(it=>`<li>${it.n} × ${it.q}</li>`).join("")}</ul><b>${rp(o.total)}</b></button>`).join(""):`<p class="muted" style="font-size:13px">Tidak ada pesanan</p>`;
  });
}
function renderRecentOrders(){
  $("recentOrders").innerHTML = orders.slice(0,5).map(o=>`<div class="order-row" onclick="openAdminOrder('${o.id}')"><span><b>#${o.id}</b> · MEJA ${o.meja} · ${o.items.map(i=>i.n+" ×"+i.q).join(", ")}</span><span>${statusBadge(o.status)} <b>${rp(o.total)}</b></span></div>`).join("");
}
function openAdminOrder(id){
  const o=orders.find(x=>x.id===id); if(!o) return;
  activeAdminOrderId=id;
  $("admOrderTitle").textContent="Pesanan #"+o.id; $("admOrderMeja").textContent=o.meja; const stEl=$("admOrderStatus"); if(stEl){ stEl.textContent=STATUS_BADGE[o.status]||o.status; stEl.className="badge "+({new:"badge-wait",process:"badge-process",ready:"badge-ready",deliver:"badge-process",done:"badge-done"}[o.status]||"badge-wait"); }
  $("admOrderItems").innerHTML=o.items.map(it=>`<div class="row"><span>${it.n} × ${it.q}</span><span>—</span></div>`).join("");
  $("admOrderTotal").textContent=rp(o.total);
  $("admAdvanceBtn").textContent=NEXT_LABEL[o.status];
  $("adminOrderModal").hidden=false;
}
function advanceAdminOrder(){
  const o=orders.find(x=>x.id===activeAdminOrderId); if(!o) return;
  o.status=NEXT_STATUS[o.status];
  if(currentOrder && currentOrder.id===o.id){ const map={new:0,process:1,ready:2,deliver:3,done:4}; currentOrder.step=map[o.status]; currentOrder.status=o.status; }
  toast("Pesanan #"+o.id+" → "+STATUS_BADGE[o.status]);
  openAdminOrder(o.id); renderAdminAll(); renderStatus();
}
function renderMenuTable(){
  $("menuTableBody").innerHTML=MENUS.map(m=>`<tr><td>${m.icon} <b>${m.name}</b></td><td>${m.cat}</td><td>${rp(m.price)}</td><td><span class="badge badge-done" id="menuSt${m.id}">Aktif</span></td><td style="white-space:nowrap"><button type="button" class="btn btn-outline btn-sm" onclick="toggleMenu(${m.id},this)">Nonaktif</button> <button type="button" class="btn btn-ghost btn-sm" onclick="deleteMenu(${m.id})">🗑️</button></td></tr>`).join("");
}
function toggleMenu(id,btn){ const b=$("menuSt"+id); const on=b.textContent==="Aktif"; b.textContent=on?"Nonaktif":"Aktif"; b.className=on?"badge badge-fail":"badge badge-done"; btn.textContent=on?"Aktif":"Nonaktif"; toast(on?"Menu dinonaktifkan":"Menu diaktifkan"); }
function deleteMenu(id){ const i=MENUS.findIndex(m=>m.id===id); if(i>-1){ MENUS.splice(i,1); renderMenuTable(); renderMenus(); toast("Menu dihapus"); } }
function addMenu(e){ e.preventDefault(); const name=$("newMenuName").value.trim(), price=parseInt($("newMenuPrice").value,10), cat=$("newMenuCat").value; if(!name||isNaN(price)) return false; MENUS.push({id:Date.now(),name,desc:"Menu baru dari dashboard kasir.",price,cat,icon:"🍽️"}); renderMenuTable(); renderMenus(); e.target.reset(); toast("✅ Menu ditambahkan"); return false; }
function renderPayments(){
  const list=orders.filter(o=>payFilter==="Semua"||o.pay===payFilter);
  $("payTableBody").innerHTML=list.slice(0,20).map(o=>{ const cls=o.pay==="Berhasil"?"badge-done":(o.pay==="Gagal"?"badge-fail":"badge-wait"); return `<tr><td><b>TRX-#${o.id}</b><br><small>${o.time}</small></td><td>Meja ${o.meja}</td><td>${o.method}</td><td>${rp(o.total)}</td><td><span class="badge ${cls}">${o.pay}</span></td><td>${o.pay!=="Berhasil"?`<button type="button" class="btn btn-primary btn-sm" onclick="markPaid('${o.id}')">Tandai Berhasil</button>`:""}</td></tr>`; }).join("")||`<tr><td colspan="6">Tidak ada transaksi</td></tr>`;
}
function filterPayments(f,btn){ payFilter=f; document.querySelectorAll("#payFilterChips .chip").forEach(c=>c.classList.remove("active")); btn.classList.add("active"); renderPayments(); }
function markPaid(id){ const o=orders.find(x=>x.id===id); if(o){ o.pay="Berhasil"; if(currentOrder&&currentOrder.id===id) currentOrder.pay="Berhasil"; toast("💳 Pembayaran #"+id+" berhasil"); renderPayments(); } }
function renderReport(){
  const f=$("reportFilter").value;
  const data={today:["Rp2.450.000","87 Pesanan"],week:["Rp15.820.000","542 Pesanan"],month:["Rp62.400.000","2.104 Pesanan"],custom:["Rp1.240.000","43 Pesanan"]}[f]||["Rp2.450.000","87 Pesanan"];
  $("repIncome").textContent=data[0]; $("repOrders").textContent=data[1];
  const vals=[1200,1800,900,2100,1700,2400,2450];
  const labels=["Sen","Sel","Rab","Kam","Jum","Sab","Min"];
  const max=Math.max(...vals);
  $("chartBars").innerHTML=vals.map((v,i)=>`<div class="bar-wrap"><span class="bar-val">${(v/1000).toFixed(1).replace(".",",")}jt</span><div class="bar ${i===6?"today":""}" style="height:${Math.round(v/max*100)}%"></div><span class="bar-label">${labels[i]}</span></div>`).join("");
}
function exportReport(){
  const rows=[["Waktu","Pesanan","Pendapatan","Tunai","Digital"],["Hari ini",87,2450000,980000,1470000],["Kemarin",74,2010000,810000,1200000],["2 hari lalu",69,1870000,720000,1150000]];
  const csv=rows.map(r=>r.join(",")).join("\n");
  const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"})); a.download="laporan-muga-coffee.csv"; a.click();
  toast("⬇ Laporan diekspor (CSV)");
}
const MEMBERS=[{n:"Andi Pratama",lv:"Gold",p:1250,t:12,r:"Rp50rb",s:"Aktif"},{n:"Budi Santoso",lv:"Silver",p:640,t:6,r:"—",s:"Aktif"},{n:"Citra Lestari",lv:"Gold",p:2180,t:21,r:"Gratis dessert",s:"Aktif"},{n:"Dewi Anggraini",lv:"Bronze",p:180,t:3,r:"—",s:"Nonaktif"}];
function renderMembers(q=""){
  $("memberTableBody").innerHTML=MEMBERS.filter(m=>m.n.toLowerCase().includes(q.toLowerCase())).map(m=>`<tr><td><b>${m.n}</b></td><td>${m.lv}</td><td>${m.p.toLocaleString("id-ID")}</td><td>${m.t}×</td><td>${m.r}</td><td><span class="badge ${m.s==="Aktif"?"badge-done":"badge-fail"}">${m.s}</span></td></tr>`).join("");
}
function addFAQ(e){ e.preventDefault(); toast("✅ FAQ ditambahkan ke pengetahuan AI"); $("faqInput").value=""; return false; }
function saveSettings(e){ e.preventDefault(); toast("⚙️ Pengaturan disimpan"); return false; }

/* Init */
renderCats(); renderMenus(); renderCart(); updateCartBadge(); renderAdminAll();

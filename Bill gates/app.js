// ---- Başlangıç bakiye ----
const START_BALANCE = 100_000_000_000; // $100,000,000,000
let balance = START_BALANCE;

// ---- Ürünler
const products = [
  { id: "bigmac", name: "Big Mac", price: 2, mediaClass: "media-bigmac" },
  {
    id: "flipflops",
    name: "Parmak arası terlik",
    price: 3,
    mediaClass: "media-flipflops",
  },
  {
    id: "cocacola",
    name: "Coca-Cola Paketi",
    price: 5,
    mediaClass: "media-cocacola",
  },

  {
    id: "skyscraper",
    name: "Gökdelen",
    price: 850_000_000,
    mediaClass: "media-skyscraper",
  },
  {
    id: "cruise",
    name: "Yolcu Gemisi",
    price: 930_000_000,
    mediaClass: "media-cruise",
  },
  {
    id: "nba",
    name: "NBA Takımı",
    price: 2_120_000_000,
    mediaClass: "media-nba",
  },

  {
    id: "stardust",
    name: "Şişelenmiş Yıldız Tozu",
    price: 75_000,
    mediaClass: "media-stardust",
  },
  {
    id: "timecapsule",
    name: "Zaman Kapsülü (Kişisel)",
    price: 1_250_000,
    mediaClass: "media-timecapsule",
  },
  {
    id: "cloudvilla",
    name: "Bulut Üstü Villa",
    price: 48_000_000,
    mediaClass: "media-cloudvilla",
  },
  {
    id: "moonpass",
    name: "Ay Tatil Bileti (Gidiş-Dönüş)",
    price: 320_000_000,
    mediaClass: "media-moonpass",
  },
  {
    id: "aurora",
    name: "Kişisel Aurora Gösterisi",
    price: 900_000,
    mediaClass: "media-aurora",
  },
  {
    id: "quantumpen",
    name: "Kuantum Kalem",
    price: 12_000,
    mediaClass: "media-quantumpen",
  },
];

const owned = new Map();

const fmt = (n) => "$" + n.toLocaleString("en-US");

function updateBalanceUI() {
  document.getElementById("balanceText").textContent = `Bakiye: ${fmt(
    balance
  )}`;
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card";

    // Görsel alanı
    const media = document.createElement("div");
    media.className = `card-media ${p.mediaClass}`;

    const title = document.createElement("h3");
    title.textContent = p.name;

    const price = document.createElement("div");
    price.className = "price";
    price.textContent = `Fiyat: ${fmt(p.price)}`;

    const controls = document.createElement("div");
    controls.className = "controls";

    // Adet girişi
    const qtyWrap = document.createElement("div");
    qtyWrap.className = "qty";
    const qtyLabel = document.createElement("span");
    qtyLabel.textContent = "Adet:";
    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.min = "1";
    qtyInput.step = "1";
    qtyInput.value = "1";
    qtyInput.inputMode = "numeric";
    qtyWrap.appendChild(qtyLabel);
    qtyWrap.appendChild(qtyInput);

    // Butonlar
    const btns = document.createElement("div");
    btns.className = "btns";

    const buyBtn = document.createElement("button");
    buyBtn.className = "btn buy";
    buyBtn.textContent = "Buy";

    const sellBtn = document.createElement("button");
    sellBtn.className = "btn sell";
    sellBtn.textContent = "Sell";

    btns.appendChild(buyBtn);
    btns.appendChild(sellBtn);

    controls.appendChild(qtyWrap);
    controls.appendChild(btns);

    card.appendChild(media);
    card.appendChild(title);
    card.appendChild(price);
    card.appendChild(controls);

    grid.appendChild(card);

    function refreshButtons() {
      const countOwned = owned.get(p.id) || 0;
      const qty = Math.max(1, parseInt(qtyInput.value || "1", 10));
      const totalCost = p.price * qty;

      // Sell
      sellBtn.disabled = countOwned <= 0;

      // Buy
      buyBtn.disabled = totalCost > balance;
    }

    qtyInput.addEventListener("input", () => {
      if (qtyInput.value === "" || parseInt(qtyInput.value, 10) < 1) {
        qtyInput.value = "1";
      }
      refreshButtons();
    });

    buyBtn.addEventListener("click", () => {
      const qty = Math.max(1, parseInt(qtyInput.value || "1", 10));
      const totalCost = p.price * qty;
      if (totalCost > balance) return;

      // Satın alma
      balance -= totalCost;

      //  adet artar
      const prev = owned.get(p.id) || 0;
      owned.set(p.id, prev + qty);

      updateBalanceUI();
      refreshButtons();
      renderPurchased();
    });

    sellBtn.addEventListener("click", () => {
      const qty = Math.max(1, parseInt(qtyInput.value || "1", 10));
      const current = owned.get(p.id) || 0;
      if (current <= 0) return;

      const sellQty = Math.min(qty, current);
      const totalGain = p.price * sellQty;

      // Satış
      balance += totalGain;

      // adet azalır
      const next = current - sellQty;
      if (next > 0) owned.set(p.id, next);
      else owned.delete(p.id);

      updateBalanceUI();
      refreshButtons();
      renderPurchased();
    });

    refreshButtons();
  });
}

function renderPurchased() {
  const tbody = document.querySelector("#purchasedTable tbody");
  const wrap = document.getElementById("purchasedTableWrap");
  const empty = document.getElementById("emptyState");
  tbody.innerHTML = "";

  let grand = 0;
  products.forEach((p) => {
    const count = owned.get(p.id) || 0;
    if (count > 0) {
      const tr = document.createElement("tr");
      const tdName = document.createElement("td");
      const tdQty = document.createElement("td");
      const tdUnit = document.createElement("td");
      const tdTotal = document.createElement("td");

      tdName.textContent = p.name;
      tdQty.textContent = count.toLocaleString("tr-TR");
      tdUnit.textContent = fmt(p.price);
      const total = p.price * count;
      tdTotal.textContent = fmt(total);

      grand += total;

      tr.appendChild(tdName);
      tr.appendChild(tdQty);
      tr.appendChild(tdUnit);
      tr.appendChild(tdTotal);
      tbody.appendChild(tr);
    }
  });

  document.getElementById("grandTotal").textContent = fmt(grand);

  const hasAny = grand > 0;
  wrap.style.display = hasAny ? "block" : "none";
  empty.style.display = hasAny ? "none" : "block";
}

// ---- Başlat ----
updateBalanceUI();
renderProducts();
renderPurchased();

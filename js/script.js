
  document.addEventListener("DOMContentLoaded", function () {
    const coins = [
      { id: "bitcoin", symbol: "btc-price" },
      { id: "ethereum", symbol: "eth-price" },
      { id: "tether", symbol: "usdt-price" },
      { id: "ripple", symbol: "xrp-price" },
      { id: "solana", symbol: "sol-price" },
      { id: "cardano", symbol: "ada-price" },
      { id: "avalanche-2", symbol: "avax-price" },
      { id: "chainlink", symbol: "link-price" },
      { id: "polkadot", symbol: "dot-price" },
      { id: "binancecoin", symbol: "bnb-price" },
      { id: "tron", symbol: "trx-price" }
    ];

    const prices = {};
    const prevPrices = {};

    const coinItems = document.getElementById("coin-items");

    coins.forEach(coin => {
      const el = document.createElement("div");
      el.className = "coin-item";
      el.innerHTML = `<span class="coin-name">${coin.id.toUpperCase()}</span>
                      <span class="coin-price" id="${coin.symbol}">loading...</span>`;
      coinItems.appendChild(el);
    });

    // Clone isi coinItems ke coin-items-clone
    document.getElementById("coin-items-clone").innerHTML = coinItems.innerHTML;

    async function fetchPrices() {
      const ids = coins.map(c => c.id).join(",");
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
        const data = await res.json();

        coins.forEach(coin => {
          const price = data[coin.id]?.usd;
          if (price !== undefined) {
            prices[coin.id] = price;
            prevPrices[coin.id] = price; // seed previous price
            const els = document.querySelectorAll(`#${coin.symbol}`);
            els.forEach(el => {
              el.textContent = `$${price.toFixed(4)}`;
              el.classList.remove("green", "red");
            });
          }
        });
      } catch (err) {
        console.error("Error fetching prices:", err);
      }
    }

    function simulateLiveUpdate() {
      coins.forEach(coin => {
        const prev = prevPrices[coin.id];
        if (prev === undefined) return;

        // Simulate random ±0.1% change
        const change = 1 + (Math.random() * 0.002 - 0.001);
        const newPrice = prices[coin.id] * change;
        const els = document.querySelectorAll(`#${coin.symbol}`);

        els.forEach(el => {
          const currentText = `$${newPrice.toFixed(4)}`;
          el.textContent = currentText;

          if (newPrice > prev) {
            el.classList.add("green");
            el.classList.remove("red");
          } else if (newPrice < prev) {
            el.classList.add("red");
            el.classList.remove("green");
          }

          prevPrices[coin.id] = newPrice;
          prices[coin.id] = newPrice;
        });
      });
    }

    fetchPrices();
    setInterval(fetchPrices, 10000);
    setInterval(simulateLiveUpdate, 1000);
  });

  // ===== DROPDOWN CATEGORIES =====
document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector('.dropdown-toggle-custom');
  const dropdown = document.querySelector('.dropdown-content-custom');

  // Toggle saat tombol "Categories" diklik
  toggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Supaya klik ini tidak dianggap klik di luar
    dropdown.classList.toggle('show');
    toggle.classList.toggle('active');
  });

  // Tutup dropdown saat klik di luar area dropdown
  document.addEventListener('click', function (e) {
    if (!dropdown.contains(e.target) && !toggle.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });
});




document.addEventListener('DOMContentLoaded', function() {
  const btnLogin = document.getElementById('btnLoginModal');
  const komentarBaru = document.getElementById('tambah-komentar');
  const btnTambahKomentar = document.getElementById('btnTambahKomentar');
  const loginModal = document.getElementById('loginModal');
  const stars = document.querySelectorAll('.rating-stars .star');
  const btnKirim = document.getElementById('kirimKomentar');

  let rating = 0; // Untuk menyimpan rating yang dipilih

  btnLogin.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Tutup modal login
    const modalInstance = bootstrap.Modal.getInstance(loginModal);
    modalInstance.hide();

    // Tampilkan kolom komentar
    komentarBaru.classList.remove('d-none');
    btnTambahKomentar.classList.add('d-none');
  });

  // Handle klik pada bintang
  stars.forEach(function(star) {
    star.addEventListener('click', function() {
      rating = parseInt(this.getAttribute('data-value'));

      // Reset semua bintang
      stars.forEach(function(s) {
        s.classList.remove('selected');
      });

      // Kasih warna gold ke bintang yang dipilih dan sebelumnya
      for (let i = 0; i < rating; i++) {
        stars[i].classList.add('selected');
      }
    });
  });

  // Handle klik Kirim Komentar
  btnKirim.addEventListener('click', function() {
    if (rating === 0) {
      alert("Silakan pilih rating terlebih dahulu!");
      return;
    }

    alert("Komentar Berhasil Dikirim!\nRating Anda: " + rating + " Bintang 🌟");
  });
});



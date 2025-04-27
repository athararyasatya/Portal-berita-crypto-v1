let isFirstLoad = true;
let allData = [];
let renderedCount = 0;
const coinPerBatch = 20;

async function fetchData() {
  const loading = document.getElementById("loading-body");
  const tbody = document.getElementById("crypto-body");
  const loadMoreBtn = document.getElementById("load-more");

  if (isFirstLoad) {
    loading.style.display = "table-row-group";
    tbody.innerHTML = "";
    loadMoreBtn.style.display = "none"; // Sembunyikan tombol saat loading
  }

  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=1h,24h,7d'
    );
    const data = await response.json();

    loading.style.display = "none";

    if (isFirstLoad) {
      allData = data;
      renderedCount = 0; // reset hanya saat pertama kali load
      renderCoins();
      isFirstLoad = false;
    } else {
      // Kalau refresh data, update datanya aja tanpa reset renderedCount
      allData = data;
    }

  } catch (error) {
    console.error('Error fetching data:', error);
    if (isFirstLoad) {
      loading.innerHTML = `
        <tr>
          <td colspan="8" class="text-center text-danger">
            <div class="d-flex flex-column align-items-center">
              <p class="mb-2">Lagi loading nih sabar ya tunggu sekitar 30 detik paling lama 😢</p>
              <div class="spinner-border text-light mt-2" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </td>
        </tr>
      `;
    }
  }
}


function renderCoins() {
  const tbody = document.getElementById("crypto-body");
  const loadMoreBtn = document.getElementById("load-more");
  const scrollTopBtn = document.getElementById("scroll-top-btn");

  const nextBatch = allData.slice(renderedCount, renderedCount + coinPerBatch);

  nextBatch.forEach((coin, index) => {
    const row = document.createElement("tr");
    const number = renderedCount + index + 1; // Urutan yang benar
    row.innerHTML = generateRow(coin, number);
    tbody.appendChild(row);
  });

  renderedCount += nextBatch.length; // cukup 1x tambah

  // Tampilkan tombol More Coins kalau masih ada sisa data
  if (renderedCount < allData.length) {
    loadMoreBtn.style.display = "block";
  } else {
    loadMoreBtn.style.display = "none";
  }

  // Tampilkan tombol Scroll Top kalau lebih dari 60 coin
  if (renderedCount >= 60) {
    scrollTopBtn.style.display = "block";
  }
}


function generateRow(coin, number) {
  const getClass = (value) =>
    value > 0 ? "green arrow-up" : value < 0 ? "red arrow-down" : "";
  const format = (value) => `$${Number(value).toLocaleString()}`;

  return `
    <td>${number}</td>
    <td><img src="${coin.image}" width="20" style="text-align:left;"> ${coin.name} <span style="color:gray;">${coin.symbol.toUpperCase()}</span></td>
    <td class="price">${format(coin.current_price)}</td>
    <td class="change1h ${getClass(coin.price_change_percentage_1h_in_currency)}">${coin.price_change_percentage_1h_in_currency?.toFixed(1)}%</td>
    <td class="change24h ${getClass(coin.price_change_percentage_24h_in_currency)}">${coin.price_change_percentage_24h_in_currency?.toFixed(1)}%</td>
    <td class="change7d ${getClass(coin.price_change_percentage_7d_in_currency)}">${coin.price_change_percentage_7d_in_currency?.toFixed(1)}%</td>
    <td class="volume">${format(coin.total_volume)}</td>
    <td class="market-cap">${format(coin.market_cap)}</td>
  `;
}


// Simulasi update harga per detik
function simulateLiveUpdate() {
  const tbody = document.getElementById("crypto-body");
  if (!allData.length) return;

  Array.from(tbody.children).forEach((row, index) => {
    const coin = allData[index];
    if (!coin) return;

    const changeFactor = 1 + (Math.random() * 0.002 - 0.001);
    const newPrice = coin.current_price * changeFactor;
    const priceCell = row.querySelector(".price");

    animateNumber(priceCell, coin.current_price, newPrice);

    coin.current_price = newPrice;
  });
}

function animateNumber(el, start, end, duration = 500) {
  const range = end - start;
  let startTime = null;

  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const value = start + range * progress;
    el.textContent = `$${value.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })}`;
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };
  requestAnimationFrame(step);
}

// Scroll to top logic
const scrollTopBtn = document.getElementById("scroll-top-btn");
window.addEventListener("scroll", () => {
  if (window.scrollY > 500) {
    scrollTopBtn.style.display = "block";
  } else {
    scrollTopBtn.style.display = "none";
  }
});
scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Klik tombol More Coins
document.getElementById("load-more").addEventListener("click", renderCoins);

// Mulai Fetch
fetchData();
setInterval(fetchData, 10000); // Refresh data tiap 10 detik
setInterval(simulateLiveUpdate, 1000); // Update animasi tiap 1 detik

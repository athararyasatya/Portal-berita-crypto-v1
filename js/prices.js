
  async function fetchData() {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=1h,24h,7d'
    );
    const data = await response.json();
    const tbody = document.getElementById("crypto-body");
    tbody.innerHTML = "";

    data.forEach((coin, index) => {
      const getClass = (value) => value > 0 ? "green arrow-up" : (value < 0 ? "red arrow-down" : "");
      const format = (value) => `$${Number(value).toLocaleString()}`;

      tbody.innerHTML += `
        <tr>
          <td>${index + 1}</td>
          <td><img src="${coin.image}" width="20" style="vertical-align:middle; margin-right:5px;"> ${coin.name} <span style="color:gray;">${coin.symbol.toUpperCase()}</span></td>
          <td>${format(coin.current_price)}</td>
          <td class="${getClass(coin.price_change_percentage_1h_in_currency)}">${coin.price_change_percentage_1h_in_currency?.toFixed(1)}%</td>
          <td class="${getClass(coin.price_change_percentage_24h_in_currency)}">${coin.price_change_percentage_24h_in_currency?.toFixed(1)}%</td>
          <td class="${getClass(coin.price_change_percentage_7d_in_currency)}">${coin.price_change_percentage_7d_in_currency?.toFixed(1)}%</td>
          <td>${format(coin.total_volume)}</td>
          <td>${format(coin.market_cap)}</td>
        </tr>
      `;
    });
  }
  

  fetchData();
  setInterval(fetchData, 1000); // Update tiap 4 detik


  
const fetch = require('node-fetch');

const get_ticker = async (ticker, date) => {
  let minutos = Math.floor((parseInt(date.substr(11,2)) * 60 + parseInt(date.substr(14,2))) / 5);
  const url = `https://api.bittrex.com/v3/markets/${ticker}/candles/trade/minute_5/historical/${date.substr(0,4)}/${date.substr(5,2)}/${date.substr(8,2)}`
  const response = await fetch(url);
  const result = await response.json();
  return result[minutos];
}

module.exports = get_ticker;
const fetch = require('node-fetch');

/**
 * Get tiker from Bittrex
 * 
 * This routine obtains all the candles of the indicated date and for the indicated time periods (5 minutes)
 * 
 * More info: 
 * https://bittrex.github.io/api/v3#operation--markets--marketSymbol--candles--candleType---candleInterval--historical--year---month---day--get
 * 
 * @param {*} ticker 
 * @param {*} date 
 * @returns Candle data of the corresponding time slot with the requested date.
 */
const get_ticker = async (ticker, date) => {
  try {
    let minutes = Math.floor((parseInt(date.substr(11,2)) * 60 + parseInt(date.substr(14,2))) / 5);
    const url = `https://api.bittrex.com/v3/markets/${ticker}/candles/trade/minute_5/historical/${date.substr(0,4)}/${date.substr(5,2)}/${date.substr(8,2)}`
    const response = await fetch(url);
    const result = await response.json();
    return result[minutes];
  } catch (error) {
    throw error;    
  }
}

module.exports = get_ticker;
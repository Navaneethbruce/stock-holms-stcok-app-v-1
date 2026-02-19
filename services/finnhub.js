const axios = require("axios");
const API_KEY = "d5f7fu1r01qtf8imv400d5f7fu1r01qtf8imv40g";

async function getQuote(symbol) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;
  const res = await axios.get(url);
  return res.data;
}

module.exports = { getQuote };

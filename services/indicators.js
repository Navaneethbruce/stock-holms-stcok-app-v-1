function sma(data, p) {
  return data.slice(-p).reduce((a,b)=>a+b,0)/p;
}

function rsi(prices, period = 14) {
  let gains = 0, losses = 0;
  for (let i = prices.length - period; i < prices.length - 1; i++) {
    let diff = prices[i+1] - prices[i];
    diff > 0 ? gains += diff : losses -= diff;
  }
  const rs = gains / (losses || 1);
  return 100 - (100 / (1 + rs));
}

function ema(data, period) {
  const k = 2 / (period + 1);
  let ema = data[0];
  data.forEach(p => ema = p * k + ema * (1 - k));
  return ema;
}

function macd(data) {
  const macdLine = ema(data,12) - ema(data,26);
  const signal = ema([macdLine],9);
  return macdLine - signal;
}

function tradeSignal(prices, current, predicted) {
  const sma5 = sma(prices,5);
  const sma20 = sma(prices,20);
  const r = rsi(prices);
  const m = macd(prices);

  let signal = "HOLD";
  if (sma5 > sma20 && r < 70 && m > 0 && predicted > current) signal = "BUY";
  if (sma5 < sma20 && r > 30 && m < 0 && predicted < current) signal = "SELL";

  const stopLoss = (current * 0.97).toFixed(2);
  const takeProfit = (current * 1.05).toFixed(2);

  return { signal, rsi: r.toFixed(2), macd: m.toFixed(2), stopLoss, takeProfit };
}

module.exports = { tradeSignal };

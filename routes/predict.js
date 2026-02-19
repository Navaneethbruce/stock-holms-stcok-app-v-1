const express = require("express");
const { execFile } = require("child_process");
const path = require("path");
const { getQuote } = require("../services/finnhub");
const { tradeSignal } = require("../services/indicators");

const router = express.Router();

const PYTHON_PATH =
  "C:\\Users\\BRUCE\\AppData\\Local\\Programs\\Python\\Python310\\python.exe";

const SCRIPT_PATH = path.join(__dirname, "..", "ml", "predict.py");

/* GET predict page */
router.get("/", (req, res) => {
  if (!req.session.user) return res.redirect("/");
  res.render("predict");
});

/* POST prediction */
router.post("/", async (req, res) => {
  console.log("POST /predict hit");

  try {
    const symbol = req.body.stock;
    if (!symbol) {
      return res.render("predict", { error: "Stock symbol required" });
    }

    const quote = await getQuote(symbol);
    if (!quote || !quote.c) {
      return res.render("predict", { error: "Invalid stock symbol" });
    }

    // exactly 30 points
    const history = Array.from({ length: 30 }, (_, i) =>
      quote.c - (30 - i)
    );

    execFile(
      PYTHON_PATH,
      [SCRIPT_PATH, JSON.stringify(history)],
      { timeout: 30000 },
      (error, stdout, stderr) => {
        if (error) {
          console.error("Python exec error:", error);
          console.error("stderr:", stderr);
          return res.render("predict", {
            error: "Prediction engine failed"
          });
        }

        if (!stdout) {
          return res.render("predict", {
            error: "No output from model"
          });
        }

        let preds;
        try {
          preds = JSON.parse(stdout.trim());
        } catch (e) {
          console.error("JSON parse error:", stdout);
          return res.render("predict", {
            error: "Invalid prediction output"
          });
        }

        const predicted = preds[0];
        const info = tradeSignal(history, quote.c, predicted);

        return res.render("predict", {
          stock: symbol,
          current: quote.c.toFixed(2),
          prediction: predicted.toFixed(2),
          chartData: [...history, predicted],
          signal: info.signal,
          rsi: info.rsi,
          macd: info.macd,
          stopLoss: info.stopLoss,
          takeProfit: info.takeProfit
        });
      }
    );
  } catch (err) {
    console.error("Server error:", err);
    res.render("predict", { error: "Server error occurred" });
  }
});

module.exports = router;


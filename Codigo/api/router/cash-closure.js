const express = require("express");

const router = express.Router();

router.get("/daily-summary/:date", async (req, res) => {
  const { date } = req.params;

  const dailySummary = {
    payments: [
      { paymentMethod: "Dinheiro", amount: 1439.5 },
      { paymentMethod: "Pix", amount: 180.0 },
      { paymentMethod: "Qr pix", amount: 330.0 },
      { paymentMethod: "Débito", amount: 210.0 },
      { paymentMethod: "Credito", amount: 2200.0 },
      { paymentMethod: "Promissoria", amount: 720.0 },
    ],
    previousDayCashBalance: 0,
    moneyCounter: {
      BILL_2: {
        count: 0,
        total: 0,
      },
      BILL_5: {
        count: 0,
        total: 0,
      },
      BILL_10: {
        count: 0,
        total: 0,
      },
      BILL_20: {
        count: 0,
        total: 0,
      },
      BILL_50: {
        count: 0,
        total: 0,
      },
      BILL_100: {
        count: 0,
        total: 0,
      },
      BILL_200: {
        count: 0,
        total: 0,
      },
      COIN_1: {
        count: 0,
        total: 0,
      },
      COIN_5: {
        count: 0,
        total: 0,
      },
      COIN_10: {
        count: 0,
        total: 0,
      },
      COIN_25: {
        count: 0,
        total: 0,
      },
      COIN_50: {
        count: 0,
        total: 0,
      },
      COIN_1_REAL: {
        count: 0,
        total: 0,
      },
    },
    cashRegisterWithdrawal: 0,
    cashBalance: 0,
  };

  res.status(200).json(dailySummary);
});

router.post("/close-day", async (req, res) => {
  const { date, moneyCounter, cashRegisterWithdrawal } = req.body;

  if (!date || !moneyCounter || typeof cashRegisterWithdrawal !== "number") {
    res.status(400).json({ error: "Parâmetros obrigatórios não informados" });
    return;
  }

  const closeDate = {
    date,
    moneyCounter,
    cashRegisterWithdrawal,
  };

  res.status(204).end();
});

module.exports = router;

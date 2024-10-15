const express = require("express");
const cashClosureRepo = require("../repository/cash-closure-repository");

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
      bill2: {
        count: 0,
        total: 0,
      },
      bill5: {
        count: 0,
        total: 0,
      },
      bill10: {
        count: 0,
        total: 0,
      },
      bill20: {
        count: 0,
        total: 0,
      },
      bill50: {
        count: 0,
        total: 0,
      },
      bill100: {
        count: 0,
        total: 0,
      },
      bill200: {
        count: 0,
        total: 0,
      },
      coin1: {
        count: 0,
        total: 0,
      },
      coin5: {
        count: 0,
        total: 0,
      },
      coin10: {
        count: 0,
        total: 0,
      },
      coin25: {
        count: 0,
        total: 0,
      },
      coin50: {
        count: 0,
        total: 0,
      },
      coin1Real: {
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

  const cashClosure = {
    date,
    moneyCounter,
    cashRegisterWithdrawal,
  };

  let result;
  try {
    result = await cashClosureRepo.createCashClosure(cashClosure);
  } catch (error) {
    if (error.name === "CashAlreadyClosedError") {
      res.status(409).json({ error: error.message });
      return;
    }
    throw error;
  }

  const cashClosureBaseUrl = req.originalUrl.replace(/\/close-day.*/gi, "");
  res
    .header("Location", `${cashClosureBaseUrl}/daily-summary/${result.date}`)
    .status(201)
    .json(result);
});

module.exports = router;

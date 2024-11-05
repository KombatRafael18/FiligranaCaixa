const express = require("express");
const cashClosureRepo = require("../repository/cash-closure-repository");

const router = express.Router();

// TODO: Mover para um módulo de utilitários
function calculatePreviousDate(date) {
  const dateParts = date.split("-");
  const year = parseInt(dateParts[0]);
  const month = parseInt(dateParts[1]);
  const day = parseInt(dateParts[2]);

  const previousDateUTC = new Date(Date.UTC(year, month - 1, day));
  previousDateUTC.setUTCDate(previousDateUTC.getUTCDate() - 1);

  return previousDateUTC.toISOString().split("T")[0];
}

router.get("/daily-summary/:date", async (req, res) => {
  const { date } = req.params;

  // TODO: Ler do repositório de vendas quando estiver implementado
  const payments = [
    { paymentMethod: "Dinheiro", amount: 1439.5 },
    { paymentMethod: "Pix", amount: 180.0 },
    { paymentMethod: "Qr pix", amount: 330.0 },
    { paymentMethod: "Débito", amount: 210.0 },
    { paymentMethod: "Crédito", amount: 2200.0 },
    { paymentMethod: "Promissoria", amount: 720.0 },
  ];

  const previousDate = calculatePreviousDate(date);
  let previousDayCashBalance = await cashClosureRepo.getCashBalanceByDate(
    previousDate
  );

  // Pode não existir fechamento de caixa para a data anterior
  if (!previousDayCashBalance) {
    previousDayCashBalance = {
      date: previousDate,
      cashBalance: 0,
    };
  }

  let cashClosure = await cashClosureRepo.getCashClosureByDate(date);

  // Pode não existir fechamento de caixa para a data informada
  if (!cashClosure) {
    cashClosure = {
      id: null,
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
  }

  const dailySummary = {
    id: cashClosure.id,
    date,
    payments,
    previousDayCashBalance: {
      date: previousDayCashBalance.date,
      cashBalance: previousDayCashBalance.cashBalance,
    },
    moneyCounter: cashClosure.moneyCounter,
    cashRegisterWithdrawal: cashClosure.cashRegisterWithdrawal,
    cashBalance: cashClosure.cashBalance,
    cashAlreadyClosed: cashClosure.id !== null,
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

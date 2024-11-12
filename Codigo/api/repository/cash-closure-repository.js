const mysqlClient = require("./mysql-client");

const db = mysqlClient.pool;

/**
 * Retorna as vendas diárias por forma de pagamento
 * @param {string} date No formato 'YYYY-MM-DD'
 */
async function getDailySalesByPaymentType(date) {
  const sql = `
    SELECT
      PAYMENT_METHOD,
      SUM(TOTAL_AMOUNT) AS SUM_TOTAL_AMOUNT
    FROM SALES
    WHERE DATE(SALE_DATE) = ?
    GROUP BY PAYMENT_METHOD`;

  const [rows, fields] = await db.execute(sql, [date]);

  const result = rows.map((row) => ({
    paymentMethod: row.PAYMENT_METHOD,
    amount: parseFloat(row.SUM_TOTAL_AMOUNT),
  }));

  return result;
}

async function createCashClosure(cashClosure) {
  const query = `
    INSERT INTO CASH_CLOSURE (
      DATE,
      BILL_2_COUNT,
      BILL_5_COUNT,
      BILL_10_COUNT,
      BILL_20_COUNT,
      BILL_50_COUNT,
      BILL_100_COUNT,
      BILL_200_COUNT,
      COIN_1_COUNT,
      COIN_5_COUNT,
      COIN_10_COUNT,
      COIN_25_COUNT,
      COIN_50_COUNT,
      COIN_1_REAL_COUNT,
      CASH_REGISTER_WITHDRAWAL)
    VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    const [result, fields] = await db.execute(query, [
      cashClosure.date,
      cashClosure.moneyCounter.bill2.count,
      cashClosure.moneyCounter.bill5.count,
      cashClosure.moneyCounter.bill10.count,
      cashClosure.moneyCounter.bill20.count,
      cashClosure.moneyCounter.bill50.count,
      cashClosure.moneyCounter.bill100.count,
      cashClosure.moneyCounter.bill200.count,
      cashClosure.moneyCounter.coin1.count,
      cashClosure.moneyCounter.coin5.count,
      cashClosure.moneyCounter.coin10.count,
      cashClosure.moneyCounter.coin25.count,
      cashClosure.moneyCounter.coin50.count,
      cashClosure.moneyCounter.coin1Real.count,
      cashClosure.cashRegisterWithdrawal,
    ]);

    return {
      id: result.insertId,
      date: cashClosure.date,
    };
  } catch (error) {
    // TODO: Criar classe de erro
    const closureError = new Error("Caixa do dia já fechado");
    closureError.name = "CashAlreadyClosedError";
    throw closureError;
  }
}

async function getCashBalanceByDate(date) {
  const sql = `
    SELECT
      ((BILL_2_COUNT * 2) +
        (BILL_5_COUNT * 5) +
        (BILL_10_COUNT * 10) +
        (BILL_20_COUNT * 20) +
        (BILL_50_COUNT * 50) +
        (BILL_100_COUNT * 100) +
        (BILL_200_COUNT * 200) +
        (COIN_1_COUNT * 0.01) +
        (COIN_5_COUNT * 0.05) +
        (COIN_10_COUNT * 0.10) +
        (COIN_25_COUNT * 0.25) +
        (COIN_50_COUNT * 0.50) +
        (COIN_1_REAL_COUNT * 1)) - CASH_REGISTER_WITHDRAWAL AS CASH_BALANCE
    FROM CASH_CLOSURE
    WHERE DATE = ?`;

  const [rows, fields] = await db.execute(sql, [date]);
  const row = rows[0];
  if (!row) {
    return null;
  }

  return {
    date: date,
    cashBalance: parseFloat(row.CASH_BALANCE),
  };
}

async function getCashClosureByDate(date) {
  const sql = `
    SELECT
      ID,
      DATE,
      BILL_2_COUNT,
      BILL_2_COUNT * 2 AS BILL_2_TOTAL,
      BILL_5_COUNT,
      BILL_5_COUNT * 5 AS BILL_5_TOTAL,
      BILL_10_COUNT,
      BILL_10_COUNT * 10 AS BILL_10_TOTAL,
      BILL_20_COUNT,
      BILL_20_COUNT * 20 AS BILL_20_TOTAL,
      BILL_50_COUNT,
      BILL_50_COUNT * 50 AS BILL_50_TOTAL,
      BILL_100_COUNT,
      BILL_100_COUNT * 100 AS BILL_100_TOTAL,
      BILL_200_COUNT,
      BILL_200_COUNT * 200 AS BILL_200_TOTAL,
      COIN_1_COUNT,
      COIN_1_COUNT * 0.01 AS COIN_1_TOTAL,
      COIN_5_COUNT,
      COIN_5_COUNT * 0.05 AS COIN_5_TOTAL,
      COIN_10_COUNT,
      COIN_10_COUNT * 0.10 AS COIN_10_TOTAL,
      COIN_25_COUNT,
      COIN_25_COUNT * 0.25 AS COIN_25_TOTAL,
      COIN_50_COUNT,
      COIN_50_COUNT * 0.50 AS COIN_50_TOTAL,
      COIN_1_REAL_COUNT,
      COIN_1_REAL_COUNT * 1 AS COIN_1_REAL_TOTAL,
      CASH_REGISTER_WITHDRAWAL,
      ((BILL_2_COUNT * 2) +
        (BILL_5_COUNT * 5) +
        (BILL_10_COUNT * 10) +
        (BILL_20_COUNT * 20) +
        (BILL_50_COUNT * 50) +
        (BILL_100_COUNT * 100) +
        (BILL_200_COUNT * 200) +
        (COIN_1_COUNT * 0.01) +
        (COIN_5_COUNT * 0.05) +
        (COIN_10_COUNT * 0.10) +
        (COIN_25_COUNT * 0.25) +
        (COIN_50_COUNT * 0.50) +
        (COIN_1_REAL_COUNT * 1)) - CASH_REGISTER_WITHDRAWAL AS CASH_BALANCE
    FROM CASH_CLOSURE
    WHERE DATE = ?`;

  const [rows, fields] = await db.execute(sql, [date]);
  const row = rows[0];
  if (!row) {
    return null;
  }

  return {
    id: row.ID,
    date: row.DATE,
    moneyCounter: {
      bill2: {
        count: parseInt(row.BILL_2_COUNT),
        total: parseFloat(row.BILL_2_TOTAL),
      },
      bill5: {
        count: parseInt(row.BILL_5_COUNT),
        total: parseFloat(row.BILL_5_TOTAL),
      },
      bill10: {
        count: parseInt(row.BILL_10_COUNT),
        total: parseFloat(row.BILL_10_TOTAL),
      },
      bill20: {
        count: parseInt(row.BILL_20_COUNT),
        total: parseFloat(row.BILL_20_TOTAL),
      },
      bill50: {
        count: parseInt(row.BILL_50_COUNT),
        total: parseFloat(row.BILL_50_TOTAL),
      },
      bill100: {
        count: parseInt(row.BILL_100_COUNT),
        total: parseFloat(row.BILL_100_TOTAL),
      },
      bill200: {
        count: parseInt(row.BILL_200_COUNT),
        total: parseFloat(row.BILL_200_TOTAL),
      },
      coin1: {
        count: parseInt(row.COIN_1_COUNT),
        total: parseFloat(row.COIN_1_TOTAL),
      },
      coin5: {
        count: parseInt(row.COIN_5_COUNT),
        total: parseFloat(row.COIN_5_TOTAL),
      },
      coin10: {
        count: parseInt(row.COIN_10_COUNT),
        total: parseFloat(row.COIN_10_TOTAL),
      },
      coin25: {
        count: parseInt(row.COIN_25_COUNT),
        total: parseFloat(row.COIN_25_TOTAL),
      },
      coin50: {
        count: parseInt(row.COIN_50_COUNT),
        total: parseFloat(row.COIN_50_TOTAL),
      },
      coin1Real: {
        count: parseInt(row.COIN_1_REAL_COUNT),
        total: parseFloat(row.COIN_1_REAL_TOTAL),
      },
    },
    cashRegisterWithdrawal: parseFloat(row.CASH_REGISTER_WITHDRAWAL),
    cashBalance: parseFloat(row.CASH_BALANCE),
  };
}

module.exports = {
  getDailySalesByPaymentType,
  createCashClosure,
  getCashBalanceByDate,
  getCashClosureByDate,
};

const mysqlClient = require("./mysql-client");

const db = mysqlClient.pool;

async function createCashClosure(cashClosure) {
  const query = `INSERT INTO CASH_CLOSURE (
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

module.exports = {
  createCashClosure,
};

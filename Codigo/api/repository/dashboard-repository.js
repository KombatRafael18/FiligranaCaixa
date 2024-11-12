const mysqlClient = require("./mysql-client");

const db = mysqlClient.pool;

/**
 * @param {*} yearAndMonth ano e mês no formato YYYY-MM
 */
async function getMonthlySalesStatistics(yearAndMonth) {
  const sql = `
    SELECT
      DATE_FORMAT(SALE_DATE, '%Y-%m') AS YEAR_AND_MONTH,
      SALE_TYPE,
      PAYMENT_METHOD,
      COUNT(*) AS COUNT,
      SUM(TOTAL_AMOUNT) AS SUM_TOTAL_AMOUNT
    FROM SALES
    WHERE DATE_FORMAT(SALE_DATE, '%Y-%m') = ?
    GROUP BY
      DATE_FORMAT(SALE_DATE, '%Y-%m'),
      SALE_TYPE,
      PAYMENT_METHOD`;

  const [rows, fields] = await db.execute(sql, [yearAndMonth]);

  const totalSales = rows.reduce((acc, row) => acc + row.COUNT, 0);
  const totalSalesAmount = rows.reduce(
    (acc, row) => acc + parseFloat(row.SUM_TOTAL_AMOUNT),
    0
  );
  const averageTicket = totalSales === 0 ? 0 : totalSalesAmount / totalSales;

  const salesByTypeMap = rows.reduce((acc, row) => {
    const { SALE_TYPE, COUNT } = row;
    const currentCount = acc.get(SALE_TYPE) || 0;
    acc.set(SALE_TYPE, currentCount + COUNT);
    return acc;
  }, new Map());

  const salesByType = Array.from(
    salesByTypeMap.entries(),
    ([saleType, count]) => ({
      saleType,
      count,
    })
  );

  const salesByPaymentMethodMap = rows.reduce((acc, row) => {
    const { PAYMENT_METHOD, COUNT } = row;
    const currentCount = acc.get(PAYMENT_METHOD) || 0;
    acc.set(PAYMENT_METHOD, currentCount + COUNT);
    return acc;
  }, new Map());

  const salesByPaymentMethod = Array.from(
    salesByPaymentMethodMap.entries(),
    ([paymentMethod, count]) => ({
      paymentMethod,
      count,
    })
  );

  return {
    totalSales,
    totalSalesAmount,
    averageTicket,
    salesByType,
    salesByPaymentMethod,
  };
}

module.exports = {
  getMonthlySalesStatistics,
};

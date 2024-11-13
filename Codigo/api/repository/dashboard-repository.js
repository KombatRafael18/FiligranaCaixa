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

/**
 * @param {*} yearAndMonth ano e mês no formato YYYY-MM
 */
async function getSumOfSalesByDaysOfTheMonth(yearAndMonth) {
  const sql = `
    SELECT
      DATE(SALE_DATE) AS SALE_DATE_ONLY,
      SUM(TOTAL_AMOUNT) AS SUM_TOTAL_AMOUNT
    FROM SALES
    WHERE DATE_FORMAT(SALE_DATE, '%Y-%m') = ?
    GROUP BY SALE_DATE_ONLY`;

  const [rows, fields] = await db.execute(sql, [yearAndMonth]);

  const result = rows.map((row) => ({
    date: row.SALE_DATE_ONLY.toISOString().slice(0, 10),
    totalAmount: parseFloat(row.SUM_TOTAL_AMOUNT),
  }));

  return result;
}

/**
 * @param {*} year ano e mês no formato YYYY
 */
async function getYearlySalesStatistics(year) {
  const sql = `
    SELECT
      YEAR(SALE_DATE) AS SALE_YEAR,
      COUNT(*) AS COUNT,
      SUM(TOTAL_AMOUNT) AS SUM_TOTAL_AMOUNT
    FROM SALES
    WHERE YEAR(SALE_DATE) = ?
    GROUP BY SALE_YEAR`;

  const [rows, fields] = await db.execute(sql, [year]);

  if (rows.length === 0) {
    return {
      totalSales: 0,
      totalSalesAmount: 0,
    };
  }

  const row = rows[0];
  return {
    totalSales: row.COUNT,
    totalSalesAmount: parseFloat(row.SUM_TOTAL_AMOUNT),
  };
}

/**
 * @param {*} year ano e mês no formato YYYY
 */
async function getSumOfSalesByMonthsOfTheYear(year) {
  const sql = `
    SELECT
      DATE_FORMAT(SALE_DATE, '%Y-%m') AS SALE_MONTH,
      SUM(TOTAL_AMOUNT) AS SUM_TOTAL_AMOUNT
    FROM SALES
    WHERE YEAR(SALE_DATE) = ?
    GROUP BY SALE_MONTH`;

  const [rows, fields] = await db.execute(sql, [year]);

  const result = rows.map((row) => ({
    month: row.SALE_MONTH,
    totalAmount: parseFloat(row.SUM_TOTAL_AMOUNT),
  }));

  return result;
}

module.exports = {
  getMonthlySalesStatistics,
  getSumOfSalesByDaysOfTheMonth,
  getYearlySalesStatistics,
  getSumOfSalesByMonthsOfTheYear,
};

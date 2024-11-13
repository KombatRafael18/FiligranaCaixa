const express = require("express");
const cashClosureRepo = require("../repository/dashboard-repository");

const router = express.Router();

// TODO: Mover para um módulo de utilitários
function calculatePreviousMonth(date) {
  const dateParts = date.split("-");
  const year = parseInt(dateParts[0]);
  const month = parseInt(dateParts[1]);

  const previousDateUTC = new Date(Date.UTC(year, month - 1, 1));
  previousDateUTC.setUTCDate(previousDateUTC.getUTCDate() - 1);

  // Formato YYYY-MM
  return previousDateUTC.toISOString().slice(0, 7);
}

/**
 * Constrói a lista de vendas por dia do mês preenchendo os dias sem vendas com 0
 * @param {*} salesByDays Lista de vendas por dia
 * @param {*} yearAndMonth Formato YYYY-MM
 * @returns
 */
function buildSalesByDays(salesByDays, yearAndMonth) {
  const lastDayOfMonth = new Date(
    +yearAndMonth.slice(0, 4),
    +yearAndMonth.slice(5, 7),
    0
  );
  const daysInMonth = lastDayOfMonth.getDate();

  const salesByDaysMap = new Map(
    salesByDays.map((row) => [row.date, row.totalAmount])
  );

  const salesByDaysArray = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const date = `${yearAndMonth}-${day.toString().padStart(2, "0")}`;
    const totalAmount = salesByDaysMap.get(date) || 0;

    return {
      date,
      totalAmount,
    };
  });

  return salesByDaysArray;
}

/**
 * Constrói a lista de vendas por mês do ano preenchendo os meses sem vendas com 0
 * @param {*} salesByMonths Lista de vendas por mês
 * @param {*} year Formato YYYY
 * @returns
 */
function buildSalesByMonths(salesByMonths, year) {
  const salesByMonthsMap = new Map(
    salesByMonths.map((row) => [row.month, row.totalAmount])
  );

  const salesByMonthsArray = Array.from({ length: 12 }, (_, index) => {
    const monthNum = index + 1;
    const month = `${year}-${monthNum.toString().padStart(2, "0")}`;
    const totalAmount = salesByMonthsMap.get(month) || 0;

    return {
      month,
      totalAmount,
    };
  });

  return salesByMonthsArray;
}

router.get("/monthly-summary/:month", async (req, res) => {
  const { month: yearAndMonth } = req.params;

  const previousYearAndMonth = calculatePreviousMonth(yearAndMonth);

  const monthlySalesStatistics =
    await cashClosureRepo.getMonthlySalesStatistics(yearAndMonth);

  const sumOfSalesByDaysOfTheMonth =
    await cashClosureRepo.getSumOfSalesByDaysOfTheMonth(yearAndMonth);

  const previousMonthlySalesStatistics =
    await cashClosureRepo.getMonthlySalesStatistics(previousYearAndMonth);

  const comparisonLastMonth =
    monthlySalesStatistics.totalSalesAmount -
    previousMonthlySalesStatistics.totalSalesAmount;

  const salesByDays = buildSalesByDays(
    sumOfSalesByDaysOfTheMonth,
    yearAndMonth
  );

  res.status(200).json({
    yearAndMonth,
    previousYearAndMonth,

    totalSales: monthlySalesStatistics.totalSales,
    totalSalesAmount: monthlySalesStatistics.totalSalesAmount,
    averageTicket: monthlySalesStatistics.averageTicket,
    comparisonLastMonth,

    salesByDays,
    salesByType: monthlySalesStatistics.salesByType,
    salesByPaymentMethod: monthlySalesStatistics.salesByPaymentMethod,
  });
});

router.get("/annual-summary/:year", async (req, res) => {
  const { year } = req.params;

  const yearlySalesStatistics = await cashClosureRepo.getYearlySalesStatistics(
    year
  );

  const sumOfSalesByMonthsOfTheYear =
    await cashClosureRepo.getSumOfSalesByMonthsOfTheYear(year);

  const salesByMonths = buildSalesByMonths(sumOfSalesByMonthsOfTheYear, year);

  res.status(200).json({
    year,
    totalSales: yearlySalesStatistics.totalSales,
    totalSalesAmount: yearlySalesStatistics.totalSalesAmount,
    salesByMonths,
  });
});

module.exports = router;

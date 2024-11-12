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

router.get("/monthly-summary/:month", async (req, res) => {
  const { month: yearAndMonth } = req.params;

  const previousYearAndMonth = calculatePreviousMonth(yearAndMonth);

  const monthlySalesStatistics =
    await cashClosureRepo.getMonthlySalesStatistics(yearAndMonth);

  const previousMonthlySalesStatistics =
    await cashClosureRepo.getMonthlySalesStatistics(previousYearAndMonth);

  const comparisonLastMonth =
    monthlySalesStatistics.totalSalesAmount -
    previousMonthlySalesStatistics.totalSalesAmount;

  res.status(200).json({
    yearAndMonth,
    previousYearAndMonth,

    totalSales: monthlySalesStatistics.totalSales,
    totalSalesAmount: monthlySalesStatistics.totalSalesAmount,
    averageTicket: monthlySalesStatistics.averageTicket,
    comparisonLastMonth,

    salesByType: monthlySalesStatistics.salesByType,
    salesByPaymentMethod: monthlySalesStatistics.salesByPaymentMethod,
  });
});

module.exports = router;

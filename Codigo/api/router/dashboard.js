const express = require("express");
const cashClosureRepo = require("../repository/dashboard-repository");

const router = express.Router();

// FIXME: Apagar esses dados fake
function generateFakeSaleTypeData() {
  return [
    {
      saleType: "Varejo",
      count: Math.floor(Math.random() * 1000),
    },
    {
      saleType: "Atacado",
      count: Math.floor(Math.random() * 1000),
    },
  ];
}

// FIXME: Apagar esses dados fake
function generateFakePaymentMethodData() {
  return [
    {
      paymentMethod: "Crédito",
      count: Math.floor(Math.random() * 1000),
    },
    {
      paymentMethod: "Débito",
      count: Math.floor(Math.random() * 1000),
    },
    {
      paymentMethod: "Dinheiro",
      count: Math.floor(Math.random() * 1000),
    },
    {
      paymentMethod: "Pix",
      count: Math.floor(Math.random() * 1000),
    },
    {
      paymentMethod: "Promissoria",
      count: Math.floor(Math.random() * 1000),
    },
    {
      paymentMethod: "QR Pix",
      count: Math.floor(Math.random() * 1000),
    },
  ];
}

router.get("/monthly-summary/:month", async (req, res) => {
  const { month } = req.params;

  res.status(200).json({
    totalSales: 120,
    totalSalesAmount: 93,
    averageTicket: 50.12,
    comparisonLastMonth: -1.2,

    salesByType: generateFakeSaleTypeData(),
    salesByPaymentMethod: generateFakePaymentMethodData(),
  });
});

module.exports = router;

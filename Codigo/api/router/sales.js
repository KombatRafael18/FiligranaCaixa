const express = require("express");
const salesRepo = require("../repository/sales-repository");
const salesValidator = require("../validators/sales-validator");

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = salesValidator.CreateSale(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { clientId, totalAmount, saleType, paymentMethod } = req.body;
  const saleData = { clientId, totalAmount, saleType, paymentMethod };
  const result = await salesRepo.createSale(saleData);

  res.header("Location", req.originalUrl + "/" + result.id).status(201).json(result);
});

//Lista todas as vendas com filtros opcionais de Tipo de venda e/ou tipo de pagamento 
router.get("/", async (req, res) => {
  const { saleType, paymentMethod } = req.query;
  const sales = await salesRepo.getSales(saleType, paymentMethod);
  res.status(200).json(sales);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const sale = await salesRepo.getSaleById(id);

  if (!sale) {
    return res.status(404).json({ error: "Sale not found" });
  }

  res.status(200).json(sale);
});

router.put("/:id", async (req, res) => {
  const { error } = salesValidator.UpdateSale(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { id } = req.params;
  const saleData = req.body;

  try {
    await salesRepo.updateSale(id, saleData);
    res.status(204).end();
  } catch (error) {
    if (error.name === "SaleNotFoundError") {
      return res.status(404).json({ error: "Sale not found" });
    }
    throw error;
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await salesRepo.deleteSale(id);
    res.status(204).end();
  } catch (error) {
    if (error.name === "SaleNotFoundError") {
      return res.status(404).json({ error: "Sale not found" });
    }
    throw error;
  }
});

module.exports = router;

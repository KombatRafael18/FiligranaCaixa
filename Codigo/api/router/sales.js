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

router.post("/finalizar-compra", async (req, res) => {
  const { client_id, total_amount, sale_type, payment_method, sale_date, products } = req.body;
  const { error } = salesValidator.CreateSale(req.body);
  if (error) {
    console.log('erro no validator');
    return res.status(400).json({ error: error.details[0].message });
  }
  console.log('passou sem erro');
  
  const result = await salesRepo.createSale(client_id, total_amount, sale_type, payment_method, sale_date, products);
  console.log('chamei o create sale');
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

router.get("/cliente/:clientId", async (req, res) => {
  const { clientId } = req.params;
  try {
    const sales = await salesRepo.getSalesByClientId(clientId);
    if (sales.length === 0) {
      return res.status(404).json({ error: "No sales found for this client" });
    }

    for (const sale of sales) {
      const products = await salesRepo.getProductsBySaleId(sale.ID);
      sale.PRODUCTS = products || []; 
    }

    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while retrieving sales" });
  }
});

module.exports = router;

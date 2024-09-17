const express = require("express");
const productsRepo = require("../repository/products-repository");

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !description) {
    res.status(400).json({ error: "Parâmetros obrigatórios não informados" });
    return;
  }

  if ((price ?? null) === null || price < 0) {
    res.status(400).json({ error: "O preço deve ser um número positivo" });
    return;
  }

  const productCreate = {
    name,
    description,
    price,
  };

  const result = await productsRepo.createProduct(productCreate);

  res
    .header("Location", req.originalUrl + "/" + result.id)
    .status(201)
    .json(result);
});

router.get("/", async (req, res) => {
  const products = await productsRepo.getProducts();

  res.status(200).json(products);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const product = await productsRepo.getProductById(id);

  if (!product) {
    res.status(404).json({ error: "Produto não encontrado" });
    return;
  }

  res.status(200).json(product);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  if (!name || !description) {
    res.status(400).json({ error: "Parâmetros obrigatórios não informados" });
    return;
  }

  if ((price ?? null) === null || price < 0) {
    res.status(400).json({ error: "O preço deve ser um número positivo" });
    return;
  }

  const productUpdate = {
    name,
    description,
    price,
  };

  try {
    await productsRepo.updateProduct(id, productUpdate);
  } catch (error) {
    if (error.name === "ProductNotFoundError") {
      res.status(404).json({ error: "Produto não encontrado" });
      return;
    }

    throw error;
  }

  res.status(204).end();
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await productsRepo.deleteProduct(id);
  } catch (error) {
    if (error.name === "ProductNotFoundError") {
      res.status(404).json({ error: "Produto não encontrado" });
      return;
    }

    throw error;
  }

  res.status(204).end();
});

module.exports = router;

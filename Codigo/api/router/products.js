const express = require("express");
const productsRepo = require("../repository/products-repository");

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, price } = req.body;

  if (price === undefined || price < 0) {
    res.status(400).json({ error: "O preço deve ser um número positivo" });
    return;
  }

  try {
    const existingProduct = await productsRepo.getProductByName(name);
    if (existingProduct) {
      res.status(400).json({ error: "Código de produto já existe" });
      return;
    }

  const productCreate = {
    name,
    price,
  };

  const result = await productsRepo.createProduct(productCreate);

  res
    .header("Location", req.originalUrl + "/" + result.id)
    .status(201)
    .json(result);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
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
  const { name, price } = req.body;

  if (price === undefined || price < 0) {
    res.status(400).json({ error: "O preço deve ser um número positivo" });
    return;
  }

  const productUpdate = {
    name,
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

  // products-router.js

router.get("/name/:name", async (req, res) => {
  const { name } = req.params;

  const product = await productsRepo.getProductByName(name);

  if (!product) {
    res.status(404).json({ error: "Produto não encontrado" });
    return;
  }

  res.status(200).json(product);
});



module.exports = router;

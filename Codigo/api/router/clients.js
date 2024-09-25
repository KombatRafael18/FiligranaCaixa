const express = require("express");
const clientsRepo = require("../repository/clients-repository");
const clientValidator = require("../validators/client-validator"); 

const router = express.Router();

router.post("/", async (req, res) => {
  // Validação dos dados de criação do cliente
  const { error } = clientValidator.CreateClient(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { name, email, address, phone } = req.body;
  const clientCreate = { name, email, address, phone };
  const result = await clientsRepo.createClient(clientCreate);

  res.header("Location", req.originalUrl + "/" + result.id).status(201).json(result);
});

router.get("/", async (req, res) => {
  // Validação dos parâmetros de paginação
  const { error } = clientValidator.GetClients(req);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const clients = await clientsRepo.getClients();
  res.status(200).json(clients);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const client = await clientsRepo.getClientById(id);

  if (!client) {
    res.status(404).json({ error: "Client not found" });
    return;
  }

  res.status(200).json(client);
});

router.put("/:id", async (req, res) => {
  // Validação dos dados de atualização do cliente
  const { error } = clientValidator.UpdateClient(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { id } = req.params;
  const { name, email, address, phone } = req.body;

  const clientUpdate = { name, email, address, phone };

  try {
    await clientsRepo.updateClient(id, clientUpdate);
  } catch (error) {
    if (error.name === "ClientNotFoundError") {
      res.status(404).json({ error: "Client not found" });
      return;
    }
    throw error;
  }

  res.status(204).end();
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await clientsRepo.deleteClient(id);
  } catch (error) {
    if (error.name === "ClientNotFoundError") {
      res.status(404).json({ error: "Client not found" });
      return;
    }
    throw error;
  }

  res.status(204).end();
});

module.exports = router;

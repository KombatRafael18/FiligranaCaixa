const express = require("express");
const clientsRepo = require("../repository/clients-repository");
const clientValidator = require("../validators/client-validator");

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = clientValidator.CreateClient(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const clientCreate = {
    ...req.body,
    email: req.body.email || null,
  };

  try {
    const result = await clientsRepo.createClient(clientCreate);
    res
      .header("Location", `${req.originalUrl}/${result.id}`)
      .status(201)
      .json(result);
  } catch (error) {
    if (error.name === "DuplicateCPFError") {
      return res.status(409).json({ error: "CPF already exists" });
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  const { error } = clientValidator.GetClients(req);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const clients = await clientsRepo.getClients();
    res.status(200).json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { error } = clientValidator.GetById(req.params);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { id } = req.params;
    const client = await clientsRepo.getClientById(id);

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.status(200).json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/cpf/:cpf", async (req, res) => {
  const { error } = clientValidator.GetByCpf(req.params);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { cpf } = req.params;
    const client = await clientsRepo.getClientByCpf(cpf);

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.status(200).json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  const { error } = clientValidator.UpdateClient(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { id } = req.params;

  const clientUpdate = {
    ...req.body,
    email: req.body.email || null,
  };

  try {
    await clientsRepo.updateClient(id, clientUpdate);
    res.status(204).end();
  } catch (error) {
    if (error.name === "ClientNotFoundError") {
      return res.status(404).json({ error: "Client not found" });
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const { error } = clientValidator.GetById(req.params);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { id } = req.params;

  try {
    await clientsRepo.deleteClient(id);
    res.status(204).end();
  } catch (error) {
    if (error.name === "ClientNotFoundError") {
      return res.status(404).json({ error: "Client not found" });
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

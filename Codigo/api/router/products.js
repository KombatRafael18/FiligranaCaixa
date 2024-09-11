const express = require("express");

const router = express.Router();

router.post("/", (req, res) => {
    res.status(500).json({ error: 'Não implementado' })
});

router.get("/", (req, res) => {
    res.status(500).json({ error: 'Não implementado' })
});

router.get("/:id", (req, res) => {
    res.status(500).json({ error: 'Não implementado' })
});

router.put("/:id", (req, res) => {
    res.status(500).json({ error: 'Não implementado' })
});

router.delete("/:id", (req, res) => {
    res.status(500).json({ error: 'Não implementado' })
});

module.exports = router;

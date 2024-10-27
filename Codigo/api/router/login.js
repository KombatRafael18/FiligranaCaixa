const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

router.post("/", (req, res) => {
  const { usuario, senha } = req.body;
  if (usuario === 'admin' && senha === 'admin') {
    const token = jwt.sign({ usuario }, 'token_filigrana', { expiresIn: '2h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Usuário ou senha inválida!' });
  }
  });

router.post("/verify", (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).json({ error: 'Token não fornecido' });
  const token = authHeader.split(' ')[1]; 
  jwt.verify(token, 'token_filigrana', (err, decoded) => {
    if (err) return res.status(500).json({ valid: 'false' });
    req.usuario = decoded.usuario;
    res.status(200).json({ valid: 'true' });
  });
});

router.get("/logout", (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout realizado com sucesso' });
});

module.exports = router;




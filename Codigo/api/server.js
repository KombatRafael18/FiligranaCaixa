const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const docsRouter = require('./router/docs');
const productsRouter = require('./router/products');

// Initialize express app
const app = express();

// Middleware to parse JSON
app.use(bodyParser.json());

app.use('/api/docs', docsRouter);
app.use('/api/products', productsRouter);

// MySQL connection
const db = mysql.createConnection(
    process.env.MYSQL_CONNECTION_URI || {
        host: 'localhost',
        user: 'root',  // Use your MySQL username
        password: 'root',  // Use your MySQL password
        database: 'client_db'
    });

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});

// Create a new client
app.post('/clients', (req, res) => {
    const { name, email, address, phone } = req.body;
    const query = 'INSERT INTO clients (name, email, address, phone) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, address, phone], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, name, email, address, phone });
    });
});

// Get all clients
app.get('/clients', (req, res) => {
    const query = 'SELECT * FROM clients';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

// Get a single client by ID
app.get('/clients/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM clients WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(results[0]);
    });
});

// Update a client by ID
app.put('/clients/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, address, phone } = req.body;
    const query = 'UPDATE clients SET name = ?, email = ?, address = ?, phone = ? WHERE id = ?';
    db.query(query, [name, email, address, phone, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json({ id, name, email, address, phone });
    });
});

// Delete a client by ID
app.delete('/clients/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM clients WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json({ message: 'Client deleted successfully' });
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const mysqlClient = require("./mysql-client");

const db = mysqlClient.pool;

async function createClient(client) {
  const query = "INSERT INTO clients (name, email, address, phone) VALUES (?, ?, ?, ?)";
  const [result] = await db.execute(query, [client.name, client.email, client.address, client.phone]);
  return { id: result.insertId, ...client };
}

async function getClients() {
  const query = "SELECT * FROM clients";
  const [rows] = await db.execute(query);
  return rows;
}

async function getClientById(id) {
  const query = "SELECT * FROM clients WHERE id = ?";
  const [rows] = await db.execute(query, [id]);
  return rows[0] || null;
}

async function updateClient(id, client) {
  const query = "UPDATE clients SET name = ?, email = ?, address = ?, phone = ? WHERE id = ?";
  const [result] = await db.execute(query, [client.name, client.email, client.address, client.phone, id]);
  if (result.affectedRows === 0) {
    const error = new Error("Client not found");
    error.name = "ClientNotFoundError";
    throw error;
  }
  return { id, ...client };
}

async function deleteClient(id) {
  const query = "DELETE FROM clients WHERE id = ?";
  const [result] = await db.execute(query, [id]);
  if (result.affectedRows === 0) {
    const error = new Error("Client not found");
    error.name = "ClientNotFoundError";
    throw error;
  }
}

module.exports = {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
};

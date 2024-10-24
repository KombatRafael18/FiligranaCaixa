const mysqlClient = require("./mysql-client");

const db = mysqlClient.pool;

async function createClient(client) {
  console.log("Dados recebidos para criação do cliente:", client);
  const query = "INSERT INTO CLIENTS (cpf, name, email, address, phone, cashback) VALUES (?, ?, ?, ?, ?, ?)";
  const [result] = await db.execute(query, [client.cpf, client.name, client.email, client.address, client.phone, 0]);
  return { id: result.insertId, ...client, cashback: 0 };  
}

async function getClients() {
  const query = "SELECT * FROM CLIENTS";
  const [rows] = await db.execute(query);
  return rows;
}

async function getClientById(id) {
  const query = "SELECT * FROM CLIENTS WHERE id = ?";
  const [rows] = await db.execute(query, [id]);
  return rows[0] || null;
}

async function getClientByCpf(cpf) {
  const query = "SELECT * FROM CLIENTS WHERE cpf = ?";
  const [rows] = await db.execute(query, [cpf]);
  return rows[0] || null;
}

async function updateClient(id, client) {
  const query = "UPDATE CLIENTS SET cpf = ?, name = ?, email = ?, address = ?, phone = ? WHERE id = ?";
  const [result] = await db.execute(query, [client.cpf, client.name, client.email, client.address, client.phone, id]);
  if (result.affectedRows === 0) {
    const error = new Error("Client not found");
    error.name = "ClientNotFoundError";
    throw error;
  }
  return { id, ...client };
}

async function deleteClient(id) {
  const query = "DELETE FROM CLIENTS WHERE id = ?";
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
  getClientByCpf,
  updateClient,
  deleteClient,
};

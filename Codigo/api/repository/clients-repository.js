const mysqlClient = require("./mysql-client");
const db = mysqlClient.pool;

async function createClient(client) {
  const query = `
    INSERT INTO CLIENTS (cpf, name, email, address, phone, cashback) 
    VALUES (?, ?, ?, ?, ?, COALESCE(?, 0))
  `;

  try {
    const [result] = await db.execute(query, [
      client.cpf || null,
      client.name || null,
      client.email || null,
      client.address || null,
      client.phone || null,
      client.cashback || 0,
    ]);
    return { id: result.insertId, ...client, cashback: client.cashback || 0 };
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      const conflictError = new Error("CPF already exists");
      conflictError.name = "DuplicateCPFError";
      throw conflictError;
    }
    throw error;
  }
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
  const query = `
    UPDATE CLIENTS 
    SET cpf = ?, name = ?, email = ?, address = ?, phone = ?, cashback = ? 
    WHERE id = ?
  `;
  const [result] = await db.execute(query, [
    client.cpf || null,
    client.name || null,
    client.email || null,
    client.address || null,
    client.phone || null,
    client.cashback || 0,
    id,
  ]);

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

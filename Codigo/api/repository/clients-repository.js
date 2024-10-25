const mysqlClient = require("./mysql-client");

const db = mysqlClient.pool;

async function createClient(client) {
  const query = `
    INSERT INTO CLIENTS (cpf, name, email, address, phone, cashback) 
    VALUES (?, ?, ?, ?, ?, COALESCE(?, 0))
  `;
  
  try {
    const [result] = await db.execute(query, [
      client.cpf, client.name, client.email, client.address, client.phone, client.cashback || 0
    ]);
    return { id: result.insertId, ...client, cashback: client.cashback || 0 };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      const conflictError = new Error("CPF already exists");
      conflictError.name = "DuplicateCPFError";
      throw conflictError;
    }
    throw error;
  }
}

async function getClients(limit = 10, offset = 0) {
  const query = "SELECT * FROM CLIENTS LIMIT ? OFFSET ?";
  const [rows] = await db.execute(query, [limit, offset]);
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
    client.cpf, client.name, client.email, client.address, client.phone, client.cashback || 0, id
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

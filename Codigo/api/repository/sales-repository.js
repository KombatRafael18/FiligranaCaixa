const mysqlClient = require("./mysql-client");
const db = mysqlClient.pool;

async function createSale(sale) {
  const query = "INSERT INTO SALES (CLIENT_ID, TOTAL_AMOUNT, SALE_TYPE, PAYMENT_METHOD) VALUES (?, ?, ?, ?)";
  const [result] = await db.execute(query, [sale.clientId, sale.totalAmount, sale.saleType, sale.paymentMethod]);
  return { id: result.insertId, ...sale };
}

async function getSales(saleType, paymentMethod) {
  let query = `
    SELECT SALES.ID, SALES.TOTAL_AMOUNT, SALES.SALE_TYPE, SALES.PAYMENT_METHOD, SALES.SALE_DATE,
           CLIENTS.NAME AS CLIENT_NAME
    FROM SALES
    JOIN CLIENTS ON SALES.CLIENT_ID = CLIENTS.ID
  `;
  const filters = [];
  if (saleType) {
    filters.push(`SALES.SALE_TYPE = '${saleType}'`);
  }
  if (paymentMethod) {
    filters.push(`SALES.PAYMENT_METHOD = '${paymentMethod}'`);
  }
  if (filters.length > 0) {
    query += ` WHERE ${filters.join(" AND ")}`;
  }
  const [rows] = await db.execute(query);
  return rows;
}

async function getSaleById(id) {
  const query = `
    SELECT SALES.ID, SALES.TOTAL_AMOUNT, SALES.SALE_TYPE, SALES.PAYMENT_METHOD, SALES.SALE_DATE,
           CLIENTS.NAME AS CLIENT_NAME
    FROM SALES
    JOIN CLIENTS ON SALES.CLIENT_ID = CLIENTS.ID
    WHERE SALES.ID = ?
  `;
  const [rows] = await db.execute(query, [id]);
  return rows[0] || null;
}

async function updateSale(id, sale) {
  const query = `
    UPDATE SALES SET CLIENT_ID = ?, TOTAL_AMOUNT = ?, SALE_TYPE = ?, PAYMENT_METHOD = ?
    WHERE ID = ?
  `;
  const [result] = await db.execute(query, [
    sale.clientId, sale.totalAmount, sale.saleType, sale.paymentMethod, id
  ]);
  if (result.affectedRows === 0) {
    const error = new Error("Sale not found");
    error.name = "SaleNotFoundError";
    throw error;
  }
}

async function deleteSale(id) {
  const query = "DELETE FROM SALES WHERE ID = ?";
  const [result] = await db.execute(query, [id]);
  if (result.affectedRows === 0) {
    const error = new Error("Sale not found");
    error.name = "SaleNotFoundError";
    throw error;
  }
}

module.exports = {
  createSale,
  getSales,
  getSaleById,
  updateSale,
  deleteSale
};

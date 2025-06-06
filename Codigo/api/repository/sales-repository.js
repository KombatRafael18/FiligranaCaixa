const mysqlClient = require("./mysql-client");
const db = mysqlClient.pool;

async function createSale(
  clientId,
  totalAmount,
  discount,
  cashback,
  saleType,
  paymentMethod,
  saleDate,
  products
) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const formattedSaleDate = new Date(saleDate).toISOString().slice(0, 19).replace('T', ' ');

    // Permitir que clientId seja null
    const saleQuery = "INSERT INTO SALES (CLIENT_ID, TOTAL_AMOUNT, DISCOUNT, CASHBACK, SALE_TYPE, PAYMENT_METHOD, SALE_DATE) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const [saleResult] = await connection.execute(saleQuery, [
      clientId || null,
      totalAmount,
      discount,
      cashback,
      saleType,
      paymentMethod,
      formattedSaleDate,
    ]);
    const saleId = saleResult.insertId;

    const productQuery = "INSERT INTO SALE_PRODUCTS (SALE_ID, PRODUCT_CODE, PRODUCT_VALUE, PRODUCT_QUANTITY) VALUES (?, ?, ?, ?)";
    for (const product of products) {
    
      const productValue = typeof product.valor === 'string' 
        ? parseFloat(product.valor.replace('R$', '').replace(',', '.').trim())
        : parseFloat(product.valor);

        await connection.execute(productQuery, [
          saleId,
          product.codigo,
          productValue,
          product.quantity,
        ]);
    }

    await connection.commit();
    return { id: saleId, clientId, totalAmount, saleType, paymentMethod, saleDate: formattedSaleDate };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
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

async function getSalesByClientId(clientId) {
  const query = "SELECT * FROM SALES WHERE CLIENT_ID = ?";
  const [rows] = await db.execute(query, [clientId]);
  return rows;
}

async function getProductsBySaleId(saleId) {
  const query = "SELECT PRODUCT_CODE FROM SALE_PRODUCTS WHERE SALE_ID = ?";
  const [rows] = await db.execute(query, [saleId]);
  return rows.map(row => row.PRODUCT_CODE);
}

module.exports = {
  createSale,
  getSales,
  getSaleById,
  updateSale,
  deleteSale,
  getSalesByClientId,
  getProductsBySaleId
};

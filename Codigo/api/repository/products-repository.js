const mysqlClient = require("./mysql-client");

const db = mysqlClient.pool;

async function createProduct(product) {
  const query =
    "INSERT INTO PRODUCTS (NAME, PRICE) VALUES (?, ?)";

  const [result, fields] = await db.execute(query, [
    product.name,
    product.price,
  ]);

  return {
    id: result.insertId,
  };
}

async function getProducts() {
  const sql =
    "SELECT ID, NAME, PRICE FROM PRODUCTS ORDER BY NAME, ID";

  const [rows, fields] = await db.execute(sql);

  const products = rows.map((row) => ({
    id: row.ID,
    name: row.NAME,
    price: parseFloat(row.PRICE),
  }));

  return products;
}

async function getProductByName(name) {
  const sql = "SELECT ID, NAME, PRICE FROM PRODUCTS WHERE NAME = ?";

  const [rows, fields] = await db.execute(sql, [name]);

  const row = rows[0];
  if (!row) {
    return null;
  }

  return {
    id: row.ID,
    name: row.NAME,
    price: parseFloat(row.PRICE),
  };
}

async function getProductById(id) {
  const sql = "SELECT ID, NAME, PRICE FROM PRODUCTS WHERE ID = ?";

  const [rows, fields] = await db.execute(sql, [id]);

  const row = rows[0];
  if (!row) {
    return null;
  }

  return {
    id: row.ID,
    name: row.NAME,
    price: parseFloat(row.PRICE),
  };
}

async function updateProduct(id, product) {
  const sql =
    "UPDATE PRODUCTS SET NAME = ?, PRICE = ? WHERE ID = ?";

  const [result, fields] = await db.execute(sql, [
    product.name,
    product.price,
    id,
  ]);

  if (result.affectedRows === 0) {
    // TODO: Criar classe de erro
    const error = new Error("Produto não encontrado");
    error.name = "ProductNotFoundError";
    throw error;
  }
}

async function deleteProduct(id) {
  const sql = "DELETE FROM PRODUCTS WHERE ID = ?";

  const [result, fields] = await db.execute(sql, [id]);

  if (result.affectedRows === 0) {
    // TODO: Criar classe de erro
    const error = new Error("Produto não encontrado");
    error.name = "ProductNotFoundError";
    throw error;
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductByName,
  getProductById,
  updateProduct,
  deleteProduct,
};

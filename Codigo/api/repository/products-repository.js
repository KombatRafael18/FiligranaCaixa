const mysqlClient = require("./mysql-client");

const db = mysqlClient.pool;

async function createProduct(product) {
  const query =
    "INSERT INTO PRODUCTS (NAME, DESCRIPTION, PRICE) VALUES (?, ?, ?)";

  const [result, fields] = await db.execute(query, [
    product.name,
    product.description,
    product.price,
  ]);

  return {
    id: result.insertId,
  };
}

async function getProducts() {
  const sql =
    "SELECT ID, NAME, DESCRIPTION, PRICE FROM PRODUCTS ORDER BY NAME, ID";

  const [rows, fields] = await db.execute(sql);

  const products = rows.map((row) => ({
    id: row.ID,
    name: row.NAME,
    description: row.DESCRIPTION,
    price: parseFloat(row.PRICE),
  }));

  return products;
}

async function getProductById(id) {
  const sql = "SELECT ID, NAME, DESCRIPTION, PRICE FROM PRODUCTS WHERE ID = ?";

  const [rows, fields] = await db.execute(sql, [id]);

  const row = rows[0];
  if (!row) {
    return null;
  }

  return {
    id: row.ID,
    name: row.NAME,
    description: row.DESCRIPTION,
    price: parseFloat(row.PRICE),
  };
}

async function updateProduct(id, product) {
  const sql =
    "UPDATE PRODUCTS SET NAME = ?, DESCRIPTION = ?, PRICE = ? WHERE ID = ?";

  const [result, fields] = await db.execute(sql, [
    product.name,
    product.description,
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
  getProductById,
  updateProduct,
  deleteProduct,
};

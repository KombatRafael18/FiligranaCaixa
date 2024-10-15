const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const docsRouter = require("./router/docs");
const productsRouter = require("./router/products");
const clientsRouter = require("./router/clients");
const salesRouter = require("./router/sales");

const app = express();

app.use(bodyParser.json());
app.use(cors()); 

app.use("/api/docs", docsRouter);
app.use("/api/products", productsRouter);
app.use("/api/clients", clientsRouter);
app.use("/api/sales", salesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

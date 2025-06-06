const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const docsRouter = require("./router/docs");
const productsRouter = require("./router/products");
const clientsRouter = require("./router/clients");
const salesRouter = require("./router/sales");
const cashClosureRouter = require("./router/cash-closure");
const dashboardRouter = require("./router/dashboard");
const loginRouter = require("./router/login");
const app = express();

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(cors());

app.use("/api/login", loginRouter);
app.use("/api/docs", docsRouter);
app.use("/api/products", productsRouter);
app.use("/api/clients", clientsRouter);
app.use("/api/sales", salesRouter);
app.use("/api/cash-closure", cashClosureRouter);
app.use("/api/dashboard", dashboardRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

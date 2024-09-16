const express = require("express");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");

const file = fs.readFileSync("./swagger.yaml", "utf8");
const swaggerDocument = YAML.parse(file);

const router = express.Router();

const options = {
  // explorer: true,
  swaggerOptions: {
    url: "/api/docs/swagger.json",
  },
};

router.use("/swagger.json", (req, res) => res.json(swaggerDocument));
router.use(
  "/",
  swaggerUi.serveFiles(null, options),
  swaggerUi.setup(swaggerDocument, options)
);

module.exports = router;

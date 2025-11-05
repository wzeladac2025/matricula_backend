const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const swaggerUI = require("swagger-ui-express");

const app = express();

var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve Swagger documentation
const swaggerSpec = require("./app/config/swagger.config");
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

const db = require("./app/models");
db.sequelize.sync();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Test
 *     tags: [Servicios Up]
 *     description: Test Proyecto Levantado
 *     responses:
 *       200:
 *         description: Test Proyecto Levantado
 */
app.get("/", (req, res) => {
  res.json({ message: "Proyecto Examen Final Matricula" });
});
try {
  require("./app/routes/usuario.routes.js")(app);
  console.log("✅ usuario.routes.js cargado correctamente");
} catch (err) {
  console.error("❌ Error al cargar usuario.routes.js:", err.message);
}
try {
  require("./app/routes/matricula.routes.js")(app);
  console.log("✅ matricula.routes.js cargado correctamente");
} catch (err) {
  console.error("❌ Error al cargar matricula.routes.js:", err.message);
}

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado correctamente en el puerto ${PORT}.`);
});

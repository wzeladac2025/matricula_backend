const Verificador = require("../middlewares/autorizacion.middleware.js");

const ROLE_ADMIN = Verificador(["admin"]);
const ROLE_TODOS = Verificador(["admin", "usuario"]);

module.exports = {
  ROLE_ADMIN,
  ROLE_TODOS,
};

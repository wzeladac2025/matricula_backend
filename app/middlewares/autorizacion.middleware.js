const jwt = require("jsonwebtoken");

const Verificador = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader)
      return res.status(401).send({ message: "Token requerido" });

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).send({ message: "Token inválido" });

      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).send({ message: "No Autorizado" });
      }

      req.user = user;
      next();
    });
  };
};

// exportamos correctamente
module.exports = Verificador;

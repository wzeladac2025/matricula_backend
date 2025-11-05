const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Usuario = db.usuario;

exports.create = async (req, res) => {
  try {
    if (!req.body.correo && !req.body.contrasena) {
      res.status(400).send({
        message: "Necesita ingresar el correo y la contraseña.",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(req.body.contrasena, 10);

    const usuario = {
      correo: req.body.correo,
      contrasena: hashedPassword,
      role: req.body.role,
    };

    const usuarioJson = Usuario.build(usuario);
    const nuevoUsuario = await usuarioJson.save().catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Error al crear el usuario. Consulte a su administrador.",
      });
    });

    //AGREGAR OBJETOS DE HUESPED, EMPLEADO BASE
    if (usuario.role != "admin") {
      let perfilUsuario = {
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        id_usuario: nuevoUsuario.id,
      };

      switch (usuario.role) {
        case "huesped":
          savePerfilUsuario(Huesped, perfilUsuario);
          break;
        case "empleado":
          savePerfilUsuario(Empleado, perfilUsuario);
          break;
        default:
          break;
      }
    }

    res.send({
      mensaje: "Usuario Registrado",
      correo: nuevoUsuario.correo,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

async function savePerfilUsuario(modelo, objeto) {
  const json = modelo.build(objeto);
  await json.save();
}

exports.login = async (req, res) => {
  const { correo, contrasena, role } = req.body;
  try {
    const query = await db.sequelize.query(
      "select * from usuarios where correo = '" + correo + "'",
      {
        model: Usuario,
        mapToModel: true,
      }
    );

    const usuario = query[0]?.dataValues;
    if (!usuario) {
      return res.status(404).send({ mensaje: "Usuario no registrado." });
    }

    if (role != usuario.role) {
      return res
        .status(404)
        .send({ mensaje: "Tu perfil de usuario no es correcto." });
    }

    const validPassword = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!validPassword) {
      return res.status(401).send({ mensaje: "Contraseña incorrecta." });
    }

    const token = jwt.sign(
      { id: usuario.id, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.send({
      mensaje: "Sesion Iniciada.",
      access_token: token,
      idUsuario: usuario.id,
    });
  } catch (err) {
    return res.status(401).send({ mensaje: err.message });
  }
};

exports.findById = async (req, res) => {
  const id = req.params.id;
  const query = await db.sequelize
    .query("select * from usuarios u WHERE u.id = " + id, {
      model: Usuario,
      mapToModel: true,
    })
    .catch((err) => {
      return res.status(500).send({
        mensaje: err.message || "Error al obtener el usuario.",
      });
    });

  const usuario = query[0]?.dataValues;
  if (!usuario) {
    return res.status(404).send({ mensaje: "Usuario no registrado." });
  }

  let datos = null;
  if (usuario.role == "huesped" || usuario.role == "empleado") {
    let tablaObjeto = usuario.role + "s";
    const query = await db.sequelize
      .query(
        'SELECT * FROM "' + tablaObjeto + '" u WHERE u."id_usuario" = ' + id,
        {
          model: Usuario,
          mapToModel: true,
        }
      )
      .catch((err) => {
        return res.status(500).send({
          mensaje: err.message || "Error al obtener el usuario.",
        });
      });

    datos = query[0]?.dataValues;
  }
  return res.send({
    id: usuario.id,
    correo: usuario.correo,
    role: usuario.role,
    nombres: datos?.nombres || "Admin",
    apellidos: datos?.apellidos || "Admin",
  });
};

exports.findAll = async (req, res) => {
  const query = await db.sequelize
    .query("select u.id, u.correo, u.role from usuarios u", {
      model: Usuario,
      mapToModel: true,
    })
    .catch((err) => {
      return res.status(500).send({
        mensaje: err.message || "Error al obtener el usuario.",
      });
    });

  const usuarios = query;
  if (!usuarios) {
    return res.status(404).send({ mensaje: "No hay usuarios registradas" });
  }
  return res.send(usuarios);
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const query = await db.sequelize
    .query("select u.* from usuarios u WHERE u.id = " + id, {
      model: Usuario,
      mapToModel: true,
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Error al obtener el usuario.",
      });
    });

  const usuario = query[0]?.dataValues;
  if (!usuario) {
    return res.status(404).send({ message: "Usuario no registrado." });
  }

  //ACTUALIZAR ESTADO
  req.body.id = usuario.id;
  await Usuario.update(req.body, {
    where: {
      id: usuario.id,
    },
  })
    .then((id) => {
      if (id == 1) {
        return res.status(200).send({
          id: usuario.id,
        });
      } else {
        return res.status(401).send({
          mensaje: "No se actualizo el usuario.",
        });
      }
    })
    .catch(() => {
      return res.status(500).send({
        mensaje: "Error al actualizar el usuario.",
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Usuario.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Usuario dado de baja.",
        });
      } else {
        res.send({
          message: "No se pudo dar de baja al usuario.",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error al dar de baja al usuario.",
      });
    });
};

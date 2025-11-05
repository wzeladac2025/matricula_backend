const db = require("../models");
const matricula = db.matricula;

exports.create = async (req, res) => {
  try {
    const matriculaObj = {
      id_usuario: req.body.id_usuario,
      descripcion: req.body.descripcion,
      ciclo: req.body.ciclo,
      tipo: req.body.tipo,
      estado: req.body.estado,
      fecha: req.body.fecha
    };

    const matricula = matricula.build(matriculaObj);
    const nuevoObjeto = await matricula.save().catch((err) => {
      res.status(500).send({
        mensaje:
          err.message || "Error al crear matricula. Consulte a su administrador.",
      });
    });

    res.send({ mensaje: "matricula creada", nombre: nuevoObjeto.nombre });
  } catch (err) {
    res.status(500).send({ mensaje: err.message });
    console.log("Hubo un error inesperado", err.message);
  }
};

exports.findById = async (req, res) => {
  const id = req.params.id;
  const query = await db.sequelize
    .query("select u.* from matriculas u WHERE u.id = " + id, {
      model: matricula,
      mapToModel: true,
    })
    .catch((err) => {
      return res.status(500).send({
        mensaje: err.message || "Error al obtener el matricula.",
      });
    });

  const matricula = query[0]?.dataValues;
  if (!matricula) {
    return res.status(404).send({ mensaje: "matricula no registrado." });
  }

  return res.send({
    matricula,
  });
};

exports.findAll = async (req, res) => {
  const query = await db.sequelize
    .query("select u.* from matriculas u", {
      model: matricula,
      mapToModel: true,
    })
    .catch((err) => {
      return res.status(500).send({
        mensaje: err.message || "Error al obtener el matricula.",
      });
    });

  const matriculas = query;
  if (!matriculas) {
    return res.status(404).send({ mensaje: "No hay matriculas registradas" });
  }
  return res.send(matriculas);
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const query = await db.sequelize
    .query("select u.* from matriculas u WHERE u.id = " + id, {
      model: matricula,
      mapToModel: true,
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Error al obtener el matricula.",
      });
    });

  const matricula = query[0]?.dataValues;
  if (!matricula) {
    return res.status(404).send({ message: "matricula no registrado." });
  }

  //ACTUALIZAR
  req.body.id = matricula.id;
  await matricula.update(req.body, {
    where: {
      id: matricula.id,
    },
  })
    .then((id) => {
      if (id == 1) {
        return res.status(200).send({
          id: matricula.id,
        });
      } else {
        return res.status(401).send({
          mensaje: "No se actualizo el matricula.",
        });
      }
    })
    .catch(() => {
      return res.status(500).send({
        mensaje: "Error al actualizar el matricula.",
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
          message: "Matricula dado de baja.",
        });
      } else {
        res.send({
          message: "No se pudo dar de baja la matricula.",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error al dar de baja la matricula.",
      });
    });
};

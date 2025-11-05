module.exports = (sequelize, Sequelize) => {
  const Usuario = require("./usuario.model")(sequelize, Sequelize);

  sequelize
    .query("CREATE SEQUENCE MATRICULA_SEQ START WITH 1 INCREMENT BY 1")
    .catch(() => {});

  const Matricula = sequelize.define("matricula", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      defaultValue: Sequelize.literal("nextval('matricula_seq')"),
    },
    id_usuario: {
      type: Sequelize.INTEGER,
    },
    descripcion: {
      type: Sequelize.STRING,
    },
    ciclo: {
      type: Sequelize.INTEGER,
    },    
    tipo: {
      type: Sequelize.ENUM("inscripcion"),
    },
    estado: {
      type: Sequelize.ENUM("pagada", "no_pagada"),
    },    
    fecha: {
      type: Sequelize.DATE,
    },
  });

  // Relación:
  Matricula.belongsTo(Usuario, {
    foreignKey: "id_usuario",
    targetKey: "id",
  });

  Usuario.hasOne(Matricula, {
    foreignKey: "id_usuario",
    sourceKey: "id",
  });

  return Matricula;
};

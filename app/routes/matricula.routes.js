module.exports = (app) => {
  const security = require("../config/security.config.js");
  const matricula = require("../controllers/matricula.controller.js");
  var router = require("express").Router();

  /**
   * @swagger
   * /api/matricula/register/:
   *   post:
   *     summary: Crear matricula
   *     tags: [matricula]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *                id_usuario:
   *                  type: number
   *     responses:
   *       200:
   *         description: matricula creada
   *       400:
   *         description: Error al crear registro de matricula
   */
  router.post("/register/", matricula.create);

  /**
   * @swagger
   * /api/matricula/{id}:
   *   get:
   *     summary: Obtener matricula por id
   *     tags: [matricula]
   *     security:
   *        - bearerAuth: []
   *     parameters:
   *        - in: path
   *          name: id
   *          type: string
   *     responses:
   *       200:
   *         description: matricula encontrado
   */
  router.get("/:id", security.ROLE_TODOS, matricula.findById);

  /**
   * @swagger
   * /api/matricula/:
   *   get:
   *     summary: Obtener matriculas
   *     tags: [matricula]
   *     security:
   *        - bearerAuth: []
   *     responses:
   *       200:
   *         description: matriculas encontradas
   */
  router.get("/", security.ROLE_TODOS, matricula.findAll);

  /**
   * @swagger
   * /api/matricula/update/{id}:
   *   put:
   *     summary: Actualizar matricula por id
   *     tags: [matricula]
   *     security:
   *        - bearerAuth: []
   *     parameters:
   *        - in: path
   *          name: id
   *          type: string
   *     description: Actualizar matricula por id
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *                id_usuario:
   *                  type: number
   *     responses:
   *       200:
   *         description: matricula actualizado
   */
  router.put("/update/:id", security.ROLE_TODOS, matricula.update);

  /**
 * @swagger
 * /api/matricula/delete/{id}:
 *   delete:
 *     summary: Eliminar matricula por id
 *     tags: [matricula]
 *     security:
 *        - bearerAuth: []
 *     parameters:
 *        - in: path
 *          name: id
 *          type: string
 *     responses:
 *       200:
 *         description: Matricula eliminada
 */
  router.get("/delete/:id", security.ROLE_TODOS, matricula.delete);

  app.use("/api/matricula", router);
};

module.exports = (app) => {
  const security = require("../config/security.config.js");
  const usuario = require("../controllers/usuario.controller.js");
  var router = require("express").Router();

  /**
   * @swagger
   * /api/usuario/register/:
   *   post:
   *     summary: Crear usuario
   *     tags: [usuario]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *                correo:
   *                  type: string
   *                contrasena:
   *                  type: string
   *                role:
   *                  type: string
   *                  enum: [usuario, admin]
   *                nombres:
   *                  type: string
   *                apellidos:
   *                  type: string
   *                carne:
   *                  type: number 
   *     responses:
   *       200:
   *         description: usuario creado
   *       400:
   *         description: Error al crear usuario
   */
  router.post("/register/", usuario.create);

  /**
   * @swagger
   * /api/usuario/login/:
   *   post:
   *     summary: Autenticar usuario
   *     tags: [usuario]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *                correo:
   *                  type: string
   *                contrasena:
   *                  type: string
   *     responses:
   *       200:
   *         description: usuario Autenticado
   *       400:
   *         description: Error al autenticar usuario
   */
  router.post("/login/", usuario.login);

  /**
   * @swagger
   * /api/usuario/{id}:
   *   get:
   *     summary: Obtener usuario por id
   *     tags: [usuario]
   *     security:
   *        - bearerAuth: []
   *     parameters:
   *        - in: path
   *          name: id
   *          type: string
   *     description: Obtener usuario por id
   *     responses:
   *       200:
   *         description: usuario encontrado
   */
  router.get("/:id", security.ROLE_TODOS, usuario.findById);

  /**
   * @swagger
   * /api/usuario/:
   *   get:
   *     summary: Obtener usuarios
   *     tags: [usuario]
   *     security:
   *        - bearerAuth: []
   *     responses:
   *       200:
   *         description: usuarios encontradas
   */
  router.get("/", security.ROLE_TODOS, usuario.findAll);

  /**
   * @swagger
   * /api/usuario/update/{id}:
   *   put:
   *     summary: Actualizar usuario por id
   *     tags: [usuario]
   *     security:
   *        - bearerAuth: []
   *     parameters:
   *        - in: path
   *          name: id
   *          type: string
   *     description: Actualizar usuario por id
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *                correo:
   *                  type: string
   *                contrasena:
   *                  type: string
   *                role:
   *                  type: string
   *                  enum: [usuario, admin]
   *                nombres:
   *                  type: string
   *                apellidos:
   *                  type: string
   *                carne:
   *                  type: number 
   *     responses:
   *       200:
   *         description: usuario actualizado
   */
  router.put("/update/:id", security.ROLE_TODOS, usuario.update);

  /**
 * @swagger
 * /api/usuario/delete/{id}:
 *   delete:
 *     summary: Eliminar usuario por id
 *     tags: [usuario]
 *     security:
 *        - bearerAuth: []
 *     parameters:
 *        - in: path
 *          name: id
 *          type: string
 *     responses:
 *       200:
 *         description: usuario eliminada
 */
  router.get("/delete/:id", security.ROLE_TODOS, usuario.delete);

  app.use("/api/usuario", router);
};

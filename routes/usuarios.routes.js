const { Router } = require("express");
const UserController = require("../controllers/usuario.controller");
const api = Router();
const md_auth = require("../middlewares/validar");

const multipart = require("connect-multiparty");
const md_upload = multipart({ uploadDir: "./uploads/usuarios" });

api.get("/probando", md_auth.autorizarAcceso, UserController.pruebas);
api.post("/registrar", UserController.guardarUsuario);
api.post("/login", UserController.loginUsuario);
api.put(
    "/actualizar-usuario/:id",
    md_auth.autorizarAcceso,
    UserController.actualizarUsuario
);
api.post(
    "/subir-imagen/:id", [md_auth.autorizarAcceso, md_upload],
    UserController.uploadImage
);
api.get(
    "/obtener-imagen/:imageFile",

    UserController.getImageFile
);

module.exports = api;
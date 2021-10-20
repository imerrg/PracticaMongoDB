const express = require("express");
const CancionController = require("../controllers/cancion.controller");
const api = express.Router();
const md_auth = require("../middlewares/validar");

const multipart = require("connect-multiparty");
const md_upload = multipart({ uploadDir: "./uploads/canciones" });

api.get("/cancion/:id", md_auth.autorizarAcceso, CancionController.getCancion);

api.post("/cancion", md_auth.autorizarAcceso, CancionController.guardarCancion);

api.get(
    "/canciones/:album?",
    md_auth.autorizarAcceso,
    CancionController.getCanciones
);

api.put(
    "/cancion/:id",
    md_auth.autorizarAcceso,
    CancionController.actualizarCancion
);

api.delete(
    "/cancion/:id",
    md_auth.autorizarAcceso,
    CancionController.borrarCancion
);

api.post(
    "/subir-cancion/:id",
    md_auth.autorizarAcceso,
    CancionController.uploadFile
);

api.get(
    "/obtener-cancion/:cancionFile",
    md_auth.autorizarAcceso,
    CancionController.getCancionFile
);

module.exports = api;
const express = require("express");
const ArtistaController = require("../controllers/artista.controller");
const api = express.Router();
const md_auth = require("../middlewares/validar");

const multipart = require("connect-multiparty");
const md_upload = multipart({ uploadDir: "./uploads/artistas" });

api.get("/artista/:id", md_auth.autorizarAcceso, ArtistaController.getArtista);
api.post("/artista", md_auth.autorizarAcceso, ArtistaController.guardarArtista);
api.get(
    "/artistas/:page?",
    md_auth.autorizarAcceso,
    ArtistaController.getArtistas
);
api.put(
    "/artistas/:id",
    md_auth.autorizarAcceso,
    ArtistaController.updateArtista
);
api.delete(
    "/artistas/:id",
    md_auth.autorizarAcceso,
    ArtistaController.deleteArtista
);
api.post(
    "/subir-image-artista/:id", [md_auth.autorizarAcceso, md_upload],
    ArtistaController.uploadImage
);
api.get(
    "/obtener-imagen-artista/:imageFile",

    ArtistaController.getImageFile
);

module.exports = api;
const express = require("express");
const AlbumController = require("../controllers/album.controller");
const api = express.Router();
const md_auth = require("../middlewares/validar");

const multipart = require("connect-multiparty");
const md_upload = multipart({ uploadDir: "./uploads/albums" });

api.get("/album/:id", md_auth.autorizarAcceso, AlbumController.getAlbum);

api.post("/album", md_auth.autorizarAcceso, AlbumController.guardarAlbum);

api.get(
    "/albums/:artista?",
    md_auth.autorizarAcceso,
    AlbumController.getAlbums
);

api.put(
    "/albums/:id",
    md_auth.autorizarAcceso,
    AlbumController.actualizarAlbum
);
api.delete("/albums/:id", md_auth.autorizarAcceso, AlbumController.borrarAlbum);

api.post(
    "/subir-image-album/:id", [md_auth.autorizarAcceso, md_upload],
    AlbumController.uploadImage
);
api.get(
    "/obtener-imagen-album/:imageFile",

    AlbumController.getImageFile
);

module.exports = api;
const path = require("path");
const fs = require("fs");
const mongoosePaginate = require("mongoose-pagination");

const Artista = require("../models/artista.model");
const Album = require("../models/album.model");
const Cancion = require("../models/cancion.model");
const { restart } = require("nodemon");

function getArtista(req, res) {
    var artistaId = req.params.id;

    Artista.findById(artistaId, (err, artista) => {
        if (err) {
            res.status(500).send({ message: "Error en la peticion" });
        } else {
            if (!artista) {
                res.status(404).send({ message: "El artista no existe" });
            } else {
                res.status(200).send({ artista });
            }
        }
    });
}

function getArtistas(req, res) {
    if (req.params.page) {
        var page = req.params.page;
    } else {
        var page = 1;
    }
    var page = req.params.page;
    var itemsPage = 3;

    Artista.find()
        .sort("nombre")
        .paginate(page, itemsPage, function(err, artistas, total) {
            if (err) {
                res.status(500).send({ message: "Error en la peticion" });
            } else {
                if (!artistas) {
                    res.status(404).send({ message: "no hay artistas" });
                } else {
                    return res
                        .status(200)
                        .send({ total_items: total, artistas: artistas });
                }
            }
        });
}

function guardarArtista(req, res) {
    var artista = new Artista();
    var params = req.body;

    artista.nombre = params.nombre;
    artista.descripcion = params.descripcion;
    artista.image = "null";

    artista.save((err, artistaStored) => {
        if (err) {
            res.status(500).send({ message: "error al guardar artista" });
        } else {
            if (!artistaStored) {
                res.status(404).send({ message: "el artista no ha sido guardado" });
            } else {
                res.status(200).send({ artista: artistaStored });
            }
        }
    });
}

function updateArtista(req, res) {
    var artistaId = req.params.id;
    var update = req.body;

    Artista.findByIdAndUpdate(artistaId, update, (err, artistaUpdated) => {
        if (err) {
            res.status(500).send({ message: "error al guardar arista" });
        } else {
            if (!artistaUpdated) {
                res.status(404).send({ message: "el artista no ha sido actualizado" });
            } else {
                res.status(200).send({ artista: artistaUpdated });
            }
        }
    });
}

function deleteArtista(req, res) {
    var artistaId = req.params.id;

    Artista.findByIdAndRemove(artistaId, (err, artistaRemoved) => {
        if (err) {
            res.status(500).send({ message: "error al eliminar artista" });
        } else {
            if (!artistaRemoved) {
                res.status(404).send({ message: "el artista no ha sido aeliminado" });
            } else {
                Album.find({ artista: artistaRemoved._id }).remove(
                    (err, albumRemove) => {
                        if (err) {
                            res.status(500).send({ message: "error al eliminar album" });
                        } else {
                            if (!artistaRemoved) {
                                res
                                    .status(404)
                                    .send({ message: "el album no ha sido aeliminado" });
                            } else {
                                Cancion.find({
                                    album: artistaRemoved._id,
                                }).remove((err, cancionRemove) => {
                                    if (err) {
                                        res.status(500).send({
                                            message: "error al eliminar cancion",
                                        });
                                    } else {
                                        if (!artistaRemoved) {
                                            res.status(404).send({
                                                message: "la cancion no ha sido aeliminado",
                                            });
                                        } else {
                                            res.status(200).send({
                                                artista: artistaRemoved,
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    }
                );
            }
        }
    });
}

function uploadImage(req, res) {
    var artistaId = req.params.id;
    var file_name = "no subido...";

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split("\\");
        var file_name = file_split[2];

        var ext_split = file_name.split(".");
        var file_ext = ext_split[1];

        if (file_ext == "png" || file_ext == "jpg" || file_ext == "gif") {
            Artista.findByIdAndUpdate(
                artistaId, { image: file_name },
                (err, aristaUpdate) => {
                    if (!artistaId) {
                        res.status(404).send({ message: "no se actualizo" });
                    } else {
                        res.status(404).send({ artista: aristaUpdate });
                    }
                }
            );
        } else {
            res.status(200).send({ message: "Extencion de archivo no valido" });
        }
    } else {
        res.status(200).send({ message: "no se ha subido ninguna imagen..." });
    }
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = "./uploads/artistas/" + imageFile;

    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: "no existe la imagen..." });
        }
    });
}
module.exports = {
    getArtista,
    guardarArtista,
    getArtistas,
    updateArtista,
    deleteArtista,
    uploadImage,
    getImageFile,
};
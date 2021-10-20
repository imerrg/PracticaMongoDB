const path = require("path");
const fs = require("fs");
const mongoosePaginate = require("mongoose-pagination");

const Artista = require("../models/artista.model");
const Album = require("../models/album.model");
const Cancion = require("../models/cancion.model");
const { restart } = require("nodemon");

function getAlbum(req, res) {
    var albumId = req.params.id;

    Album.findById(albumId)
        .populate({ path: "artista" })
        .exec((err, album) => {
            if (err) {
                res.status(500).send({ message: "error en la peticion" });
            } else {
                if (!album) {
                    res.status(404).send({ message: "el album no existe" });
                } else {
                    res.status(200).send({ album });
                }
            }
        });
}

function getAlbums(req, res) {
    var artistaId = req.params.artista;

    if (!artistaId) {
        //sacar los albums
        var find = Album.find({}).sort("titulo");
    } else {
        //sacar albun por artista
        var find = Album.find({ artista: artistaId }).sort("año");
    }

    find.populate({ path: "artista" }).exec((err, albums) => {
        if (err) {
            res.status(500).send({ message: "error en la peticion" });
        } else {
            if (!albums) {
                res.status(404).send({ message: "no hay el album no existe" });
            } else {
                res.status(200).send({ albums });
            }
        }
    });
}

function guardarAlbum(req, res) {
    var album = new Album();
    var params = req.body;
    album.titulo = params.titulo;
    album.descripcion = params.descripcion;
    album.año = params.año;
    album.image = "null";
    album.artista = params.artista;

    album.save((err, albumSored) => {
        if (err) {
            res.status(500).send({ message: "error en el servidor" });
        } else {
            if (!albumSored) {
                res.status(404).send({ message: "no se guardo el album" });
            } else {
                res.status(200).send({ album: albumSored });
            }
        }
    });
}

function actualizarAlbum(req, res) {
    var albumId = req.params.id;

    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, albumnUpdated) => {
        if (err) {
            res.status(500).send({ message: "error en el servidor" });
        } else {
            if (!albumnUpdated) {
                res.status(404).send({ message: "no se actualizo el album" });
            } else {
                res.status(200).send({ album: albumnUpdated });
            }
        }
    });
}

function borrarAlbum(req, res) {
    var albumId = req.params.id;

    Album.findByIdAndRemove(albumId, (err, albumRemove) => {
        if (err) {
            res.status(500).send({ message: "error al eliminar album" });
        } else {
            if (!albumRemove) {
                res.status(404).send({ message: "el album no ha sido aeliminado" });
            } else {
                Cancion.find({
                    album: albumRemove._id,
                }).remove((err, cancionRemove) => {
                    if (err) {
                        res.status(500).send({
                            message: "error al eliminar cancion",
                        });
                    } else {
                        if (!cancionRemove) {
                            res.status(404).send({
                                message: "la cancion no ha sido aeliminado",
                            });
                        } else {
                            res.status(200).send({
                                album: albumRemove,
                            });
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res) {
    var albumId = req.params.id;
    var file_name = "no subido...";

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split("\\");
        var file_name = file_split[2];

        var ext_split = file_name.split(".");
        var file_ext = ext_split[1];

        if (file_ext == "png" || file_ext == "jpg" || file_ext == "gif") {
            Album.findByIdAndUpdate(
                albumId, { image: file_name },
                (err, albumUpdate) => {
                    if (!albumUpdate) {
                        res.status(404).send({ message: "no se actualizo" });
                    } else {
                        res.status(404).send({ album: albumUpdate });
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
    var path_file = "./uploads/albums/" + imageFile;

    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: "no existe la imagen..." });
        }
    });
}

module.exports = {
    getAlbum,
    guardarAlbum,
    getAlbums,
    actualizarAlbum,
    borrarAlbum,
    uploadImage,
    getImageFile,
};
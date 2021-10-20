const path = require("path");
const fs = require("fs");
const mongoosePaginate = require("mongoose-pagination");

const Artista = require("../models/artista.model");
const Album = require("../models/album.model");
const Cancion = require("../models/cancion.model");
const { restart } = require("nodemon");
const { SSL_OP_NETSCAPE_CA_DN_BUG } = require("constants");

function getCancion(req, res) {
    var cancionId = req.params.id;

    Cancion.findById(cancionId)
        .populate({ path: "album" })
        .exec((err, cancion) => {
            if (err) {
                res.status(500).send({ message: "error en la peticion" });
            } else {
                if (!cancion) {
                    res.status(404).send({ message: "no existe la cancion" });
                } else {
                    res.status(200).send({ cancion });
                }
            }
        });
}

function getCanciones(req, res) {
    var albumId = req.params.album;

    if (!albumId) {
        var find = Cancion.find({}).sort("numero");
    } else {
        var find = Cancion.find({ album: albumId }).sort("numero");
    }

    find
        .populate({
            path: "album",
            populate: {
                path: "artista",
                model: "Artista",
            },
        })
        .exec(function(err, canciones) {
            if (err) {
                res.status(500).send({ message: "error en la peticion" });
            } else {
                if (!canciones) {
                    res.status(404).send({ message: "no hay canciones" });
                } else {
                    res.status(200).send({ canciones });
                }
            }
        });
}

function guardarCancion(req, res) {
    var cancion = new Cancion();
    var params = req.body;
    cancion.numero = params.numero;
    cancion.nombre = params.nombre;
    cancion.duracion = params.duracion;
    cancion.file = null;
    cancion.album = params.album;

    cancion.save((err, cancionStored) => {
        if (err) {
            res.status(500).send({ message: "error en la peticion" });
        } else {
            if (!cancionStored) {
                res.status(404).send({ message: "no se guardo la cancion" });
            } else {
                res.status(200).send({ cancion: cancionStored });
            }
        }
    });
}

function actualizarCancion(req, res) {
    var cancionId = req.params.id;
    var update = req.body;

    Cancion.findByIdAndUpdate(cancionId, update, (err, cancionUpdate) => {
        if (err) {
            res.status(500).send({ message: "error en la peticion" });
        } else {
            if (!cancionUpdate) {
                res.status(404).send({ message: "no se actualizo la cancion" });
            } else {
                res.status(200).send({ cancion: cancionUpdate });
            }
        }
    });
}

function borrarCancion(req, res) {
    var cancionId = req.params.id;
    Cancion.findByIdAndRemove(cancionId, (err, cancionRemoved) => {
        if (err) {
            res.status(500).send({ message: "error en la peticion" });
        } else {
            if (!cancionRemoved) {
                res.status(404).send({ message: "no se elimino la cancion" });
            } else {
                res.status(200).send({ cancion: cancionRemoved });
            }
        }
    });
}

function uploadFile(req, res) {
    var cancionId = req.params.id;
    var file_name = "no subido...";

    if (req.files) {
        var file_path = req.files.file.path;
        var file_split = file_path.split("\\");
        var file_name = file_split[2];

        var ext_split = file_name.split(".");
        var file_ext = ext_split[1];

        if (file_ext == "mp3" || file_ext == "ogg") {
            Cancion.findByIdAndUpdate(
                cancionId, { file: file_name },
                (err, cancionUpdated) => {
                    if (!cancionUpdated) {
                        res.status(404).send({ message: "no se actualizo" });
                    } else {
                        res.status(200).send({ cancion: cancionUpdated });
                    }
                }
            );
        } else {
            res.status(200).send({ message: "Extencion de archivo no valido" });
        }
    } else {
        res.status(200).send({ message: "no se ha subido ninguna cancion..." });
    }
}

function getCancionFile(req, res) {
    var imageFile = req.params.cancionFile;
    var path_file = "./uploads/canciones/" + imageFile;

    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: "no existe la cancion..." });
        }
    });
}

module.exports = {
    getCancion,
    guardarCancion,
    getCanciones,
    actualizarCancion,
    borrarCancion,
    uploadFile,
    getCancionFile,
};
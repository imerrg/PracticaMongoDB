const { response } = require("express");
const Usuario = require("../models/usuario.model");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../helpers/jwt");
const { JsonWebTokenError } = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { exists } = require("../models/usuario.model");

const pruebas = async(req, res) => {
    res.status(200).send({
        message: "probando acciones",
    });
};

const guardarUsuario = async(req, res) => {
    const usuario = new Usuario();
    const params = req.body;
    console.log(params);
    usuario.nombre = params.nombre;
    usuario.apellido = params.apellido;
    usuario.email = params.email;
    usuario.role = "ROLE_ADMIN";
    usuario.image = "null";

    if (params.password) {
        bcrypt.hash(params.password, null, null, function(err, hash) {
            usuario.password = hash;
            if (
                usuario.nombre != null &&
                usuario.apellido != null &&
                usuario.email != null
            ) {
                //guardar el usuario
                usuario.save((err, usuarioStored) => {
                    if (err) {
                        res.status(500).send({ message: "Error al guardar el usuario" });
                    } else {
                        if (!usuarioStored) {
                            res
                                .status(400)
                                .send({ message: "No se ha registrado el usuario" });
                        } else {
                            res.status(200).send({ usuario: usuarioStored });
                        }
                    }
                });
            } else {
                res.status(200).send({ message: "introduce todos los campos" });
            }
        });
    } else {
        res.status(500).send({ message: "introduce la contraseña" });
    }
};
const loginUsuario = async(req, res) => {
    const params = req.body;

    const email = params.email;
    const password = params.password;

    Usuario.findOne({ email: email.toLowerCase() }, (err, usuario) => {
        if (err) {
            res.status(500).send({ message: "error en la peticion" });
        } else {
            if (!usuario) {
                res.status(400).send({ message: "El usuario no existe" });
            } else {
                //comprobar la contraseña
                bcrypt.compare(password, usuario.password, function(err, check) {
                    if (check) {
                        //devolver los datos del usuario
                        if (params.gethash) {
                            res.status(200).send({
                                token: jwt.crearToken(usuario),
                            });
                        } else {
                            res.status(200).send({ usuario });
                        }
                    } else {
                        res
                            .status(400)
                            .send({ message: "el usuario no ha podido logearse" });
                    }
                });
            }
        }
    });
};
const actualizarUsuario = async(req, res) => {
    const usuarioId = req.params.id;
    const update = req.body;

    Usuario.findByIdAndUpdate(usuarioId, update, (err, usuarioUpdate) => {
        if (err) {
            res.status(500).send({ message: "error al actualizar usuario" });
        } else {
            if (!usuarioUpdate) {
                res
                    .status(404)
                    .send({ message: "no se ha odido actualizar el usuario" });
            } else {
                res.status(200).send({ usuario: usuarioUpdate });
            }
        }
    });
};

function uploadImage(req, res) {
    var usuarioId = req.params.id;
    var file_name = "no subido...";

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split("\\");
        var file_name = file_split[2];

        var ext_split = file_name.split(".");
        var file_ext = ext_split[1];

        if (file_ext == "png" || file_ext == "jpg" || file_ext == "gif") {
            Usuario.findByIdAndUpdate(
                usuarioId, { image: file_name },
                (err, usuarioUpdate) => {
                    if (!usuarioUpdate) {
                        res.status(404).send({ message: "no se actualizo" });
                    } else {
                        res.status(404).send({ usuario: usuarioUpdate });
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
    var path_file = "./uploads/usuarios/" + imageFile;

    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: "no existe la imagen..." });
        }
    });
}

module.exports = {
    pruebas,
    guardarUsuario,
    loginUsuario,
    actualizarUsuario,
    uploadImage,
    getImageFile,
};
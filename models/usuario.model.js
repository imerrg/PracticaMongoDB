const { Schema, model } = require("mongoose");

const usuarioSchema = Schema({
    nombre: {
        type: String,
        require: true,
    },
    apellido: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: "USER_ROLE",
    },
});

module.exports = model("Usuario", usuarioSchema);
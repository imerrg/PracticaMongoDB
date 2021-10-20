const { Schema, model } = require("mongoose");

const artistaSchema = Schema({
    nombre: {
        type: String,
        require: true,
    },
    descripcion: {
        type: String,
        require: true,
    },

    image: {
        type: String,
    },
});
module.exports = model("Artista", artistaSchema);
const { Schema, model } = require("mongoose");

const cancionSchema = Schema({
    numero: {
        type: String,
        require: true,
    },
    nombre: {
        type: String,
        require: true,
    },
    duracion: {
        type: String,
        require: true,
    },

    file: {
        type: String,
        require: true,
    },
    album: {
        type: Schema.ObjectId,
        ref: "Album",
    },
});
module.exports = model("Cancion", cancionSchema);
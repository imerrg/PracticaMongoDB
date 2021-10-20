const { Schema, model } = require("mongoose");

const albumSchema = Schema({
    titulo: {
        type: String,
        require: true,
    },
    descripcion: {
        type: String,
        require: true,
    },
    año: {
        type: Number,
        require: true,
    },

    image: {
        type: String,
    },
    artista: {
        type: Schema.ObjectId,
        ref: "Artista",
    },
});
module.exports = model("Album", albumSchema);
const express = require("express"); //sintaxis de importacion en node.js

require("dotenv").config();

const { dbConection } = require("./config/database");

const cors = require("cors");

//crear servidor express
const app = express();

//configurar cors
app.use(cors());

app.use(express.json());

//Estableciendo conexion a la base de datos
dbConection();
//console.log(process.env);

//rutas de la API proyectos
app.use("/api", require("./routes/usuarios.routes"));
app.use("/api", require("./routes/artista.routes"));
app.use("/api", require("./routes/album.routes"));
app.use("/api", require("./routes/cancion.routes"));

//codigo desplegar servidor
app.listen(process.env.PORT, () => {
    console.log("Servidor desplegado en el puerto :" + process.env.PORT);
});
const jwt = require("jwt-simple");
const moment = require("moment");
const secret = "clave_secreta";
//Funcion que genera un JWT
exports.crearToken = function(usuario) {
    const payload = {
        sub: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        role: usuario.role,
        image: usuario.image,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix,
    };
    return jwt.encode(payload, secret);
};
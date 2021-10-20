const jwt = require("jwt-simple");
const moment = require("moment");
const secret = "clave_secreta";

exports.autorizarAcceso = function(req, res, next) {
    if (!req.headers.authorization) {
        return res
            .status(403)
            .send({ message: "la peticion no tiene autentificacion" });
    }
    const token = req.headers.authorization.replace(/['"]+/g, "");
    try {
        var payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: "el toquen ha expirado" });
        }
    } catch (ex) {
        //console.log(ex);
        return res.status(404).send({ message: "Token no valido" });
    }
    req.usuario = payload;
    next();
};
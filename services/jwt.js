'use estrict'

var jwt = require('jwt-simple');
var moment = require('moment');
var llave = 'S1st3m@D3R3st@ur@nt3sN0tFr33';

exports.createToken = (usr) => {
    var payload = {
        sub: usr._id,
        nombre: usr.nombre,
        correoe: usr.correoe,
        usuario: usr.usuario,
        iat: moment().unix(),
        exp: moment().add(24, 'hours').unix()
    };
    return jwt.encode(payload, llave);
};
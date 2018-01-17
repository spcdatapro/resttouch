'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var llave = 'S1st3m@D3R3st@ur@nt3sN0tFr33';

exports.ensureAuth = (req, res, next) => {
    if(!req.headers.authorization){
        return res.status(403).send({ mensaje: 'La petición no tiene la cabecera de autenticación.' });
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');

    try{
        var payload = jwt.decode(token, llave);
        if(payload.exp < moment().unix()){
            return res.status(401).send({ mensaje: 'El token ha expirado.' });
        }
    }catch(ex){
        return res.status(404).send({ mensaje: 'Error: el token no es válido.' });        
    }

    req.usrauth = payload;

    next();
};
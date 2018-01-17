'use strict'

// Modelos
var DiccionarioFox = require('../models/diccionariofox');

// Acciones
function crear(req, res) {
    var entidad = new DiccionarioFox();
    var params = req.body;

    entidad.idmongodb = params.idmongodb;
    entidad.idcomponente = params.idcomponente;
    entidad.idfox = params.idfox;
    entidad.detalle = params.detalle;
    entidad.power = params.power;
    entidad.idparticion = params.idparticion;
    entidad.idtipoprecio = params.idtipoprecio;

    entidad.save((err, entidadSvd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al crear el diccionario.' });
        } else {
            if (!entidadSvd) {
                res.status(200).send({ mensaje: 'No se pudo grabar el diccionario.' });
            } else {
                res.status(200).send({ mensaje: 'Diccionario grabado exitosamente.', entidad: entidadSvd });
            }
        }
    });
}

function modificar(req, res) {
    var identidad = req.params.id;
    var body = req.body;

    DiccionarioFox.findByIdAndUpdate(identidad, body, { new: true }, (err, entidadUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al modificar el diccionario.' });
        } else {
            if (!entidadUpd) {
                res.status(200).send({ mensaje: 'No se pudo modificar el diccionario.' });
            } else {
                res.status(200).send({ mensaje: 'Diccionario modificado exitosamente.', entidad: entidadUpd });
            }
        }
    });
}

function eliminar(req, res) {
    var identidad = req.params.id;
    var body = req.body;

    DiccionarioFox.findByIdAndUpdate(identidad, body, { new: true }, (err, entidadDel) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al eliminar el diccionario.' });
        } else {
            if (!entidadDel) {
                res.status(200).send({ mensaje: 'No se pudo eliminar el diccionario.' });
            } else {
                res.status(200).send({ mensaje: 'Diccionario eliminado exitosamente.', entidad: entidadDel });
            }
        }
    });
}

function getListaDiccionarioFox(req, res) {
    DiccionarioFox.find({}, null, (err, lista) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al listar los diccionarios.' });
        } else {
            if (lista.length == 0) {
                res.status(200).send({ mensaje: 'No se pudo encontrar diccionarios.' });
            } else {
                res.status(200).send({ mensaje: 'Lista de diccionarios.', lista: lista });
            }
        }
    });
}

function getDiccionarioFox(req, res) {
    var identidad = req.params.id;

    DiccionarioFox.findById(identidad, (err, entidad) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al buscar el diccionario.' });
        } else {
            if (!entidad) {
                res.status(200).send({ mensaje: 'No se pudo encontrar el diccionario.' });
            } else {
                res.status(200).send({ mensaje: 'Diccionario encontrado.', entidad: entidad });
            }
        }
    });
}

//API para fox
function lstdictfox(req, res) {
    DiccionarioFox.find({}, (err, res) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al listar los diccionarios.' });            
        } else {
            if (res.length == 0) {
                res.status(200).send({ mensaje: 'No se pudo encontrar diccionarios.' });
            } else {
                res.forEach((dict) => {
                    dict.idmongodb = dict.idmongodb ? dict.idmongodb : '';
                    dict.idcomponente = dict.idcomponente ? dict.idcomponente : '';
                    dict.idfox = dict.idfox ? dict.idfox : '';
                    dict.detalle = dict.detalle ? dict.detalle : '';
                    dict.power = dict.power ? dict.power : '';
                    dict.idparticion = dict.idparticion ? dict.idparticion : '';
                    dict.idtipoprecio = dict.idtipoprecio ? dict.idtipoprecio : '';
                });

                res.status(200).send({ mensaje: 'Lista de diccionarios.', lista: res });
            }
        }
    });
}

function upddictfox(req, res) {
    var identidad = req.params.id;
    var body = {};

    body.idfox = parseInt(req.params.idfox);
    body.detalle = parseInt(req.params.detalle);
    body.power = parseInt(req.params.power);
    body.idparticion = parseInt(req.params.idparticion);
    body.idtipoprecio = parseInt(req.params.idtipoprecio);

    DiccionarioFox.findByIdAndUpdate(identidad, body, { new: true }, (err, entidadUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al modificar el diccionario.' });
        } else {
            if (!entidadUpd) {
                res.status(200).send({ mensaje: 'No se pudo modificar el diccionario.' });
            } else {
                res.status(200).send({ mensaje: 'Diccionario modificado exitosamente.', entidad: entidadUpd });
            }
        }
    });    
}
//Fin de API para fox

module.exports = {
    crear, modificar, eliminar, getListaDiccionarioFox, getDiccionarioFox, lstdictfox, upddictfox
}
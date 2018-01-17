'use strict'

// Modelos
var EmisorTarjeta = require('../models/emisortarjeta');

// Acciones
function crear(req, res) {
    var et = new EmisorTarjeta();
    var params = req.body;

    et.nombre = params.nombre;
    et.debaja = params.debaja;

    et.save((err, entidadSvd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al crear el emisor de la tarjeta.' });
        } else {
            if (!entidadSvd) {
                res.status(200).send({ mensaje: 'No se pudo grabar el emisor de la tarjeta.' });
            } else {
                res.status(200).send({ mensaje: 'Emisor de tarjeta grabado exitosamente.', entidad: entidadSvd });
            }
        }
    });
}

function modificar(req, res) {
    var idet = req.params.id;
    var body = req.body;

    EmisorTarjeta.findByIdAndUpdate(idet, body, { new: true }, (err, entidadUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al modificar el emisor de tarjeta.' });
        } else {
            if (!entidadUpd) {
                res.status(200).send({ mensaje: 'No se pudo modificar el emisor de tarjeta.' });
            } else {
                res.status(200).send({ mensaje: 'Emisor de tarjeta modificado exitosamente.', entidad: entidadUpd });
            }
        }
    });
}

function eliminar(req, res) {
    var idet = req.params.id;
    var body = req.body;

    EmisorTarjeta.findByIdAndUpdate(idet, body, { new: true }, (err, entidadUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al eliminar el emisor de tarjeta.' });
        } else {
            if (!entidadUpd) {
                res.status(200).send({ mensaje: 'No se pudo eliminar el emisor de tarjeta.' });
            } else {
                res.status(200).send({ mensaje: 'Emisor de tarjeta eliminado exitosamente.', entidad: entidadUpd });
            }
        }
    });
}

function getEmisoresTarjeta(req, res) {
    var debaja = req.params.debaja;
    var filtro = {};
    switch (+debaja) {
        case 0: filtro = { debaja: false }; break;
        case 1: filtro = { debaja: true }; break;
        case 2: filtro = {}; break;
    }
    EmisorTarjeta.find(filtro, null, { sort: { nombre: 1 } }, (err, lista) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al listar los emisores de tarjeta.' });
        } else {
            if (lista.length == 0) {
                res.status(200).send({ mensaje: 'No se pudo encontrar emisores de tarjeta.' });
            } else {
                res.status(200).send({ mensaje: 'Lista de emisores de tarjeta.', lista: lista });
            }
        }
    });

}

function getEmisorTarjeta(req, res) {
    var idet = req.params.id;

    EmisorTarjeta.findById(idet, (err, entidad) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al buscar el emisor de tarjeta.' });
        } else {
            if (!entidad) {
                res.status(200).send({ mensaje: 'No se pudo encontrar el emisor de tarjeta.' });
            } else {
                res.status(200).send({ mensaje: 'Emisor de tarjeta encontrado.', entidad: entidad });
            }
        }
    });
}

module.exports = {
    crear, modificar, eliminar, getEmisoresTarjeta, getEmisorTarjeta
}
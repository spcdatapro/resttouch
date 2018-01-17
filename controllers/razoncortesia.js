'use strict'

// Modelos
var RazonCortesia = require('../models/razoncortesia');

// Acciones
function crear(req, res) {
    var entidad = new RazonCortesia();
    var params = req.body;

    entidad.razon = params.razon;    
    entidad.debaja = params.debaja;

    entidad.save((err, entidadSvd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al crear la razón por la cortesía.' });
        } else {
            if (!entidadSvd) {
                res.status(200).send({ mensaje: 'No se pudo grabar razón por la cortesía.' });
            } else {
                res.status(200).send({ mensaje: 'Razón de cortesía grabada exitosamente.', entidad: entidadSvd });
            }
        }
    });
}

function modificar(req, res) {
    var identidad = req.params.id;
    var body = req.body;

    RazonCortesia.findByIdAndUpdate(identidad, body, { new: true }, (err, entidadUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al modificar la razón por la cortesía.' });
        } else {
            if (!entidadUpd) {
                res.status(200).send({ mensaje: 'No se pudo modificar la razón por la cortesía.' });
            } else {
                res.status(200).send({ mensaje: 'Razón por la cortesía modificada exitosamente.', entidad: entidadUpd });
            }
        }
    });
}

function eliminar(req, res) {
    var identidad = req.params.id;
    var body = req.body;

    RazonCortesia.findByIdAndUpdate(identidad, body, { new: true }, (err, entidadDel) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al eliminar la razón por la cortesía.' });
        } else {
            if (!entidadDel) {
                res.status(200).send({ mensaje: 'No se pudo eliminar la razón por la cortesía.' });
            } else {
                res.status(200).send({ mensaje: 'Razón por la cortesía eliminada exitosamente.', entidad: entidadDel });
            }
        }
    });
}

function getRazonesCortesia(req, res) {
    var debaja = req.params.debaja;
    var filtro = {};
    switch (+debaja) {
        case 0: filtro = { debaja: false }; break;
        case 1: filtro = { debaja: true }; break;
        case 2: filtro = {}; break;
    }
    RazonCortesia.find(filtro, null, { sort: { razon: 1 } }, (err, lista) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al listar las razones por las cortesía.' });
        } else {
            if (lista.length == 0) {
                res.status(200).send({ mensaje: 'No se pudo encontrar razones de cortesía.' });
            } else {
                res.status(200).send({ mensaje: 'Lista de razones de cortesía.', lista: lista });
            }
        }
    });

}

function getRazonCortesia(req, res) {
    var identidad = req.params.id;

    RazonCortesia.findById(identidad, (err, entidad) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al buscar la razón por la cortesía.' });
        } else {
            if (!entidad) {
                res.status(200).send({ mensaje: 'No se pudo encontrar la razón por la cortesía.' });
            } else {
                res.status(200).send({ mensaje: 'Razón por la cortesía encontrada.', entidad: entidad });
            }
        }
    });
}

module.exports = {
    crear, modificar, eliminar, getRazonesCortesia, getRazonCortesia
}
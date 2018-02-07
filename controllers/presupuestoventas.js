'use strict'

// Modelos
var PresupuestoVentas = require('../models/presupuestoventas');

// Acciones
function crear(req, res) {
    var entidad = new PresupuestoVentas();
    var params = req.body;

    entidad.mes = params.mes;
    entidad.anio = params.anio;
    entidad.presupuesto = params.presupuesto;
    entidad.debaja = params.debaja;

    entidad.save((err, entidadSvd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al crear el presupuesto. ERROR: ' + err });
        } else {
            if (!entidadSvd) {
                res.status(200).send({ mensaje: 'No se pudo grabar el presupuesto.' });
            } else {
                res.status(200).send({ mensaje: 'Presupuesto grabado exitosamente.', entidad: entidadSvd });
            }
        }
    });
}

function modificar(req, res) {
    var identidad = req.params.id;
    var body = req.body;

    PresupuestoVentas.findByIdAndUpdate(identidad, body, { new: true }, (err, entidadUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al modificar el presupuesto. ERROR: ' + err });
        } else {
            if (!entidadUpd) {
                res.status(200).send({ mensaje: 'No se pudo modificar el presupuesto.' });
            } else {
                res.status(200).send({ mensaje: 'Presupuesto modificado exitosamente.', entidad: entidadUpd });
            }
        }
    });
}

function eliminar(req, res) {
    var identidad = req.params.id;
    var body = req.body;

    PresupuestoVentas.findByIdAndUpdate(identidad, body, { new: true }, (err, entidadDel) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al eliminar el presupuesto. ERROR: ' + err });
        } else {
            if (!entidadDel) {
                res.status(200).send({ mensaje: 'No se pudo eliminar el presupuesto.' });
            } else {
                res.status(200).send({ mensaje: 'Presupuesto eliminado exitosamente.', entidad: entidadDel });
            }
        }
    });
}

function getPresupuestos(req, res) {
    var debaja = req.params.debaja;
    var filtro = {};
    switch (+debaja) {
        case 0: filtro = { debaja: false }; break;
        case 1: filtro = { debaja: true }; break;
        case 2: filtro = {}; break;
    }
    PresupuestoVentas.find(filtro, null, { sort: { mes: 1, anio: 1 } }, (err, lista) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al listar los presupuestos. ERROR: ' + err });
        } else {
            if (lista.length == 0) {
                res.status(200).send({ mensaje: 'No se pudo encontrar presupuestos.' });
            } else {
                res.status(200).send({ mensaje: 'Lista de presupuestos.', lista: lista });
            }
        }
    });

}

function getPresupuesto(req, res) {
    var identidad = req.params.id;

    PresupuestoVentas.findById(identidad, (err, entidad) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al buscar el presupuesto. ERROR: ' + err });
        } else {
            if (!entidad) {
                res.status(200).send({ mensaje: 'No se pudo encontrar el presupuesto.' });
            } else {
                res.status(200).send({ mensaje: 'Presupuesto encontrado.', entidad: entidad });
            }
        }
    });
}

module.exports = {
    crear, modificar, eliminar, getPresupuestos, getPresupuesto
}
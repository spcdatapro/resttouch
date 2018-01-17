'use strict'

// Modelos
var FormaPago = require('../models/formapago');

// Acciones
function crear(req, res) {
    var fpago = new FormaPago();
    var params = req.body;

    fpago.descripcion = params.descripcion;
    fpago.estarjeta = params.estarjeta;
    fpago.escortesia = params.escortesia;
    fpago.condocumento = params.condocumento;
    fpago.orden = params.orden;
    fpago.debaja = params.debaja;

    fpago.save((err, entidadSvd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al crear la forma de pago.' });
        } else {
            if (!entidadSvd) {
                res.status(200).send({ mensaje: 'No se pudo grabar la forma de pago.' });
            } else {
                res.status(200).send({ mensaje: 'Forma de pago grabada exitosamente.', entidad: entidadSvd });
            }
        }
    });
}

function modificar(req, res) {
    var idfpago = req.params.id;
    var body = req.body;

    FormaPago.findByIdAndUpdate(idfpago, body, { new: true }, (err, entidadUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al modificar la forma de pago.' });
        } else {
            if (!entidadUpd) {
                res.status(200).send({ mensaje: 'No se pudo modificar la forma de pago.' });
            } else {
                res.status(200).send({ mensaje: 'Forma de pago modificada exitosamente.', entidad: entidadUpd });
            }
        }
    });
}

function eliminar(req, res) {
    var idfpago = req.params.id;
    var body = req.body;

    FormaPago.findByIdAndUpdate(idfpago, body, { new: true }, (err, entidadDel) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al eliminar la forma de pago.' });
        } else {
            if (!entidadDel) {
                res.status(200).send({ mensaje: 'No se pudo eliminar la forma de pago.' });
            } else {
                res.status(200).send({ mensaje: 'Forma de pago eliminada exitosamente.', entidad: entidadDel });
            }
        }
    });
}

function getFormasPago(req, res) {
    var debaja = req.params.debaja;
    var filtro = {};
    switch (+debaja) {
        case 0: filtro = { debaja: false }; break;
        case 1: filtro = { debaja: true }; break;
        case 2: filtro = {}; break;
    }
    FormaPago.find(filtro, null, { sort: { orden: 1 } }, (err, lista) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al listar las formas de pago.' });
        } else {
            if (lista.length === 0) {
                res.status(200).send({ mensaje: 'No se pudo encontrar formas de pago.' });
            } else {
                res.status(200).send({ mensaje: 'Lista de formas de pago.', lista: lista });
            }
        }
    });

}

function getFormaPago(req, res) {
    var idfpago = req.params.id;

    FormaPago.findById(idfpago, (err, entidad) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al buscar la forma de pago.' });
        } else {
            if (!entidad) {
                res.status(200).send({ mensaje: 'No se pudo encontrar la forma de pago.' });
            } else {
                res.status(200).send({ mensaje: 'Forma de pago encontrada.', entidad: entidad });
            }
        }
    });
}

module.exports = {
    crear, modificar, eliminar, getFormasPago, getFormaPago
}
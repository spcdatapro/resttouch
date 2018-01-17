'use strict'

// Modelos
var Vuelto = require('../models/vuelto');

// Acciones
function crear(req, res) {
    var entidad = new Vuelto();
    var params = req.body;

    entidad.descripcion = params.descripcion;
    entidad.valor = params.valor;
    entidad.debaja = params.debaja;

    entidad.save((err, entidadSvd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al crear el vuelto.' });
        } else {
            if (!entidadSvd) {
                res.status(200).send({ mensaje: 'No se pudo grabar el vuelto.' });
            } else {
                res.status(200).send({ mensaje: 'Vuelto grabado exitosamente.', entidad: entidadSvd });
            }
        }
    });
}

function modificar(req, res) {
    var identidad = req.params.id;
    var body = req.body;

    Vuelto.findByIdAndUpdate(identidad, body, { new: true }, (err, entidadUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al modificar el vuelto.' });
        } else {
            if (!entidadUpd) {
                res.status(200).send({ mensaje: 'No se pudo modificar el vuelto.' });
            } else {
                res.status(200).send({ mensaje: 'Vuelto modificado exitosamente.', entidad: entidadUpd });
            }
        }
    });
}

function eliminar(req, res) {
    var identidad = req.params.id;
    var body = req.body;

    Vuelto.findByIdAndUpdate(identidad, body, { new: true }, (err, entidadDel) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al eliminar el vuelto.' });
        } else {
            if (!entidadDel) {
                res.status(200).send({ mensaje: 'No se pudo eliminar el vuelto.' });
            } else {
                res.status(200).send({ mensaje: 'Vuelto eliminado exitosamente.', entidad: entidadDel });
            }
        }
    });
}

function getVueltos(req, res) {
    var debaja = req.params.debaja;
    var filtro = {};
    switch (+debaja) {
        case 0: filtro = { debaja: false }; break;
        case 1: filtro = { debaja: true }; break;
        case 2: filtro = {}; break;
    }
    Vuelto.find(filtro, null, { sort: { valor: 1 } }, (err, lista) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al listar los vueltos.' });
        } else {
            if (lista.length == 0) {
                res.status(200).send({ mensaje: 'No se pudo encontrar vueltos.' });
            } else {
                res.status(200).send({ mensaje: 'Lista de vueltos.', lista: lista });
            }
        }
    });

}

function getVueltosMayorQue(req, res) {
    var mayorque = parseFloat(req.params.mayorque);

    Vuelto.find({ $or: [{ valor: { $gt: mayorque } }, { valor: 0 }], debaja: false}, null, { sort: { valor: 1 } }, (err, lista) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al listar los vueltos mayores que ' + mayorque.toFixed(2) + '.' });
        } else {
            if (lista.length == 0) {
                res.status(200).send({ mensaje: 'No se pudo encontrar vueltos mayores que ' + mayorque.toFixed(2) + '.' });
            } else {
                res.status(200).send({ mensaje: 'Lista de vueltos mayores que ' + mayorque.toFixed(2) + '.', lista: lista });
            }
        }
    });

}

function getVuelto(req, res) {
    var identidad = req.params.id;

    Vuelto.findById(identidad, (err, entidad) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al buscar el vuelto.' });
        } else {
            if (!entidad) {
                res.status(200).send({ mensaje: 'No se pudo encontrar el vuelto.' });
            } else {
                res.status(200).send({ mensaje: 'Vuelto encontrado.', entidad: entidad });
            }
        }
    });
}

module.exports = {
    crear, modificar, eliminar, getVueltos, getVuelto, getVueltosMayorQue
}
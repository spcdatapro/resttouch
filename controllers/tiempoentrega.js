'use strict'

// Modelos
var TiempoEntrega = require('../models/tiempoentrega');

// Acciones
function crear(req, res) {
    var entidad = new TiempoEntrega();
    var params = req.body;

    entidad.tiempo = params.tiempo;    
    entidad.debaja = params.debaja;

    entidad.save((err, entidadSvd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al crear el tiempo de entrega. ERROR: ' + err });
        } else {
            if (!entidadSvd) {
                res.status(200).send({ mensaje: 'No se pudo grabar el tiempo de entrega.' });
            } else {
                res.status(200).send({ mensaje: 'Tiempo de entrega grabado exitosamente.', entidad: entidadSvd });
            }
        }
    });
}

function modificar(req, res) {
    var identidad = req.params.id;
    var body = req.body;

    TiempoEntrega.findByIdAndUpdate(identidad, body, { new: true }, (err, entidadUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al modificar el tiempo de entrega.' });
        } else {
            if (!entidadUpd) {
                res.status(200).send({ mensaje: 'No se pudo modificar el tiempo de entrega.' });
            } else {
                res.status(200).send({ mensaje: 'Tiempo de entrega modificado exitosamente.', entidad: entidadUpd });
            }
        }
    });
}

function eliminar(req, res) {
    var identidad = req.params.id;
    var body = req.body;

    TiempoEntrega.findByIdAndUpdate(identidad, body, { new: true }, (err, entidadDel) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al eliminar el tiempo de entrega.' });
        } else {
            if (!entidadDel) {
                res.status(200).send({ mensaje: 'No se pudo eliminar el tiempo de entrega.' });
            } else {
                res.status(200).send({ mensaje: 'Tiempo de entrega eliminado exitosamente.', entidad: entidadDel });
            }
        }
    });
}

function getTiemposEntrega(req, res) {
    var debaja = req.params.debaja;
    var filtro = {};
    switch (+debaja) {
        case 0: filtro = { debaja: false }; break;
        case 1: filtro = { debaja: true }; break;
        case 2: filtro = {}; break;
    }
    TiempoEntrega.find(filtro, null, { sort: { tiempo: 1 } }, (err, lista) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al listar los tiempos de entrega.' });
        } else {
            if (lista.length == 0) {
                res.status(200).send({ mensaje: 'No se pudo encontrar tiempos de entrega.' });
            } else {
                res.status(200).send({ mensaje: 'Lista de tiempos de entrega.', lista: lista });
            }
        }
    });

}

function getTiempoEntrega(req, res) {
    var identidad = req.params.id;

    TiempoEntrega.findById(identidad, (err, entidad) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al buscar el tiempo de entrega.' });
        } else {
            if (!entidad) {
                res.status(200).send({ mensaje: 'No se pudo encontrar el tiempo de entrega.' });
            } else {
                res.status(200).send({ mensaje: 'Tiempo de entrega encontrado.', entidad: entidad });
            }
        }
    });
}

module.exports = {
    crear, modificar, eliminar, getTiemposEntrega, getTiempoEntrega
}
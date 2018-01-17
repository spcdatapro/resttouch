'use strict'

// Modelos
var EstatusComanda = require('../models/estatuscomanda');

// Acciones
function crear(req, res) {
    var estcom = new EstatusComanda();
    var params = req.body;

    estcom.descripcion = params.descripcion;
    estcom.color = params.color;
    estcom.orden = params.orden;
    estcom.debaja = params.debaja;

    estcom.save((err, estatusComandaSvd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al crear el estatus de la comanda.' });
        } else {
            if (!estatusComandaSvd) {
                res.status(200).send({ mensaje: 'No se pudo grabar el estatus de la comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Estatus de comanda grabado exitosamente.', entidad: estatusComandaSvd });
            }
        }
    });
}

function modificar(req, res) {
    var idestatuscomanda = req.params.id;
    var body = req.body;

    EstatusComanda.findByIdAndUpdate(idestatuscomanda, body, { new: true }, (err, estatusComandaUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al modificar el estatus de comanda.' });
        } else {
            if (!estatusComandaUpd) {
                res.status(200).send({ mensaje: 'No se pudo modificar el estatus de comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Estatus de comanda modificado exitosamente.', entidad: estatusComandaUpd });
            }
        }
    });
}

function eliminar(req, res) {
    var idestatuscomanda = req.params.id;
    var body = req.body;

    EstatusComanda.findByIdAndUpdate(idestatuscomanda, body, { new: true }, (err, estatusComandaDel) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al eliminar el estatus de comanda.' });
        } else {
            if (!estatusComandaDel) {
                res.status(200).send({ mensaje: 'No se pudo eliminar el estatus de comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Estatus de comanda eliminado exitosamente.', entidad: estatusComandaDel });
            }
        }
    });
}

function getListaEstatusComanda(req, res) {
    var debaja = req.params.debaja;
    var filtro = {};
    switch (+debaja) {
        case 0: filtro = { debaja: false }; break;
        case 1: filtro = { debaja: true }; break;
        case 2: filtro = {}; break;
    }
    EstatusComanda.find(filtro, null, { sort: { orden: 1 } }, (err, lista) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al listar los estatus de comanda.' });
        } else {
            if (!lista) {
                res.status(200).send({ mensaje: 'No se pudo encontrar estatus de comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Lista de estatus de comanda.', lista: lista });
            }
        }
    });

}

function getEstatusComanda(req, res) {
    var idestatuscomanda = req.params.id;

    EstatusComanda.findById(idestatuscomanda, (err, estCom) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al buscar el estatus de comanda.' });
        } else {
            if (!estCom) {
                res.status(200).send({ mensaje: 'No se pudo encontrar el estatus de comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Estatus de comanda encontrado.', entidad: estCom });
            }
        }
    });
}

module.exports = {
    crear, modificar, eliminar, getListaEstatusComanda, getEstatusComanda
}
'use strict'

// Modelos
var TipoComanda = require('../models/tipocomanda');

// Acciones
function crear(req, res) {
    var tcom = new TipoComanda();
    var params = req.body;

    tcom.descripcion = params.descripcion;
    tcom.imagen = params.imagen;
    tcom.debaja = params.debaja;

    tcom.save((err, tcomSvd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al crear el tipo de comanda.' });
        } else {
            if (!tcomSvd) {
                res.status(200).send({ mensaje: 'No se pudo grabar el tipo de comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Tipo de comanda grabado exitosamente.', entidad: tcomSvd });
            }
        }
    });
}

function modificar(req, res) {
    var idtcom = req.params.id;
    var body = req.body;

    TipoComanda.findByIdAndUpdate(idtcom, body, { new: true }, (err, tcomUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al modificar el tipo de comanda.' });
        } else {
            if (!tcomUpd) {
                res.status(200).send({ mensaje: 'No se pudo modificar el tipo de comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Tipo de comanda modificado exitosamente.', entidad: tcomUpd });
            }
        }
    });
}

function eliminar(req, res) {
    var idtcom = req.params.id;
    var body = req.body;

    TipoComanda.findByIdAndUpdate(idtcom, body, { new: true }, (err, tcomDel) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al eliminar el tipo de comanda.' });
        } else {
            if (!tcomDel) {
                res.status(200).send({ mensaje: 'No se pudo eliminar el tipo de comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Tipo de comanda eliminado exitosamente.', entidad: tcomDel });
            }
        }
    });
}

function getTiposComanda(req, res) {
    var debaja = req.params.debaja;
    var filtro = {};
    switch (+debaja) {
        case 0: filtro = { debaja: false }; break;
        case 1: filtro = { debaja: true }; break;
        case 2: filtro = {}; break;
    }
    TipoComanda.find(filtro, null, { sort: { descripcion: 1 } }, (err, lista) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al listar los tipos de comanda.' });
        } else {
            if (lista.length == 0) {
                res.status(200).send({ mensaje: 'No se pudo encontrar tipos de comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Lista de tipos de comanda.', lista: lista });
            }
        }
    });

}

function getTipoComanda(req, res) {
    var idtipodir = req.params.id;

    TipoComanda.findById(idtipodir, (err, tcom) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al buscar el tipo de comanda.' });
        } else {
            if (!tcom) {
                res.status(200).send({ mensaje: 'No se pudo encontrar el tipo de comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Tipo de comanda encontrado.', entidad: tcom });
            }
        }
    });
}

module.exports = {
    crear, modificar, eliminar, getTiposComanda, getTipoComanda
}
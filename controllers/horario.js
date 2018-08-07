'use strict'

// Modelos
var Horario = require('../models/horario');

// Acciones
function crear(req, res) {
    var horario = new Horario();
    var params = req.body;

    horario.de = params.de;
    horario.a = params.a;
    horario.orden = params.orden;    
    horario.debaja = params.debaja;

    horario.save((err, entidadSvd) => {
        if (err) {
            res.status(500).send({
                mensaje: 'Error en el servidor al crear el horario.'
            });
        } else {
            if (!entidadSvd) {
                res.status(200).send({
                    mensaje: 'No se pudo grabar el horario.'
                });
            } else {
                res.status(200).send({
                    mensaje: 'Horario grabado exitosamente.',
                    entidad: entidadSvd
                });
            }
        }
    });
}

function modificar(req, res) {
    var idhorario = req.params.id;
    var body = req.body;

    Horario.findByIdAndUpdate(idhorario, body, {
        new: true
    }, (err, entidadUpd) => {
        if (err) {
            res.status(500).send({
                mensaje: 'Error en el servidor al modificar el horario.'
            });
        } else {
            if (!entidadUpd) {
                res.status(200).send({
                    mensaje: 'No se pudo modificar el horario.'
                });
            } else {
                res.status(200).send({
                    mensaje: 'Horario modificado exitosamente.',
                    entidad: entidadUpd
                });
            }
        }
    });
}

function eliminar(req, res) {
    var idhorario = req.params.id;
    var body = req.body;

    Horario.findByIdAndUpdate(idhorario, body, {
        new: true
    }, (err, entidadDel) => {
        if (err) {
            res.status(500).send({
                mensaje: 'Error en el servidor al eliminar el horario.'
            });
        } else {
            if (!entidadDel) {
                res.status(200).send({
                    mensaje: 'No se pudo eliminar el horario.'
                });
            } else {
                res.status(200).send({
                    mensaje: 'Horario eliminado exitosamente.',
                    entidad: entidadDel
                });
            }
        }
    });
}

function getHorarios(req, res) {
    var debaja = req.params.debaja;
    var filtro = {};
    switch (+debaja) {
        case 0:
            filtro = {
                debaja: false
            };
            break;
        case 1:
            filtro = {
                debaja: true
            };
            break;
        case 2:
            filtro = {};
            break;
    }
    Horario.find(filtro, null, {
        sort: {
            orden: 1
        }
    }, (err, lista) => {
        if (err) {
            res.status(500).send({
                mensaje: 'Error en el servidor al listar los horarios.'
            });
        } else {
            if (lista.length === 0) {
                res.status(200).send({
                    mensaje: 'No se pudo encontrar horarios.'
                });
            } else {
                res.status(200).send({
                    mensaje: 'Lista de horarios.',
                    lista: lista
                });
            }
        }
    });

}

function getHorario(req, res) {
    var idhorario = req.params.id;

    Horario.findById(idhorario, (err, entidad) => {
        if (err) {
            res.status(500).send({
                mensaje: 'Error en el servidor al buscar el horario.'
            });
        } else {
            if (!entidad) {
                res.status(200).send({
                    mensaje: 'No se pudo encontrar el horario.'
                });
            } else {
                res.status(200).send({
                    mensaje: 'Horario encontrado.',
                    entidad: entidad
                });
            }
        }
    });
}

module.exports = {
    crear,
    modificar,
    eliminar,
    getHorarios,
    getHorario
}
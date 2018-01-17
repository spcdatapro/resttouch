'use strict'

// Modelos
var RolUsuario = require('../models/rolusuario');

// Acciones
function crear(req, res) {
    var entidad = new RolUsuario();
    var params = req.body;

    entidad.descripcion = params.descripcion;    
    entidad.debaja = params.debaja;

    entidad.save((err, entidadSvd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al crear el rol del usuario. ERROR: ' + err });
        } else {
            if (!entidadSvd) {
                res.status(200).send({ mensaje: 'No se pudo grabar el rol del usuario.' });
            } else {
                res.status(200).send({ mensaje: 'Rol del usuario grabado exitosamente.', entidad: entidadSvd });
            }
        }
    });
}

function modificar(req, res) {
    var identidad = req.params.id;
    var body = req.body;

    RolUsuario.findByIdAndUpdate(identidad, body, { new: true }, (err, entidadUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al modificar el rol del usuario.' });
        } else {
            if (!entidadUpd) {
                res.status(200).send({ mensaje: 'No se pudo modificar el rol del usuario.' });
            } else {
                res.status(200).send({ mensaje: 'Rol del usuario modificado exitosamente.', entidad: entidadUpd });
            }
        }
    });
}

function eliminar(req, res) {
    var identidad = req.params.id;
    var body = req.body;

    RolUsuario.findByIdAndUpdate(identidad, body, { new: true }, (err, entidadDel) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al eliminar el rol del usuario.' });
        } else {
            if (!entidadDel) {
                res.status(200).send({ mensaje: 'No se pudo eliminar el rol del usuario.' });
            } else {
                res.status(200).send({ mensaje: 'Rol del usuario eliminado exitosamente.', entidad: entidadDel });
            }
        }
    });
}

function getRolesUsuario(req, res) {
    var debaja = req.params.debaja;
    var filtro = {};
    switch (+debaja) {
        case 0: filtro = { debaja: false }; break;
        case 1: filtro = { debaja: true }; break;
        case 2: filtro = {}; break;
    }
    RolUsuario.find(filtro, null, { sort: { descripcion: 1 } }, (err, lista) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al listar los roles del usuario.' });
        } else {
            if (lista.length == 0) {
                res.status(200).send({ mensaje: 'No se pudo encontrar roles del usuario.' });
            } else {
                res.status(200).send({ mensaje: 'Lista de roles del usuario.', lista: lista });
            }
        }
    });

}

function getRolUsuario(req, res) {
    var identidad = req.params.id;

    RolUsuario.findById(identidad, (err, entidad) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al buscar el rol del usuario.' });
        } else {
            if (!entidad) {
                res.status(200).send({ mensaje: 'No se pudo encontrar el rol del usuario.' });
            } else {
                res.status(200).send({ mensaje: 'Rol del usuario encontrado.', entidad: entidad });
            }
        }
    });
}

module.exports = {
    crear, modificar, eliminar, getRolesUsuario, getRolUsuario
}
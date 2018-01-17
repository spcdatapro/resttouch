'use strict'

// Modelos
var Componente = require('../models/componente');

// Acciones
function crear(req, res) {
    var compo = new Componente();
    var params = req.body;

    compo.descripcion = params.descripcion;
    compo.comoextra = params.comoextra;
    compo.secobra = params.secobra;
    compo.debaja = params.debaja;

    compo.save((err, compoSvd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al crear el componente.' });
        } else {
            if (!compoSvd) {
                res.status(200).send({ mensaje: 'No se pudo grabar el componente.' });
            } else {
                res.status(200).send({ mensaje: 'Componente grabado exitosamente.', entidad: compoSvd });
            }
        }
    });
}

function modificar(req, res) {
    var idcompo = req.params.id;
    var body = req.body;

    Componente.findByIdAndUpdate(idcompo, body, { new: true }, (err, compoUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al modificar el componente.' });
        } else {
            if (!compoUpd) {
                res.status(200).send({ mensaje: 'No se pudo modificar el componente.' });
            } else {
                res.status(200).send({ mensaje: 'Componente modificado exitosamente.', entidad: compoUpd });
            }
        }
    });
}

function eliminar(req, res) {
    var idcompo = req.params.id;
    var body = req.body;

    Componente.findByIdAndUpdate(idcompo, body, { new: true }, (err, compoDel) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al eliminar el componente.' });
        } else {
            if (!compoDel) {
                res.status(200).send({ mensaje: 'No se pudo eliminar el componente.' });
            } else {
                res.status(200).send({ mensaje: 'Componente eliminado exitosamente.', entidad: compoDel });
            }
        }
    });
}

function getComponentes(req, res) {
    var debaja = req.params.debaja;
    var filtro = {};
    switch (+debaja) {
        case 0: filtro = { debaja: false }; break;
        case 1: filtro = { debaja: true }; break;
        case 2: filtro = {}; break;
    }
    Componente.find(filtro, null, { sort: { descripcion: 1 } }, (err, lista) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al listar los componentes.' });
        } else {
            if (!lista) {
                res.status(200).send({ mensaje: 'No se pudo encontrar componentes.' });
            } else {
                res.status(200).send({ mensaje: 'Lista de componentes.', lista: lista });
            }
        }
    });

}

function getComponente(req, res) {
    var idcompo = req.params.id;

    Componente.findById(idcompo, (err, compo) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al buscar el componente.' });
        } else {
            if (!compo) {
                res.status(200).send({ mensaje: 'No se pudo encontrar el componente.' });
            } else {
                res.status(200).send({ mensaje: 'Componente encontrado.', entidad: compo });
            }
        }
    });
}

function getExtras(req, res) {
    var debaja = req.params.debaja;
    var filtro = {};
    switch (+debaja) {
        case 0: filtro = { comoextra: true, debaja: false }; break;
        case 1: filtro = { comoextra: true, debaja: true }; break;
        case 2: filtro = { comoextra: true }; break;
    }
    
    Componente.find(filtro, null, { sort: { descripcion: 1 } }, (err, lista) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al listar los extras.' });
        } else {
            if (lista.length == 0) {
                res.status(200).send({ mensaje: 'No se pudo encontrar extras.' });
            } else {
                res.status(200).send({ mensaje: 'Lista de extras.', lista: lista });
            }
        }
    });
}

module.exports = {
    crear, modificar, eliminar, getComponentes, getComponente, getExtras
}
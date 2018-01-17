'use strict'

// Modelos
var MenuRestComponente = require('../models/menurestcomponente');

// Acciones
function crear(req, res) {
    var mnurestcomp = new MenuRestComponente();
    var params = req.body;

    mnurestcomp.idmenurest = params.idmenurest;
    mnurestcomp.idcomponente = params.idcomponente;
    mnurestcomp.debaja = params.debaja;

    mnurestcomp.save((err, entidadSvd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al crear el menú restaurante - componente.' });
        } else {
            if (!entidadSvd) {
                res.status(200).send({ mensaje: 'No se pudo grabar el menú restaurante - componente.' });
            } else {
                res.status(200).send({ mensaje: 'Menú restaurante - componente grabado exitosamente.', entidad: entidadSvd });
            }
        }
    });
}

function modificar(req, res) {
    var idmenurestcomp = req.params.id;
    var body = req.body;

    MenuRestComponente.findByIdAndUpdate(idmenurestcomp, body, { new: true }, (err, entidadUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al modificar el menú restaurante - componente.' });
        } else {
            if (!entidadUpd) {
                res.status(200).send({ mensaje: 'No se pudo modificar el menú restaurante - componente.' });
            } else {
                res.status(200).send({ mensaje: 'Menú restaurante - componente modificado exitosamente.', entidad: entidadUpd });
            }
        }
    });
}

function eliminar(req, res) {
    var idmenurestcomp = req.params.id;
    var body = req.body;

    MenuRestComponente.findByIdAndUpdate(idmenurestcomp, body, { new: true }, (err, entidadDel) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al eliminar el menú restaurante - componente.' });
        } else {
            if (!entidadDel) {
                res.status(200).send({ mensaje: 'No se pudo eliminar el menú restaurante - componente.' });
            } else {
                res.status(200).send({ mensaje: 'Menú restaurante - componente eliminado exitosamente.', entidad: entidadDel });
            }
        }
    });
}

function getLstMenuRestComponente(req, res) {
    var idmenurest = req.params.idmenurest;
    
    MenuRestComponente.find({ idmenurest: idmenurest, debaja: false }).populate('idcomponente', ['_id', 'descripcion']).exec((err, lista) => {    
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al listar menú restaurante - componente.' });
        } else {
            if (!lista) {
                res.status(200).send({ mensaje: 'No se pudo encontrar menú restaurante - componente.' });
            } else {
                lista.forEach((item, i) => { if(!item.idcomponente){ lista.splice(i, 1); } });

                lista.sort((a, b) => {
                    if (a.idcomponente.descripcion < b.idcomponente.descripcion) { return -1; }
                    if (a.idcomponente.descripcion > b.idcomponente.descripcion) { return 1; }
                    return 0;                    
                });
                res.status(200).send({ mensaje: 'Lista de menú restaurante - componente.', lista: lista });
            }
        }
    });

}

function getMenuRestComponente(req, res) {
    var idmenurestcomp = req.params.id;

    MenuRestComponente.findById(idmenurestcomp, (err, entidad) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al buscar menú restaurante - componente.' });
        } else {
            if (!entidad) {
                res.status(200).send({ mensaje: 'No se pudo encontrar menú restaurante - componente.' });
            } else {
                res.status(200).send({ mensaje: 'Menú restaurante - componente encontrado.', entidad: entidad });
            }
        }
    });
}

module.exports = {
    crear, modificar, eliminar, getLstMenuRestComponente, getMenuRestComponente
}
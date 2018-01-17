'use strict'

// Modelos
var Banner = require('../models/banner');

// Acciones
function crear(req, res) {
    var ban = new Banner();
    var params = req.body;

    ban.banner = params.banner;
    ban.espermanente = params.espermanente;
    ban.fechadel = params.fechadel;
    ban.fechaal = params.fechaal;
    ban.fechacrea = params.fechacrea;
    ban.idusrcrea = params.idusrcrea;
    ban.fechamod = null;
    ban.idusrmod = null;
    ban.debaja = params.debaja;

    ban.save((err, entidadSvd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al crear el recordatorio al operador.' });
        } else {
            if (!entidadSvd) {
                res.status(200).send({ mensaje: 'No se pudo grabar el recordatorio al operador.' });
            } else {
                res.status(200).send({ mensaje: 'Recordatorio al operador grabado exitosamente.', entidad: entidadSvd });
            }
        }
    });
}

function modificar(req, res) {
    var iban = req.params.id;
    var body = req.body;

    Banner.findByIdAndUpdate(iban, body, { new: true }, (err, entidadUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al modificar recordatorio al operador.' });
        } else {
            if (!entidadUpd) {
                res.status(200).send({ mensaje: 'No se pudo modificar el recordatorio al operador.' });
            } else {
                res.status(200).send({ mensaje: 'Recordatorio al operador modificado exitosamente.', entidad: entidadUpd });
            }
        }
    });
}

function eliminar(req, res) {
    var idban = req.params.id;
    var body = req.body;

    Banner.findByIdAndUpdate(idban, body, { new: true }, (err, entidadUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al eliminar el recordatorio al operador.' });
        } else {
            if (!entidadUpd) {
                res.status(200).send({ mensaje: 'No se pudo eliminar el recordatorio al operador.' });
            } else {
                res.status(200).send({ mensaje: 'Recordatorio al operador eliminado exitosamente.', entidad: entidadUpd });
            }
        }
    });
}

function getBanners(req, res) {
    var debaja = req.params.debaja;
    var filtro = {};
    switch (+debaja) {
        case 0: filtro = { debaja: false }; break;
        case 1: filtro = { debaja: true }; break;
        case 2: filtro = {}; break;
    }

    Banner.find(filtro, null, { sort: { fechacrea: -1 } })
        .populate('idusrcrea', ['_id', 'nombre'])
        .populate('idusrmod', ['_id', 'nombre'])
        .exec((err, lista) => {
            if (err) {
                res.status(500).send({ mensaje: 'Error en el servidor al listar los recordatorios al operador.' });
            } else {
                if (lista.length == 0) {
                    res.status(200).send({ mensaje: 'No se pudo encontrar recordatorios al operador.' });
                } else {
                    res.status(200).send({ mensaje: 'Lista de recordatorios al operador.', lista: lista });
                }
            }
        });
}

function lstBannersFecha(req, res){
    var hoy = new Date();
    var lst = [];

    Banner.find({ fechadel: { $lte: hoy }, fechaal: { $gte: hoy }, espermanente: false, debaja: false}, null, { sort: {fechacrea: -1} })
        .populate('idusrcrea', ['_id', 'nombre'])
        .populate('idusrmod', ['_id', 'nombre'])
        .exec((err, lista) => {
            if (err) {
                res.status(500).send({ mensaje: 'Error en el servidor al listar los recordatorios al operador.' });
            } else {
                if (lista.length == 0) {
                    res.status(200).send({ mensaje: 'No se encontraron recordatorios al operador.' });
                } else {
                    lst = lista;
                    // console.log(lst);
                    Banner.find({ espermanente: true, debaja: false }, null, { sort: { fechacrea: -1 } })
                        .populate('idusrcrea', ['_id', 'nombre'])
                        .populate('idusrmod', ['_id', 'nombre'])
                        .exec((errPerm, listaPerm) => {
                            if (errPerm) {
                                res.status(500).send({ mensaje: 'Error en el servidor al listar los recordatorios al operador.' });
                            } else {
                                if (listaPerm.length == 0) {
                                    res.status(200).send({ mensaje: 'No se encontraron recordatorios al operador.' });
                                } else {
                                    listaPerm.forEach(item => { lst.push(item); });
                                    // console.log(lst);
                                    res.status(200).send({ mensaje: 'Lista de recordatorios al operador.', lista: lst });
                                }
                            }
                        });
                }
            }
        });
}

function getBanner(req, res) {
    var idban = req.params.id;

    Banner.findById(idban, (err, entidad) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al buscar el recordatorio al operador.' });
        } else {
            if (!entidad) {
                res.status(200).send({ mensaje: 'No se pudo encontrar el recordatorio al operador.' });
            } else {
                res.status(200).send({ mensaje: 'Recordatorio al operador encontrado.', entidad: entidad });
            }
        }
    });
}

module.exports = {
    crear, modificar, eliminar, getBanners, getBanner, lstBannersFecha
}
'use strict'

// Modelos
var TipoDireccion = require('../models/tipodireccion');

// Acciones
function crear(req, res){
    var tipodir = new TipoDireccion();
    var params = req.body;

    tipodir.descripcion = params.descripcion;
    tipodir.debaja = params.debaja;

    tipodir.save((err, tipodirSvd) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al crear el tipo de dirección.' });
        }else{
            if(!tipodirSvd){
                res.status(200).send({ mensaje: 'No se pudo grabar el tipo de dirección.' });
            }else{
                res.status(200).send({ mensaje:'Tipo de dirección grabada exitosamente.', entidad: tipodirSvd});
            }
        }
    });
}

function modificar(req, res){
    var idtipodir = req.params.id;
    var body = req.body;

    TipoDireccion.findByIdAndUpdate(idtipodir, body, { new: true }, (err, tipodirUpd) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al modificar el tipo de dirección.' });
        }else{
            if(!tipodirUpd){
                res.status(200).send({ mensaje: 'No se pudo modificar el tipo de dirección.' });
            }else{
                res.status(200).send({ mensaje:'Tipo de dirección modificada exitosamente.', entidad: tipodirUpd});
            }
        }        
    });
}

function eliminar(req, res){
    var idtipodir = req.params.id;
    var body = req.body;

    TipoDireccion.findByIdAndUpdate(idtipodir, body, { new: true }, (err, tipodirDel) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al eliminar el tipo de dirección.' });
        }else{
            if(!tipodirDel){
                res.status(200).send({ mensaje: 'No se pudo eliminar el tipo de dirección.' });
            }else{
                res.status(200).send({ mensaje:'Tipo de dirección eliminada exitosamente.', entidad: tipodirDel});
            }
        }        
    });
}

function getTiposDireccion(req, res){
    var debaja = req.params.debaja;
    var filtro = {};
    switch(+debaja){
        case 0: filtro = { debaja: false }; break;
        case 1: filtro = { debaja: true }; break;
        case 2: filtro = {}; break;
    }
    TipoDireccion.find(filtro, null, { sort: { descripcion: 1 } }, (err, lista) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al listar los tipos de dirección.' });
        }else{
            if(!lista){
                res.status(200).send({ mensaje: 'No se pudo encontrar tipos de dirección.' });
            }else{
                res.status(200).send({ mensaje:'Lista de tipos de dirección.', lista: lista});
            }
        }        
    });

}

function getTipoDireccion(req, res){
    var idtipodir = req.params.id;

    TipoDireccion.findById(idtipodir, (err, tipodir) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al buscar el tipo de dirección.' });
        }else{
            if(!tipodir){
                res.status(200).send({ mensaje: 'No se pudo encontrar el tipo de dirección.' });
            }else{
                res.status(200).send({ mensaje:'Tipo de dirección encontrado.', entidad: tipodir});
            }
        }
    });
}

module.exports = {
    crear, modificar, eliminar, getTiposDireccion, getTipoDireccion
}
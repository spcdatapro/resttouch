'use strict'

// Modelos
var Restaurante = require('../models/restaurante');

// Acciones
function crear(req, res){
    var restaurante = new Restaurante();
    var params = req.body;

    restaurante.nombre = params.nombre;
    restaurante.debaja = params.debaja;

    restaurante.save((err, restauranteSvd) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al crear el restaurante.' });
        }else{
            if(!restauranteSvd){
                res.status(200).send({ mensaje: 'No se pudo grabar el restaurante.' });
            }else{
                res.status(200).send({ mensaje:'Restaurante grabado exitosamente.', entidad: restauranteSvd});
            }
        }
    });
}

function modificar(req, res){
    var idrestaurante = req.params.id;
    var body = req.body;

    Restaurante.findByIdAndUpdate(idrestaurante, body, { new: true }, (err, restauranteUpd) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al modificar el restaurante.' });
        }else{
            if(!restauranteUpd){
                res.status(200).send({ mensaje: 'No se pudo modificar el restaurante.' });
            }else{
                res.status(200).send({ mensaje:'Restaurante modificado exitosamente.', entidad: restauranteUpd});
            }
        }        
    });
}

function eliminar(req, res){
    var idrestaurante = req.params.id;
    var body = req.body;

    Restaurante.findByIdAndUpdate(idrestaurante, body, { new: true }, (err, restauranteDel) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al eliminar el restaurante.' });
        }else{
            if(!restauranteDel){
                res.status(200).send({ mensaje: 'No se pudo eliminar el restaurante.' });
            }else{
                res.status(200).send({ mensaje:'Restaurante eliminado exitosamente.', entidad: restauranteDel});
            }
        }        
    });
}

function getRestaurantes(req, res){
    var debaja = req.params.debaja;
    var filtro = {};
    switch(+debaja){
        case 0: filtro = {debaja: false}; break;
        case 1: filtro = {debaja: true}; break;
        case 2: filtro = {}; break;
    }
    Restaurante.find(filtro, null, { sort: { nombre: 1 } }, (err, lista) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al listar los restaurantes.' });
        }else{
            if(!lista){
                res.status(200).send({ mensaje: 'No se pudo encontrar restaurantes.' });
            }else{
                res.status(200).send({ mensaje:'Lista de restaurantes.', lista: lista});
            }
        }        
    });

}

function getRestaurante(req, res){
    var idrestaurante = req.params.id;

    Restaurante.findById(idrestaurante, (err, restaurante) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al buscar el restaurante.' });
        }else{
            if(!restaurante){
                res.status(200).send({ mensaje: 'No se pudo encontrar el restaurante.' });
            }else{
                res.status(200).send({ mensaje:'Restaurante encontrado.', entidad: restaurante});
            }
        }
    });
}

module.exports = {
    crear, modificar, eliminar, getRestaurantes, getRestaurante
}
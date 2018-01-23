'use strict'

//Modulos
var bcrypt = require('bcrypt-nodejs');

//Modelos
var usuario = require('../models/usuario');

//Servicio JWT
var jwt = require('../services/jwt');

//Acciones
function pruebas(req, res){ res.status(200).send({ mensaje: 'Probando controlador de usuarios, acción pruebas', usrauth: req.usrauth }); }

function crear(req, res){
    var usrObj = new usuario();

    var params = req.body;

    usrObj.nombre = params.nombre;
    usrObj.usuario = params.usuario.toLowerCase();    
    usrObj.correoe = params.correoe;
    usrObj.roles = params.roles;
    usrObj.restaurante = params.restaurante;
    usrObj.debaja = params.debaja;

    usuario.findOne({usuario: usrObj.usuario}, (err, usrExistente) => {
        if(err){
            res.status(500).send({ mensaje:'Error: ' + err });            
        }else{
            if(!usrExistente){
                bcrypt.hash(params.contrasenia, null, null, (err, hash) => {
                    usrObj.contrasenia = hash;
                    usrObj.save((err, usuarioStored) => {
                        if(err){
                            res.status(500).send({ mensaje:'Error: ' + err });
                        }else{
                            if(!usuarioStored){
                                res.status(404).send({mensaje:'El usuario no se pudo registrar' });
                            }else{
                                res.status(200).send({
                                    mensaje:'Usuario registrado con éxito.',
                                    entidad: usuarioStored
                                });
                            }
                        }
                    });
                });
            }else{
                res.status(200).send({
                    mensaje:'El usuario ya fue registrado.',
                    entidad: usrExistente
                });
            }
        }
    });    
}

function login(req, res){
    var params = req.body;
    usuario.findOne({usuario: params.usuario.toLowerCase()}, (err, usrExistente) => {
        if(err){
            res.status(500).send({ mensaje:'Error: ' + err });
        }else{
            if(usrExistente){
                bcrypt.compare(params.contrasenia, usrExistente.contrasenia, (err, check) =>{
                    if(check){
                        usrExistente.contrasenia = null;
                        if(params.gettoken){
                            res.status(200).send({
                                mensaje: 'Acceso aprobado.',
                                entidad: usrExistente,
                                token: jwt.createToken(usrExistente)
                            });
                        }else{
                            res.status(200).send({
                                mensaje:'Acceso aprobado.',
                                entidad: usrExistente
                            });                            
                        }                        
                    }else{
                        res.status(200).send({ mensaje:'Error en el usuario o la contraseña. Intente de nuevo, por favor.' });
                    }
                });                
            }else{
                res.status(200).send({ mensaje:'El usuario no existe.' });
            }
        }
    });    
}

function execUpdate(req, res, idusuario, body){
    usuario.findByIdAndUpdate(idusuario, body, {new: true}, (err, usrUpd) => {
        if(err){
            res.status(500).send({ mensaje: 'Error al modificar el usuario.' });    
        }else{
            if(!usrUpd){
                res.status(404).send({ mensaje: 'No se pudo modificar el usuario.' });
            }else{
                res.status(200).send({ mensaje: 'Usuario modificado con éxito.', usr: usrUpd });    
            }
        }
    });
}

function modificar(req, res){
    var idusuario = req.params.id;
    var body = req.body;

    // if(idusuario != req.usrauth.sub){
        //res.status(500).send({ mensaje: 'No tienes permiso para actualizar el usuario' });
    //}else{
        if(body.contrasenia){
            bcrypt.hash(body.contrasenia, null, null, (err, hash)=>{
                body.contrasenia = hash;        
                execUpdate(req, res, idusuario, body);                
            })
        }else{
            execUpdate(req, res, idusuario, body);
        }
    //}    
}

function lstusuarios(req, res){
    usuario.find().sort('nombre').exec((err, lista)=>{
        if(err){
            res.status(500).send({mensaje: 'Error en la solicitud.'});
        }else{
            if(!lista){
                res.status(200).send({mensaje: 'Lista de usuarios vacía.'});
            }else{
                res.status(200).send({mensaje: 'Lista de usuarios.', lista: lista});
            }
        }
    });
}

function getusuario(req, res){
    var idusuario = req.params.id;
    usuario.findById(idusuario, (err, usr)=>{
        if(err){
            res.status(500).send({mensaje: 'Error en la solicitud.'});
        }else{
            if(!usr){
                res.status(200).send({mensaje: 'Usuario no encontrado.'});
            }else{
                res.status(200).send({mensaje: 'Usuario encontrado.', entidad: usr});
            }
        }
    });
}

function eliminar(req, res) {
    var idusuario = req.params.id;
    var body = req.body;

    usuario.findByIdAndUpdate(idusuario, body, { new: true }, (err, usrDel) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error al eliminar el usuario.' });
        } else {
            if (!usrDel) {
                res.status(200).send({ mensaje: 'No se pudo eliminar el usuario.' });
            } else {
                res.status(200).send({ mensaje: 'Usuario eliminado con éxito.', usr: usrDel });
            }
        }
    });
}

//Inicia API para FOX
function creaDeFox(req, res) {
    var usrObj = new usuario();

    var params = req.body;

    usrObj.nombre = params.nombre;
    usrObj.usuario = params.usuario.toLowerCase();
    usrObj.correoe = params.correoe;
    usrObj.roles = params.roles;
    usrObj.debaja = params.debaja;

    usuario.findOne({ usuario: usrObj.usuario }, (err, usrExistente) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error: ' + err });
        } else {
            if (!usrExistente) {
                bcrypt.hash(params.contrasenia, null, null, (err, hash) => {
                    usrObj.contrasenia = hash;
                    usrObj.save((err, usuarioStored) => {
                        if (err) {
                            res.status(500).send({ mensaje: 'Error: ' + err });
                        } else {
                            if (!usuarioStored) {
                                res.status(404).send({ mensaje: 'El usuario no se pudo registrar' });
                            } else {
                                res.status(200).send({
                                    mensaje: 'Usuario registrado con éxito.',
                                    entidad: usuarioStored
                                });
                            }
                        }
                    });
                });
            } else {
                res.status(200).send({
                    mensaje: 'El usuario ya fue registrado.',
                    entidad: usrExistente
                });
            }
        }
    });
}

function modificaDeFox(req, res) {
    var idusuario = req.params.id;
    var body = req.body;

    if (body.contrasenia) {
        bcrypt.hash(body.contrasenia, null, null, (err, hash) => {
            body.contrasenia = hash;
            execUpdate(req, res, idusuario, body);
        })
    } else {
        execUpdate(req, res, idusuario, body);
    }
}

//Finaliza API para FOX

module.exports = {
    pruebas, crear, login, modificar, lstusuarios, getusuario, eliminar,
    //Inicia API para FOX
    creaDeFox, modificaDeFox
    //Finaliza API para FOX
};
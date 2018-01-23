'use strict'

var express = require('express');
var UsuarioController = require('../controllers/usuario');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/usr/pruebas-del-controlador', md_auth.ensureAuth, UsuarioController.pruebas);
api.post('/usr/c', md_auth.ensureAuth, UsuarioController.crear);
api.put('/usr/u/:id', md_auth.ensureAuth, UsuarioController.modificar);
//api.put('/usr/u/:id', UsuarioController.modificar);
api.put('/usr/d/:id', md_auth.ensureAuth, UsuarioController.eliminar);
api.post('/usr/login', UsuarioController.login);
api.get('/usr/lstusuarios', md_auth.ensureAuth, UsuarioController.lstusuarios);
api.get('/usr/getusuario/:id', md_auth.ensureAuth, UsuarioController.getusuario);

//API para FOX
api.post('/usr/cdf', UsuarioController.creaDeFox);
api.post('/usr/udf/:id', UsuarioController.modificaDeFox);

module.exports = api;
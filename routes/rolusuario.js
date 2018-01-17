var express = require('express');
var RolUsuarioController = require('../controllers/rolusuario');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// Tipos de dirección
api.post('/rol/c', md_auth.ensureAuth, RolUsuarioController.crear);
api.put('/rol/u/:id', md_auth.ensureAuth, RolUsuarioController.modificar);
api.put('/rol/d/:id', md_auth.ensureAuth, RolUsuarioController.eliminar);
api.get('/rol/lstroles/:debaja', md_auth.ensureAuth, RolUsuarioController.getRolesUsuario);
api.get('/rol/getrol/:id', md_auth.ensureAuth, RolUsuarioController.getRolUsuario);

module.exports = api;
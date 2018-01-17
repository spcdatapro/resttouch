var express = require('express');
var PermisoController = require('../controllers/permiso');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/prm/c', md_auth.ensureAuth, PermisoController.crear);
api.put('/prm/u/:id', md_auth.ensureAuth, PermisoController.modificar);
api.get('/prm/lstpermusr/:idusr', md_auth.ensureAuth, PermisoController.lstpermisosusuario);
//api.get('/mnu/getmenu/:id', md_auth.ensureAuth, MenuController.getmenu);

module.exports = api;
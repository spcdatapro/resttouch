var express = require('express');
var VueltoController = require('../controllers/vuelto');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// Tipos de dirección
api.post('/vlt/c', md_auth.ensureAuth, VueltoController.crear);
api.put('/vlt/u/:id', md_auth.ensureAuth, VueltoController.modificar);
api.put('/vlt/d/:id', md_auth.ensureAuth, VueltoController.eliminar);
api.get('/vlt/lstvueltos/:debaja', md_auth.ensureAuth, VueltoController.getVueltos);
api.get('/vlt/getvuelto/:id', md_auth.ensureAuth, VueltoController.getVuelto);
api.get('/vlt/lstmayq/:mayorque', md_auth.ensureAuth, VueltoController.getVueltosMayorQue);

module.exports = api;
var express = require('express');
var TiempoEntregaController = require('../controllers/tiempoentrega');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// Tipos de dirección
api.post('/te/c', md_auth.ensureAuth, TiempoEntregaController.crear);
api.put('/te/u/:id', md_auth.ensureAuth, TiempoEntregaController.modificar);
api.put('/te/d/:id', md_auth.ensureAuth, TiempoEntregaController.eliminar);
api.get('/te/lsttiempos/:debaja', md_auth.ensureAuth, TiempoEntregaController.getTiemposEntrega);
api.get('/te/gettiempo/:id', md_auth.ensureAuth, TiempoEntregaController.getTiempoEntrega);

module.exports = api;
var express = require('express');
var RazonCortesiaController = require('../controllers/razoncortesia');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// Tipos de dirección
api.post('/rcort/c', md_auth.ensureAuth, RazonCortesiaController.crear);
api.put('/rcort/u/:id', md_auth.ensureAuth, RazonCortesiaController.modificar);
api.put('/rcort/d/:id', md_auth.ensureAuth, RazonCortesiaController.eliminar);
api.get('/rcort/lstrcort/:debaja', md_auth.ensureAuth, RazonCortesiaController.getRazonesCortesia);
api.get('/rcort/getrcort/:id', md_auth.ensureAuth, RazonCortesiaController.getRazonCortesia);

module.exports = api;
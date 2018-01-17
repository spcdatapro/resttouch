var express = require('express');
var EmisorTarjetaController = require('../controllers/emisortarjeta');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// Tipos de dirección
api.post('/et/c', md_auth.ensureAuth, EmisorTarjetaController.crear);
api.put('/et/u/:id', md_auth.ensureAuth, EmisorTarjetaController.modificar);
api.put('/et/d/:id', md_auth.ensureAuth, EmisorTarjetaController.eliminar);
api.get('/et/lstet/:debaja', md_auth.ensureAuth, EmisorTarjetaController.getEmisoresTarjeta);
api.get('/et/getet/:id', md_auth.ensureAuth, EmisorTarjetaController.getEmisorTarjeta);

module.exports = api;
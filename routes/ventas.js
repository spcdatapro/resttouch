var express = require('express');
var VentasController = require('../controllers/ventas');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// Ventas
api.get('/ventas/gen/:mes?/:anio?', md_auth.ensureAuth, VentasController.construyeRepositorio);

module.exports = api;
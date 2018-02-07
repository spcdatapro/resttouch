var express = require('express');
var RptVentas = require('../controllers/rptventas');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// Reportes de ventas
api.post('/rpt/operador', md_auth.ensureAuth, RptVentas.ventasPorOperador);
api.post('/rpt/restaurante', md_auth.ensureAuth, RptVentas.ventasPorRestaurante);
api.post('/rpt/tipopedido', md_auth.ensureAuth, RptVentas.ventasPorTipoComanda);

module.exports = api;
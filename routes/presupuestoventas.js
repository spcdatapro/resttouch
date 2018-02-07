var express = require('express');
var PresupuestoVentasController = require('../controllers/presupuestoventas');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// Tipos de dirección
api.post('/prv/c', md_auth.ensureAuth, PresupuestoVentasController.crear);
api.put('/prv/u/:id', md_auth.ensureAuth, PresupuestoVentasController.modificar);
api.put('/prv/d/:id', md_auth.ensureAuth, PresupuestoVentasController.eliminar);
api.get('/prv/lstpresventas/:debaja', md_auth.ensureAuth, PresupuestoVentasController.getPresupuestos);
api.get('/prv/getpresventa/:id', md_auth.ensureAuth, PresupuestoVentasController.getPresupuesto);

module.exports = api;
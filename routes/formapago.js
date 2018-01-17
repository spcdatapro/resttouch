var express = require('express');
var FormaPagoController = require('../controllers/formapago');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// Tipos de dirección
api.post('/fp/c', md_auth.ensureAuth, FormaPagoController.crear);
api.put('/fp/u/:id', md_auth.ensureAuth, FormaPagoController.modificar);
api.put('/fp/d/:id', md_auth.ensureAuth, FormaPagoController.eliminar);
api.get('/fp/lstfp/:debaja', md_auth.ensureAuth, FormaPagoController.getFormasPago);
api.get('/fp/getfp/:id', md_auth.ensureAuth, FormaPagoController.getFormaPago);

module.exports = api;
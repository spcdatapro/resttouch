var express = require('express');
var TipoDireccionController = require('../controllers/tipodireccion');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// Tipos de dirección
api.post('/tdir/c', md_auth.ensureAuth, TipoDireccionController.crear);
api.put('/tdir/u/:id', md_auth.ensureAuth, TipoDireccionController.modificar);
api.put('/tdir/d/:id', md_auth.ensureAuth, TipoDireccionController.eliminar);
api.get('/tdir/lsttiposdir/:debaja', md_auth.ensureAuth, TipoDireccionController.getTiposDireccion);
api.get('/tdir/gettipodir/:id', md_auth.ensureAuth, TipoDireccionController.getTipoDireccion);

module.exports = api;
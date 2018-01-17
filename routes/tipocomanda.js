var express = require('express');
var TipoComandaController = require('../controllers/tipocomanda');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// Tipos de dirección
api.post('/tcom/c', md_auth.ensureAuth, TipoComandaController.crear);
api.put('/tcom/u/:id', md_auth.ensureAuth, TipoComandaController.modificar);
api.put('/tcom/d/:id', md_auth.ensureAuth, TipoComandaController.eliminar);
api.get('/tcom/lsttiposcom/:debaja', md_auth.ensureAuth, TipoComandaController.getTiposComanda);
api.get('/tcom/gettipocom/:id', md_auth.ensureAuth, TipoComandaController.getTipoComanda);

module.exports = api;
var express = require('express');
var EstatusComandaController = require('../controllers/estatuscomanda');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// Tipos de dirección
api.post('/estcom/c', md_auth.ensureAuth, EstatusComandaController.crear);
api.put('/estcom/u/:id', md_auth.ensureAuth, EstatusComandaController.modificar);
api.put('/estcom/d/:id', md_auth.ensureAuth, EstatusComandaController.eliminar);
api.get('/estcom/lstestcom/:debaja', md_auth.ensureAuth, EstatusComandaController.getListaEstatusComanda);
api.get('/estcom/getestcom/:id', md_auth.ensureAuth, EstatusComandaController.getEstatusComanda);

module.exports = api;
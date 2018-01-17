var express = require('express');
var ComponenteController = require('../controllers/componente');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// Tipos de dirección
api.post('/compo/c', md_auth.ensureAuth, ComponenteController.crear);
api.put('/compo/u/:id', md_auth.ensureAuth, ComponenteController.modificar);
api.put('/compo/d/:id', md_auth.ensureAuth, ComponenteController.eliminar);
api.get('/compo/lstcomponentes/:debaja', md_auth.ensureAuth, ComponenteController.getComponentes);
api.get('/compo/lstextras/:debaja', md_auth.ensureAuth, ComponenteController.getExtras);
api.get('/compo/getcomponente/:id', md_auth.ensureAuth, ComponenteController.getComponente);

module.exports = api;
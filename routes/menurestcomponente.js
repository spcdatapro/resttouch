var express = require('express');
var MenuRestComponenteController = require('../controllers/menurestcomponente');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// Tipos de dirección
api.post('/mnurstcompo/c', md_auth.ensureAuth, MenuRestComponenteController.crear);
api.put('/mnurstcompo/u/:id', md_auth.ensureAuth, MenuRestComponenteController.modificar);
api.put('/mnurstcompo/d/:id', md_auth.ensureAuth, MenuRestComponenteController.eliminar);
api.get('/mnurstcompo/lstmnurstcompo/:idmenurest', md_auth.ensureAuth, MenuRestComponenteController.getLstMenuRestComponente);
api.get('/mnurstcompo/getmnurstcompo/:id', md_auth.ensureAuth, MenuRestComponenteController.getMenuRestComponente);

module.exports = api;
var express = require('express');
var HorarioController = require('../controllers/horario');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// Tipos de dirección
api.post('/hr/c', md_auth.ensureAuth, HorarioController.crear);
api.put('/hr/u/:id', md_auth.ensureAuth, HorarioController.modificar);
api.put('/hr/d/:id', md_auth.ensureAuth, HorarioController.eliminar);
api.get('/hr/lsthr/:debaja', md_auth.ensureAuth, HorarioController.getHorarios);
api.get('/hr/gethr/:id', md_auth.ensureAuth, HorarioController.getHorario);

module.exports = api;
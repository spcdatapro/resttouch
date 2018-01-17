var express = require('express');
var RestauranteController = require('../controllers/restaurante');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// Tipos de dirección
api.post('/rest/c', md_auth.ensureAuth, RestauranteController.crear);
api.put('/rest/u/:id', md_auth.ensureAuth, RestauranteController.modificar);
api.put('/rest/d/:id', md_auth.ensureAuth, RestauranteController.eliminar);
api.get('/rest/lstrestaurantes/:debaja', md_auth.ensureAuth, RestauranteController.getRestaurantes);
api.get('/rest/getrestaurante/:id', md_auth.ensureAuth, RestauranteController.getRestaurante);

module.exports = api;
var express = require('express');
var DiccionarioFoxController = require('../controllers/diccionariofox');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// Diccionario de fox
api.post('/diccf/c', md_auth.ensureAuth, DiccionarioFoxController.crear);
api.put('/diccf/u/:id', md_auth.ensureAuth, DiccionarioFoxController.modificar);
api.put('/diccf/d/:id', md_auth.ensureAuth, DiccionarioFoxController.eliminar);
api.get('/diccf/lstdiccf/:debaja', md_auth.ensureAuth, DiccionarioFoxController.getListaDiccionarioFox);
api.get('/diccf/getdiccf/:id', md_auth.ensureAuth, DiccionarioFoxController.getDiccionarioFox);

// API para Fox
api.get('/df/ldf', DiccionarioFoxController.lstdictfox);
api.get('/df/udf/:id/:idfox/:detalle/:power/:idparticion/:idtipoprecio', DiccionarioFoxController.upddictfox);
// Fin de API para Fox

module.exports = api;
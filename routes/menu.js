var express = require('express');
var MenuController = require('../controllers/menu');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/mnu/c', md_auth.ensureAuth, MenuController.crear);
api.put('/mnu/u/:id', md_auth.ensureAuth, MenuController.modificar);
api.get('/mnu/lstallmenu', md_auth.ensureAuth, MenuController.lstallmenu);
api.get('/mnu/getmenu/:id', md_auth.ensureAuth, MenuController.getmenu);
api.get('/mnu/lstmnuusr/:idusr', md_auth.ensureAuth, MenuController.lstmnuusr);

module.exports = api;
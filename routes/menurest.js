var express = require('express');
var MenuRestController = require('../controllers/menurest');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/mnurest/c', md_auth.ensureAuth, MenuRestController.crear);
api.put('/mnurest/u/:id', md_auth.ensureAuth, MenuRestController.modificar);
api.get('/mnurest/lstallmenu/:cuales', md_auth.ensureAuth, MenuRestController.lstallmenu);
api.get('/mnurest/getmenu/:id', md_auth.ensureAuth, MenuRestController.getmenu);
api.get('/mnurest/lstmenurest/:cuales', md_auth.ensureAuth, MenuRestController.lstmenurest);
api.get('/mnurest/getcarta/:nivel/:idpadre?', md_auth.ensureAuth, MenuRestController.getItemsMenuRest);
api.get('/mnurest/dodictfox', md_auth.ensureAuth, MenuRestController.doDictFox);
api.get('/mnurest/upddictfox', MenuRestController.updDictFox);

module.exports = api;
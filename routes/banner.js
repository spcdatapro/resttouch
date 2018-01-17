var express = require('express');
var BannerController = require('../controllers/banner');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// Tipos de dirección
api.post('/ban/c', md_auth.ensureAuth, BannerController.crear);
api.put('/ban/u/:id', md_auth.ensureAuth, BannerController.modificar);
api.put('/ban/d/:id', md_auth.ensureAuth, BannerController.eliminar);
api.get('/ban/lstban/:debaja', md_auth.ensureAuth, BannerController.getBanners);
api.get('/ban/getban/:id', md_auth.ensureAuth, BannerController.getBanner);
api.get('/ban/lstbanfec', md_auth.ensureAuth, BannerController.lstBannersFecha);

module.exports = api;
var express = require('express');
var ComandaController = require('../controllers/comanda');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// Comanda
api.post('/com/c', md_auth.ensureAuth, ComandaController.crearComanda);
api.put('/com/u/:id', md_auth.ensureAuth, ComandaController.modificarComanda);
api.put('/com/d/:id', md_auth.ensureAuth, ComandaController.eliminarComanda);
api.get('/com/getcomanda/:id', md_auth.ensureAuth, ComandaController.getComanda);
api.get('/com/lstcomandas/:fdel?/:fal?/:idestatuscomanda?/:idrestaurante?', md_auth.ensureAuth, ComandaController.listaComandas);
api.post('/com/lstcomandas', md_auth.ensureAuth, ComandaController.listaComandasPost);
api.get('/com/contporest/:fdel/:fal', md_auth.ensureAuth, ComandaController.contadorPorEstatus);
api.get('/com/lstcomusr/:idusuario', md_auth.ensureAuth, ComandaController.lstComandasUsuario);

// API para FOX
api.get('/com/lstcomres/:idrestaurante', ComandaController.listaComandasRestaurante);
api.get('/com/getcomtrack/:tracking', ComandaController.getComandaByTracking);
api.get('/com/comerror/:id/:ipaddr?', ComandaController.comandaConProblemas);
api.get('/com/confcom/:id/:ipaddr?', ComandaController.confirmarComanda);
api.get('/com/confcomenc/:id/:ipaddr?', ComandaController.confirmarComandaEncargado);
//api.get('/com/rescom', ComandaController.resetEstatusComandas);
api.get('/com/comaprob/:id/:ipaddr?', ComandaController.cobroAprobadoComanda);
api.get('/com/comrech/:id/:ipaddr?', ComandaController.cobroRechazadoComanda);
api.get('/com/comprod/:id/:ipaddr?', ComandaController.produccionComanda);
api.get('/com/comencamino/:id/:idmotorista/:ipaddr?', ComandaController.enCaminoComanda);
api.get('/com/comentregada/:id/:ipaddr?', ComandaController.entregadaComanda);
// FIN de API para FOX

// Detalle comanda
api.post('/com/cd', md_auth.ensureAuth, ComandaController.crearDetComanda);
api.put('/com/ud/:id', md_auth.ensureAuth, ComandaController.modificarDetComanda);
api.put('/com/dd/:id', md_auth.ensureAuth, ComandaController.eliminarDetComanda);
api.get('/com/getdetcomanda/:id', md_auth.ensureAuth, ComandaController.getDetComanda);
api.get('/com/lstdetcomanda/:idcomanda', md_auth.ensureAuth, ComandaController.listaDetComanda);
api.get('/com/lstcomcli/:idcliente', md_auth.ensureAuth, ComandaController.lstComandasCliente);

//Detalle de componentes de comanda
api.post('/com/cdc', md_auth.ensureAuth, ComandaController.crearDetCompDetComanda);
api.put('/com/udc/:id', md_auth.ensureAuth, ComandaController.modificarDetCompDetComanda);
api.put('/com/ddc/:id', md_auth.ensureAuth, ComandaController.eliminarDetCompDetComanda);
api.get('/com/getdetcompdetcom/:id', md_auth.ensureAuth, ComandaController.getDetCompDetComanda);
api.get('/com/lstdetcompdetcom/:iddetcomanda', md_auth.ensureAuth, ComandaController.listaDetCompDetComanda);

//Extras y notas de comanda
api.post('/com/cde', md_auth.ensureAuth, ComandaController.crearExtraNotaComanda);
api.put('/com/ude/:id', md_auth.ensureAuth, ComandaController.modificarExtraNotaComanda);
api.put('/com/dde/:id', md_auth.ensureAuth, ComandaController.eliminarExtraNotaComanda);
api.get('/com/getextnot/:id', md_auth.ensureAuth, ComandaController.getExtraNotaComanda);
api.get('/com/lstextnot/:iddetcomanda/:iddetcompdetcom', md_auth.ensureAuth, ComandaController.listaExtrasNotasComanda);

//Detalle de cobro de comanda
api.post('/com/cdcc', md_auth.ensureAuth, ComandaController.crearDetCobroCom);
api.put('/com/udcc/:id', md_auth.ensureAuth, ComandaController.modificarDetCobroCom);
api.put('/com/ddcc/:id', md_auth.ensureAuth, ComandaController.eliminarDetCobroCom);
api.get('/com/getdetcob/:id', md_auth.ensureAuth, ComandaController.getDetCobroCom);
api.get('/com/lstdetcob/:idcomanda', md_auth.ensureAuth, ComandaController.listaDetCobroCom);

//API para TIGO
api.post('/tigo', ComandaController.webHookInsert);


module.exports = api;
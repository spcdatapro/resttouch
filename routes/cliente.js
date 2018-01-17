var express = require('express');
var ClienteController = require('../controllers/cliente');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// Cliente
api.post('/cli/c', md_auth.ensureAuth, ClienteController.crearCliente);
api.post('/cli/cp', md_auth.ensureAuth, ClienteController.nuevoClientePaquete);
api.put('/cli/u/:id', md_auth.ensureAuth, ClienteController.modificarCliente);
api.put('/cli/d/:id', md_auth.ensureAuth, ClienteController.eliminarCliente);
api.get('/cli/getcliente/:id', md_auth.ensureAuth, ClienteController.getClienteById);
api.get('/cli/getclibytel/:telefono', md_auth.ensureAuth, ClienteController.getClienteByTelefono);
api.get('/cli/lstclientes/:page/:buscar?', md_auth.ensureAuth, ClienteController.lstClientes);

//Telefonos
api.post('/cli/ctel', md_auth.ensureAuth, ClienteController.crearTelefonoCliente);
api.put('/cli/utel/:id', md_auth.ensureAuth, ClienteController.modificarTelCliente);
api.put('/cli/dtel/:id', md_auth.ensureAuth, ClienteController.eliminarTelCliente);
api.get('/cli/gettelscli/:idcliente', md_auth.ensureAuth, ClienteController.getTelefonosCliente);
api.get('/cli/gettelbyidclinum/:idcliente/:telefono', md_auth.ensureAuth, ClienteController.getTelByIdClienteNumtel);
api.get('/cli/gettelcli/:id', md_auth.ensureAuth, ClienteController.getTelCliente);

//Direcciones
api.post('/cli/cdir', md_auth.ensureAuth, ClienteController.crearDireccionCliente);
api.put('/cli/udir/:id', md_auth.ensureAuth, ClienteController.modificarDirCliente);
api.put('/cli/ddir/:id', md_auth.ensureAuth, ClienteController.eliminarDirCliente);
api.get('/cli/getdirscli/:idcliente', md_auth.ensureAuth, ClienteController.getDireccionesCliente);
api.get('/cli/getdircli/:id', md_auth.ensureAuth, ClienteController.getDireccionCliente);

//Datos de facturación
api.post('/cli/cdfact', md_auth.ensureAuth, ClienteController.crearDatoFacturaCliente);
api.put('/cli/udfact/:id', md_auth.ensureAuth, ClienteController.modificarDatoFacturaCliente);
api.put('/cli/ddfact/:id', md_auth.ensureAuth, ClienteController.eliminarDatoFacturaCliente);
api.get('/cli/getdfact/:idcliente', md_auth.ensureAuth, ClienteController.getDatosFacturaCliente);
api.get('/cli/getdf/:id', md_auth.ensureAuth, ClienteController.getDatoFacturaCliente);

module.exports = api;
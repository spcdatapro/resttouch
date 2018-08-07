'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

//Cargar rutas
var 
usuario_routes = require('./routes/usuario'), menu_routes = require('./routes/menu'), permiso_routes = require('./routes/permiso'), 
cliente_routes = require('./routes/cliente'), tipoDireccion_routes = require('./routes/tipodireccion'), restaurante_routes = require('./routes/restaurante'), 
menuRest_routes = require('./routes/menurest'), estatusComanda_routes = require('./routes/estatuscomanda'), tipoComanda_routes = require('./routes/tipocomanda'), 
comanda_routes = require('./routes/comanda'), componente_routes = require('./routes/componente'), menuRestComponente_routes = require('./routes/menurestcomponente'), 
formasPago_routes = require('./routes/formapago'), emisorTarjeta_routes = require('./routes/emisortarjeta'), banner_routes = require('./routes/banner'),
vuelto_routes = require('./routes/vuelto'), razonCortesia_router = require('./routes/razoncortesia'), dictFox_router = require('./routes/diccionariofox'),
tiempoEntrega_routes = require('./routes/tiempoentrega'), rolUsuario_routes = require('./routes/rolusuario'), reportes_routes = require('./routes/rptventas'),
presupuestoVentas_routes = require('./routes/presupuestoventas'), ventas_routes = require('./routes/ventas'), horario_routes = require('./routes/horario');

//Middlewares de body-parser
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());

//Configurar cabeceras y CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Rutas base
// Inicia lineas para servidor de produccion
app.use('/', express.static('client', { redirect: false })); //Descomentar para cuando se vaya a produccion
// Fin de lineas para servidor de produccion
app.use('/api', usuario_routes);
app.use('/api', menu_routes);
app.use('/api', permiso_routes);
app.use('/api', cliente_routes);
app.use('/api', tipoDireccion_routes);
app.use('/api', restaurante_routes);
app.use('/api', menuRest_routes);
app.use('/api', estatusComanda_routes);
app.use('/api', tipoComanda_routes);
app.use('/api', comanda_routes);
app.use('/api', componente_routes);
app.use('/api', menuRestComponente_routes);
app.use('/api', formasPago_routes);
app.use('/api', emisorTarjeta_routes);
app.use('/api', banner_routes);
app.use('/api', vuelto_routes);
app.use('/api', razonCortesia_router);
app.use('/api', dictFox_router);
app.use('/api', tiempoEntrega_routes);
app.use('/api', rolUsuario_routes);
app.use('/api', reportes_routes);
app.use('/api', presupuestoVentas_routes);
app.use('/api', ventas_routes);
app.use('/api', horario_routes);

// Inicia lineas para servidor de produccion
app.get('*', (req, res, next) => { res.sendFile(path.resolve('client/index.html')); }); //Descomentar para cuando se vaya a produccion
// Fin de lineas para servidor de produccion

module.exports = app;
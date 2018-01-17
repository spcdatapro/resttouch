'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3789;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/restouch', { useMongoClient: true })
.then((conn) => {
    console.log('Conexión exitosa...');
    app.listen(port, () => { console.log('Servidor local corriendo...'); })    
})
.catch(err => console.log(err));

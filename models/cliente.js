'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClienteSchema = Schema({
    nombre: String,    
    notascliente: [],
    cumpleanios: Date,
    correoelectronico: String,
    tienehijos: Boolean,
    rangoedadeshijos: [],
    debaja: Boolean
});

module.exports = mongoose.model('cliente', ClienteSchema, 'cliente');
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TelefonoClienteSchema = Schema({
    idcliente: {type: Schema.ObjectId, ref: 'cliente'},
    telefono: String,
    debaja: Boolean
});

module.exports = mongoose.model('telefonocliente', TelefonoClienteSchema, 'telefonocliente');
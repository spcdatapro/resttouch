'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmisorTarjetaSchema = Schema({
    nombre: String,
    debaja: Boolean
});

module.exports = mongoose.model('emisortarjeta', EmisorTarjetaSchema, 'emisortarjeta');
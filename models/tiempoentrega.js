'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TiempoEntregaSchema = Schema({
    tiempo: String,
    debaja: Boolean
});

module.exports = mongoose.model('tiempoentrega', TiempoEntregaSchema, 'tiempoentrega');
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TipoDireccionSchema = Schema({
    descripcion: String,
    debaja: Boolean
});

module.exports = mongoose.model('tipodireccion', TipoDireccionSchema, 'tipodireccion');
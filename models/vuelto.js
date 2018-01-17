'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VueltoSchema = Schema({
    descripcion: String,
    valor: Number,
    debaja: Boolean
});

module.exports = mongoose.model('vuelto', VueltoSchema, 'vuelto');
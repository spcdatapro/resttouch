'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ComponenteSchema = Schema({
    descripcion: String,
    comoextra: Boolean,
    secobra: Boolean,
    debaja: Boolean
});

module.exports = mongoose.model('componente', ComponenteSchema, 'componente');
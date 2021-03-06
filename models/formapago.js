'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FormaPagoSchema = Schema({
    descripcion: String,
    estarjeta: Boolean,
    escortesia: Boolean,
    condocumento: Boolean,
    orden: Number,
    codigo: { type: Number, default: 0 },
    debaja: Boolean
});

module.exports = mongoose.model('formapago', FormaPagoSchema, 'formapago');
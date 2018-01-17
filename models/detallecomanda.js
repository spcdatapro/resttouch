'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DetalleComandaSchema = Schema({
    idcomanda: { type: Schema.ObjectId, ref: 'comanda', required: true },
    idmenurest: { type: Schema.ObjectId, ref: 'menurest', required: true },
    cantidad: { type: Number, required: true, default: 1 },
    precio: { type: Number, required: true },
    notas: String,
    debaja: { type: Boolean, default: false }
});

module.exports = mongoose.model('detallecomanda', DetalleComandaSchema, 'detallecomanda');
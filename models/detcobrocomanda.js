'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DetalleCobroComandaSchema = Schema({
    idcomanda: { type: Schema.ObjectId, ref: 'comanda', required: true },
    idformapago: { type: Schema.ObjectId, ref: 'formapago', required: true },    
    debaja: { type: Boolean, default: false }
});

module.exports = mongoose.model('detallecobrocomanda', DetalleCobroComandaSchema, 'detallecobrocomanda');
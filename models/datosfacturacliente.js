'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DatosFacturaClienteSchema = Schema({
    idcliente: { type: Schema.ObjectId, ref: 'cliente' },
    nit: String,
    nombre: String,
    direccion: String,
    debaja: Boolean
});

module.exports = mongoose.model('datosfacturacliente', DatosFacturaClienteSchema, 'datosfacturacliente');
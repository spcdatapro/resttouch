'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DireccionClienteSchema = Schema({
    idcliente: {type: Schema.ObjectId, ref: 'cliente'},
    idtipodireccion: {type: Schema.ObjectId, ref: 'tipodireccion'},
    idrestaurante: {type: Schema.ObjectId, ref: 'restaurante'},
    direccion: String,
    zona: Number,
    colonia: String,
    codigoacceso: String,
    debaja: Boolean
});

module.exports = mongoose.model('direccioncliente', DireccionClienteSchema, 'direccioncliente');
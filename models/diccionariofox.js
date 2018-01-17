'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DiccionarioFoxSchema = Schema({
    descripcion: String,
    idmongodb: String,
    idcomponente: String,
    idfox: Number,
    detalle: Number,
    power: Number,
    idparticion: Number,
    idtipoprecio: Number
});

module.exports = mongoose.model('diccionariofox', DiccionarioFoxSchema, 'diccionariofox');
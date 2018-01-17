'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TipoComandaSchema = Schema({    
    descripcion: { type: String, required: true },
    imagen: String,
    debaja: { type: Boolean, default: false }
});

module.exports = mongoose.model('tipocomanda', TipoComandaSchema, 'tipocomanda');
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EstatusComandaSchema = Schema({    
    descripcion: String,
    color: String,
    orden: { type: Number, unique: true, required: true, dropDups: true },
    debaja: { type: Boolean, default: false }
});

module.exports = mongoose.model('estatuscomanda', EstatusComandaSchema, 'estatuscomanda');
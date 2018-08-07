'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HorarioSchema = Schema({
    de: { type: String, required: true },
    a: { type: String, required: true },
    orden: { type: Number, required: true },
    debaja: { type: Boolean, default: false }
});

module.exports = mongoose.model('horario', HorarioSchema, 'horario');
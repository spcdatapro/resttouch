'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RestauranteSchema = Schema({
    nombre: String,
    webhook: { type: String, default: null },
    empresa: { type: String, default: null },
    sede: { type: Number, default: null },
    debaja: Boolean
});

module.exports = mongoose.model('restaurante', RestauranteSchema, 'restaurante');
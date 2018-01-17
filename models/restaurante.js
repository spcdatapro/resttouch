'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RestauranteSchema = Schema({
    nombre: String,
    debaja: Boolean
});

module.exports = mongoose.model('restaurante', RestauranteSchema, 'restaurante');
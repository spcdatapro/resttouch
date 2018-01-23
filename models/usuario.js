'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    nombre: String,
    usuario: {type: String, unique: true},
    contrasenia: String,
    correoe: {type: String, unique: true},
    roles: [],
    restaurante: [],
    debaja: Boolean    
});

module.exports = mongoose.model('usuario', UserSchema, 'usuario');
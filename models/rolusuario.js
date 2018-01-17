'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RolUsuarioSchema = Schema({
    descripcion: String,    
    debaja: Boolean
});

module.exports = mongoose.model('rolusuario', RolUsuarioSchema, 'rolusuario');
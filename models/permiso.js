'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PermisoSchema = Schema({
    idusuario: {type: Schema.ObjectId, ref: 'usuario'},
    iditemmenu: {type: Schema.ObjectId, ref: 'menu'},
    accesar: Number,
    crear: Number,
    modificar: Number,
    eliminar: Number    
});

module.exports = mongoose.model('permiso', PermisoSchema, 'permiso');
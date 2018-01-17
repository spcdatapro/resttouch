'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MenuRestSchema = Schema({
    descripcion: String,
    nivel: Number,
    idpadre: { type: Schema.ObjectId, ref: 'menurest' },
    precio: Number,
    tienecomponentes: Boolean,
    precioextra: Number,
    tieneextras: Boolean,
    limitecomponentes: Number,
    espromocion: Boolean,
    itemspromo: [],
    debaja: Boolean
});

module.exports = mongoose.model('menurest', MenuRestSchema, 'menurest');
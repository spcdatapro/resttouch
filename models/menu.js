'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MenuSchema = Schema({
    descripcion: String,
    nivel: Number,
    idpadre: { type: Schema.ObjectId, ref: 'menu' },
    url: String
});

module.exports = mongoose.model('menu', MenuSchema, 'menu');
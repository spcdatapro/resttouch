'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MenuRestComponenteSchema = Schema({
    idmenurest: { type: Schema.ObjectId, ref:'menurest', required: true},
    idcomponente: { type: Schema.ObjectId, ref: 'componente', required: true },
    precio: { type: Number, default: 0.00 },
    debaja: { type: Boolean, default: false }
});

module.exports = mongoose.model('menurestcomponente', MenuRestComponenteSchema, 'menurestcomponente');
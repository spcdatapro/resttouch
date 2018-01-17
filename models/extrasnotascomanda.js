'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ExtrasNotasComandaSchema = Schema({
    iddetallecomanda: { type: Schema.ObjectId, ref: 'detallecomanda' },
    iddetcompdetcomanda: { type: Schema.ObjectId, ref: 'componente' },
    idcomponente: { type: Schema.ObjectId, ref:'componente' },
    esextra: { type: Boolean, default: false },
    precio: { type: Number, default: 0.00 },
    notas: String,
    debaja: { type: Boolean, default: false }
});

module.exports = mongoose.model('extrasnotascomanda', ExtrasNotasComandaSchema, 'extrasnotascomanda');
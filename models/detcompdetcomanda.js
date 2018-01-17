'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DetaCompDetaComandaSchema = Schema({
    iddetallecomanda: { type: Schema.ObjectId, ref: 'detallecomanda', required: true },
    idcomponente: { type: Schema.ObjectId, ref: 'componente', required: true },    
    debaja: { type: Boolean, default: false }
});

module.exports = mongoose.model('detcompdetcomanda', DetaCompDetaComandaSchema, 'detcompdetcomanda');
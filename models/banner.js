'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BannerSchema = Schema({
    banner: String,
    espermanente: Boolean,
    fechadel: Date,
    fechaal: Date,        
    fechacrea: { type: Date, required: true},
    idusrcrea: { type: Schema.ObjectId, ref:'usuario', required: true },
    fechamod: Date,
    idusrmod: { type: Schema.ObjectId, ref: 'usuario' },
    debaja: Boolean
});

module.exports = mongoose.model('banner', BannerSchema, 'banner');
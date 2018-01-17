'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RazonCortesiaSchema = Schema({
    razon: String,
    debaja: Boolean
});

module.exports = mongoose.model('razoncortesia', RazonCortesiaSchema, 'razoncortesia');
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PresupuestoVentasSchema = Schema({
    mes: Number,
    anio: Number,
    presupuesto: Number,
    debaja: Boolean
});

module.exports = mongoose.model('presupuestoventas', PresupuestoVentasSchema, 'presupuestoventas');
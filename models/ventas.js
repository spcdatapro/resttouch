'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VentasSchema = Schema({
    mes: Number,
    nombremes: String,
    anio: Number,
    cantidadtotalmes: Number,
    montototalmes: Number,
    restaurantes:[{
        idrestaurante: { type: Schema.ObjectId, ref: 'restaurante' },
        restaurante: String,
        cantidadtotalrestaurante: Number,
        montototalrestaurante: Number,
        ventas: [{
            fecha: Date,
            fechaformateada: String,
            nodiasemana: Number,
            diasemana: String,
            cantidadtotaldia: Number,
            montototaldia: Number,
            horarios: [{                
                idhorario: { type: Schema.ObjectId, ref: 'horario' },
                horario: String,
                cantidad: Number,
                monto: Number
            }]        
        }]
    }]    
});

module.exports = mongoose.model('ventas', VentasSchema, 'ventas');
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var counter = require('./counter');

var ComandaSchema = Schema({
    idcliente: { type: Schema.ObjectId, ref: 'cliente', required: true },    
    idtelefonocliente: { type: Schema.ObjectId, ref: 'telefonocliente', required: true },
    iddireccioncliente: { type: Schema.ObjectId, ref: 'direccioncliente', required: true },    
    fecha: Date,
    idtipocomanda: { type: Schema.ObjectId, ref: 'tipocomanda', required: true },
    idusuario: { type: Schema.ObjectId, ref: 'usuario', required: true },
    fechainitoma: Date,
    fechafintoma: Date,
    idestatuscomanda: { type: Schema.ObjectId, ref: 'estatuscomanda', required: true },
    notas: String,
    cantidaditems: Number,
    totalcomanda: Number,
    tracking: Number,
    detallecomanda: Array,
    detcobrocomanda: Array,
    detfacturara: Array,
    idtiempoentrega: { type: Schema.ObjectId, ref: 'tiempoentrega', required: true },
    idrestaurante: { type: Schema.ObjectId, ref: 'restaurante', required: true },
    idmotorista: { type: Schema.ObjectId, ref: 'usuario' },
    imgpago: Array,
    debaja: { type: Boolean, default: false }
});

ComandaSchema.pre('save',function(next){
    var doc = this;
    counter.findByIdAndUpdate({ _id: 'trackingnumber' }, { $inc: { seq: 1 } }, function (error, counter) {
        if (error)
            return next(error);
        doc.tracking = counter.seq;
        next();
    });
});

module.exports = mongoose.model('comanda', ComandaSchema, 'comanda');

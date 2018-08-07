'use strict'

const mongoose = require('mongoose');
const moment = require('moment');
const axios = require('axios');

// Modelos
const Comanda = require('../models/comanda');
const Usuario = require('../models/usuario');
const PresupuestoVentas = require('../models/presupuestoventas');
const Restaurante = require('../models/restaurante');
const TipoComanda = require('../models/tipocomanda');
const Ventas = require('../models/ventas');

async function ventasPorOperador(req, res) {
    var body = req.body;
    var fdel = moment(body.fdel).startOf('day').toDate();
    var fal = moment(body.fal).endOf('day').toDate();

    var aggOpts = [
        { $match: { 
            idestatuscomanda: "59fea7f34218672b285ab0e8",
            fecha: { $gte: fdel, $lte: fal } 
        } },
        { 
            $group: {
                _id: "$idusuario",
                venta: { $sum: "$totalcomanda" },
                ventaneta: { $sum: { $divide: ["$totalcomanda", 1.12] } },
                cantidad: { $sum: 1 }
            }
        }
    ];

    var presupuesto = await PresupuestoVentas.findOne({mes: moment(fdel).month() + 1, anio: moment(fdel).year()}).exec();    
    if (!presupuesto) { presupuesto = { presupuesto: 0 }; }

    Comanda.aggregate(aggOpts).exec((error, lista) => {
        if (error) {
            res.status(500).send({ mensaje: 'Error en el servidor al calcular las ventas por operador. ERROR: ' + error });
        } else {
            if (lista.length == 0) {
                res.status(200).send({ mensaje: 'No se encontraron ventas con estos parámetros 1.', lista: lista });
            } else {
                Usuario.populate(lista, { path: "_id", select:"_id nombre", sort: { "nombre": 1 } }, (error2, lstVentas) => {
                    if (error2) {
                        res.status(500).send({ mensaje: 'Error en el servidor al calcular las ventas por operador. ERROR: ' + error2 });
                    } else {
                        if (lstVentas.length == 0) {
                            res.status(200).send({ mensaje: 'No se encontraron ventas con estos parámetros 2.', lista: lstVentas });
                        } else {

                            var datos = [], total = 0.00, totalneto = 0.00, totalcantidad = 0;
                            lstVentas.forEach((operador) => {
                                datos.push({
                                    idoperador: operador._id._id,
                                    nombre: operador._id.nombre,
                                    venta: parseFloat(parseFloat(operador.venta).toFixed(2)),
                                    ventaneta: parseFloat(parseFloat(operador.ventaneta).toFixed(2)),
                                    cantidad: operador.cantidad,
                                    porcentaje: 0,
                                    presupuesto: '',
                                    cumplido: ''
                                });
                                total += parseFloat(parseFloat(operador.venta).toFixed(2));
                                totalneto += parseFloat(parseFloat(operador.ventaneta).toFixed(2));
                                totalcantidad += operador.cantidad;
                            });

                            datos.sort((a, b) => { return a.nombre > b.nombre ? 1 : (b.nombre > a.nombre ? -1 : 0); });

                            datos.push({
                                idoperador: '', 
                                nombre: 'Gran Total', 
                                venta: total, 
                                ventaneta: parseFloat(parseFloat(total / 1.12).toFixed(2)), 
                                cantidad: totalcantidad, 
                                porcentaje: 100.00, 
                                presupuesto: parseFloat(parseFloat(presupuesto.presupuesto).toFixed(2)), 
                                cumplido: parseFloat((((total / 1.12) * 100) / presupuesto.presupuesto).toFixed(2))
                            });

                            datos.forEach((item, i) => {
                                item.porcentaje = parseFloat((item.ventaneta * 100 / totalneto).toFixed(2));
                            });

                            //res.status(200).send({ mensaje: 'Ventas por operador', lista: lstVentas });
                            res.status(200).send({ mensaje: 'Ventas por operador', lista: datos });
                        }
                    }
                });
            }
        }
    });
    

}

async function ventasPorRestaurante(req, res) {
    var body = req.body;
    var fdel = moment(body.fdel).startOf('day').toDate();
    var fal = moment(body.fal).endOf('day').toDate();

    var aggOpts = [
        { $match: { 
            idestatuscomanda: "59fea7f34218672b285ab0e8",
            fecha: { $gte: fdel, $lte: fal } 
        } },
        {
            $group: {
                _id: "$idrestaurante",
                venta: { $sum: "$totalcomanda" },
                ventaneta: { $sum: { $divide: ["$totalcomanda", 1.12] } },
                cantidad: { $sum: 1 }
            }
        }
    ];

    var presupuesto = await PresupuestoVentas.findOne({ mes: moment(fdel).month() + 1, anio: moment(fdel).year() }).exec();
    if (!presupuesto) { presupuesto = { presupuesto: 0 }; }

    Comanda.aggregate(aggOpts).exec((error, lista) => {
        if (error) {
            res.status(500).send({ mensaje: 'Error en el servidor al calcular las ventas por restaurante. ERROR: ' + error });
        } else {
            if (lista.length == 0) {
                res.status(200).send({ mensaje: 'No se encontraron ventas con estos parámetros.' });
            } else {
                Restaurante.populate(lista, { path: "_id", select: "_id nombre", sort: { "nombre": 1 } }, (error2, lstVentas) => {
                    if (error2) {
                        res.status(500).send({ mensaje: 'Error en el servidor al calcular las ventas por restaurante. ERROR: ' + error2 });
                    } else {
                        if (lstVentas.length == 0) {
                            res.status(200).send({ mensaje: 'No se encontraron ventas con estos parámetros.' });
                        } else {

                            var datos = [], total = 0.00, totalneto = 0.00, totalcantidad = 0;
                            lstVentas.forEach((rst) => {
                                datos.push({
                                    idrestaurante: rst._id._id,
                                    nombre: rst._id.nombre,
                                    venta: parseFloat(parseFloat(rst.venta).toFixed(2)),
                                    ventaneta: parseFloat(parseFloat(rst.ventaneta).toFixed(2)),
                                    cantidad: rst.cantidad,
                                    porcentaje: 0,
                                    presupuesto: '',
                                    cumplido: ''
                                });
                                total += parseFloat(parseFloat(rst.venta).toFixed(2));
                                totalneto += parseFloat(parseFloat(rst.ventaneta).toFixed(2));
                                totalcantidad += rst.cantidad;
                            });

                            datos.sort((a, b) => { return a.nombre > b.nombre ? 1 : (b.nombre > a.nombre ? -1 : 0); });

                            datos.push({
                                idrestaurante: '',
                                nombre: 'Gran Total',
                                venta: total,
                                ventaneta: parseFloat(parseFloat(total / 1.12).toFixed(2)),
                                cantidad: totalcantidad,
                                porcentaje: 100.00,
                                presupuesto: parseFloat(parseFloat(presupuesto.presupuesto).toFixed(2)),
                                cumplido: parseFloat((((total / 1.12) * 100) / presupuesto.presupuesto).toFixed(2))
                            });

                            datos.forEach((item, i) => {
                                item.porcentaje = parseFloat((item.ventaneta * 100 / totalneto).toFixed(2));
                            });
                            
                            res.status(200).send({ mensaje: 'Ventas por restaurante', lista: datos });
                        }
                    }
                });
            }
        }
    });

}

async function ventasPorTipoComanda(req, res) {
    var body = req.body;
    var fdel = moment(body.fdel).startOf('day').toDate();
    var fal = moment(body.fal).endOf('day').toDate();

    var aggOpts = [
        { $match: { 
            idestatuscomanda: "59fea7f34218672b285ab0e8",
            fecha: { $gte: fdel, $lte: fal } 
        } },
        {
            $group: {
                _id: "$idtipocomanda",
                venta: { $sum: "$totalcomanda" },
                ventaneta: { $sum: { $divide: ["$totalcomanda", 1.12] } },
                cantidad: { $sum: 1 }
            }
        }
    ];

    var presupuesto = await PresupuestoVentas.findOne({ mes: moment(fdel).month() + 1, anio: moment(fdel).year() }).exec();
    if(!presupuesto) { presupuesto = { presupuesto: 0 }; }

    Comanda.aggregate(aggOpts).exec((error, lista) => {
        if (error) {
            res.status(500).send({ mensaje: 'Error en el servidor al calcular las ventas por tipo de pedido. ERROR: ' + error });
        } else {
            if (lista.length == 0) {
                res.status(200).send({ mensaje: 'No se encontraron ventas con estos parámetros.' });
            } else {
                TipoComanda.populate(lista, { path: "_id", select: "_id descripcion", sort: { "descripcion": 1 } }, (error2, lstVentas) => {
                    if (error2) {
                        res.status(500).send({ mensaje: 'Error en el servidor al calcular las ventas por tipo de pedido. ERROR: ' + error2 });
                    } else {
                        if (lstVentas.length == 0) {
                            res.status(200).send({ mensaje: 'No se encontraron ventas con estos parámetros.' });
                        } else {

                            var datos = [], total = 0.00, totalneto = 0.00, totalcantidad = 0;
                            lstVentas.forEach((tcom) => {
                                datos.push({
                                    idtipocomanda: tcom._id._id,
                                    descripcion: tcom._id.descripcion,
                                    venta: parseFloat(parseFloat(tcom.venta).toFixed(2)),
                                    ventaneta: parseFloat(parseFloat(tcom.ventaneta).toFixed(2)),
                                    cantidad: tcom.cantidad,
                                    porcentaje: 0,
                                    presupuesto: '',
                                    cumplido: ''
                                });
                                total += parseFloat(parseFloat(tcom.venta).toFixed(2));
                                totalneto += parseFloat(parseFloat(tcom.ventaneta).toFixed(2));
                                totalcantidad += tcom.cantidad;
                            });

                            datos.sort((a, b) => { return a.descripcion > b.descripcion ? 1 : (b.descripcion > a.descripcion ? -1 : 0); });

                            datos.push({
                                idtipocomanda: '',
                                descripcion: 'Gran Total',
                                venta: total,
                                ventaneta: parseFloat(parseFloat(total / 1.12).toFixed(2)),
                                cantidad: totalcantidad,
                                porcentaje: 100.00,
                                presupuesto: parseFloat(parseFloat(presupuesto.presupuesto).toFixed(2)),
                                cumplido: parseFloat((((total / 1.12) * 100) / presupuesto.presupuesto).toFixed(2))
                            });

                            datos.forEach((item, i) => {
                                item.porcentaje = parseFloat((item.ventaneta * 100 / totalneto).toFixed(2));
                            });

                            res.status(200).send({ mensaje: 'Ventas por tipo de pedido', lista: datos });
                        }
                    }
                });
            }
        }
    });

}

async function ventasMensualDetallado(req, res){
    const params = {
        mes: +req.body.mes > 0 ? +req.body.mes : moment().month() + 1, 
        anio: +req.body.anio > 0 ? +req.body.anio : moment().year()
    };
    let datos = { 
        generales: {
            mes: '', 
            anio: params.anio,
            hoy: moment().format('DD/MM/YYYY HH:mm:ss')
        }, 
        ventas: [] 
    };

    await axios.get('http://localhost:3789/api/ventas/gen/' + datos.generales.mes + '/' + datos.generales.anio);

    let pedidos = await Ventas.find({mes: params.mes, anio: params.anio}).exec();
    
    if(pedidos.length > 0){
        datos.generales.mes = pedidos[0].nombremes;
        datos.ventas = pedidos[0].restaurantes;
    }

    res.status(200).send({
        mensaje: 'Ventas mensual detallado',
        ventas: datos
    });

}

module.exports = {
    ventasPorOperador, ventasPorRestaurante, ventasPorTipoComanda, ventasMensualDetallado
}
'use strict'

const moment = require('moment');
const mongoose = require('mongoose');
const Ventas = require('../models/ventas');
const Comanda = require('../models/comanda');
const Restaurante = require('../models/restaurante');
const Horario = require('../models/horario');

async function getRango(){
    const rango = { desde: null, hasta: null }
    const aggOpts = [{
        $group: {
            _id: {},
            fechadesde: {
                $min: "$fecha"
            },
            fechahasta: {
                $max: "$fecha"
            }
        }
    }];

    const arrRango = await Comanda.aggregate(aggOpts).exec();
    if (arrRango) {
        if (arrRango.length > 0) {
            rango.desde = moment(moment(arrRango[0].fechadesde).format('YYYY-MM-DD') + ' 00:00:00.000').toDate();
            //rango.desde = moment(moment(arrRango[0].fechadesde).format('2017-12-02') + ' 00:00:00.000').toISOString();
            rango.hasta = moment(moment(arrRango[0].fechahasta).format('YYYY-MM-28') + ' 23:59:59.999').toDate();
            //rango.hasta = moment(moment(arrRango[0].fechahasta).format('2017-12-04') + ' 23:59:59.999').toISOString();
        }
    }
    return rango;
}

function getPlantillaRestaurante(restaurantes){
    let plantilla = [];
    for(let i = 0; i < restaurantes.length; i++){
        let restaurante = restaurantes[i];
        plantilla.push({
            idrestaurante: restaurante._id,
            restaurante: restaurante.nombre,
            cantidadtotalrestaurante: 0,
            montototalrestaurante: 0.00,
            ventas: []
        });
    }
    return plantilla;
}

function agregarMesAnio(datos, mes, anio, restaurantes){
    const meses = ['', 'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
    let existe = false;
    
    if(datos.length > 0){
        for(let i = 0; i < datos.length; i++){
            let dato = datos[i];
            if (dato.mes === (mes + 1) && dato.anio === anio) {
                existe = true;
                break;
            }
        }
        if(!existe){
            datos.push({
                mes: mes + 1,
                nombremes: meses[mes + 1],
                anio: anio,
                cantidadtotalmes: 0,
                montototalmes: 0.00,
                restaurantes: getPlantillaRestaurante(restaurantes)
            });
        }
    } else {
        datos.push({
            mes: mes + 1,
            nombremes: meses[mes + 1],
            anio: anio,
            cantidadtotalmes: 0,
            montototalmes: 0.00,
            restaurantes: getPlantillaRestaurante(restaurantes)
        });
    }
    return datos;
}

function agregaHorario(ventas, objDatos){
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    let idx = null;
    for (let i = 0; i < ventas.length; i++) {
        let venta = ventas[i];
        if (venta.fechaformateada.trim() === objDatos.fechaActual.format('DD/MM/YYYY').trim()) {            
            idx = i;
            break;
        }
    }
    // console.log('Encontrado en: ', idx);
    if (idx === null || idx === undefined) {
        ventas.push({
            fecha: moment(objDatos.fechaActual.format('YYYY-MM-DD') + ' 00:00:00.000').toDate(),
            fechaformateada: objDatos.fechaActual.format('DD/MM/YYYY'),
            nodiasemana: objDatos.fechaActual.day(),
            diasemana: dias[objDatos.fechaActual.day()],
            cantidadtotaldia: 0,
            montototaldia: 0.00,
            horarios: []
        });
        idx = ventas.length - 1;
    }
    ventas[idx].cantidadtotaldia += objDatos.cantidadPedido;
    ventas[idx].montototaldia += objDatos.montoPedido;
    ventas[idx].horarios.push({
        idhorario: objDatos.idhorario,
        horario: objDatos.horario,
        cantidad: objDatos.cantidadPedido,
        monto: objDatos.montoPedido
    });

    return ventas;
}

function calculaTotales(datos){
    for(let i = 0; i < datos.length; i++){
        for(let j = 0; j < datos[i].restaurantes.length; j++){
            for(let k = 0; k < datos[i].restaurantes[j].ventas.length; k++){
                datos[i].restaurantes[j].cantidadtotalrestaurante += datos[i].restaurantes[j].ventas[k].cantidadtotaldia;
                datos[i].restaurantes[j].montototalrestaurante += datos[i].restaurantes[j].ventas[k].montototaldia;
            }
            datos[i].cantidadtotalmes += datos[i].restaurantes[j].cantidadtotalrestaurante;
            datos[i].montototalmes += datos[i].restaurantes[j].montototalrestaurante;
        }
    }
    return datos;
}

async function construyeRepositorio(req, res){
    let mes = +req.params.mes, anio = +req.params.anio;
    let rango = {desde: null, hasta: null};

    if(mes > 0 && anio > 0){
        rango.desde = moment(anio + '-' + (mes < 10 ? ('0' + mes) : mes) + '-01 00:00:00.000').toDate();        
        rango.hasta = moment(anio + '-' + (mes < 10 ? ('0' + mes) : mes) + '-28 23:59:59.999').toDate();
    } else {
        rango = await getRango();
    }   
    
    //const restaurantes = await Restaurante.find({_id: "5a3a7c376a72bb242199a1ec"}, {_id: 1, nombre: 1}).sort({nombre: 1}).exec();
    const restaurantes = await Restaurante.find({}, {_id: 1, nombre: 1}).sort({nombre: 1}).exec();
    const horarios = await Horario.find({}, {_id: 1, de: 1, a: 1}).sort({orden: 1}).exec();
    let datos = [];

    if (rango.desde && rango.hasta){
        let mes = 0, anio = 0;
        while(rango.desde <= rango.hasta){
            mes = moment(rango.desde).month();
            anio = moment(rango.desde).year();
            datos = agregarMesAnio(datos, mes, anio, restaurantes);                        
            rango.desde = moment(rango.desde).add(1, 'month').toDate();
        }
        for(let i = 0; i < datos.length; i++){
            let dato = datos[i];
            for(let j = 0; j < dato.restaurantes.length; j++){                
                let restaurante = dato.restaurantes[j],
                desde = moment(dato.anio + '-' + (dato.mes < 10 ? ('0' + dato.mes) : dato.mes) + '-' + '01').startOf('month'),
                //desde = moment('2017-12-02').startOf('day'),
                hasta = moment(dato.anio + '-' + (dato.mes < 10 ? ('0' + dato.mes) : dato.mes) + '-' + '01').endOf('month');
                //hasta = moment('2017-12-20').endOf('day');
                //console.log('Id Restaurante = ', restaurante.idrestaurante);
                while(desde.isSameOrBefore(hasta)){
                    //console.log('Fecha actual = ', desde.format('DD/MM/YYYY HH:mm:ss.SSS'));
                    
                    for(let k = 0; k < horarios.length; k++){
                        let horario = horarios[k];
                        let de = horario.de.split(':'),
                            a = horario.a.split(':');
                        //console.log('k = ', k);

                        let hini = moment({
                            y: desde.year(),
                            M: desde.month(),
                            d: desde.date(),
                            h: de[0],
                            m: de[1],
                            s: '0',
                            ms: '000'
                        });
                        let hfin = moment({
                            y: desde.year(),
                            M: desde.month(),
                            d: desde.date(),
                            h: a[0],
                            m: a[1],
                            s: '59',
                            ms: '999'
                        });
                        //console.log('De = ', hini.toDate().toISOString());
                        //console.log('A  = ', hfin.toDate().toISOString());
                                                
                        let aggOpts = [{
                                $match: {
                                    idrestaurante: restaurante.idrestaurante,
                                    idestatuscomanda: mongoose.Types.ObjectId("59fea7f34218672b285ab0e8"),
                                    fecha: {
                                        $gte: new Date(hini.toISOString()),
                                        $lte: new Date(hfin.toISOString())
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: '$idrestaurante',
                                    monto: {
                                        $sum: "$totalcomanda"
                                    },
                                    cantidad: {
                                        $sum: 1
                                    }
                                }
                            }
                        ];

                        //console.log('$gte = ', aggOpts[0].$match.fecha.$gte);
                        //console.log('$lte = ', aggOpts[0].$match.fecha.$lte);

                        let pedidos = await Comanda.aggregate(aggOpts).exec();
                        // console.log('Pedidos = ', pedidos.length > 0 ? pedidos[0] : 'No hay en el rango...');
                        restaurante.ventas = agregaHorario(restaurante.ventas, {
                            fechaActual: hini,
                            idhorario: horario._id,
                            horario: horario.de + '-' + horario.a,
                            cantidadPedido: pedidos.length > 0 ? pedidos[0].cantidad : 0,
                            montoPedido: pedidos.length > 0 ? pedidos[0].monto : 0.00
                        });                                                
                    }//For de horarios                    
                    desde = moment(desde).add(1, 'day');
                }//While
            }
        }
    }

    datos = calculaTotales(datos);
    
    if(mes > 0 && anio > 0){
        await Ventas.remove({mes: mes, anio: anio}).exec();
    } else {
        await Ventas.remove({}).exec();
    }
    
    await Ventas.insertMany(datos);

    res.status(200).send({
        mensaje: 'Generación de repositorio terminada...',
        datos: datos
    });
}

module.exports = {
    construyeRepositorio
}
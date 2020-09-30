'use strict'

const mongoose = require('mongoose');
const moment = require('moment');
const fs = require('fs');
const axios = require('axios');

// Modelos
const Comanda = require('../models/comanda');
const DetalleComanda = require('../models/detallecomanda');
const DetCompDetComanda = require('../models/detcompdetcomanda');
const ExtrasNotasComanda = require('../models/extrasnotascomanda');
const DetalleCobroComanda = require('../models/detcobrocomanda');
const EstatusComanda = require('../models/estatuscomanda');
const DiccionarioFox = require('../models/diccionariofox');
const EmisoresTarjeta = require('../models/emisortarjeta');
const TelefonoCliente = require('../models/telefonocliente');
const Cliente = require('../models/cliente');
const DireccionCliente = require('../models/direccioncliente');
const DatosFacturaCliente = require('../models/datosfacturacliente');
const TipoComanda = require('../models/tipocomanda');
const Carta = require('../models/menurest');
const Restaurante = require('../models/restaurante');
const FormaPago = require('../models/formapago');
// Acciones
// Comanda
function crearComanda(req, res) {
    var com = new Comanda();
    var params = req.body;

    com.idcliente = params.idcliente;
    com.idtelefonocliente = params.idtelefonocliente;
    com.iddireccioncliente = params.iddireccioncliente;
    com.fecha = params.fecha;
    com.idtipocomanda = params.idtipocomanda;
    com.idusuario = params.idusuario;
    com.fechainitoma = params.fechainitoma;
    com.fechafintoma = params.fechafintoma;
    com.idestatuscomanda = params.idestatuscomanda;
    com.notas = params.notas;
    com.cantidaditems = params.cantidaditems;
    com.totalcomanda = params.totalcomanda;
    com.detallecomanda = params.detallecomanda;
    com.detcobrocomanda = params.detcobrocomanda;
    com.detfacturara = params.detfacturara;
    com.idtiempoentrega = params.idtiempoentrega;
    com.idrestaurante = params.idrestaurante;
    com.idmotorista = params.idmotorista;
    com.imgpago = params.imgpago;
    com.debaja = params.debaja;
    com.bitacoraestatus = [{ idestatuscomanda: mongoose.Types.ObjectId("59fea7304218672b285ab0e2"), estatus: "Pendiente", fecha: moment().toDate() }];

    com.save(async (err, comandaSvd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al crear la comanda. Error: ' + err });
        } else {
            if (!comandaSvd) {
                res.status(200).send({ mensaje: 'No se pudo grabar la comanda.' });
            } else {
                const rest = await Restaurante.findById(comandaSvd.idrestaurante).exec();
                if (rest) {
                    if (rest.webhook && rest.empresa && rest.sede) {
                        sendToRestTouch(res, rest, comandaSvd);
                    } else {
                        res.status(200).send({ mensaje: 'Comanda grabada exitosamente.', entidad: comandaSvd });
                    }
                }
            }
        }
    });

}

async function sendToRestTouch(response, restaurante, comanda) {
    const config = JSON.parse(fs.readFileSync('./config.json'));

    const obj = {
        key: restaurante.empresa,
        sede: restaurante.sede,
        mesa: null,
        moneda: 'GTQ',
        numero_orden: comanda.tracking,
        cliente: {},
        metodo_pago: [],
        direccion_entrega: "",
        detalle: []
    };

    const cliente = await Cliente.findById(comanda.idcliente).exec();
    const telefono = await TelefonoCliente.findById(comanda.idtelefonocliente).exec();
    const tmpnit = comanda.detfacturara[0].nit.trim().toUpperCase().replace(/[^a-zA-Z0-9]/gi, '') || 'CF';
    if (cliente) { 
        obj.cliente = {
            nombre: cliente.nombre,
            apellidos: '',
            correo: cliente.correoelectronico,
            telefono: telefono.telefono || '',
            nit: tmpnit,
            direccion: comanda.detfacturara[0].direccion
        }
    }

    comanda.detcobrocomanda.forEach(async(dcc) => {
        const fp = await FormaPago.findById(dcc.idformapago).exec();
        let totfp = 0;
        dcc.detcobro.forEach(dc => totfp += dc.monto);
        obj.metodo_pago.push({
            id: dcc.idformapago,
            nombre: dcc.descripcion,
            observaciones: null,
            codigo: fp.codigo,
            monto: totfp
        });
    });

    comanda.detallecomanda.forEach((det) => {

        let precioExtra = 0;
        let componentes = '';

        det.componentes.forEach(c => {
            precioExtra += c.precio;
            if(componentes !== '') {
                componentes += '; ';
            }

            componentes += c.descripcion + (c.extrasnotas.length > 0 ? ' (' : '');

            let descext = '';
            c.extrasnotas.forEach(en => {                
                if (descext !== '') {
                    descext += ', '
                }
                precioExtra += (en.precio || 0);
                descext += en.notas;
            });

            componentes += descext + (c.extrasnotas.length > 0 ? ')' : '');
        });
        
        obj.detalle.push({
            codigo: det.idmenurest, 
            cantidad: det.cantidad,
            precio: det.precio + precioExtra,
            total: det.cantidad * (det.precio + precioExtra),
            nombre: det.descripcion,
            nota: componentes
        });
    });

    axios.post(`${config.produccion ? config.url_base : config.url_base_dev}/api/orden/rtg`, obj).then(res => {
        if (res.data.exito) {
            response.status(200).send({ mensaje: 'Comanda grabada exitosamente.', entidad: comanda });
        } else {
            response.status(200).send({ mensaje: `ERROR: ${res.data.mensaje}`, entidad: null });
        }
    }).catch((e) => {
        response.status(200).send({ mensaje: `ERROR: ${e}`, entidad: null });
    });
}

function modificarComanda(req, res) {
    var idcom = req.params.id;
    var body = req.body;

    Comanda.findByIdAndUpdate(idcom, body, { new: true }, (err, comandaUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al modificar la comanda.' });
        } else {
            if (!comandaUpd) {
                res.status(200).send({ mensaje: 'No se pudo modificar la comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Comanda modificada exitosamente.', entidad: comandaUpd });
            }
        }
    });
}

function eliminarComanda(req, res) {
    var idcom = req.params.id;
    var body = req.body;

    Comanda.findByIdAndUpdate(idcom, body, { new: true }, (err, comandaDel) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al eliminar la comanda.' });
        } else {
            if (!comandaDel) {
                res.status(200).send({ mensaje: 'No se pudo eliminar la comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Comanda eliminada exitosamente.', entidad: comandaDel });
            }
        }
    });
}

function listaComandas(req, res) {
    var idestatuscomanda = req.params.idestatuscomanda, fltr = { debaja: false };
    var idrestaurante = req.params.idrestaurante;
    var fdel = moment(req.params.fdel).startOf('day').toDate();
    var fal = moment(req.params.fal).endOf('day').toDate();

    if (idestatuscomanda && idestatuscomanda != '0') { fltr.idestatuscomanda = idestatuscomanda; }
    if (idrestaurante) { fltr.idrestaurante = idrestaurante; }
    if (fdel && fal) { fltr.fecha = { $lte: fal, $gte: fdel }; }

    // console.log(fltr);

    Comanda.find(fltr, null, { sort: { fecha: -1 } })
        .populate('idcliente', ['_id', 'nombre'])
        .populate('idtipocomanda', ['_id', 'descripcion', 'imagen'])
        .populate('idusuario', ['_id', 'nombre'])
        .populate('idestatuscomanda', ['_id', 'descripcion', 'color'])
        .populate('idtelefonocliente', ['_id', 'telefono'])
        .populate({ path: 'iddireccioncliente', populate: { path: 'idrestaurante', select: '_id nombre' } })
        .populate('iddatosfacturacliente', ['_id', 'nit', 'nombre', 'direccion'])
        .populate('idtiempoentrega', ['_id', 'tiempo'])
        .populate('idrestaurante', ['_id', 'nombre'])
        .populate('idmotorista', ['_id', 'nombre'])
        .exec((err, lista) => {
            if (err) {
                res.status(500).send({ mensaje: 'Error en el servidor al listar las comandas. ERROR: ' + err });
            } else {
                if (lista.length == 0) {
                    res.status(200).send({ mensaje: 'No se encontraron comandas.' });
                } else {

                    lista.forEach((item) => {
                        item.fecha = moment(item.fecha).toDate();
                        item.imgpago = [];
                        item.detcobrocomanda.forEach((fp) => {
                            if (item.imgpago.length == 0) {
                                item.imgpago.push(fp.estarjeta ? 'tarjeta' : 'efectivo');
                            } else {
                                if (item.imgpago.indexOf(fp.estarjeta ? 'tarjeta' : 'efectivo') < 0) {
                                    item.imgpago.push(fp.estarjeta ? 'tarjeta' : 'efectivo');
                                }
                            }
                        });
                    });
                    //console.log(lista[0]);
                    // console.log(lista);
                    res.status(200).send({ mensaje: 'Lista de comandas.', lista: lista });
                }
            }
        });
}

function listaComandasPost(req, res) {
    var filtros = req.body;

    var fltr = { debaja: false };

    if (filtros.fdel && filtros.fal) {
        var fdel = moment(filtros.fdel).startOf('day').toDate();
        var fal = moment(filtros.fal).endOf('day').toDate();
        fltr.fecha = { $gte: fdel, $lte: fal };
    }

    if (filtros.idestatuscomanda) {
        fltr.idestatuscomanda = filtros.idestatuscomanda;
    }

    if (filtros.restaurantes && filtros.restaurantes.length > 0) {
        fltr.idrestaurante = { $in: filtros.restaurantes };
    } else {
        fltr.idrestaurante = { $exists: true, $ne: null };
    }

    if (filtros.detigo) {
        fltr.detigo = true;
        fltr.idrestaurante = { $exists: true, $eq: null };
    }

    // console.log(fltr);

    Comanda.find(fltr, null, { sort: { fecha: -1 } })
        .populate('idcliente', ['_id', 'nombre'])
        .populate('idtipocomanda', ['_id', 'descripcion', 'imagen'])
        .populate('idusuario', ['_id', 'nombre'])
        .populate('idestatuscomanda', ['_id', 'descripcion', 'color'])
        .populate('idtelefonocliente', ['_id', 'telefono'])
        .populate({ path: 'iddireccioncliente', populate: { path: 'idrestaurante', select: '_id nombre' } })
        .populate('iddatosfacturacliente', ['_id', 'nit', 'nombre', 'direccion'])
        .populate('idtiempoentrega', ['_id', 'tiempo'])
        .populate('idrestaurante', ['_id', 'nombre'])
        .populate('idmotorista', ['_id', 'nombre'])
        .exec((err, lista) => {
            if (err) {
                res.status(500).send({ mensaje: 'Error en el servidor al listar las comandas. ERROR: ' + err });
            } else {
                if (lista.length == 0) {
                    res.status(200).send({ mensaje: 'No se encontraron comandas.' });
                } else {

                    lista.forEach((item) => {
                        item.fecha = moment(item.fecha).toDate();
                        item.imgpago = [];
                        item.detcobrocomanda.forEach((fp) => {
                            if (item.imgpago.length == 0) {
                                item.imgpago.push(fp.estarjeta ? 'tarjeta' : 'efectivo');
                            } else {
                                if (item.imgpago.indexOf(fp.estarjeta ? 'tarjeta' : 'efectivo') < 0) {
                                    item.imgpago.push(fp.estarjeta ? 'tarjeta' : 'efectivo');
                                }
                            }
                        });
                    });
                    //console.log(lista[0]);
                    // console.log(lista);
                    res.status(200).send({ mensaje: 'Lista de comandas.', lista: lista });
                }
            }
        });
}

function lstComandasUsuario(req, res) {
    var idusuario = req.params.idusuario;

    Comanda.find({ idestatuscomanda: "59fea7dd4218672b285ab0e7", idmotorista: idusuario, debaja: false }, null, { sort: { fecha: 1 } })
        .populate('idcliente', ['_id', 'nombre'])
        .populate('idtipocomanda', ['_id', 'descripcion', 'imagen'])
        .populate('idusuario', ['_id', 'nombre'])
        .populate('idestatuscomanda', ['_id', 'descripcion', 'color'])
        .populate('idtelefonocliente', ['_id', 'telefono'])
        .populate({ path: 'iddireccioncliente', populate: { path: 'idrestaurante', select: '_id nombre' } })
        .populate('iddatosfacturacliente', ['_id', 'nit', 'nombre', 'direccion'])
        .populate('idtiempoentrega', ['_id', 'tiempo'])
        .populate('idrestaurante', ['_id', 'nombre'])
        .populate('idmotorista', ['_id', 'nombre'])
        .exec((err, lista) => {
            if (err) {
                res.status(500).send({ mensaje: 'Error en el servidor al listar las comandas. ERROR: ' + err });
            } else {
                if (lista.length == 0) {
                    res.status(200).send({ mensaje: 'No se encontraron comandas.' });
                } else {

                    lista.forEach((item) => {
                        item.fecha = moment(item.fecha).toDate();
                        item.imgpago = [];
                        item.detcobrocomanda.forEach((fp) => {
                            if (item.imgpago.length == 0) {
                                item.imgpago.push(fp.estarjeta ? 'tarjeta' : 'efectivo');
                            } else {
                                if (item.imgpago.indexOf(fp.estarjeta ? 'tarjeta' : 'efectivo') < 0) {
                                    item.imgpago.push(fp.estarjeta ? 'tarjeta' : 'efectivo');
                                }
                            }
                        });
                    });
                    //console.log(lista[0]);
                    // console.log(lista);
                    res.status(200).send({ mensaje: 'Lista de comandas.', lista: lista });
                }
            }
        });
}

function getComanda(req, res) {
    var idcom = req.params.id;

    Comanda.findById(idcom)
        .populate('idcliente', ['_id', 'nombre'])
        .populate('idtipocomanda', ['_id', 'descripcion'])
        .populate('idusuario', ['_id', 'nombre'])
        .populate('idestatuscomanda', ['_id', 'descripcion'])
        .populate('idtelefonocliente', ['_id', 'telefono'])
        .populate({ path: 'iddireccioncliente', populate: { path: 'idrestaurante', select: '_id nombre' } })
        .populate('iddatosfacturacliente', ['_id', 'nit', 'nombre', 'direccion'])
        .populate('idtiempoentrega', ['_id', 'tiempo'])
        .exec((err, com) => {
            if (err) {
                res.status(500).send({ mensaje: 'Error en el servidor al buscar la comanda.' });
            } else {
                if (!com) {
                    res.status(200).send({ mensaje: 'No se encontro la comanda.' });
                } else {
                    res.status(200).send({ mensaje: 'Comanda encontrada con éxito.', entidad: com });
                }
            }
        });
}

function lstComandasCliente(req, res) {
    var idcliente = req.params.idcliente;

    Comanda.find({ idcliente: idcliente, debaja: false }, null, { sort: { fecha: -1 } })
        .populate('idcliente', ['_id', 'nombre'])
        .populate('idtipocomanda', ['_id', 'descripcion', 'imagen'])
        .populate('idusuario', ['_id', 'nombre'])
        .populate('idestatuscomanda', ['_id', 'descripcion', 'color'])
        .populate('idtelefonocliente', ['_id', 'telefono'])
        .populate({ path: 'iddireccioncliente', populate: { path: 'idrestaurante', select: '_id nombre' } })
        .populate('iddatosfacturacliente', ['_id', 'nit', 'nombre', 'direccion'])
        .populate('idtiempoentrega', ['_id', 'tiempo'])
        .populate('idrestaurante', ['_id', 'nombre'])
        .populate('idmotorista', ['_id', 'nombre'])
        .exec((err, lista) => {
            if (err) {
                res.status(500).send({ mensaje: 'Error en el servidor al listar las comandas.' });
            } else {
                if (lista.length == 0) {
                    res.status(200).send({ mensaje: 'No se encontraron comandas.' });
                } else {
                    res.status(200).send({ mensaje: 'Lista de comandas.', lista: lista });
                }
            }
        });
}

// API para FOX

function searchItem(dict, valor) {
    const vacio = { _id: null, descripcion: "", idmongodb: "", idcomponente: "", "idfox": "", detalle: "", power: "", idparticion: "", idtipoprecio: "" };
    for (let i = 0; i < dict.length; i++) {
        if (dict[i].idmongodb) {
            if (dict[i].idmongodb.toString().trim() == valor.toString().trim()) {
                return dict[i];
                break;
            }
        }
    }

    for (let i = 0; i < dict.length; i++) {
        if (dict[i].idcomponente) {
            if (dict[i].idcomponente.toString().trim() == valor.toString().trim()) {
                return dict[i];
                break;
            }
        }
    }

    return vacio;
}

function searchEmisorTarjeta(emisores, idabuscar) {
    var emisor = '';
    emisores.forEach((et) => {
        if (idabuscar != null && idabuscar != undefined) {
            if ((et._id.toString().trim() == idabuscar.toString().trim())) {
                emisor = et.nombre;
            }
        }
    });
    return emisor;
}

function traduceDetalleComanda(dc, dict) {
    let detalle = [], contador = 1, idpow = 0, idext = 0, idextprod = 0;

    dc.forEach((deta, i) => {
        let itemFox = searchItem(dict, deta.idmenurest);
        if (itemFox._id) {
            // Push de producto
            detalle.push(
                {
                    id: contador,
                    idproducto: itemFox.idfox != null ? itemFox.idfox : '',
                    detalle: itemFox.detalle != null ? itemFox.detalle : '',
                    precio: deta.precio,
                    cantidad: deta.cantidad,
                    subtotal: parseFloat((parseFloat(deta.precio) * parseInt(deta.cantidad)).toFixed(2)),
                    idextra: 0,
                    idpower: 0,
                    power: itemFox.power != null ? itemFox.power : '',
                    idparticion: itemFox.idparticion != null ? itemFox.idparticion : '',
                    idtipoprecio: itemFox.idtipoprecio != null ? itemFox.idtipoprecio : '',
                    notas: ''
                }
            )
            idpow = deta.componentes.length == 0 ? 0 : contador;
            idextprod = deta.extrasnotas.length == 0 ? 0 : contador;
            contador++;
            deta.componentes.forEach((compo, j) => {
                let compoFox = searchItem(dict, compo.idcomponente);
                if (compoFox._id) {
                    detalle.push({
                        id: contador,
                        idproducto: compoFox.idfox != null ? compoFox.idfox : '',
                        detalle: compoFox.detalle != null ? compoFox.detalle : '',
                        precio: 0,
                        cantidad: deta.cantidad,
                        subtotal: 0,
                        idextra: 0,
                        idpower: idpow,
                        power: compoFox.power != null ? compoFox.power : '',
                        idparticion: compoFox.idparticion != null ? compoFox.idparticion : '',
                        idtipoprecio: compoFox.idtipoprecio != null ? compoFox.idtipoprecio : '',
                        notas: ''
                    });
                    idext = compo.extrasnotas.length == 0 ? 0 : contador;
                    contador++;
                    compo.extrasnotas.forEach((en, k) => {
                        if (en.esextra) {
                            let extFox = searchItem(dict, en.idcomponente);
                            if (extFox._id) {
                                detalle.push({
                                    id: contador,
                                    idproducto: extFox.idfox != null ? extFox.idfox : '',
                                    detalle: extFox.detalle != null ? extFox.detalle : '',
                                    precio: en.precio,
                                    cantidad: deta.cantidad,
                                    subtotal: parseFloat(parseFloat(en.precio) * parseFloat(deta.cantidad).toFixed(2)),
                                    idextra: idext,
                                    idpower: 0,
                                    power: extFox.power != null ? extFox.power : '',
                                    idparticion: extFox.idparticion != null ? extFox.idparticion : '',
                                    idtipoprecio: extFox.idtipoprecio != null ? extFox.idtipoprecio : '',
                                    notas: ''
                                });
                                contador++;
                            }
                        } else {
                            detalle.push({
                                id: contador,
                                idproducto: '',
                                detalle: '',
                                precio: 0,
                                cantidad: 0,
                                subtotal: 0,
                                idextra: idext,
                                idpower: 0,
                                power: '',
                                idparticion: '',
                                idtipoprecio: '',
                                notas: en.notas
                            });
                            contador++;
                        }
                    });
                }
            });

            deta.extrasnotas.forEach((enp, l) => {
                if (enp.esextra) {
                    let extPFox = searchItem(dict, enp.idcomponente);
                    if (extPFox._id) {
                        detalle.push({
                            id: contador,
                            idproducto: extPFox.idfox != null ? extPFox.idfox : '',
                            detalle: extPFox.detalle != null ? extPFox.detalle : '',
                            precio: enp.precio,
                            cantidad: deta.cantidad,
                            subtotal: parseFloat((parseFloat(enp.precio) * parseFloat(deta.cantidad)).toFixed(2)),
                            idextra: idextprod,
                            idpower: 0,
                            power: extPFox.power != null ? extPFox.power : '',
                            idparticion: extPFox.idparticion != null ? extPFox.idparticion : '',
                            idtipoprecio: extPFox.idtipoprecio != null ? extPFox.idtipoprecio : '',
                            notas: ''
                        });
                        contador++;
                    }
                } else {
                    detalle.push({
                        id: contador,
                        idproducto: '',
                        detalle: '',
                        precio: 0,
                        cantidad: 0,
                        subtotal: 0,
                        idextra: idextprod,
                        idpower: 0,
                        power: '',
                        idparticion: '',
                        idtipoprecio: '',
                        notas: enp.notas
                    });
                    contador++;
                }

            });
        }
    });

    return detalle;
}

function conteoProductos(det) {
    var conteo = 0;

    if (det) {
        det.forEach(function (item) {
            try {
                if (+item.idproducto > 0) {
                    conteo++;
                }
            } catch (e) { }
        });
    }

    return conteo;
}

function traduceFormasPago(dp, emisores) {
    let detalle = [], str = '';
    dp.forEach((fp) => {
        fp.detcobro.forEach((dfp) => {
            str = fp.descripcion + ': ';
            if (!fp.estarjeta) {
                str += parseFloat(dfp.monto).toFixed(2) + ', billete: ';
                str += (dfp.vueltopara ? parseFloat(dfp.vueltopara).toFixed(2) : '') + ', vuelto: ';
                str += (dfp.vuelto ? parseFloat(dfp.vuelto).toFixed(2) : '');
            } else {
                str += parseFloat(dfp.monto).toFixed(2) + ', emisor: ';
                str += searchEmisorTarjeta(emisores, dfp.idemisor) + ', número: ';
                str += (dfp.numero ? dfp.numero.toString() : '') + ', vence: ';
                str += (dfp.mesvence ? dfp.mesvence.toString() : '') + '/' + (dfp.aniovence ? dfp.aniovence.toString() : '');
            }
            detalle.push({ descripcion: str });
        });
    });
    return detalle;
}

function traduceFacturarA(facta, pedido) {
    var tmp = { monto: pedido.totalcomanda, direccion: 'Ciudad', nit: 'C/F', nombre: 'C/F' };
    if (facta) {
        facta.monto = facta.monto ? facta.monto : 0;
        facta.direccion = facta.direccion ? facta.direccion : '';
        facta.nit = facta.nit ? facta.nit : '';
        facta.nombre = facta.nombre ? facta.nombre : '';
        return facta;
    }
    return tmp;
}

/*
async function resetRecibidasToPendente(idrestaurante, fdel, fal) {
    let limite = fs.readFileSync('timelimit.txt', 'utf-8');
    const cutoff = moment().subtract(+limite, 'minutes').toDate();
    const filtro = {
        idrestaurante: idrestaurante,
        idestatuscomanda: "59fea7524218672b285ab0e3",
        debaja: false,
        fecha: { $gte: fdel, $lte: fal },
        fechafintoma: { $lte: cutoff }
    };
    
    //console.log(filtro);
    await Comanda.update(filtro, { $set: { idestatuscomanda: "59fea7304218672b285ab0e2" } }, { multi: true}).exec();    
    return true;
}
*/

async function resetRecibidasToPendente(idrestaurante, fdel, fal) {
    let limite = fs.readFileSync('timelimit.txt', 'utf-8');
    const cutoff = moment().subtract(+limite, 'minutes').toDate();

    const aggOpts = [
        {
            $match: {
                idrestaurante: mongoose.Types.ObjectId(idrestaurante),
                idestatuscomanda: mongoose.Types.ObjectId("59fea7524218672b285ab0e3"),
                debaja: false,
                fecha: { $gte: fdel, $lte: fal }
            }
        },
        { $unwind: "$bitacoraestatus" },
        { $sort: { "bitacoraestatus.fecha": -1 } },
        { $match: { "bitacoraestatus.idestatuscomanda": mongoose.Types.ObjectId("59fea7524218672b285ab0e3") } },
        {
            $group: {
                _id: "$_id",
                estatus: { "$first": "$bitacoraestatus.estatus" },
                fechaestatus: { "$first": "$bitacoraestatus.fecha" }
            }
        },
        {
            $match: { fechaestatus: { $lte: cutoff } }
        }
    ];

    const pedidos = await Comanda.aggregate(aggOpts).exec();
    if (pedidos && pedidos.length > 0) {
        for (let i = 0; i < pedidos.length; i++) {
            let pedido = pedidos[i];
            await Comanda.findByIdAndUpdate(pedido._id, { $set: { idestatuscomanda: "59fea7304218672b285ab0e2" } }).exec();
        }
    }
    return true;
}

async function listaComandasRestaurante(req, res) {
    var lst = [], idrestaurante = req.params.idrestaurante, errores = [];
    var fdel = moment().startOf('day').toDate();
    var fal = moment().endOf('day').toDate();

    await resetRecibidasToPendente(idrestaurante, fdel, fal);

    EmisoresTarjeta.find({}, (errore, listaet) => {
        DiccionarioFox.find({}, (e, dictfox) => {
            if (e) {
                res.status(500).send({ mensaje: 'Error en el servidor al listar el diccionario para las comandas. ERROR: ' + e });
            } else {
                if (dictfox.length == 0) {
                    res.status(200).send({ mensaje: 'No se encontro nada en el diccionario de fox.' });
                } else {
                    const diccionario = dictfox;
                    Comanda.find({
                        idestatuscomanda: { $in: ["59fea7304218672b285ab0e2", "5a72403fc5bb328b700edc58"] },
                        debaja: false,
                        fecha: { $gte: fdel, $lte: fal }
                    }, null, { sort: { fecha: 1 } })
                        .populate('idcliente', ['_id', 'nombre'])
                        .populate('idtipocomanda', ['_id', 'descripcion', 'imagen'])
                        .populate('idusuario', ['_id', 'nombre'])
                        .populate('idestatuscomanda', ['_id', 'descripcion', 'color'])
                        .populate('idtelefonocliente', ['_id', 'telefono'])
                        .populate({ path: 'iddireccioncliente', populate: { path: 'idrestaurante', select: '_id nombre' } })
                        .populate('iddatosfacturacliente', ['_id', 'nit', 'nombre', 'direccion'])
                        .populate('idtiempoentrega', ['_id', 'tiempo'])
                        .populate('idrestaurante', ['_id', 'nombre'])
                        .populate('idmotorista', ['_id', 'nombre'])
                        .exec((err, lista) => {
                            if (err) {
                                res.status(500).send({ mensaje: 'Error en el servidor al listar las comandas del restaurante.' });
                            } else {
                                if (lista.length == 0) {
                                    res.status(200).send({ mensaje: 'No se encontraron comandas para el restaurante.' });
                                } else {
                                    lista.forEach(rst => {
                                        try {
                                            if (!rst.iddireccioncliente.idrestaurante && rst.idrestaurante) {
                                                rst.iddireccioncliente.idrestaurante = rst.idrestaurante;
                                            } else if (!rst.idrestaurante && rst.iddireccioncliente.idrestaurante) {
                                                rst.idrestaurante = rst.iddireccioncliente.idrestaurante;
                                            } else if (rst.idrestaurante && rst.iddireccioncliente.idrestaurante) {
                                                rst.iddireccioncliente.idrestaurante = rst.idrestaurante;
                                            } else if (!rst.idrestaurante && !rst.iddireccioncliente.idrestaurante) {
                                                rst.idrestaurante = {
                                                    _id: ''
                                                };
                                            }

                                            var tmpDetalle = [], cantDetalle = 0;

                                            if (rst.idrestaurante._id.toString().trim() === idrestaurante.toString().trim()) {
                                                tmpDetalle = traduceDetalleComanda(rst.detallecomanda, diccionario);
                                                cantDetalle = conteoProductos(tmpDetalle);
                                                lst.push({
                                                    fechahora: moment(rst.fecha, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm:ss'),
                                                    tracking: parseInt(rst.tracking),
                                                    id: rst._id,
                                                    idusuario: rst.idusuario._id,
                                                    nombreusuario: rst.idusuario.nombre,
                                                    cliente: rst.idcliente.nombre ? rst.idcliente.nombre : '',
                                                    telefono: rst.idtelefonocliente.telefono,
                                                    notas: rst.notas ? rst.notas : '',
                                                    direccion: rst.idtipocomanda._id == '59fff327596e572d9cdac917' ?
                                                        (rst.iddireccioncliente.direccion +
                                                            ', zona ' + rst.iddireccioncliente.zona +
                                                            ', colonia ' + rst.iddireccioncliente.colonia + (rst.iddireccioncliente.codigoacceso ? (', código de acceso ' + rst.iddireccioncliente.codigoacceso) : '')) : 'CLIENTE PASA A TRAER A RESTAURANTE',
                                                    idrestaurante: rst.idrestaurante ? rst.idrestaurante._id : rst.iddireccioncliente.idrestaurante._id,
                                                    restaurante: rst.idrestaurante ? rst.idrestaurante.nombre : rst.iddireccioncliente.idrestaurante.nombre,
                                                    idtipocomanda: rst.idtipocomanda._id,
                                                    tipocomanda: rst.idtipocomanda.descripcion,
                                                    detalle: tmpDetalle,
                                                    cantidadlineasdetalle: cantDetalle,
                                                    detalleformapago: traduceFormasPago(rst.detcobrocomanda, listaet),
                                                    facturara: traduceFacturarA(rst.detfacturara[0], rst),
                                                    estatuscomanda: rst.idestatuscomanda.descripcion
                                                });
                                            }
                                        } catch (errTry) {
                                            errores.push(errTry.message);
                                        }
                                    });
                                    res.status(200).send({ mensaje: 'Lista de comandas.', lista: lst, errores: errores });
                                }
                            }
                        });
                }
            }
        });
    });
}

function getComandaByTracking(req, res) {
    var lst = [], noTracking = req.params.tracking, errores = [];

    EmisoresTarjeta.find({}, (errore, listaet) => {
        DiccionarioFox.find({}, (e, dictfox) => {
            if (e) {
                res.status(500).send({ mensaje: 'Error en el servidor al listar el diccionario para las comandas. ERROR: ' + e });
            } else {
                if (dictfox.length == 0) {
                    res.status(200).send({ mensaje: 'No se encontro nada en el diccionario de fox.' });
                } else {
                    const diccionario = dictfox;
                    Comanda.find({ tracking: noTracking }, null, { sort: { fecha: 1 } })
                        .populate('idcliente', ['_id', 'nombre'])
                        .populate('idtipocomanda', ['_id', 'descripcion', 'imagen'])
                        .populate('idusuario', ['_id', 'nombre'])
                        .populate('idestatuscomanda', ['_id', 'descripcion', 'color'])
                        .populate('idtelefonocliente', ['_id', 'telefono'])
                        .populate({ path: 'iddireccioncliente', populate: { path: 'idrestaurante', select: '_id nombre' } })
                        .populate('iddatosfacturacliente', ['_id', 'nit', 'nombre', 'direccion'])
                        .populate('idtiempoentrega', ['_id', 'tiempo'])
                        .populate('idrestaurante', ['_id', 'nombre'])
                        .populate('idmotorista', ['_id', 'nombre'])
                        .exec((err, lista) => {
                            if (err) {
                                res.status(500).send({ mensaje: 'Error en el servidor al obtener la comanda.' });
                            } else {
                                if (lista.length == 0) {
                                    res.status(200).send({ mensaje: 'No se encontro la comanda del restaurante.' });
                                } else {
                                    lista.forEach(rst => {
                                        try {
                                            if (!rst.iddireccioncliente.idrestaurante && rst.idrestaurante) {
                                                rst.iddireccioncliente.idrestaurante = rst.idrestaurante;
                                            } else if (!rst.idrestaurante && rst.iddireccioncliente.idrestaurante) {
                                                rst.idrestaurante = rst.iddireccioncliente.idrestaurante;
                                            } else if (rst.idrestaurante && rst.iddireccioncliente.idrestaurante) {
                                                rst.iddireccioncliente.idrestaurante = rst.idrestaurante;
                                            } else if (!rst.idrestaurante && !rst.iddireccioncliente.idrestaurante) {
                                                rst.idrestaurante = {
                                                    _id: ''
                                                };
                                            }

                                            var tmpDetalle = [], cantDetalle = 0;
                                            tmpDetalle = traduceDetalleComanda(rst.detallecomanda, diccionario);
                                            cantDetalle = conteoProductos(tmpDetalle);

                                            lst.push({
                                                fechahora: moment(rst.fecha, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm:ss'),
                                                tracking: parseInt(rst.tracking),
                                                id: rst._id,
                                                idusuario: rst.idusuario._id,
                                                nombreusuario: rst.idusuario.nombre,
                                                cliente: rst.idcliente.nombre,
                                                telefono: rst.idtelefonocliente.telefono,
                                                notas: rst.notas ? rst.notas : '',
                                                direccion: rst.idtipocomanda._id == '59fff327596e572d9cdac917' ?
                                                    (rst.iddireccioncliente.direccion +
                                                        ', zona ' + rst.iddireccioncliente.zona +
                                                        ', colonia ' + rst.iddireccioncliente.colonia + (rst.iddireccioncliente.codigoacceso ? (', código de acceso ' + rst.iddireccioncliente.codigoacceso) : '')) : 'CLIENTE PASA A TRAER A RESTAURANTE',
                                                idrestaurante: rst.idrestaurante ? rst.idrestaurante._id : rst.iddireccioncliente.idrestaurante._id,
                                                restaurante: rst.idrestaurante ? rst.idrestaurante.nombre : rst.iddireccioncliente.idrestaurante.nombre,
                                                idtipocomanda: rst.idtipocomanda._id,
                                                tipocomanda: rst.idtipocomanda.descripcion,
                                                detalle: tmpDetalle,
                                                cantidadlineasdetalle: cantDetalle,
                                                detalleformapago: traduceFormasPago(rst.detcobrocomanda, listaet),
                                                facturara: traduceFacturarA(rst.detfacturara[0], rst),
                                                bitacoraestatus: rst.bitacoraestatus,
                                                estatuscomanda: rst.idestatuscomanda.descripcion
                                            });
                                        } catch (errTry) {
                                            errores.push(errTry.message);
                                        }
                                    });
                                    res.status(200).send({
                                        mensaje: 'Lista de comandas.',
                                        lista: lst,
                                        errores: errores
                                    });
                                }
                            }
                        });
                }
            }
        });
    });

}

function setBody(idestatus, ipaddr) {
    var descripcion = '';

    switch (idestatus) {
        case "59fea7304218672b285ab0e2": descripcion = "Pendiente"; break;
        case "59fea7524218672b285ab0e3": descripcion = "Recibido en restaurante"; break;
        case "5a512f55228d627facf8c643": descripcion = "Confirmado por encargado"; break;
        case "59fea7894218672b285ab0e4": descripcion = "Cobrado - aprobado"; break;
        case "59fea79e4218672b285ab0e5": descripcion = "Cobrado - rechazado"; break;
        case "59fea7bc4218672b285ab0e6": descripcion = "Producción"; break;
        case "59fea7dd4218672b285ab0e7": descripcion = "En camino"; break;
        case "59fea7f34218672b285ab0e8": descripcion = "Entregado"; break;
        case "5a72403fc5bb328b700edc58": descripcion = "Error al recibir en restaurante"; break;
    }

    return {
        idestatuscomanda: idestatus,
        $push: {
            'bitacoraestatus': {
                fecha: moment().toDate(),
                idestatuscomanda: mongoose.Types.ObjectId(idestatus),
                estatus: descripcion,
                ip: ipaddr
            }
        }
    };
}

function comandaConProblemas(req, res) {
    var idcom = req.params.id, ipaddr = req.params.ipaddr ? req.params.ipaddr : null;
    var body = setBody("5a72403fc5bb328b700edc58", ipaddr);

    Comanda.findByIdAndUpdate(idcom, body, { new: true }, (err, comandaUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al poner la comanda en Problemas.' });
        } else {
            if (!comandaUpd) {
                res.status(200).send({ mensaje: 'No se pudo poner con problema para descargar la comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Comanda puesta con problemas para descargar.', entidad: comandaUpd });
            }
        }
    });
}

function confirmarComanda(req, res) {
    var idcom = req.params.id,
        ipaddr = req.params.ipaddr ? req.params.ipaddr : null;
    var body = setBody("59fea7524218672b285ab0e3", ipaddr);

    Comanda.findByIdAndUpdate(idcom, body, { new: true }, (err, comandaUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al confirmar la comanda. ERROR: ' + err });
        } else {
            if (!comandaUpd) {
                res.status(200).send({ mensaje: 'No se pudo confirmar la comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Comanda confirmada exitosamente.', entidad: comandaUpd });
            }
        }
    });
}

function confirmarComandaEncargado(req, res) {
    var idcom = req.params.id,
        ipaddr = req.params.ipaddr ? req.params.ipaddr : null;
    var body = setBody("5a512f55228d627facf8c643", ipaddr);

    Comanda.findByIdAndUpdate(idcom, body, { new: true }, (err, comandaUpd) => {
        if (err) {
            res.status(500).send({
                mensaje: 'Error en el servidor al confirmar la comanda por el encargado.'
            });
        } else {
            if (!comandaUpd) {
                res.status(200).send({
                    mensaje: 'No se pudo confirmar la comanda por el encargado.'
                });
            } else {
                res.status(200).send({
                    mensaje: 'Comanda confirmada exitosamente por el encargado.',
                    entidad: comandaUpd
                });
            }
        }
    });
}

/*
function resetEstatusComandas(req, res) {
    Comanda.update({ idestatuscomanda: { $ne: '59fea7f34218672b285ab0e8' } }, { idestatuscomanda: "59fea7304218672b285ab0e2", idmotorista: null }, { multi: true }).exec((err, raw) =>{
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al resetear los estatus de las comandas.' });
        } else {
            res.status(200).send({ mensaje: 'Comandas reseteadas exitosamente.' });
        }
    });
}
*/

function cobroAprobadoComanda(req, res) {
    var idcom = req.params.id,
        ipaddr = req.params.ipaddr ? req.params.ipaddr : null;
    var body = setBody("59fea7894218672b285ab0e4", ipaddr);

    Comanda.findByIdAndUpdate(idcom, body, { new: true }, (err, comandaUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al cambiar el estatus a cobro aprobado de la comanda.' });
        } else {
            if (!comandaUpd) {
                res.status(200).send({ mensaje: 'No se pudo cambiar el estatus a cobro aprobado de la comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Cobro aprobado de comanda.', entidad: comandaUpd });
            }
        }
    });
}

function cobroRechazadoComanda(req, res) {
    var idcom = req.params.id,
        ipaddr = req.params.ipaddr ? req.params.ipaddr : null;
    var body = setBody("59fea79e4218672b285ab0e5", ipaddr);

    Comanda.findByIdAndUpdate(idcom, body, { new: true }, (err, comandaUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al cambiar el estatus a cobro rechazado de la comanda.' });
        } else {
            if (!comandaUpd) {
                res.status(200).send({ mensaje: 'No se pudo cambiar el estatus a cobro rechazado de la comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Cobro rechazado de comanda.', entidad: comandaUpd });
            }
        }
    });
}

function produccionComanda(req, res) {
    var idcom = req.params.id,
        ipaddr = req.params.ipaddr ? req.params.ipaddr : null;
    var body = setBody("59fea7bc4218672b285ab0e6", ipaddr);

    Comanda.findByIdAndUpdate(idcom, body, { new: true }, (err, comandaUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al cambiar el estatus a produción de la comanda.' });
        } else {
            if (!comandaUpd) {
                res.status(200).send({ mensaje: 'No se pudo cambiar el estatus a producción de la comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Producción de comanda.', entidad: comandaUpd });
            }
        }
    });
}

function enCaminoComanda(req, res) {
    var idcom = req.params.id,
        idmotorista = req.params.idmotorista,
        ipaddr = req.params.ipaddr ? req.params.ipaddr : null;
    var body = setBody("59fea7dd4218672b285ab0e7", ipaddr);
    body.idmotorista = idmotorista;

    Comanda.findByIdAndUpdate(idcom, body, { new: true }, (err, comandaUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al cambiar el estatus a en camino de la comanda.' });
        } else {
            if (!comandaUpd) {
                res.status(200).send({ mensaje: 'No se pudo cambiar el estatus a en camino de la comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Comanda en camino.', entidad: comandaUpd });
            }
        }
    });
}

function entregadaComanda(req, res) {
    var idcom = req.params.id,
        ipaddr = req.params.ipaddr ? req.params.ipaddr : null;
    var body = setBody("59fea7f34218672b285ab0e8", ipaddr);

    Comanda.findByIdAndUpdate(idcom, body, { new: true }, (err, comandaUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al cambiar el estatus a comanda entregada.' });
        } else {
            if (!comandaUpd) {
                res.status(200).send({ mensaje: 'No se pudo cambiar el estatus a comanda entregada.' });
            } else {
                res.status(200).send({ mensaje: 'Comanda entregada.', entidad: comandaUpd });
            }
        }
    });
}

// Fin de API para FOX

// Detalle comanda
function crearDetComanda(req, res) {
    var detcom = new DetalleComanda();
    var params = req.body;

    detcom.idcomanda = params.idcomanda;
    detcom.idmenurest = params.idmenurest;
    detcom.cantidad = params.cantidad;
    detcom.precio = params.precio;
    detcom.notas = params.notas;
    detcom.debaja = params.debaja;

    detcom.save((err, detcomSvd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al crear el detalle de comanda.' });
        } else {
            if (!detcomSvd) {
                res.status(200).send({ mensaje: 'No se pudo grabar el detalle de comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Detalle de comanda grabado exitosamente.', entidad: detcomSvd });
            }
        }
    });

}

function modificarDetComanda(req, res) {
    var iddetcom = req.params.id;
    var body = req.body;

    DetalleComanda.findByIdAndUpdate(iddetcom, body, { new: true }, (err, detcomUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al modificar el detalle de comanda.' });
        } else {
            if (!detcomUpd) {
                res.status(200).send({ mensaje: 'No se pudo modificar el detalle de comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Detalle de comanda modificado exitosamente.', entidad: detcomUpd });
            }
        }
    });
}

function eliminarDetComanda(req, res) {
    var iddetcom = req.params.id;
    var body = req.body;

    DetalleComanda.findByIdAndUpdate(iddetcom, body, { new: true }, (err, detcomDel) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al eliminar el detalle de comanda.' });
        } else {
            if (!detcomDel) {
                res.status(200).send({ mensaje: 'No se pudo eliminar el detalle de comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Detalle de comanda eliminado exitosamente.', entidad: detcomDel });
            }
        }
    });
}

function listaDetComanda(req, res) {
    var idcomanda = req.params.idcomanda;

    DetalleComanda.find({ idcomanda: idcomanda, debaja: false }).populate('idmenurest').exec((err, lista) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al listar el detalle de la comanda.' });
        } else {
            if (lista.length == 0) {
                res.status(200).send({ mensaje: 'No se encontraró detalle de la comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Detalle de comanda.', lista: lista });
            }
        }
    });
}

function getDetComanda(req, res) {
    var iddetcom = req.params.id;

    DetalleComanda.findById(iddetcom).populate('idmenurest').exec((err, detcom) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al buscar el detalle de la comanda.' });
        } else {
            if (!detcom) {
                res.status(200).send({ mensaje: 'No se encontraró el detalle de la comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Detalle de comanda.', entidad: detcom });
            }
        }
    });
}

// Detalle de componentes para el detalle de comanda
function crearDetCompDetComanda(req, res) {
    var detcomp = new DetCompDetComanda();
    var params = req.body;

    detcomp.iddetallecomanda = params.iddetallecomanda;
    detcomp.idcomponente = params.idcomponente;
    detcomp.debaja = params.debaja;

    detcomp.save((err, entidadSvd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor el detalle de componente.' });
        } else {
            if (!entidadSvd) {
                res.status(200).send({ mensaje: 'No se pudo grabar el detalle decomponente.' });
            } else {
                res.status(200).send({ mensaje: 'Detalle de componente grabado exitosamente.', entidad: entidadSvd });
            }
        }
    });

}

function modificarDetCompDetComanda(req, res) {
    var iddet = req.params.id;
    var body = req.body;

    DetCompDetComanda.findByIdAndUpdate(iddetcom, body, { new: true }, (err, entidadUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al modificar el detalle de componente.' });
        } else {
            if (!entidadUpd) {
                res.status(200).send({ mensaje: 'No se pudo modificar el detalle de componente.' });
            } else {
                res.status(200).send({ mensaje: 'Detalle de componente modificado exitosamente.', entidad: entidadUpd });
            }
        }
    });
}

function eliminarDetCompDetComanda(req, res) {
    var iddet = req.params.id;
    var body = req.body;

    DetCompDetComanda.findByIdAndUpdate(iddetcom, body, { new: true }, (err, entidadDel) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al eliminar el detalle de componente.' });
        } else {
            if (!entidadDel) {
                res.status(200).send({ mensaje: 'No se pudo eliminar el detalle de componente.' });
            } else {
                res.status(200).send({ mensaje: 'Detalle de componente eliminado exitosamente.', entidad: entidadDel });
            }
        }
    });
}

function listaDetCompDetComanda(req, res) {
    var iddetcomanda = req.params.iddetcomanda;

    DetCompDetComanda.find({ iddetallecomanda: iddetcomanda, debaja: false }).populate('idcomponente').exec((err, lista) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al listar el detalle de componentes.' });
        } else {
            if (lista.length == 0) {
                res.status(200).send({ mensaje: 'No se encontraró detalle de componentes.' });
            } else {
                res.status(200).send({ mensaje: 'Detalle de componentes.', lista: lista });
            }
        }
    });
}

function getDetCompDetComanda(req, res) {
    var iddetcompdetcomanda = req.params.id;

    DetCompDetComanda.findById(iddetcompdetcomanda).populate('idcomponente').exec((err, entidad) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al buscar el detalle de componentes.' });
        } else {
            if (!entidad) {
                res.status(200).send({ mensaje: 'No se encontraró el detalle de componentes.' });
            } else {
                res.status(200).send({ mensaje: 'Detalle de componentes.', entidad: entidad });
            }
        }
    });
}

// Detalle de notas y extras de comanda
function crearExtraNotaComanda(req, res) {
    var extranota = new ExtrasNotasComanda();
    var params = req.body;

    extranota.iddetallecomanda = params.iddetallecomanda;
    extranota.iddetcompdetcomanda = params.iddetcompdetcomanda;
    extranota.idcomponente = params.idcomponente;
    extranota.esextra = params.esextra;
    extranota.precio = params.precio;
    extranota.notas = params.notas;
    extranota.debaja = params.debaja;

    extranota.save((err, entidadSvd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al grabar los extras/notas de la comanda.' });
        } else {
            if (!entidadSvd) {
                res.status(200).send({ mensaje: 'No se pudo grabar los extras/notas de la comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Extras/notas de la comanda grabadas exitosamente.', entidad: entidadSvd });
            }
        }
    });

}

function modificarExtraNotaComanda(req, res) {
    var idextranota = req.params.id;
    var body = req.body;

    ExtrasNotasComanda.findByIdAndUpdate(idextranota, body, { new: true }, (err, entidadUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al modificar los extras/notas de la comanda.' });
        } else {
            if (!entidadUpd) {
                res.status(200).send({ mensaje: 'No se pudo modificar los extras/notas de la comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Extras/notas modificado exitosamente.', entidad: entidadUpd });
            }
        }
    });
}

function eliminarExtraNotaComanda(req, res) {
    var idextranota = req.params.id;
    var body = req.body;

    ExtrasNotasComanda.findByIdAndUpdate(idextranota, body, { new: true }, (err, entidadDel) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al eliminar los extras/notas de la comanda.' });
        } else {
            if (!entidadDel) {
                res.status(200).send({ mensaje: 'No se pudo eliminar los extras/notas de la comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Extras/notas de la comanda eliminado exitosamente.', entidad: entidadDel });
            }
        }
    });
}

function listaExtrasNotasComanda(req, res) {
    var iddetcomanda = req.params.iddetcomanda, iddetcompdetcom = req.params.iddetcompdetcom;
    var fltr = { iddetallecomanda: null, iddetcompdetcomanda: null, debaja: false };
    if (iddetcomanda) { fltr.iddetallecomanda = iddetcomanda; fltr.iddetcompdetcomanda = null; }
    if (iddetcompdetcom) { fltr.iddetcompdetcomanda = iddetcompdetcom; fltr.iddetcomanda = null; }

    ExtrasNotasComanda.find(fltr).populate('idcomponente').exec((err, lista) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al listar los extras/notas de la comanda.' });
        } else {
            if (lista.length == 0) {
                res.status(200).send({ mensaje: 'No se encontraró los extras/notas de la comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Extras/notas de la comanda.', lista: lista });
            }
        }
    });
}

function getExtraNotaComanda(req, res) {
    var idextranota = req.params.id;

    ExtrasNotasComanda.findById(idextranota).populate('idcomponente').exec((err, entidad) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al buscar el extra/nota de comanda.' });
        } else {
            if (!entidad) {
                res.status(200).send({ mensaje: 'No se encontraró el extra/nota de comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Extra/nota de comanda.', entidad: entidad });
            }
        }
    });
}

// Detalle cobro comanda
function crearDetCobroCom(req, res) {
    var detcobcom = new DetalleCobroComanda();
    var params = req.body;

    detcobcom.idcomanda = params.idcomanda;
    detcobcom.idformapago = params.idformapago;
    detcobcom.debaja = params.debaja;

    detcobcom.save((err, entidadSvd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al grabar el detalle de cobro de la comanda.' });
        } else {
            if (!entidadSvd) {
                res.status(200).send({ mensaje: 'No se pudo grabar el detalle de cobro de la comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Detalle de cobro de la comanda grabado exitosamente.', entidad: entidadSvd });
            }
        }
    });

}

function modificarDetCobroCom(req, res) {
    var identidad = req.params.id;
    var body = req.body;

    DetalleCobroComanda.findByIdAndUpdate(identidad, body, { new: true }, (err, entidadUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al modificar el detalle de cobro de la comanda.' });
        } else {
            if (!entidadUpd) {
                res.status(200).send({ mensaje: 'No se pudo modificar el detalle de cobro de la comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Detalle de cobro modificado exitosamente.', entidad: entidadUpd });
            }
        }
    });
}

function eliminarDetCobroCom(req, res) {
    var identidad = req.params.id;
    var body = req.body;

    DetalleCobroComanda.findByIdAndUpdate(identidad, body, { new: true }, (err, entidadDel) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al eliminar el detalle de cobro de la comanda.' });
        } else {
            if (!entidadDel) {
                res.status(200).send({ mensaje: 'No se pudo eliminar el detalle de cobro de la comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Detalle de cobro de la comanda eliminado exitosamente.', entidad: entidadDel });
            }
        }
    });
}

function listaDetCobroCom(req, res) {
    var idcomanda = req.params.idcomanda;

    DetalleCobroComanda.find({ idcomanda: idcomanda, debaja: false }).populate('idformapago').exec((err, lista) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al listar las formas de pago de la comanda.' });
        } else {
            if (lista.length == 0) {
                res.status(200).send({ mensaje: 'No se encontraron formas de pago de la comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Formas de pago de la comanda.', lista: lista });
            }
        }
    });
}

function getDetCobroCom(req, res) {
    var identidad = req.params.id;

    DetalleCobroComanda.findById(identidad).populate('idformapago').exec((err, entidad) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al buscar la forma de pago de comanda.' });
        } else {
            if (!entidad) {
                res.status(200).send({ mensaje: 'No se encontraró la forma de pago de comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Forma de pago de comanda.', entidad: entidad });
            }
        }
    });
}

function contadorPorEstatus(req, res) {
    var fdel = moment(req.params.fdel).startOf('day').toDate();
    var fal = moment(req.params.fal).endOf('day').toDate();

    var aggOpts = [
        { $match: { fecha: { $gte: fdel, $lte: fal }, idrestaurante: { $exists: true, $ne: null } } },
        { $group: { _id: "$idestatuscomanda", count: { $sum: 1 } } }];

    Comanda.aggregate(aggOpts).exec((err, lista) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al contar comandas por estatus.' });
        } else {
            if (lista.length == 0) {
                res.status(200).send({ mensaje: 'No se encontraron comanda para contar por estatus.' });
            } else {
                EstatusComanda.populate(lista, { path: "_id", select: "orden descripcion color", sort: { "orden": 1 } }, (error, listaLlena) => {
                    if (error) {
                        res.status(500).send({ mensaje: 'Error en el servidor al contar comandas por estatus. ERROR: ' + error });
                    } else {
                        if (listaLlena.length == 0) {
                            res.status(200).send({ mensaje: 'No se encontraron comanda para contar por estatus.' });
                        } else {
                            listaLlena.sort((a, b) => { return a._id.orden - b._id.orden; });
                            res.status(200).send({ mensaje: 'Conteo de comandas por estatus.', lista: listaLlena });
                        }
                    }
                });
            }
        }
    });
}


//Inicia API para TIGO
/*
function crearComanda(req, res){
    var com = new Comanda();
    var params = req.body;    

    com.idcliente = params.idcliente;
    com.idtelefonocliente = params.idtelefonocliente;
    com.iddireccioncliente = params.iddireccioncliente;    
    com.fecha = params.fecha;
    com.idtipocomanda = params.idtipocomanda;
    com.idusuario = params.idusuario;
    com.fechainitoma = params.fechainitoma;
    com.fechafintoma = params.fechafintoma;
    com.idestatuscomanda = params.idestatuscomanda;
    com.notas = params.notas;
    com.cantidaditems = params.cantidaditems;
    com.totalcomanda = params.totalcomanda;
    com.detallecomanda = params.detallecomanda;
    com.detcobrocomanda = params.detcobrocomanda;
    com.detfacturara = params.detfacturara;
    com.idtiempoentrega = params.idtiempoentrega;
    com.idrestaurante = params.idrestaurante;
    com.idmotorista = params.idmotorista;
    com.imgpago = params.imgpago;
    com.debaja = params.debaja;   
    com.bitacoraestatus = [ { idestatuscomanda: mongoose.Types.ObjectId("59fea7304218672b285ab0e2"), estatus: "Pendiente", fecha: moment().toDate() } ];

    com.save((err, comandaSvd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al crear la comanda. Error: ' + err });
        } else {
            if (!comandaSvd) {
                res.status(200).send({ mensaje: 'No se pudo grabar la comanda.' });
            } else {
                res.status(200).send({ mensaje: 'Comanda grabada exitosamente.', entidad: comandaSvd });
            }
        }
    });

}
*/

async function nuevoClienteTigo(datos) {
    let cliente = new Cliente();
    let telefono = new TelefonoCliente();
    let direccion = new DireccionCliente();
    let datosfact = new DatosFacturaCliente();

    try {
        cliente.nombre = datos.nombre_cliente;
        cliente.detigo = true;
        cliente.debaja = false;
        const clienteSvd = await cliente.save();

        telefono.idcliente = clienteSvd._id;
        telefono.telefono = datos.telefono;
        telefono.debaja = false;
        const telefonoSvd = await telefono.save();

        direccion.idcliente = clienteSvd._id;
        direccion.idtipodireccion = "59e7785cf46aa32910c255a2";
        direccion.idrestaurante = null;
        direccion.direccion = datos.direccion_entrega;
        direccion.zona = datos.zona;
        direccion.colonia = datos.colonia;
        direccion.codigoacceso = datos.codigo_acceso;
        direccion.debaja = false;
        const direccionSvd = await direccion.save();

        datosfact.idcliente = clienteSvd._id;
        datosfact.nit = datos.nit;
        datosfact.nombre = datos.nombre_factura;
        datosfact.direccion = datos.direccion_factura;
        datosfact.debaja = false;
        const facturaSvd = await datosfact.save();

        return {
            exito: true,
            mensaje: 'Cliente grabado exitosamente.',
            entidad: {
                cliente: clienteSvd,
                telefono: telefonoSvd,
                direccion: direccionSvd,
                facturacion: facturaSvd
            }
        };
    } catch (e) {
        return {
            exito: false,
            mensaje: e,
            entidad: null
        };
    }
}


async function webHookInsert(req, res) {
    const objTigo = req.body;
    let com = new Comanda();

    const result = await nuevoClienteTigo(objTigo);
    const clienteTigo = result.entidad;

    if (clienteTigo) {
        try {
            const tipocmd = await TipoComanda.find({ descripcion: objTigo.tipo_orden }).exec();

            com.idcliente = clienteTigo.cliente._id;
            com.idtelefonocliente = clienteTigo.telefono._id;
            com.iddireccioncliente = clienteTigo.direccion._id;
            com.fecha = moment().toDate();
            com.idtipocomanda = tipocmd !== null && tipocmd !== undefined ? tipocmd[0]._id : "59fff327596e572d9cdac917";
            com.idusuario = "59d8051d5d8d082af82dedd7";
            com.fechainitoma = moment().toDate();
            com.fechafintoma = moment().toDate();
            com.idestatuscomanda = "59fea7304218672b285ab0e2";
            com.notas = '';
            com.cantidaditems = objTigo.pedido.count;
            com.totalcomanda = objTigo.total_pedido;
            com.detallecomanda = [];
            com.detcobrocomanda = [];
            com.detfacturara = [{
                nit: clienteTigo.facturacion.nit,
                nombre: clienteTigo.facturacion.nombre,
                direccion: clienteTigo.facturacion.direccion,
                monto: objTigo.total_pedido
            }];
            com.idtiempoentrega = "5a3a2ce36a72bb242199a1e4";
            com.idrestaurante = null;
            com.idmotorista = null;
            com.imgpago = null;
            com.debaja = false;
            com.bitacoraestatus = [{ idestatuscomanda: mongoose.Types.ObjectId("59fea7304218672b285ab0e2"), estatus: "Pendiente", fecha: moment().toDate() }];
            com.detigo = true;

            for (let item of objTigo.pedido) {
                const itemMenu = await Carta.findById(item.id_vesuvio);
                // console.log('ES PROMO = ', itemMenu.espromocion);
                if (itemMenu !== null && itemMenu !== undefined) {
                    if (itemMenu.espromocion) {
                        // console.log('ITEMS = ', itemMenu.itemspromo);
                        com.notas += `Promocion: ${item.descripcion}. `;
                        itemMenu.itemspromo.forEach((ip, i) => {
                            com.detallecomanda.push({
                                idmenurest: ip.idmenurest,
                                cantidad: item.cantidad,
                                descripcion: ip.descripcion,
                                precio: (i !== 0 ? 0 : item.precio_unitario),
                                precioextra: ip.precioextra,
                                tieneextras: ip.tieneextras,
                                limitecomponentes: ip.limitecomponentes,
                                extrasnotas: ip.extrasnotas,
                                componentes: ip.componentes,
                                notas: ip.notas,
                                debaja: false
                            });
                        });
                    } else {
                        com.detallecomanda.push({
                            idmenurest: item.id_vesuvio,
                            cantidad: item.cantidad,
                            descripcion: item.descripcion,
                            precio: item.precio_unitario,
                            precioextra: null,
                            tieneextras: null,
                            limitecomponentes: null,
                            extrasnotas: [],
                            componentes: [],
                            notas: null,
                            debaja: false
                        });
                    }
                } else {
                    throw "No se encontró el producto seleccionado...";
                }
            }

            const comandaTigo = await com.save();
            res.status(200).send({ exito: true, mensaje: 'Comanda grabada exitosamente.', entidad: comandaTigo });
            // res.status(200).send({ exito: true, mensaje: 'Para pruebas...', entidad: com }); //Esto es solo para pruebas del endpoint.
        } catch (error) {
            console.log('ERROR: ', error);
            res.status(500).send({ exito: false, mensaje: error, entidad: null });
        }
    } else {
        res.status(500).send({ exito: false, mensaje: result.mensaje, entidad: null });
    }
}

//Finaliza API para TIGO





module.exports = {
    crearComanda, modificarComanda, eliminarComanda, listaComandas, getComanda, lstComandasCliente, contadorPorEstatus, lstComandasUsuario, listaComandasPost,
    // api para FOX
    listaComandasRestaurante, confirmarComanda,
    //resetEstatusComandas, 
    cobroAprobadoComanda, cobroRechazadoComanda,
    produccionComanda, enCaminoComanda, entregadaComanda, confirmarComandaEncargado, getComandaByTracking, comandaConProblemas,
    // fin de api para FOX    
    crearDetComanda, modificarDetComanda, eliminarDetComanda, listaDetComanda, getDetComanda,
    crearDetCompDetComanda, modificarDetCompDetComanda, eliminarDetCompDetComanda, listaDetCompDetComanda, getDetCompDetComanda,
    crearExtraNotaComanda, modificarExtraNotaComanda, eliminarExtraNotaComanda, listaExtrasNotasComanda, getExtraNotaComanda,
    crearDetCobroCom, modificarDetCobroCom, eliminarDetCobroCom, listaDetCobroCom, getDetCobroCom,
    // API para TIGO
    webHookInsert
    // Fin de API para TIGO    
}
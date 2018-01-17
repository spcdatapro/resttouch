'use strict'
var moment = require('moment');

// Modelos
var Cliente = require('../models/cliente');
var TelefonoCliente = require('../models/telefonocliente');
var DireccionCliente = require('../models/direccioncliente');
var DatosFacturaCliente = require('../models/datosfacturacliente');

// Acciones
// Cliente
function crearCliente(req, res){
    var cliente = new Cliente();
    var params = req.body;

    cliente.nombre = params.nombre;
    cliente.notascliente = params.notascliente;
    cliente.cumpleanios = !moment(params.cumpleanios).isValid() ? null : params.cumpleanios;
    cliente.correoelectronico = params.correoelectronico;
    cliente.tienehijos = params.tienehijos;
    cliente.rangoedadeshijos = params.rangoedadeshijos;
    cliente.debaja = params.debaja;   

    cliente.save((err, clienteSaved) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al crear el cliente. ERROR: ' + err });
        }else{
            if(!clienteSaved){
                res.status(200).send({ mensaje: 'No se pudo grabar el cliente.' });
            }else{
                res.status(200).send({ mensaje:'Cliente grabado exitosamente.', entidad: clienteSaved});
            }
        }
    });
}

function nuevoClientePaquete(req, res) {
    var cliente = new Cliente();
    var telefono = new TelefonoCliente();
    var direccion = new DireccionCliente();
    var datosfact = new DatosFacturaCliente();

    var pcliente = req.body.cliente;
    cliente.nombre = pcliente.nombre;
    cliente.notascliente = pcliente.notascliente;
    cliente.cumpleanios = !moment(pcliente.cumpleanios).isValid() ? null : pcliente.cumpleanios;
    cliente.correoelectronico = pcliente.correoelectronico;
    cliente.tienehijos = pcliente.tienehijos;
    cliente.rangoedadeshijos = pcliente.rangoedadeshijos;
    cliente.debaja = pcliente.debaja;

    cliente.save((err, clienteSvd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al crear el cliente. ERROR: ' + err });            
        } else {
            if (!clienteSvd) {
                res.status(200).send({ mensaje: 'No se pudo grabar el cliente.' });
            } else {
                // Grabar teléfono
                var ptelefono = req.body.telefono;
                telefono.idcliente = clienteSvd._id;
                telefono.telefono = ptelefono.telefono;
                telefono.debaja = ptelefono.debaja;

                telefono.save((errTel, telefonoSvd) => {
                    if (errTel) {
                        res.status(500).send({ mensaje: 'Error en el servidor al crear el teléfono del cliente. ERROR: ' + errTel });
                    } else {
                        if (!telefonoSvd) {
                            res.status(200).send({ mensaje: 'No se pudo grabar el teléfono del cliente.' });
                        } else {
                            // Grabar dirección del cliente
                            var pdireccion = req.body.direccion;
                            direccion.idcliente = clienteSvd._id;
                            direccion.idtipodireccion = pdireccion.idtipodireccion;
                            direccion.idrestaurante = pdireccion.idrestaurante;
                            direccion.direccion = pdireccion.direccion;
                            direccion.zona = pdireccion.zona;
                            direccion.colonia = pdireccion.colonia;
                            direccion.codigoacceso = pdireccion.codigoacceso;
                            direccion.debaja = pdireccion.debaja;

                            direccion.save((errDir, direccionSvd) => {
                                if (errDir) {
                                    res.status(500).send({ mensaje: 'Error en el servidor al crear la dirección del cliente. ERROR: ' + errDir });
                                } else {
                                    if (!direccionSvd) {
                                        res.status(200).send({ mensaje: 'No se pudo grabar la dirección del cliente.' });
                                    } else {
                                        //Grabar datos de facturación del cliente
                                        var pfactura = req.body.factura;
                                        datosfact.idcliente = clienteSvd._id;
                                        datosfact.nit = pfactura.nit;
                                        datosfact.nombre = pfactura.nombre;
                                        datosfact.direccion = pfactura.direccion;
                                        datosfact.debaja = pfactura.debaja;

                                        datosfact.save((errFact, facturaSvd) => {
                                            if (errFact) {
                                                res.status(500).send({ mensaje: 'Error en el servidor al crear los datos de facturación del cliente. ERROR: ' + errFact });
                                            } else {
                                                if (!facturaSvd) {
                                                    res.status(200).send({ mensaje: 'No se pudo grabar los datos de facturación del cliente.' });
                                                } else {
                                                    res.status(200).send({ 
                                                        mensaje: 'Cliente grabado exitosamente.', 
                                                        entidad: {
                                                            idcliente: clienteSvd._id, 
                                                            telefono: telefonoSvd.telefono
                                                        } 
                                                    });
                                                }
                                            }
                                        });

                                    }
                                }
                            });
                        }
                    }
                });
            }            
        }
    });
}

function modificarCliente(req, res){
    var idcliente = req.params.id;
    var body = req.body;

    body.cumpleanios = !moment(body.cumpleanios).isValid() ? null : body.cumpleanios;
    
    Cliente.findByIdAndUpdate(idcliente, body, { new: true }, (err, clienteUpd) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al modificar el cliente. ERROR: ' + err });
        }else{
            if(!clienteUpd){
                res.status(200).send({ mensaje: 'No se pudo modificar el cliente.' });
            }else{
                res.status(200).send({ mensaje:'Cliente modificado exitosamente.', entidad: clienteUpd});
            }
        }        
    });
}

function eliminarCliente(){
    var idcliente = req.params.id;
    var body = req.body;

    Cliente.findByIdAndUpdate(idcliente, body, { new: true }, (err, clienteDel) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al eliminar el cliente.' });
        }else{
            if(!clienteDel){
                res.status(200).send({ mensaje: 'No se pudo eliminar el cliente.' });
            }else{
                res.status(200).send({ mensaje:'Cliente eliminado exitosamente.', entidad: clienteDel});
            }
        }        
    });        
}

function getClienteById(req, res){
    var idcliente = req.params.id;
    Cliente.findById(idcliente, (err, cliente) =>{
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al buscar el cliente.' });
        }else{
            if(!cliente){
                res.status(200).send({ mensaje: 'No se pudo encontrar el cliente.' });
            }else{
                res.status(200).send({ mensaje:'Cliente encontrado exitosamente.', entidad: cliente});
            }
        }
    });
}

function getClienteByTelefono(req, res){
    var telefono = req.params.telefono;
    
    TelefonoCliente.find({ telefono: telefono }, (err, listaTelCliente) =>{
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al buscar el teléfono del cliente.' });
        }else{
            if(listaTelCliente.length == 0){
                res.status(200).send({ mensaje: 'No se pudo encontrar el teléfono del cliente.' });
            }else{
                var listaIds = [];
                listaTelCliente.forEach(tel => { listaIds.push(tel.idcliente); });
                Cliente.find({ _id: { "$in" : listaIds }, debaja: false }, null, { sort: { nombre: 1 } }, (errcli, lista) =>{
                    if(errcli){
                        res.status(500).send({ mensaje: 'Error en el servidor al buscar el cliente.' });
                    }else{
                        if(lista.length == 0){
                            res.status(200).send({ mensaje: 'No se pudo encontrar el cliente.' });
                        }else{
                            res.status(200).send({ mensaje:'Cliente encontrado exitosamente.', lista: lista});
                        }
                    }
                })                
            }
        }        
    });
}

/*
function lstClientes(req, res){
    Cliente.find({}, null, { sort: { nombre: 1 } }, (err, lista) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al listar clientes.' });
        }else{
            if(!lista){
                res.status(200).send({ mensaje: 'Lista de clientes vacía.' });
            }else{
                res.status(200).send({ mensaje:'Lista de clientes.', lista: lista});
            }
        }        
    });
}
*/

function lstClientes(req, res) {
    var perPage = 25;
    var page = req.params.page || 1;
    var nombre = req.params.buscar || '';
    var filtro = {};

    if (nombre != '') {
        filtro = { nombre: new RegExp(nombre, 'i') };
        // page = 1;
    }

    Cliente
    .find(filtro, null, { sort: { nombre: 1 } })
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec((err, lista) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al listar clientes.' });
        } else {
            if (!lista) {
                res.status(200).send({ mensaje: 'Lista de clientes vacía.' });
            } else {
                Cliente.find(filtro).count().exec((err2, conteo) => {
                    var pages = Math.ceil(conteo / perPage); 
                    if (page > pages) { page = 1; }
                    res.status(200).send({ 
                        mensaje: 'Lista de clientes. Página No. ' + page, 
                        lista: lista, 
                        current: page, 
                        pages: pages,
                        conteo: conteo, 
                        perpage: perPage
                    }
                );
                });                
            }
        }
    });

}

// Telefonos del cliente
function crearTelefonoCliente(req, res){
    var telefono = new TelefonoCliente();
    var params = req.body;

    telefono.idcliente = params.idcliente;
    telefono.telefono = params.telefono;
    telefono.debaja = params.debaja;

    telefono.save((err, telefonoSaved) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al crear el teléfono del cliente.' });
        }else{
            if(!telefonoSaved){
                res.status(200).send({ mensaje: 'No se pudo grabar el teléfono del cliente.' });
            }else{
                res.status(200).send({ mensaje:'Teléfono del cliente grabado exitosamente.', entidad: telefonoSaved});
            }
        }
    });
}

function getTelefonosCliente(req, res){
    var idcliente = req.params.idcliente;
    TelefonoCliente.find({idcliente: idcliente, debaja: false}, (err, lista) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al buscar los teléfonos del cliente.' });
        }else{
            if(!lista){
                res.status(200).send({ mensaje: 'No se encontraron teléfonos del cliente.' });
            }else{
                res.status(200).send({ mensaje:'Lista de teléfonos.', lista: lista});
            }
        }
    });
}

function getTelByIdClienteNumtel(req, res){
    var idcliente = req.params.idcliente, telefono = req.params.telefono;

    TelefonoCliente.findOne({idcliente: idcliente, telefono: telefono}, (err, tel) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al buscar el teléfono del cliente.' });
        } else {
            if (!tel) {
                res.status(200).send({ mensaje: 'No se encontrao el teléfono del cliente.' });
            } else {
                res.status(200).send({ mensaje: 'Teléfono del cliente.', entidad: tel });
            }
        }
    })
}

function getTelCliente(req, res){
    var identidad = req.params.id;

    TelefonoCliente.findById(identidad, (err, entidad) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al buscar el teléfono del cliente. ERROR: ' + err });
        } else {
            if (!entidad) {
                res.status(200).send({ mensaje: 'No se encontró el teléfono del cliente.' });
            } else {
                res.status(200).send({ mensaje: 'Teléfono del cliente.', entidad: entidad });
            }
        }
    });    
}

function modificarTelCliente(req, res) {
    var identidad = req.params.id;
    var body = req.body;

    TelefonoCliente.findByIdAndUpdate(identidad, body, { new: true }, (err, entidadUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al actualizar el teléfono del cliente. ERROR: ' + err });
        } else {
            if (!entidadUpd) {
                res.status(200).send({ mensaje: 'No se pudo actualizar el teléfono del cliente.' });
            } else {
                res.status(200).send({ mensaje: 'Teléfono del cliente actualizado.', entidad: entidadUpd });
            }
        }
    });
}

function eliminarTelCliente(req, res) {
    var identidad = req.params.id;
    var body = req.body;

    TelefonoCliente.findByIdAndUpdate(identidad, body, { new: true }, (err, entidadDel) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al eliminar el teléfono del cliente. ERROR: ' + err });
        } else {
            if (!entidadDel) {
                res.status(200).send({ mensaje: 'No se pudo eliminar el teléfono del cliente.' });
            } else {
                res.status(200).send({ mensaje: 'Teléfono del cliente eliminado.', entidad: entidadDel });
            }
        }
    });
}

//Direcciones del cliente
function crearDireccionCliente(req, res){
    var direccion = new DireccionCliente();
    var params = req.body;

    direccion.idcliente = params.idcliente;
    direccion.idtipodireccion = params.idtipodireccion;
    direccion.idrestaurante = params.idrestaurante;
    direccion.direccion = params.direccion;
    direccion.zona = params.zona;
    direccion.colonia = params.colonia;
    direccion.codigoacceso = params.codigoacceso;
    direccion.debaja = params.debaja;

    direccion.save((err, direccionSvd) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al crear la dirección del cliente.' });
        }else{
            if(!direccionSvd){
                res.status(200).send({ mensaje: 'No se pudo grabar la dirección del cliente.' });
            }else{
                res.status(200).send({ mensaje:'Dirección del cliente grabada exitosamente.', entidad: direccionSvd});
            }
        }
    });
}

function getDireccionesCliente(req, res){
    var idcliente = req.params.idcliente;

    DireccionCliente.find({idcliente: idcliente, debaja:false})
    .populate('idtipodireccion', ['_id', 'descripcion'], { debaja: false })
    .populate('idrestaurante', ['_id', 'nombre'], { debaja: false }).sort('idrestaurante.nombre').exec((err, lista) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al buscar las direcciones del cliente.' });
        }else{
            if(!lista){
                res.status(200).send({ mensaje: 'No se encontraron direcciones del cliente.' });
            }else{
                res.status(200).send({ mensaje:'Lista de direcciones.', lista: lista});
            }
        }        
    });
}

function getDireccionCliente(req, res){
    var identidad = req.params.id;

    DireccionCliente.findById(identidad, (err, entidad) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al buscar la dirección del cliente. ERROR: ' + err });
        }else{
            if(!entidad){
                res.status(200).send({ mensaje: 'No se encontró la dirección del cliente.' });
            }else{
                res.status(200).send({ mensaje: 'Dirección del cliente.', entidad: entidad });
            }
        }
    });
}

function modificarDirCliente(req, res){
    var identidad = req.params.id;
    var body = req.body;

    DireccionCliente.findByIdAndUpdate(identidad, body, { new: true }, (err, entidadUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al actualizar la dirección del cliente. ERROR: ' + err });
        } else {
            if (!entidadUpd) {
                res.status(200).send({ mensaje: 'No se pudo actualizar la dirección del cliente.' });
            } else {
                res.status(200).send({ mensaje: 'Dirección del cliente actualizada.', entidad: entidadUpd });
            }
        }
    });
}

function eliminarDirCliente(req, res) {
    var identidad = req.params.id;
    var body = req.body;

    DireccionCliente.findByIdAndUpdate(identidad, body, { new: true }, (err, entidadDel) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al eliminar la dirección del cliente. ERROR: ' + err });
        } else {
            if (!entidadDel) {
                res.status(200).send({ mensaje: 'No se pudo eliminar la dirección del cliente.' });
            } else {
                res.status(200).send({ mensaje: 'Dirección del cliente eliminada.', entidad: entidadDel });
            }
        }
    });
}

//Datos de facturacion del cliente
function crearDatoFacturaCliente(req, res){
    var datosfact = new DatosFacturaCliente();
    var params = req.body;

    datosfact.idcliente = params.idcliente;
    datosfact.nit = params.nit;
    datosfact.nombre = params.nombre;
    datosfact.direccion = params.direccion;
    datosfact.debaja = params.debaja;

    datosfact.save((err, datosfactSaved) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al crear el dato de facturación del cliente.' });
        } else {
            if (!datosfactSaved) {
                res.status(200).send({ mensaje: 'No se pudo grabar el dato de facturación del cliente.' });
            } else {
                res.status(200).send({ mensaje: 'Dato de facturación del cliente grabado exitosamente.', entidad: datosfactSaved });
            }
        }        
    });
}

function getDatosFacturaCliente(req, res){
    var idcliente = req.params.idcliente;

    DatosFacturaCliente.find({idcliente: idcliente, debaja: false}).exec((err, lista) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al buscar los datos de facturación del cliente.' });
        } else {
            if (!lista) {
                res.status(200).send({ mensaje: 'No se encontraron datos de facturación del cliente.' });
            } else {
                res.status(200).send({ mensaje: 'Datos de facturación del cliente.', lista: lista });
            }
        }        
    });
}

function getDatoFacturaCliente(req, res) {
    var identidad = req.params.id;

    DatosFacturaCliente.findById(identidad, (err, entidad) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al buscar el dato de facturación del cliente. ERROR: ' + err });
        } else {
            if (!entidad) {
                res.status(200).send({ mensaje: 'No se encontró el dato de facturación del cliente.' });
            } else {
                res.status(200).send({ mensaje: 'Dato de facturación del cliente.', entidad: entidad });
            }
        }
    });
}

function modificarDatoFacturaCliente(req, res) {
    var identidad = req.params.id;
    var body = req.body;

    DatosFacturaCliente.findByIdAndUpdate(identidad, body, { new: true }, (err, entidadUpd) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al actualizar el dato de facturación del cliente. ERROR: ' + err });
        } else {
            if (!entidadUpd) {
                res.status(200).send({ mensaje: 'No se pudo actualizar el dato de facturación del cliente.' });
            } else {
                res.status(200).send({ mensaje: 'Dato de facturación del cliente actualizada.', entidad: entidadUpd });
            }
        }
    });
}

function eliminarDatoFacturaCliente(req, res) {
    var identidad = req.params.id;
    var body = req.body;

    DatosFacturaCliente.findByIdAndUpdate(identidad, body, { new: true }, (err, entidadDel) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al eliminar el dato de facturación del cliente. ERROR: ' + err });
        } else {
            if (!entidadDel) {
                res.status(200).send({ mensaje: 'No se pudo eliminar el dato de facturación del cliente.' });
            } else {
                res.status(200).send({ mensaje: 'Dato de facturación del cliente eliminada.', entidad: entidadDel });
            }
        }
    });
}



module.exports = {
    crearCliente, nuevoClientePaquete, modificarCliente, eliminarCliente, getClienteById, getClienteByTelefono, lstClientes,
    crearTelefonoCliente, getTelefonosCliente, getTelByIdClienteNumtel, getTelCliente, modificarTelCliente, eliminarTelCliente,
    crearDireccionCliente, getDireccionesCliente, getDireccionCliente, modificarDirCliente, eliminarDirCliente,
    crearDatoFacturaCliente, getDatosFacturaCliente, getDatoFacturaCliente, modificarDatoFacturaCliente, eliminarDatoFacturaCliente
}
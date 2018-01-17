'use strict'

//Modelos
var menurest = require('../models/menurest');
var DiccionarioFox = require('../models/diccionariofox');
var Componente = require('../models/componente');

//Acciones

function crear(req, res){
    var mnu = new menurest();
    var params = req.body;

    mnu.descripcion = params.descripcion;
    mnu.nivel = params.nivel;
    mnu.idpadre = params.idpadre;
    mnu.precio = params.precio;
    mnu.tienecomponentes = params.tienecomponentes;
    mnu.precioextra = params.precioextra;
    mnu.tieneextras = params.tieneextras;
    mnu.limitecomponentes = params.limitecomponentes;
    mnu.espromocion = params.espromocion;
    mnu.itemspromo = params.itemspromo;
    mnu.debaja = params.debaja;

    mnu.save((err, mnuSaved) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al grabar el menu.', err });
        }else{
            if(!mnuSaved){
                res.status(200).send({ mensaje: 'No se pudo grabar el nuevo menu.' });
            }else{
                res.status(200).send({ mensaje: 'Menu grabado exitosamente', entidad: mnuSaved });
            }
        }
    });
}

function modificar(req, res){
    var idmenu = req.params.id;
    var body = req.body;

    menurest.findByIdAndUpdate(idmenu, body, { new: true }, (err, mnuUpd) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al actualizar el menu.' });
        }else{
            if(!mnuUpd){
                res.status(200).send({ mensaje: 'No se pudo actualizar el menu.' });
            }else{
                res.status(200).send({ mensaje: 'Menu actualizado exitosamente', entidad: mnuUpd });
            }
        }        
    });    
}

function lstallmenu(req, res){
    var cuales = req.params.cuales, fltr = {};
    switch(+cuales){
        case 0: fltr = { debaja: false }; break;
        case 1: fltr = { debaja: true }; break;
        case 2: fltr = {}; break;
    }
    menurest.find(fltr).sort({nivel: 1, descripcion: 1}).exec((err, lista) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al listar el menu.' });
        }else{
            if(!lista){
                res.status(200).send({ mensaje: 'La lista de menu está vacía.' });
            }else{
                res.status(200).send({ mensaje: 'Lista de menu.', lista: lista });
            }
        }        
    });
}

function getmenu(req, res){
    var idmenu = req.params.id;
    menurest.findById(idmenu, (err, mnu) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al buscar el menu.' });
        }else{
            if(!mnu){
                res.status(200).send({ mensaje: 'El menu que busca no existe.' });
            }else{
                res.status(200).send({ mensaje: 'Menu encontrado.', entidad: mnu });
            }
        }        
    });
}

function constructMenu(lista, level, father, objInicial){
    var obj = objInicial, padre = null;

    for(var i = 0; i < lista.length; i++){
        if(lista[i].nivel == level && lista[i].idpadre){ padre = lista[i].idpadre.toString(); }
        if(lista[i].nivel == level && padre == father){
            obj.push({
                id: lista[i]._id,
                idpadre: lista[i].idpadre,
                nivel: lista[i].nivel,
                name: lista[i].descripcion,
                precio: lista[i].precio,
                tienecomponentes: lista[i].tienecomponentes,
                precioextra: lista[i].precioextra,
                tieneextras: lista[i].tieneextras,
                limitecomponentes: lista[i].limitecomponentes,
                espromocion: lista[i].espromocion ? lista[i].espromocion : false ,
                itemspromo: lista[i].itemspromo ? lista[i].itemspromo : [],
                children: []
            });
        }
    }

    for(var j = 0; j < obj.length; j++){        
        constructMenu(lista, level + 1, obj[j].id, obj[j].children);
    }

    return obj;
}

function lstmenurest(req, res){
    var cuales = req.params.cuales, fltr = {};
    switch(+cuales) {
        case 0: fltr = { debaja: false }; break;
        case 1: fltr = { debaja: true }; break;
        case 2: fltr = {}; break;
    }
    //.populate({ path: 'iditemmenu' })
    //menurest.find(fltr).populate({ path: 'idpadre' }).exec((err, mnu) =>{
    menurest.find(fltr, (err, mnu) =>{
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al buscar el menu.' });
        }else{
            if(!mnu){
                res.status(200).send({ mensaje: 'No existe el menú.' });
            }else{
                var menuArmado = constructMenu(mnu, 0, null, []);
                res.status(200).send({ mensaje: 'Menú.', lista: menuArmado });
                //res.status(200).send({ mensaje: 'Menú.', lista: mnu });
            }
        }                
    });    
}

function getItemsMenuRest(req, res){
    var nivel = req.params.nivel, idpadre = req.params.idpadre;
    var fltr = { debaja: false, nivel: nivel, idpadre: null };
    if(idpadre){ fltr = { debaja: false, nivel: nivel, idpadre: idpadre } }

    menurest.find(fltr, null, { sort: { descripcion: 1 } }, (err, lista) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al listar el menu.' });
        } else {
            if (lista.length == 0) {
                res.status(200).send({ mensaje: 'La lista de menu está vacía.' });
            } else {
                res.status(200).send({ mensaje: 'Lista de menu.', lista: lista });
            }
        }
    });
}

// Funciones para construir el diccionario de fox

function getSinHijos(listado, losagregados, ruta) {

    listado.forEach( (item) => {        
        if ( item.children.length == 0 ) {
            losagregados.push({
                id: item.id,
                descripcion: ruta.join(' - ') + ' - ' + item.name
            });
        } else {
            ruta.push(item.name);
            getSinHijos(item.children, losagregados, ruta);
        }
    });
    ruta.splice(+listado[0].nivel - 1);

    return losagregados;
}

function doDictFox(req, res) {

    menurest.find({ debaja: false }, (err, mnu) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al hacer el diccionario de fox.' });
        } else {
            if (!mnu) {
                res.status(200).send({ mensaje: 'No existe el menú para el diccionario de fox.' });
            } else {
                var menuArmado = constructMenu(mnu, 0, null, []);
                var sinhijos = getSinHijos(menuArmado, [], []);
                //res.status(200).send({ mensaje: 'Productos en su ultimo nivel', lista: sinhijos });
                //res.status(200).send({ mensaje: 'Productos en su ultimo nivel', lista: menuArmado });
                
                sinhijos.forEach((sh) => {
                    DiccionarioFox.create({
                        descripcion: sh.descripcion,
                        idmongodb: sh.id,
                        idcomponente: null,
                        idfox: null,
                        detalle: null,
                        power: null,
                        idparticion: null,
                        idtipoprecio: null                        
                    });
                });

                Componente.find({ debaja: false }, (err, cmps) => {
                    if (cmps) {
                        cmps.forEach((cmp) => {
                            DiccionarioFox.create({
                                descripcion: cmp.descripcion,
                                idmongodb: null,
                                idcomponente: cmp._id,
                                idfox: null,
                                detalle: null,
                                power: null,
                                idparticion: null,
                                idtipoprecio: null
                            });                            
                        });
                    }
                });

                res.status(200).send({ mensaje: 'Diccionario de fox creado...' });
                
            }
        }
    });

}

function updDictFox(req, res) {
    var nuevos = [];

    menurest.find({ debaja: false }, (err, mnu) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor al hacer el diccionario de fox.' });
        } else {
            if (!mnu) {
                res.status(200).send({ mensaje: 'No existe el menú para el diccionario de fox.' });
            } else {
                var menuArmado = constructMenu(mnu, 0, null, []);
                var sinhijos = getSinHijos(menuArmado, [], []);

                DiccionarioFox.find({ idcomponente: null }, (err1, endict) => {
                    if(err1) {
                        res.status(500).send({ mensaje: 'Error en el servidor al hacer el diccionario de fox.' });                        
                    } else {
                        if (!endict) {
                            res.status(200).send({ mensaje: 'No existe el menú para el diccionario de fox.' });
                        } else {
                            var existe = false;
                            // Agregar productos que no existan

                            sinhijos.forEach((sh) => {
                                existe = false;                                
                                endict.forEach((ied) => {                                    
                                    if (ied.idmongodb == sh.id) {
                                        existe = true;
                                    }
                                });

                                if (!existe) {
                                    // console.log('NO EXISTE: ' + sh.descripcion);
                                    nuevos.push(sh.descripcion);

                                    DiccionarioFox.create({
                                        descripcion: sh.descripcion,
                                        idmongodb: sh.id,
                                        idcomponente: null,
                                        idfox: null,
                                        detalle: null,
                                        power: null,
                                        idparticion: null,
                                        idtipoprecio: null
                                    });                                    
                                }
                            });

                            // Agregar componentes que no existan
                            
                            Componente.find({ debaja: false }, (err, cmps) => {
                                if (cmps) {

                                    DiccionarioFox.find({ idmongodb: null }, (err2, endict) => {
                                        if(err2) {
                                            res.status(500).send({ mensaje: 'Error en el servidor al hacer el diccionario de fox.' });
                                        } else {
                                            if (!endict) {
                                                res.status(200).send({ mensaje: 'No existe el menú para el diccionario de fox.' });                                                
                                            } else {                                                
                                                cmps.forEach((cmp) => {
                                                    existe = false;
                                                    endict.forEach((ied) => {
                                                        if (ied.idcomponente == cmp._id) {
                                                            existe = true;
                                                        }
                                                    });

                                                    if(!existe) {
                                                        // console.log('NO EXISTE: ' + cmp.descripcion);
                                                        nuevos.push(cmp.descripcion);                                                        
                                                        DiccionarioFox.create({
                                                            descripcion: cmp.descripcion,
                                                            idmongodb: null,
                                                            idcomponente: cmp._id,
                                                            idfox: null,
                                                            detalle: null,
                                                            power: null,
                                                            idparticion: null,
                                                            idtipoprecio: null
                                                        });                                                        
                                                    }                                                    
                                                });
                                                res.status(200).send({ mensaje: 'Diccionario de fox actualizado...', lista: nuevos });
                                            }
                                        }
                                    });                                    
                                }
                            });                            
                        }
                    }
                });                
            }
        }
    });    
}


//Fin de funciones para construir el diccionario de fox

module.exports = {
    crear, modificar, lstallmenu, getmenu, lstmenurest, getItemsMenuRest, doDictFox, updDictFox
}
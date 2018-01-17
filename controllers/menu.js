'use strict'

//Modelos
var menu = require('../models/menu');
var permiso = require('../models/permiso');


//Acciones

function crear(req, res){
    var mnu = new menu();
    var params = req.body;

    mnu.descripcion = params.descripcion;
    mnu.nivel = params.nivel;
    mnu.idpadre = params.idpadre;
    mnu.url = params.url;

    mnu.save((err, mnuSaved) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al grabar el menu.', err });
        }else{
            if(!mnuSaved){
                res.status(404).send({ mensaje: 'No se pudo grabar el nuevo menu.' });
            }else{
                res.status(200).send({ mensaje: 'Menu grabado exitosamente', entidad: mnuSaved });
            }
        }
    });
}

function modificar(req, res){
    var idmenu = req.params.id;
    var body = req.body;

    menu.findByIdAndUpdate(idmenu, body, { new: true }, (err, mnuUpd) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al actualizar el menu.' });
        }else{
            if(!mnuUpd){
                res.status(404).send({ mensaje: 'No se pudo actualizar el menu.' });
            }else{
                res.status(200).send({ mensaje: 'Menu actualizado exitosamente', entidad: mnuUpd });
            }
        }        
    });    
}

function lstallmenu(req, res){
    menu.find().exec((err, lista) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al listar el menu.' });
        }else{
            if(!lista){
                res.status(404).send({ mensaje: 'La lista de menu está vacía.' });
            }else{
                res.status(200).send({ mensaje: 'Lista de menu.', lista: lista });
            }
        }        
    });
}

function getmenu(req, res){
    var idmenu = req.params.id;
    menu.findById(idmenu, (err, mnu) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al buscar el menu.' });
        }else{
            if(!mnu){
                res.status(404).send({ mensaje: 'El menu que busca no existe.' });
            }else{
                res.status(200).send({ mensaje: 'Menu encontrado.', entidad: mnu });
            }
        }        
    });
}

function constructMenuUsuario(lista, level, father, objInicial){
    var obj = objInicial, padre = null;

    for(var i = 0; i < lista.length; i++){
        if(lista[i].iditemmenu.nivel == level && lista[i].iditemmenu.idpadre){ padre = lista[i].iditemmenu.idpadre.toString(); }
        if(lista[i].iditemmenu.nivel == level && padre == father){
            obj.push({
                id: lista[i].iditemmenu._id,
                idpadre: lista[i].iditemmenu.idpadre,
                nivel: lista[i].iditemmenu.nivel,
                name: lista[i].iditemmenu.descripcion,
                url: lista[i].iditemmenu.url,
                children: []
            });
        }
    }

    for(var j = 0; j < obj.length; j++){        
        constructMenuUsuario(lista, level + 1, obj[j].id, obj[j].children);
    }

    return obj;
}

function lstmnuusr(req, res){
    var idusr = req.params.idusr, maxnivel = 0;
    permiso.find({idusuario: idusr, accesar: 1}).populate({ path: 'iditemmenu' }).exec((err, lstpermisos) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al buscar el menu por usuario.' });
        }else{
            if(!lstpermisos){
                res.status(404).send({ mensaje: 'El menu d usuario que busca no existe.' });
            }else{                
                var menuUsuario = constructMenuUsuario(lstpermisos, 0, null, []);
                res.status(200).send({ mensaje: 'Menu del usuario.', lista: menuUsuario });
                //res.status(200).send({ mensaje: 'Menu del usuario.', listaCompleta: lstpermisos, lista: menuUsuario });
            }
        }        
    });    
}

module.exports = {
    crear, modificar, lstallmenu, getmenu, lstmnuusr
};
'use strict'

//Modelos
var permiso = require('../models/permiso');

//Acciones
function crear(req, res){
    var perm = new permiso();
    var params = req.body;

    perm.idusuario = params.idusuario;
    perm.iditemmenu = params.iditemmenu;
    perm.accesar = params.accesar;
    perm.crear = params.crear;
    perm.modificar = params.modificar;
    perm.eliminar = params.eliminar;

    perm.save((err, permSaved) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor.' });
        }else{
            if(!permSaved){
                res.status(404).send({ mensaje: 'No se pudo grabar el permiso.' });
            }else{
                res.status(200).send({ mensaje: 'Permiso grabado exitosamente.', entidad: permSaved });
            }
        }
    });
}

function modificar(req, res){
    var idpermiso = req.params.id;
    var body = requ.body;

    permiso.findByIdAndUpdate(idpermiso, body,{ new: true }, (err, permUpd) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al actualizar el permiso.' });
        }else{
            if(!permUpd){
                res.status(404).send({ mensaje: 'No se pudo actualizar el permiso.' });
            }else{
                res.status(200).send({ mensaje: 'Permiso actualizado exitosamente', entidad: permUpd });
            }
        }        
    });
}

function lstpermisosusuario(req, res){
    var idusr = req.params.idusr;
    permiso.find({idusuario: idusr}, (err, lista) => {
        if(err){
            res.status(500).send({ mensaje: 'Error en el servidor al listar los permisos del usuario.' });
        }else{
            if(!lista){
                res.status(404).send({ mensaje: 'La lista de permisos está vacía.' });
            }else{
                res.status(200).send({ mensaje: 'Lista de permisos.', lista: lista });
            }
        }        
    });
}

module.exports = {
    crear, modificar, lstpermisosusuario
}


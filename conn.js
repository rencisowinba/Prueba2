var mysql = require('mysql');

var conexion = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'gestionproyectos'
});


function previoActividades(){  
    conexion.connect(function(err) {
        if (err) throw err;
        strQ="SELECT actividades.Id, usuarios.Nombre, estatus.Estatus FROM actividades INNER JOIN usuarios ON actividades.Asignado = usuarios.Id INNER JOIN estatus ON actividades.Estatus = estatus.Id ORDER BY actividades.Id";
        
        conexion.query(strQ, function (err, result, fields) {
            if (err) throw err;
            return(result);
        });
    });
}

function actividades(argId){  
    conexion.connect(function(err) {
        if (err) throw err;
        strQ="SELECT actividades.Id, Actividad, actividades.Usuario, usuarios.Nombre, actividades.Estatus, estatus.Estatus, Descripcion, Documento, actividades.Asignado, Usr.Nombre AS Asignado_A, FEnvio, FFinal, isAcepted FROM actividades INNER JOIN usuarios ON actividades.Usuario = usuarios.Id INNER JOIN estatus ON actividades.Estatus = estatus.Id INNER JOIN (SELECT Id, Nombre FROM usuarios) AS Usr ON actividades.Asignado = Usr.Id WHERE actividades.Id = " + argId;
        
        conexion.query(strQ, function (err, result, fields) {
            if (err) throw err;
            return(result);
        });
    });
}

function qUsuarios( ){  
    conexion.connect(function(err) {
        if (err) throw err;
        strQ="SELECT * FROM usuarios ORDER BY Nombre";
        
        conexion.query(strQ, function (err, result, fields) {
            if (err) throw err;
            return(result);
        });
    });
}

function iUsuario(Usr,Cve){  
    conexion.connect(function(err) {
        if (err) throw err;
        strQ="SELECT * FROM usuarios WHERE Usuario = '" + Usr + "' AND Clave = PASSWORD('"+ Cve + "') ";
        
        conexion.query(strQ, function (err, result, fields) {
            if (err) throw err;
            return(result);
        });
    });
}

function estatus(){  
    conexion.connect(function(err) {
        if (err) throw err;
        strQ="SELECT * FROM estatus";
        
        conexion.query(strQ, function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });
    });
}

function addQ(act,usr,est,desc,doc,asig,fe,ff,iA){  
    conexion.connect(function(err) {
        if (err) throw err;
        strQ="INSERT INTO actividades (Id,Actividad,Usuario,Estatus,Descripcion,Documento,Asignado,FEnvio,FFinal,isAcepted) VALUES (NULL, '"+act+"', '"+usr+"', '"+est+"', '"+desc+"', '"+doc+"', '"+asig+"', '"+fe+"', '"+ff+"', '"+iA+"')";
        
        conexion.query(strQ, function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });
    });
}

function updQ(argId,act,usr,est,desc,doc,asig,fe,ff,iA){  
    conexion.connect(function(err) {
        if (err) throw err;
        strQ="UPDATE actividades SET Actividad='"+act+"',Usuario='"+usr+"' ,Estatus ='"+est+"',Descripcion='"+desc+"',Documento='"+doc+"',Asignado='"+asig+"',FEnvio='"+fe+"',FFinal='"+ff+"',isAcepted='"+iA+"' WHERE Id = '"+argId+"'";
        
        conexion.query(strQ, function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });
    });
}


//UPDATE `actividades` SET `Actividad` = 'Test 1', `Usuario` = '2', `Estatus` = '3', `Descripcion` = 'Test test test ', `Documento` = 'google/test_01.doc', `Asignado` = '1', `FEnvio` = '2022-09-21', `FFinal` = '2022-09-24', `isAcepted` = '1' WHERE `actividades`.`Id` = 13

//addQ('Test','3','1','Test test','test_01.doc','5','2022-09-20','','');//
//updQ('13','Test 1','2','3','Test test test','google/test_01.doc','1','2022-09-21','','1');
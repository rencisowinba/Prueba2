var mysql = require('mysql');

var conexion = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'gestionproyectos'
});

function genQ(tipoQ, argQ){
    let argumentos = argQ.split(',');
    let strQ='';
    switch(tipoQ){
        case 'previo':
            strQ="SELECT actividades.Id, usuarios.Nombre, estatus.Estatus FROM activdades INNER JOIN usuarios ON actividades.Asignado = usuarios.Id INNER JOIN estatus ON actividades.Estatus = estatus.Id ORDER BY actividades.Id";    
            break;
        case 'actividades':
            strQ="SELECT actividades.Id, Actividad, actividades.Usuario, usuarios.Nombre, actividades.Estatus, estatus.Estatus, Descripcion, Documento, actividades.Asignado, Usr.Nombre AS Asignado_A, FEnvio, FFinal, isAcepted FROM actividades INNER JOIN usuarios ON actividades.Usuario = usuarios.Id INNER JOIN estatus ON actividades.Estatus = estatus.Id INNER JOIN (SELECT Id, Nombre FROM usuarios) AS Usr ON actividades.Asignado = Usr.Id WHERE actividades.Id = " + argumentos[0];
            break;
        case 'usuarios':
            strQ="SELECT * FROM usuarios ORDER BY Nombre";    
            break;
        case 'iusuario':
            strQ="SELECT * FROM usuarios WHERE Usuario = '" + argumentos[0] + "' AND Clave = PASSWORD('"+ argumentos[1] + "') ";
            break;
        case 'estatus':
            strQ="SELECT * FROM estatus";
            break;
        case 'agrega':
            strQ="INSERT INTO actividades (Id,Actividad,Usuario,Estatus,Descripcion,Documento,Asignado,FEnvio,FFinal,isAcepted) VALUES (NULL, '"+argumentos[0]+"', '"+argumentos[1]+"', '"+argumentos[2]+"', '"+argumentos[3]+"', '"+argumentos[4]+"', '"+argumentos[5]+"', '"+argumentos[6]+"', '"+argumentos[7]+"', '"+argumentos[8]+"')";
            break;
        case 'actualiza':
            strQ="UPDATE actividades SET Actividad='"+argumentos[1]+"',Usuario='"+argumentos[2]+"' ,Estatus ='"+argumentos[3]+"',Descripcion='"+argumentos[4]+"',Documento='"+argumentos[5]+"',Asignado='"+argumentos[6]+"',FEnvio='"+argumentos[7]+"',FFinal='"+argumentos[8]+"',isAcepted='"+argumentos[9]+"' WHERE Id = '"+argumentos[0]+"'";
            break;    
    }

    conexion.connect(function(err) {
        if (err) throw err;        
        conexion.query(strQ, function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });
    });
}


//UPDATE `actividades` SET `Actividad` = 'Test 1', `Usuario` = '2', `Estatus` = '3', `Descripcion` = 'Test test test ', `Documento` = 'google/test_01.doc', `Asignado` = '1', `FEnvio` = '2022-09-21', `FFinal` = '2022-09-24', `isAcepted` = '1' WHERE `actividades`.`Id` = 13

//addQ('Test','3','1','Test test','test_01.doc','5','2022-09-20','','');//
//updQ('13','Test 1','2','3','Test test test','google/test_01.doc','1','2022-09-21','','1');

//genQ('','13,TEST,2,Test Test test,google/test01.doc,2022-09-01');

genQ('actualiza','13,Test 1,2,3,Test test test Sin Comas,google/test_01.doc,1,2022-09-21,NULL,1');

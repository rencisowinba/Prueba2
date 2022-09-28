const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const { request } = require('http');
const { response } = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

var conexion = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'gestionproyectos'
});

//conexion.connect(function(err){
//    if(err) throw err;
//});


const app = express();
app.use(cors());
app.use(session({
    secret: 'FraseQueSeUsaComoSecreto',
    resave: true,
    saveUninitialized: true
}))
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/login',(req,res)=>{
    //console.log(req.body)
    let usr = req.body.usuario;
    let clave = req.body.password;
    
    
    if(usr && clave){
        strQ="SELECT * FROM usuarios WHERE Usuario = '"+usr+"' AND Clave = PASSWORD('"+ clave + "')";
        conexion.query(strQ, function(err,result,fields){
            //if (err) throw err;
            
            if (result.length > 0){
                req.session.loggdin = true;
                req.session.username = usr;
                
                let id = result[0].Id;
                /*jwt.sign(usr, clave, (err, token)=>{
                    if(err) throw err;
                    //res.status(400).send({msg:'Error'});
                    else {
                        
                    }*/
                
                let token = jwt.sign(usr, clave, {algorithm: "HS256"});
                strTQ = "UPDATE usuarios SET token='"+token+"' where Id="+id+";";
                conexion.query(strTQ, function(er, r, fields){
                            if(er) throw er;
                        });
                res.send({msg:'Success', token: token});
                
                //res.send(req.session);
                //res.redirect('http://127.0.0.1:3000/home');
            } else{
                res.send('Nombre de usuario o Password incorrectos');
            }
            res.end();
        });
    } else{
        res.send('Favor de ingresar usuario y contraseña');
        res.end();
    }
});

app.get('/home', (req,res)=>{
    if (!(req.session.loggdin)){res.sendStatus(401);}
});

app.get('/salir',(req,res)=>{
    req.session.destroy();
})

app.get('/actividades', (req,res)=>{
    if (!(req.session.loggdin)){
            res.sendStatus(401);
    }else{ 
    strQ="SELECT actividades.Id, Actividad, usuarios.Nombre, estatus.Estatus FROM actividades INNER JOIN usuarios ON actividades.Asignado = usuarios.Id INNER JOIN estatus ON actividades.Estatus = estatus.Id ORDER BY actividades.Id";
    conexion.query(strQ, function (err, result, fields) {
        if (err) throw err;
        res.send(result);
    });}
});

app.get('/actividad/:Id',(req,res)=>{
    if (!(req.session.loggdin)){
        res.sendStatus(401);
    }else{ 
    let actId = req.params.Id;
    strQ="SELECT actividades.Id, Actividad, actividades.Usuario, usuarios.Nombre, actividades.Estatus, estatus.Estatus, Descripcion, Documento, actividades.Asignado, Usr.Nombre AS Asignado_A, FEnvio, FFinal, isAcepted FROM actividades INNER JOIN usuarios ON actividades.Usuario = usuarios.Id INNER JOIN estatus ON actividades.Estatus = estatus.Id INNER JOIN (SELECT Id, Nombre FROM usuarios) AS Usr ON actividades.Asignado = Usr.Id WHERE actividades.Id = " + actId;
    conexion.query(strQ, function (err, result, fields) {
        if (err) throw err;
        res.send(result);
    });}
});

app.get('/usuarios',(req,res)=>{
    if (!(req.session.loggdin)){
        res.sendStatus(401);
    }else{
    strQ="SELECT Id,Usuario,Nombre FROM usuarios ORDER BY Nombre";
    conexion.query(strQ, function (err, result, fields) {
        if (err) throw err;
        res.send(result);
    });}
});

app.get('/usuario/:Id',(req,res)=>{
    if (!(req.session.loggdin)){
        res.sendStatus(401);
    }else{
    let usrId = req.params.Id;
    strQ="SELECT * FROM usuarios WHERE Usuario = '" + usrId + "'";
    conexion.query(strQ, function (err, result, fields) {
        if (err) throw err;
        res.send(result);
    });}
});

app.get('/estatus',(req,res)=>{
    if (!(req.session.loggdin)){
        res.sendStatus(401);
    }else{
    strQ="SELECT * FROM estatus";
    conexion.query(strQ, function (err, result, fields) {
        if (err) throw err;
        res.send(result);
    });}
});

app.post('/addAct',(req,res)=>{
    if (!(req.session.loggdin)){
        res.sendStatus(401);
    }else{
    act=req.body.actividad; usr=req.body.usuario; est=req.body.estatus; desc=req.body.descripcion; doc=req.body.documento; asig=req.body.asignado; fe=req.body.fecha_envio; ff=req.body.fecha_final; iA=req.body.isAcepted; 
    strQ="INSERT INTO actividades (Id,Actividad,Usuario,Estatus,Descripcion,Documento,Asignado,FEnvio,FFinal,isAcepted) VALUES (NULL, '"+act+"', '"+usr+"', '"+est+"', '"+desc+"', '"+doc+"', '"+asig+"', '"+fe+"', '"+ff+"', '"+iA+"')";
    conexion.query(strQ, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });}
});

app.post('/updAct',(req, res)=>{
    if (!(req.session.loggdin)){
        res.sendStatus(401);
    }else{
    actId=req.body.Id; act=req.body.actividad; usr=req.body.usuario; est=req.body.estatus; desc=req.body.descripcion; doc=req.body.documento; asig=req.body.asignado; fe=req.body.fecha_envio; ff=req.body.fecha_final; iA=req.body.isAcepted;
    strQ="UPDATE actividades SET Actividad='"+act+"',Usuario='"+usr+"' ,Estatus ='"+est+"',Descripcion='"+desc+"',Documento='"+doc+"',Asignado='"+asig+"',FEnvio='"+fe+"',FFinal='"+ff+"',isAcepted='"+iA+"' WHERE Id = '"+argId+"'";
    conexion.query(strQ, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });}
});

const port = process.env.port || 8081;

app.listen(port,() => console.log(`Servicio activo escuchado en el puerto -${port}-`))
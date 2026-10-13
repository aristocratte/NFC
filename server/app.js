//Aplicacion web para el Sistema de Acceso mediante NFC.
//Contiene un endpoint para el sistema físico de acceso y un panel de visualizacion
//Para manejar las credenciales de la BD en un archivo .env

const http=require('http');
require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

const express = require("express");
const {WebSocketServer}=require('ws');
const path = require('path');

const scannerRouter=require('./scanner.js');
const panelrouter = require('./panel.js');

//debido a que la conexión con la DB es asíncrona debemos encapsular la app con async
async function startApp()
{
    const db = await mysql.createPool(dbConfig);
    //console.log(dbConfig);


    //Configuración del servidor con Express
    const app = express();
    //tenemos que crear antes el server para que el websocket lo pueda usar
    const server = http.createServer(app);
    //Configuración del WebSocket
    const wss = new WebSocketServer({server, path:'/ws'})
    wss.on('connection', (ws,req)=>{
        console.log('client connected: %s', req.socket.remoteAddress);
   
        //no esperamos recibir ningun mensaje pero lo registramos para investigar
        ws.on('message', (data, isBinary)=>{
            console.log('message received: %s', isBinary?'BINDATA':data.toString());
        });

        ws.on('error', console.error);

        ws.on('close', ()=>{
        });
    });
    console.log('websocket listening on port 7777');

    //el router para recibir el resultado del scanner necesita la db y el websocket
    app.use('/api', scannerRouter(db, wss));
    app.use('/panel', (req,res)=>{
        res.sendFile('panel.html', {root:__dirname} );
    });
    app.use('/', (req, res, next) => {
        res.send('silence🤫')
    });

    server.listen(3000, () => {
        console.log("Server running on port 3000")
    });

    server.on('error', (e)=>{
        console.log(e.code);
        console.error('failed to start server: ', e.message);
    });

    //Terminar con gracia

    const terminate = async ()=>{
        console.log('stopping server');
        await server.close();
        await db.end();
        process.exit(0);
    }
    process.on('SIGTERM', terminate);
    process.on('SIGINT', terminate);
}

startApp().catch(e=>{
    console.error('async app failed: ',e);
});


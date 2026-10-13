const express=require('express');

//Endpoint para recibir resultado del escaner NFC
//retorna 'si' o 'no' dependiendo del status del usuario
//además notifica al panel del intento de acceso
module.exports=(db, wss)=>{
    const router=express.Router({
        caseSensitive:false,
        strict:false
    });

    router.get("/scanner", async (req, res,next) => {
            if(req.query.token==='code37' && req.query.id!==undefined)
            {
                const id = req.query.id;
                //res.send(`ok, el id enviado es ${id} `);
                const [rows]=await db.execute(
                    'SELECT `id`,`username`,`first_name`,`last_name`,`email`,`pfp_url`,`status` FROM `user` WHERE id=? LIMIT 1',
                    [id]
                );
                if(rows.length>0)
                {
                    if(rows[0].status==='active')
                        res.send('si');
                    else
                        res.send('no');

                    //enviar a cada cliente panel conectado el intento de acceso
                    if(wss){
                        const message=JSON.stringify(rows[0]);
                        console.log(message);
                        for(const client of wss.clients){
                            if(client.readyState === WebSocket.OPEN){
                                client.send(message);
                            }
                        }
                    }
                }
                //si rows=0, el usuario no existe, negar acceso
                else {
                    res.send('no');
                    //notificar a cada cliente
                    if(wss){
                        const data = {
                            id:id,
                            status:'unknown'
                        }
                        const message=JSON.stringify(data);
                        for(const client of wss.clients){
                            if(client.readyState === WebSocket.OPEN){
                                client.send(message);
                            }
                        }
                    }
                }
            }
            else
            {
                return res.status(400).send('no');
            }
    });
    return router;
}

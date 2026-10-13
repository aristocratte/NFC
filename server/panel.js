const express=require('express');


module.exports=(db)=>{
    const router=express.Router({caseSensitive: true, strict: true });
    router.get('/panel', (req,res)=>{
        res.send('aki vair eaki vair el panel');
    });
    return router;
}

const express = require('express');
const router  = express.Router();
const con = require('./connection');


router.get('/login',(req,res,next)=>{
    var err = req.query.err;
    res.render('login',{title : 'Login', err: err});
    res.end();
});


router.get('/logout',(req,res,next)=>{
    if(req.session.id){
        req.session.destroy();
        res.redirect('/user/login');
        res.end();
    }
});



//==============================POST REQUEST===============================//


//login user
router.post('/login-user',(req,res,next)=>{

    var username = req.body.username;
    var password = req.body.password;
    


    var q = `SELECT * FROM users WHERE user_name = ? AND user_password = ?`;
    var qval = [username,password];

    con.query(q,qval,(err,rs)=>{
        if(err){
            console.log('Error: '+err);
        }
        if(rs.length != 0){
            req.session.id = rs[0].user_id;
            req.session.user = rs[0].user_name;
            res.redirect('/');
            res.end();
        }else{
            res.redirect('/user/login?err=1');
            res.end();
        }
    });

});



module.exports = router;
var express = require('express');
var router = express.Router();
const con = require('./connection');


var newApp, totalApp;
router.use((req,res,next)=>{
  var n = `SELECT * FROM applicants WHERE app_isview	!= 'true'`;
  var t = `SELECT * FROM applicants`;
    
    con.query(n,(err,rs)=>{
      if(err){
        console.log("Err: "+ err);
      }
      newApp = rs.length;
    });

    con.query(t,(err,rs)=>{
      if(err){
        console.log("Err: "+ err);
      }
      totalApp = rs.length;
    });
    next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.user){
    console.log(newApp+" "+totalApp);
    res.render('index', { title: 'Dashboard', nApp : newApp, tApp : totalApp });
    res.end();
  }else{
    res.redirect('/user/login');
    res.end();
  }
});



module.exports = router;

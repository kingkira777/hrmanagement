var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.user){
    res.render('index', { title: 'Dashboard' });
    res.end();
  }else{
    res.redirect('/user/login');
    res.end();
  }
});



module.exports = router;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.id){
    res.render('index', { title: 'Dashboard' });
    res.end();
  }
});



module.exports = router;

const crypto = require('crypto');
const con = require('./connection');

var main = {



    random_id : function(){
        var id = crypto.randomBytes(8).toString('hex');
        return id;
    }

};


module.exports = main;
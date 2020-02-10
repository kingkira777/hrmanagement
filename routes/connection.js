const mysql = require('mysql');


var con; 


function connection(){
    //Production 107.180.44.127
    con = mysql.createPool({
        host : 'localhost',
        user : 'hrmanagement',
        password : '*hr818!',
        database : 'hmanager',
    });


    //Local
    // con = mysql.createPool({
    //     host : 'localhost',
    //     user : 'root',
    //     password : '',
    //     database : 'hmanager',
    // });
    return con;
}

module.exports = connection();
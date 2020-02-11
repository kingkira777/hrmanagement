const mysql = require('mysql');


var con; 


function connection(){
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
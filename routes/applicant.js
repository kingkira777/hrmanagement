const express = require('express');
const router = express.Router();
const con = require('./connection');
const main = require('./main');

//Get the List of Applicant form Database
router.get('/',(req,res,next)=>{
    if(req.session.user){
        var g = `SELECT * FROM applicants`;
        con.query(g,(err,rs)=>{
            if(err){
                console.log(err);
            }
            
            res.render('applicant-list',{ title : 'Applicant List', applicants : rs});
            res.end();
        });
    }else{
        res.redirect('/user/login');
        res.end();
    }
});


//View applicant Form from HR Manager
router.get('/viewform?',(req,res,next)=>{
    if(req.session.user){
        var id = req.query.id
        var q = `SELECT * FROM applicants WHERE app_id = ?`;
        var qval = [id];
        con.query(q,qval,(err,rs)=>{
            if(err){
                console.log("Err: "+ err);
            }

            var v = `UPDATE applicants SET app_isview = ? WHERE app_id = ?`;
            var vVal = ['true', id];
            con.query(v,vVal,(err1,rs1)=>{
                if(err1){
                    console.log("Err: "+ err1);
                }
                res.render('view-form',{ title : 'View Applicant Form', app : rs});
                res.end();
            });
        });
    }else{    
        res.redirect('/user/login');
        res.end();
    }
});

//Fill Out Form
router.get('/fillup-form?',(req,res,next)=>{
    if(!req.query.formid){
        res.redirect('/applicants/fillup-form?formid='+ main.random_id());
    }else{
        res.render('fillup-form', { title : 'Fillup Form', formid : req.query.formid});
        res.end();
    }
});




//===================POST REQUEST===========================//



//Upload File
router.post('/upload-file?',(req,res,next)=>{
    var no = req.query.formid;
    if(!req.files || Object.keys(req.files).length === 0){
        return res.status(400).send("No files were uploaded");
    }

    let file = req.files.resume;
    var path = 'public/files/' + file.name;

    


    file.mv(path, (err)=>{
        if(err){
            console.log("error: "+ err);
        }

        //Save data to Database
        var q = `INSERT INTO files(file_no, file_name,file_path) VALUES ?`;
        var qVal = [
            [no, file.name, path]
        ];
        con.query(q,[qVal], (err,rs)=>{
            if(err){
                console.log("error: "+ err);
            }
            res.send("File Uploaded");
            res.end();
        });
    });

});



//Save Applicant Form Data
router.post('/save-fillupform?',(req,res,next)=>{

    var formid = req.query.formid;
    var name = req.body.name;
    var email = req.body.email;
    var telephone = req.body.telephone;
    var form = JSON.stringify(req.body);


    var chk = `SELECT * FROM applicants WHERE app_email = ?`;
    var chkVal = [email];


    var q = `INSERT INTO applicants(app_no, app_name, app_email, app_telephone, app_form)
    VALUES ?`;
    var qval = [
        [formid, name, email, telephone, form]
    ];

    con.query(chk,chkVal,(err,chkres)=>{
        if(err){
            console.log("err: "+err);
        }
        if(chkres.length !=0){
            res.send("exist");
            res.end();
        }
        if(chkres.length == 0){
            con.query(q,[qval],(err,rs)=>{
                if(err){
                    console.log("err: "+ err)
                }
                res.send('Saved');
                res.end();
            });
        }
    });


    

});





module.exports = router;

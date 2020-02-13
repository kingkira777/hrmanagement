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


router.get('/delete?',(req,res,next)=>{
    var id =req.query.id;
    var z= 'DELETE FROM applicants WHERE app_id = ?';
    var zval = [id];
    con.query(z,zval,(err,rs)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect('/applicants');
            res.end();
        }
    });
});



router.get('/thankyou',(req,res,next)=>{
    res.render('thankyou');
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
                var form_data=JSON.parse(rs[0].app_form);
                var gf = `SELECT * FROM files WHERE file_no = ?`;
                var gfval = [rs[0].app_no];
                con.query(gf,gfval,(err2, rs2)=>{
                    if (err){
                        throw err;
                    }
                    res.render('view-form',{ title : 'View Applicant Form', app : form_data , filez : rs2});
                    res.end();
                });

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
            res.redirect("/applicants/fillup-form?formid="+ no);
            res.end();
        });
    });

});



//Save Applicant Form Data
router.post('/save-fillupform?',(req,res,next)=>{

    var formid = req.query.formid;
    var name = req.body.appname+' '+req.body.appmname+''+req.body.applname;
    var email = req.body.appemail1;
    var telephone = req.body.apptell;
    var address = req.body.appaddress1;
    var cellphone = req.body.appphonenumber;
    var form = JSON.stringify(req.body);



    var chk = `SELECT * FROM applicants WHERE app_email = ?`;
    var chkVal = [email];



    var q = `INSERT INTO applicants(app_no, app_name, app_email, app_telephone,app_cellno,app_address,app_form)
    VALUES ?`;
    var qval = [
        [formid, name, email, telephone,cellphone,address,form]
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
                res.redirect('/applicants/thankyou');
                res.end();
            });
        }
    });


    

});





module.exports = router;

var express = require('express');
var app = express();
var router = express.Router();
var Connection= require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var DButilsAzure = require('../dbUtils');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
router.post('/', function(req, res, next) {
    res.send('respond with a resource');

});


let insertClient=function(registerDetails){
    return new Promise(function(resolve,reject){
        DButilsAzure.InsertClient(registerDetails, function (result) {
            resolve(result);
        })
    });
}



router.post('/register', function (req,res) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = mm + '/' + dd + '/' + yyyy;

    var registerDetails = new Object();
    console.log(req.body)
    registerDetails.UserName = req.body.UserName;
    registerDetails.password = req.body.password;
    registerDetails.firstName = req.body.firstName;
    registerDetails.lastName = req.body.lastName;
    registerDetails.adress = req.body.adress;
    registerDetails.city = req.body.city;
    registerDetails.country = req.body.country;
    registerDetails.phone = req.body.phone;
    registerDetails.Mail = req.body.Mail;
    registerDetails.creditCardNumber = req.body.creditCardNumber;
    registerDetails.LastLogin = today;
    registerDetails.isADmin =parseInt(req.body.isADmin) ;
    console.log('isadddddddddddddd');
    console.log(req.body.isADmin);
    var categoryDetails = "";


    insertClient(registerDetails)
        .then(function(clientIn){
            return new Promise(function(resolve,reject){
                var QandA = new Object()
                QandA.UserName = req.body.UserName;
                QandA.question1 = req.body.question1;
                QandA.question2 = req.body.question2;
                QandA.answer1 = req.body.answer1;
                QandA.answer2 = req.body.answer2;
                DButilsAzure.InsertQandA(QandA, function (result) {
                    resolve(result);
                });
            });

        })
        .then(function(category){
            categoryDetails =categoryDetails+"('"+req.body.UserName+"',"+req.body.categoryA+","+req.body.categoryB+","+req.body.categoryC+")";
            DButilsAzure.InsertClientCategory(categoryDetails, function (result) {
                res.send(result);
            });
        })
});
router.post('/login', function (req,res){
    var datetime = new Date();
    var dd = datetime.getDate();
    var mm = datetime.getMonth() + 1; //January is 0!
    var yyyy = datetime.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    datetime = mm + '/' + dd + '/' + yyyy;

    return new Promise(function(resolve,reject){
        var quer="Select * from  dbo.Clients WHERE UserName=\'"+req.body.username+"\' AND password=\'"+req.body.password +"\'";

        DButilsAzure.select( quer, function (result) {
            //res.send(result);
            resolve(result);
        });
    })
        .then(function(userName){

            if(userName.length>0){
                console.log('userNameuserNameuserNameuserNameuserNameuserName')
                console.log(userName[0].UserName)
                var queri="update Clients set LastLogin='"+datetime+"' where Clients.UserName='"+userName[0].UserName+"\'";
                DButilsAzure.delet(queri, function (result) {
                    if(result){
                        res.send(userName);

                    }
                    else
                        res.send(result);
                });
            }
            else
                res.send('false');
        })
});

router.get('/getAllClients', function (req,res){
    var quer="Select * from  dbo.Clients";
    DButilsAzure.select( quer, function (result) {
        res.send(result);
    });
});

router.post('/getUser', function (req,res){
    console.log(req);
    var quer="Select * from  dbo.Clients where UserName='"+req.body.UserName+"\'"
    DButilsAzure.select( quer, function (result) {
        res.send(result);
    });
});
router.post('/getPassword', function (req,res){

    var quer="Select password from  dbo.Clients where UserName='"+req.body.UserName+"\'"
    DButilsAzure.select( quer, function (result) {
        res.send(result);
    });
});
router.post('/getQuestions', function (req,res){
    ;
    var quer="Select question1, question2, answer1, answer2 From QAndA where UserName='"+req.body.UserName+"\'";
    DButilsAzure.select(quer , function (result) {
        res.send(result);
    });
});

router.put('/deleteClient', function (req,res){
    var quer="Delete from  dbo.Clients WHERE UserName=\'"+req.body.UserName+"\'";
    DButilsAzure.delet(quer, function (result) {
        res.send(result);
    });
});


router.post('/isAdmin', function (req,res){
    var quer="Select * from  dbo.Clients WHERE UserName=\'"+req.body.UserName+"\'";
    //  var quer="Select * from  dbo.Clients where isADmin= 1 and UserName='"+req.body.UserName+"\'"
    DButilsAzure.select( quer, function (result) {
        if(result[0].isADmin==1)
            res.send('true');
        else
            res.send('false');
    });
});

/*   router.post('/lastLogin', function (req,res){
 ;
 var quer="Select question1, question2, answer1, answer2 From QAndA where UserName='"+req.body.UserName+"\'";
 DButilsAzure.select(quer , function (result) {
 res.send(result);
 });
 });*/
module.exports = router;



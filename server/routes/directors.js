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
router.post('/addDirector', function (req,res) {
    var DirectorDetails=new Object();
    DirectorDetails.firstName=req.body.firstName;
    DirectorDetails.lastName=req.body.lastName;
    DButilsAzure.InsertDirector(DirectorDetails, function (result) {
        res.send(result);
    });
});
router.get('/getAllDirectors', function (req,res){
    var quer="Select * from  dbo.Directors";
    DButilsAzure.select(quer, function (result) {
        res.send(result);
    });
});
module.exports = router;



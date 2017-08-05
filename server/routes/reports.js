var express = require('express');
var app = express();
var router = express.Router();
var Connection= require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var DButilsAzure = require('../dbUtils');
router.get('/getSuppliers', function(req, res) {
    var quer="SELECT  * FROM Suppliers";
    DButilsAzure.select(quer,function (result) {
        console.log(result)
        res.send(result);
    })
});

router.get('/getReportNum', function(req, res) {
    var quer="SELECT  Max(reportId) As reportId FROM Reports";
    DButilsAzure.select(quer,function (result) {

        res.send(result);
    })
});
//

//  InsertMoviesInReport InsertReport
let insertReport=function(ReportDetails){
    return new Promise(function(resolve,reject){
        DButilsAzure.InsertReport(ReportDetails, function (result) {
            resolve(result);
        })
    });
}
router.post('/addReport', function (req,res) {
    console.log('checcccccccccccccccccccck')
    console.log(req.body.reportQuery)
    insertReport(req.body.reportQuery)
    //get movie id by name
        .then(function(movieId){
            DButilsAzure.InsertMoviesInReport(req.body.reportMoviesQuery, function (result) {
                res.send(result);
            });
        })
});

module.exports = router;



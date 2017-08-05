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
router.post('/addCategory', function (req,res) {
    var CategoryDetails=new Object();
    /* CategoryDetails.categoryId=req.body.categoryId;*/
    CategoryDetails.categoryName=req.body.categoryName;
    DButilsAzure.InsertCategory(CategoryDetails, function (result) {
        res.send(result);
    });
});
router.get('/getAllCategories', function (req,res){
    var quer="Select * from  dbo.Categories";
    DButilsAzure.select(quer, function (result) {
        res.send(result);
    });
});
module.exports = router;



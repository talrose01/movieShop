var express = require('express');
var app = express();
var router = express.Router();
var Connection= require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var DButilsAzure = require('../dbUtils');


/* GET users listing. */
router.get('/', function(req, res,
                         next) {
    res.send('respond with a resource');
});
router.post('/', function(req, res, next) {
    res.send('respond with a resource');
});

let InsertToOrder=function(OrderDetails){
    return new Promise(function(resolve,reject){
        DButilsAzure.InsertOrder(OrderDetails, function (result) {
            resolve(result);
        })
    });
}

router.post('/addOrder', function (req,res) {
    var text="";
    var str1="UPDATE dbo.Movies SET stockAmount=case movieId";
    var str2="(";
    var orderToInsert= new Object();
    orderToInsert.UserName= req.body.UserName;
    orderToInsert.orderDate= req.body.orderDate;
    orderToInsert.shipmentDate= req.body.shipmentDate;
    orderToInsert.Dollar= req.body.Dollar;
    orderToInsert.totalPrice= req.body.totalPrice;
    var splitMovie=req.body.movieList.split("*");

    InsertToOrder(orderToInsert)
        .then(function(varibleOrder){
            return new Promise(function(resolve,reject){
                var quer="Select top 1 orderId from  dbo.Orders order by orderId desc";
                DButilsAzure.select( quer,function (result) {
                    console.log("bey");
                    resolve(result[0].orderId);

                })
            });
        })
        .then(function(orderId){
            return new Promise(function(resolve,reject){

                for (i = 0; i < splitMovie.length-1; i=i+2) {
                    if(i==0){
                        text +="("+orderId+","+splitMovie[i]+","+splitMovie[i+1]+")";
                        str1+=" when "+splitMovie[i]+" then stockAmount- "+splitMovie[i+1];
                        str2+=splitMovie[i]+",";
                    }
                    else if(i==(splitMovie.length-2)){
                        text +=",("+orderId+","+splitMovie[i]+","+splitMovie[i+1]+")";
                        str1+=" when "+splitMovie[i]+" then stockAmount- "+splitMovie[i+1];
                        str2+=splitMovie[i]+")";
                    }
                    else{
                        text +=",("+orderId+","+splitMovie[i]+","+splitMovie[i+1]+")";
                        str1+=" when "+splitMovie[i]+" then stockAmount- "+splitMovie[i+1];
                        str2+=splitMovie[i]+",";
                    }

                }
                str1=str1+" end where movieId in "+str2;
                DButilsAzure.insertListOfMovies( text,function (result) {
                    resolve('true');
                })
            });

        })
        .then(function(ifUpdate){
            return new Promise(function(resolve,reject){
                DButilsAzure.updateStockAmount(str1, function (result) {
                    console.log("bey");
                    resolve(result);

                })
            });
        })
        .then(function(last){
            var quer="SELECT TOP 1 * FROM dbo.Orders  ORDER BY orderId DESC";

            DButilsAzure.select( quer,function (result) {
                res.send(result);

            })
        })
});

router.post('/getPreviousOrders', function (req,res){
    console.log("sdsddddddddddddddddddddddddd")
    console.log(req.body.userName)
    var quer="SELECT * FROM dbo.Orders Where UserName='"+ req.body.userName+"\'";
    DButilsAzure.select(quer, function (result) {
        res.send(result);
    });
});

router.post('/getOrder', function (req,res){
    var quer="Select * from  dbo.Orders WHERE orderId=\'"+req.body.orderId+"\'";
    DButilsAzure.select( quer, function (result) {
        res.send(result);
    });
});
router.post('/getOrderDetails', function (req,res){
    /*
     var quer="Select MovielastName, description, price, stockAmount, publishedYear,language, picturePath,addedDate From Movies,Categories,MoviesCategories,Directors where Movies.movieId=MoviesCategories.movieId and MoviesCategories.categoryId=Categories.categoryId and Movies.directorId=Directors.directorId";
     */

    var quer="Select Movies.movieName,price,MoviesInOrders.amount From Movies,MoviesInOrders where  Movies.movieId=MoviesInOrders.movieId and orderId=\'"+req.body.orderId+"\'";

    /* var quer="Select * from  dbo.MoviesInOrders WHERE orderId=\'"+req.body.orderId+"\'";*/
    DButilsAzure.select( quer, function (result) {
        res.send(result);
    });
});
router.post('/getOrdersOfUser', function (req,res){
    var quer="Select * from  dbo.Orders WHERE UserName=\'"+req.body.UserName+"\'";
    DButilsAzure.select( quer, function (result) {
        res.send(result);
    });
});

module.exports = router;



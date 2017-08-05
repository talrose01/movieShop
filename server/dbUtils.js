        /**
         * Created by TAL on 05/06/2017.
         */
        var express = require('express');
        var moment = require('moment');
        var app = express();
        var router = express.Router();
        var Connection= require('tedious').Connection;
        var Request = require('tedious').Request;
        var TYPES = require('tedious').TYPES;
        var config={
            userName:'tal',
            password:'HilaHila1',
            server:'talhila.database.windows.net',
            requestTimeout:30000,
            options:{encrypt: true, database:'talHila' }
        }
        var connection = new Connection(config);
        connection.on('connect', function (err) {
            if(err){

                console.error('error connecting: '+ err.stack);
                return;
            }
            console.log('connected azure')
        });


        exports.InsertClient= function(object, callback){
            var quer="INSERT INTO dbo.MoviesInOrders (orderId,movieId,amount) VALUES "+ object;

            var req= new Request("INSERT INTO dbo.Clients  VALUES (@UserName,@password,@firstName,@lastName,@adress,@city,@country,@phone,@Mail,@creditCardNumber,@LastLogin,@isADmin)",function(err,rowCount){
                if(err){
                    console.log(err);
                    callback('false')
                }
                else{
                    callback('true')
                }
            });
            req.addParameter('UserName',TYPES.VarChar,object.UserName);
            req.addParameter('password',TYPES.VarChar,object.password);
             req.addParameter('firstName',TYPES.VarChar,object.firstName);


            req.addParameter('lastName',TYPES.VarChar,object.lastName);
            req.addParameter('adress',TYPES.VarChar,object.adress);
            req.addParameter('city',TYPES.VarChar,object.city);
            req.addParameter('country',TYPES.VarChar,object.country);
            req.addParameter('phone',TYPES.VarChar,object.phone);
            req.addParameter('Mail',TYPES.VarChar,object.Mail);
            req.addParameter('creditCardNumber',TYPES.VarChar,object.creditCardNumber);
            req.addParameter('LastLogin',TYPES.VarChar,object.LastLogin);
            req.addParameter('isADmin',TYPES.Int,object.isADmin);



            req.on('requestCompleted', function () {
                console.log('requestCompleted with' + req.rowCount +' rows ');
            });
            connection.execSql(req);
        };


        exports.InsertMovie= function(object, callback){
            var req= new Request("INSERT INTO dbo.Movies  VALUES (@movieName,@directorId,@description,@price,@stockAmount, @publishedYear,@language,@picturePath,@addedDate)",function(err,rowCount){
                if(err){
                    console.log(err);
                    callback('false')
                }
                else{
                    callback('true')
                }
            });
           /* req.addParameter('movieId',TYPES.Int,object.movieId);*/
             req.addParameter('movieName',TYPES.VarChar,object.movieName);
            req.addParameter('directorId',TYPES.Int,object.directorId);
            req.addParameter('description',TYPES.VarChar,object.description);
            req.addParameter('price',TYPES.Float,object.price);
            req.addParameter('stockAmount',TYPES.Int,object.stockAmount);
            req.addParameter('publishedYear',TYPES.VarChar,object.publishedYear);
            req.addParameter('language',TYPES.VarChar,object.language);
            req.addParameter('picturePath',TYPES.VarChar,object.picturePath);
            req.addParameter('addedDate',TYPES.DateTime2,object.addedDate);

            req.on('requestCompleted', function () {
                console.log('requestCompleted with' + req.rowCount +' rows ');
            });
            connection.execSql(req);
        };


        exports.InsertOrder= function(object, callback){
            var req= new Request("INSERT INTO dbo.Orders  VALUES (@UserName,@orderDate,@shipmentDate,@Dollar,@totalPrice)",function(err,rowCount){
                if(err){
                    console.log(err);
                    callback('false')
                }
                else{
                    callback('true')
                }
            });
            /* req.addParameter('orderId',TYPES.Int,object.orderId);*/
            req.addParameter('UserName',TYPES.VarChar,object.UserName);
            var orderDate= moment().format('YYYY-MM-DD');
            req.addParameter('orderDate',TYPES.DateTime2,object.orderDate);
            var shipmentDate= moment().format('YYYY-MM-DD');
            req.addParameter('shipmentDate',TYPES.DateTime2,object.shipmentDate);
            req.addParameter('Dollar',TYPES.Float,object.Dollar);
            req.addParameter('totalPrice',TYPES.Float,object.totalPrice);
            req.on('requestCompleted', function () {
                console.log('requestCompleted with' + req.rowCount +' rows ');
            });
            connection.execSql(req);
        };


        exports.InsertCategory= function(object, callback){
            var req= new Request("INSERT INTO dbo.Categories  VALUES (@categoryName)",function(err,rowCount){
                if(err){
                    console.log(err);
                    callback('false')
                }
                else{
                    callback('true')
                }
            });
           /* req.addParameter('categoryId',TYPES.Int,object.categoryId);*/
            req.addParameter('categoryName',TYPES.VarChar,object.categoryName);
            req.on('requestCompleted', function () {
                console.log('requestCompleted with' + req.rowCount +' rows ');
            });
            connection.execSql(req);
        };

        exports.InsertQandA= function(object, callback){
            var req= new Request("INSERT INTO dbo.QAndA  VALUES (@UserName,@question1,@question2,@answer1,@answer2)",function(err,rowCount){
                if(err){
                    console.log(err);
                    callback('false')
                }
                else{
                    callback('true')
                }
            });
            /* req.addParameter('categoryId',TYPES.Int,object.categoryId);*/
            req.addParameter('UserName',TYPES.VarChar,object.UserName);
            req.addParameter('question1',TYPES.VarChar,object.question1);
            req.addParameter('question2',TYPES.VarChar,object.question2);
            req.addParameter('answer1',TYPES.VarChar,object.answer1);
            req.addParameter('answer2',TYPES.VarChar,object.answer2);


            req.on('requestCompleted', function () {
                console.log('requestCompleted with' + req.rowCount +' rows ');
            });
            connection.execSql(req);
        };


        exports.InsertDirector= function(object, callback){
            var req= new Request("INSERT INTO dbo.Directors  VALUES (@firstName,@lastName)",function(err,rowCount){
                if(err){
                    console.log(err);
                    callback('false')
                }
                else{
                    callback('true')
                }
            });
/*            req.addParameter('directorId',TYPES.NvarChar,object.directorId);*/
            req.addParameter('firstName',TYPES.VarChar,object.firstName);
            req.addParameter('lastName',TYPES.VarChar,object.lastName);

            req.on('requestCompleted', function () {
                console.log('requestCompleted with' + req.rowCount +' rows ');
            });
            connection.execSql(req);
        };


        exports.InsertMovieCategory= function(categoryId,object, callback){
            var quer="INSERT INTO dbo.MoviesCategories  VALUES (@movieId,@categoryId)";
            var req= new Request(quer,function(err,rowCount){
                if(err){
                    console.log(err);
                    callback('false')
                }
                else{
                    callback('true')
                }
            });
             req.addParameter('movieId',TYPES.Int,object);
            req.addParameter('categoryId',TYPES.Int,categoryId);

            req.on('requestCompleted', function () {
                console.log('requestCompleted with' + req.rowCount +' rows ');
            });
            connection.execSql(req);
        };


        exports.insertListOfMovies= function(object, callback){
            var quer="INSERT INTO dbo.MoviesInOrders (orderId,movieId,amount) VALUES "+ object;
            var req= new Request(quer,function(err,rowCount){
                if(err){
                    console.log(err);
                    callback('false')
                }
                else{
                    callback('true')
                }
            });
            req.on('requestCompleted', function () {
                console.log('requestCompleted with' + req.rowCount +' rows ');
            });
            connection.execSql(req);
        };


        //updateStockAmount
        exports.updateStockAmount= function(object, callback){
                      var req= new Request(object ,function(err,rowCount){
                          if(err){
                              console.log(err);
                              callback('false')
                          }
                          else{
                              callback('true')
                          }
            });
            var res= [];
            var properties=[];

            req.on('columnMetadata', function (columns) {
                columns.forEach(function(column){
                    if(column.colName!= null)
                        properties.push(column.colName)
                });
            });

            req.on('row', function (row) {
                var item={};
                for(i=0;i<row.length;i++){
                    item[properties[i]]=row[i].value;
                }
                res.push(item);
            });

            req.on('requestCompleted', function () {
                console.log('requestCompleted with' + req.rowCount +' rows ');
                console.log(res);

            });
            connection.execSql(req);
        };



        exports.searchMovieByCategory= function(object, callback){

            var quer="Select * From Movies Where "+object.categoryName+"='"+object.categoryValue+"\'";
            var req= new Request(quer ,function(err,rowCount){
            });
            var res= [];
            var properties=[];

            req.on('columnMetadata', function (columns) {
                columns.forEach(function(column){
                    if(column.colName!= null)
                        properties.push(column.colName)
                });
            });

            req.on('row', function (row) {
                var item={};
                for(i=0;i<row.length;i++){
                    item[properties[i]]=row[i].value;
                }
                res.push(item);
            });

            req.on('requestCompleted', function () {
                console.log('requestCompleted with' + req.rowCount +' rows ');
                console.log(res);
                callback(res);

            });
            connection.execSql(req);
        };

        exports.InsertClientCategory= function(object,callback){
            // (UserName,category1,category2,category3)
            var quer="INSERT INTO dbo.ClientsCategories VALUES "+ object;
            var req= new Request(quer,function(err,rowCount){
                if(err){
                    console.log(err);
                    callback('false')
                }
                else{
                    callback('true')
                }
            });
            req.on('requestCompleted', function () {
                console.log('requestCompleted with' + req.rowCount +' rows ');
            });
            connection.execSql(req);
        };

        exports.InsertReport= function(object,callback){
            // (UserName,category1,category2,category3)

            var quer="INSERT INTO dbo.Reports VALUES "+ object;

            console.log("INSERT INTO dbo.Reports VALUES ")
            console.log(quer)
            var req= new Request(quer,function(err,rowCount){
                if(err){
                    console.log(err);
                    callback('false')
                }
                else{
                    callback('true')
                }
            });
            req.on('requestCompleted', function () {
                console.log('requestCompleted with' + req.rowCount +' rows ');
            });
            connection.execSql(req);
        };
        exports.InsertMoviesInReport= function(object,callback){
            // (UserName,category1,category2,category3)
            var quer="INSERT INTO dbo.moviesInReport VALUES "+ object;
            var req= new Request(quer,function(err,rowCount){
                if(err){
                    console.log(err);
                    callback('false')
                }
                else{
                    callback('true')
                }
            });
            req.on('requestCompleted', function () {
                console.log('requestCompleted with' + req.rowCount +' rows ');
            });
            connection.execSql(req);
        };







        //getAllClients

        //**********************************new****************************
      function select(quer,callback){
                       var req= new Request(quer ,function(err,rowCount){
            });
            var res= [];
            var properties=[];

            req.on('columnMetadata', function (columns) {
                columns.forEach(function(column){
                    if(column.colName!= null)
                        properties.push(column.colName)
                });
            });

            req.on('row', function (row) {
                var item={};
                for(i=0;i<row.length;i++){
                    item[properties[i]]=row[i].value;
                }
                res.push(item);
            });

            req.on('requestCompleted', function () {
                console.log('requestCompleted with' + req.rowCount +' rows ');
                console.log(res);
                callback(res);

            });
            connection.execSql(req);
        };
        function delet(object,callback){
            // (UserName,category1,category2,category3)
            var req= new Request(object,function(err,rowCount){
                if(err){
                    console.log(err);
                    callback('false')
                }
                else{
                    callback('true')
                }
            });
            req.on('requestCompleted', function () {
                console.log('requestCompleted with' + req.rowCount +' rows ');
            });
            connection.execSql(req);
        };
        module.exports.select = select
        module.exports.delet = delet

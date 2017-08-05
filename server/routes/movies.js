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

router.get('/getAllMovies', function(req, res) {
    var quer="Select Movies.movieId ,movieName, description, price, stockAmount, publishedYear,language, picturePath,addedDate,MoviesCategories.categoryId,categoryName,Directors.directorId,firstName,lastName From Movies,Categories,MoviesCategories,Directors where Movies.movieId=MoviesCategories.movieId and MoviesCategories.categoryId=Categories.categoryId and Movies.directorId=Directors.directorId";

    DButilsAzure.select(quer,function (result) {
        res.send(result);
    })
});

router.put('/updateStock', function (req,res){
    var quer="UPDATE Movies SET stockAmount = stockAmount+ "+req.body.stockAdd+" WHERE movieId='"+req.body.movieId+"\'"                   ;
    DButilsAzure.delet( quer, function (result) {
        res.send(result);
    });
});



let categoryIdByName=function(catName){
    return new Promise(function(resolve,reject){
        var quer="Select categoryId from  dbo.Categories WHERE categoryName=\'"+catName+"\'";
        DButilsAzure.getCategoryId(quer, function (result) {
            resolve(result[0].categoryId);
        })
    });
}


let getMoviesInCategories=function(categoryId){
    return new Promise(function(resolve,reject){
        var quer="Select * From MoviesCategories AS MC, Movies AS M Where MC.CategoryID="+categoryId+"AND MC.MovieID=M.MovieID";
        DButilsAzure.select(quer, function (result) {
            resolve(result);
        })
    });
}
router.post('/getMovieAmount', function(req, res) {
    var quer="Select stockAmount from  dbo.Movies WHERE movieId=\'"+req.body.movieId+"\'";
    DButilsAzure.select(quer, function (result) {
        res.send(result);
    })
});

router.get('/getTopFive', function(req, res) {
    var quer="Select Top 5 M.movieId,M.movieName,directorId,description,price,stockAmount,publishedYear,language,picturePath From Movies AS M, MoviesInOrders AS MIO, Orders AS O Where O.orderDate BETWEEN CURRENT_TIMESTAMP-7 AND CURRENT_TIMESTAMP AND M.movieId=MIO.movieId AND MIO.orderId = O.orderId Group By M.movieID,M.movieName,directorId,description,price,stockAmount,publishedYear,language,picturePath Order by sum(MIO.amount) desc";
    DButilsAzure.select( quer,function (result) {
        res.send(result);
    })
});
router.post('/searchMovieByCategory', function(req, res) {
    var quer="Select * From Movies Where "+req.body.categoryName+"='"+req.body.categoryValue+"\'";
    DButilsAzure.select(quer, function (result) {
        res.send(result);
    })
});
router.post('/getMoviesByCategory', function(req, res) {
    var quer= "Select Movies.movieId,movieName,MoviesCategories.categoryId,categoryName,Movies.directorId,firstName,lastName, description, price, stockAmount, publishedYear,language, picturePath,addedDate From Movies,Categories,MoviesCategories,Directors where Movies.movieId=MoviesCategories.movieId and MoviesCategories.categoryId=Categories.categoryId and Movies.directorId=Directors.directorId and MoviesCategories.categoryId='"+req.body.categoryId+"'"
    // var quer="Select movieId from  dbo.MoviesCategories WHERE categoryId=\'"+req.body.categoryId+"\'";

    DButilsAzure.select(quer, function (result) {
        res.send(result);

    })
});
router.get('/getNewestMovies', function(req, res) {
    var quer="SELECT * FROM Movies WHERE MONTH(addedDate) = MONTH(GETDATE())";
    //   var quer="Select * From Movies Where Movies.addedDate BETWEEN CURRENT_TIMESTAMP-30 AND CURRENT_TIMESTAMP";
    DButilsAzure.select(quer,function (result) {
        res.send(result);
    })
});
router.get('/getInventory', function(req, res) {
    var quer="Select movieID,movieName,stockAmount From Movies";
    DButilsAzure.select(quer,function (result) {
        res.send(result);
    })
});

router.post('/', function(req, res, next) {
    res.send('respond with a resource');
});

let insertMovie=function(MovieDetails){
    return new Promise(function(resolve,reject){
        DButilsAzure.InsertMovie(MovieDetails, function (result) {
            resolve(result);
        })
    });
}


router.post('/addMovie', function (req,res) {
    console.log(req.body);
    var MovieDetails=new Object();
    MovieDetails.movieName=req.body.movieName;
    MovieDetails.directorId=req.body.directorId;
    MovieDetails.description=req.body.description;
    MovieDetails.price=req.body.price;
    MovieDetails.stockAmount=req.body.stockAmount;
    MovieDetails.publishedYear=req.body.publishedYear;
    MovieDetails.language=req.body.language;
    MovieDetails.picturePath=req.body.picturePath;
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    }

    if(mm<10) {
        mm = '0'+mm
    }

    today = mm + '/' + dd + '/' + yyyy;
    MovieDetails.addedDate=today;
    console.log("currenttttttttttttttttt"+today);
//add movie to movies
    insertMovie(MovieDetails)
    //get movie id by name
        .then(function(movieIn){
            return new Promise(function(resolve,reject){
                var quer="Select movieId from  dbo.Movies WHERE movieName=\'"+MovieDetails.movieName+"\'";
                DButilsAzure.select(quer, function (result) {
                    resolve(result[0].movieId);
                })
            });
        })
        .then(function(movieId){
            DButilsAzure.InsertMovieCategory(req.body.categoryId,movieId, function (result) {
                res.send(result);
            });
        })
});
router.put('/deleteMovie', function (req,res){
    var quer="Delete From Movies Where Movies.movieId='"+req.body.movieId+"\'" ;
    DButilsAzure.delet( quer, function (result) {
        res.send(result);
    });
});

router.post('/getRecommendedMovies', function(req, res) {

    var quer="Select top 3 M.movieId,M.movieName,directorId,description,price,stockAmount,publishedYear,language,picturePath From  ClientsCategories AS CC, MoviesCategories AS MC, MoviesInOrders AS MIO, Movies AS M Where MIO.movieId = M.movieId AND MIO.movieId = MC.movieId AND M.movieId = MC.movieId AND CC.UserName ='"+req.body.UserName+"' AND (CC.category1 = MC.categoryId OR CC.category2 = MC.categoryId OR CC.category3 = MC.categoryId) AND M.movieId NOT IN (Select MIO.movieId From Orders AS O, MoviesInOrders AS MIO, MoviesCategories AS MC Where O.UserName ='"+req.body.UserName+"' AND O.orderId = MIO.orderId) Group By M.movieID,M.movieName,directorId,description,price,stockAmount,publishedYear,language,picturePath Having SUM(MIO.amount) >= ALL(SELECT SUM(MIO.amount) From MoviesInOrders AS MIO Where MIO.movieId = M.movieId Group By MIO.movieId)"
    DButilsAzure.select(quer, function (result) {
        res.send(result);
    })
});
router.post('/getMovie', function(req, res) {
    var quer="Select * from  dbo.Movies WHERE movieId=\'"+req.body.movieId+"\'";
    DButilsAzure.select(quer, function (result) {
        res.send(result);
    })
});

router.post('/getMovieByName', function(req, res) {
    console.log('response.dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    console.log(req.body.movieName)
    var quer="Select * from  dbo.Movies WHERE movieName=\'"+req.body.movieName+"\'";
    console.log('sdfdddddddddddddddddddddddddddddddddddddd')
    console.log(quer)
    DButilsAzure.select(quer, function (result) {
        console.log('response.dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
        console.log(result)

        res.send(result);
    })
});
module.exports = router;

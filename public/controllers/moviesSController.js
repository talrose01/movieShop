app.controller('moviesSCtrl', ['$route','localStorageService','$http','$window','$scope','UserService',function($route,localStorageService,$http,$window,$scope,UserService) {
    var ctrl = this;

    ctrl.getMoviesDetails = function () {
        $http.get( "http://localhost:3000/movies/getAllMovies").then(function(response) {

            ctrl.products = response.data;

        }, function(errResponse){
            console.error('error in requestedNewMovies');
        })
    }

    $scope.currentOrder = 1;
    $scope.orderByMe = function (value) {
        $scope.currentOrder++;
        if ($scope.currentOrder % 2 != 0)
            $scope.myOrderBy = '-' + value;
        else
        {
            $scope.myOrderBy = value;
        }
    }
    ctrl.removeMovie=function(movieId){
        var obj={}
        obj.movieId=movieId;
        $http.put("http://localhost:3000/movies/deleteMovie",obj).then(function (response) {

            $window.alert('the movie have been removed');
            // window.location.reload();
            $route.reload();
        }, function (errResponse) {
            console.error('Error Categories');
        })
    }
    ctrl.fillMovie=function(movieId,stockAdd){
        var obj={}
        obj.movieId=movieId;
        obj.stockAdd=stockAdd;

        $http.put("http://localhost:3000/movies/updateStock",obj).then(function (response) {

            $window.alert('the stock has update');
            // window.location.reload();
            $route.reload();
        }, function (errResponse) {
            console.error('Error Categories');
        })
    }
}]);
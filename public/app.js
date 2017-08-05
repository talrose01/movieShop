let app = angular.module('myApp', ['ngRoute', 'LocalStorageModule']);
//-------------------------------------------------------------------------------------------------------------------
app.config(function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('client');
});

app.factory('UserService', ['$http', function($http) {
    let service = {};
    service.isLoggedIn = false;
    service.isAdmin = false;
    service.userName='guest'
    service.logout= function() {
        console.log('heylogout')
        service.userName='guest';
    }
    service.login = function(user) {

        return $http.post('http://localhost:3000/clients/login', user)
            .then(function(response) {

                if(response.data!='false'){
                    console.log(response.data[0].UserName)
                    let token = response.data[0].UserName;
                    $http.defaults.headers.common = {
                        'my-Token': user.username,
                        'user' : user.password
                    };
                    service.isLoggedIn = true;
                    service.userName=response.data[0].UserName+" "+response.data[0].LastLogin;
                    if(response.data[0].isADmin==1){
                        service.isAdmin = true;
                    }
                    return Promise.resolve(response);
                }
                else{
                    alert('UserName or Password are incorrect, you should insert new details')
                    return Promise.reject('false');
                }
                return Promise.resolve(response);
            })
            .catch(function (e) {
                return Promise.reject(e);
            });
    };
    return service;
}]);

//-------------------------------------------------------------------------------------------------------------------
app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
}]);
app.config( ['$routeProvider', function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "./views/home.html",
            controller : "mainController"
        })

        .when("/NewClients", {
            templateUrl : "./views/register.html",
            controller : "registerCtrl"
        })
        .when("/Clients", {
            templateUrl : "./views/Clients.html",
            controller : "ClientsController"
        })
        .when("/login", {
            templateUrl : "./views/login.html",
            controller : "loginController"
        })

        .when("/movies", {
            templateUrl : "./views/movies.html",
            controller: 'NewMoviesCtrl'
        })
        .when("/cart", {
            templateUrl : "./views/cart.html",
            controller: 'cartController'
        })
        .when("/forgotPassword", {
            templateUrl : "./views/forgotPassword.html",
            controller: 'forgotPassword'
        })
        .when("/moviesS", {
            templateUrl : "./views/moviesS.html",
            controller: 'moviesSCtrl'
        })
        .when("/addMovie", {
            templateUrl : "./views/addMovie.html",
            controller: 'addMovieCtrl'
        })
        .when("/OrdersReport", {
            templateUrl : "./views/OrdersReport.html",
            controller: 'OrdersReportCtrl'
        })
        .when("/register", {
            templateUrl : "./views/register.html",
            controller: 'registerCtrl'
        })
        .otherwise({redirect: '/',
        });
}]);
//*******************************************************************************************************
app.factory('openPageService', function ($location) {
    return {
        openPage: function (url) {
            $location.path(url);
        }
    }
});


app.controller("ModelHandlerController",function($scope,$uibModalInstance){

    $scope.cancelModal = function(){
        console.log("cancelmodal");
        $uibModalInstance.dismiss('close');
    }
    $scope.ok = function(){
        $uibModalInstance.close('save');

    }

});




app.controller('NewMoviesCtrl', ['localStorageService','$http','$window','$scope','UserService',function(localStorageService,$http,$window,$scope,UserService) {
    var ctrl = this;
    ctrl.showModal=false;
    var dict = {};
    var Categories = [];
    var idSelcted;
    ctrl.init = function () {
        getCategories();
    }

    ctrl.userService = UserService;
    // if (ctrl.userService.isLoggedIn == true)

    let searchByCat = function (res) {

        var selecteCat = $scope.category;
        if (selecteCat == "All" || selecteCat === undefined) {
            requestedNewMovies();
        }

        else {

            idSelcted = dict[selecteCat];
            console.log(idSelcted);
            var id = {}
            id.categoryId = (idSelcted[0]);
            $http.post("http://localhost:3000/movies/getMoviesByCategory", id).then(function (response) {

                ctrl.products = response.data;



            }, function (error) {
                console.error('error');
            }).then(recommended);

        }
    }
    // ctrl.searchByCat=searchByCat;
    let getCategories = function (res) {
        console.log(".CategoriesMoviesss");
        $http.get("http://localhost:3000/categories/getAllCategories").then(function (response) {

            for (i = 0; i < response.data.length; i++) {
                Categories[i] = response.data[i].categoryName;
                dict[response.data[i].categoryName] = [response.data[i].categoryId];

            }
            Categories[response.data.length] = "All";

            $scope.Categories = Categories;
            // $scope.category="All";
        }, function (errResponse) {
            console.error('Error Categories');
        }).then(searchByCat);
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
    let requestedNewMovies=function(){
        $http.get( "http://localhost:3000/movies/getAllMovies").then(function(response) {

            var returnData = response.data;
            ctrl.products = returnData;
            console.log(ctrl.products);
        }, function(errResponse){
            console.error('error in requestedNewMovies');
        }).then(recommended);}

    let recommended=function(res)
    {

        var userExist =  decodeURIComponent(document.cookie);
        var userName= localStorageService.cookie.get();
        ctrl.userName=userExist.substring(7);
        var index =  ctrl.userName.indexOf("=");
        ctrl.userName=ctrl.userName.substring(0,index);
        var User={};
        User.UserName=ctrl.userName;
        $http.post("http://localhost:3000/movies/getRecommendedMovies",User).then(function (response){
            console.log(response);
            ctrl.recommended=response.data;

        },function (error) {console.error('error');});

    }

    ctrl.showMovie=function (x) {
        $scope.movieName=x.movieName;
        $scope.description=x.description;
        $scope.categoryName=x.categoryName;
        $scope.director=x.firstName+ " "+x.lastName;
        ctrl.showModal=true;
    }

    ctrl.closeModal=function() {
        ctrl.showModal=false;
    }
    ctrl.addToCart = function (movieId,movieName, quantity, price,language,picturePath,description) {
        var intQuantity=parseInt(quantity);
        if (quantity>0){

            alert("You choose "+ quantity +" "+"parts of the Movie :"+movieName );
            let lsLength = localStorageService.length();
            let valueStored = localStorageService.get(movieId);
            if (!valueStored) {

                var insert={};
                insert.picturePath = picturePath;
                insert.language = language;
                insert.movieName = movieName;
                insert.description = description;
                insert.quantity = parseInt(quantity);
                insert.price = price*insert.quantity;
                if (localStorageService.set(movieId, insert)){
                    // $window.alert('data was added successfully');
                  /*  $scope.quantity= '';*/
                }

                else{
                    //  $window.alert('failed to add the data');
                }

            }
            else{
                var delte=localStorageService.get(movieId)
                console.log(delte)
                localStorageService.remove(movieId);
                var insert={};
                insert.picturePath=picturePath;
                insert.language=language;
                insert.movieName=movieName;
                insert.quantity=delte.quantity;
                insert.quantity= insert.quantity+parseInt(quantity);
                insert.price=delte.price+(price*parseInt(quantity));
                if (localStorageService.set(movieId, insert)){
                    //    $window.alert('data was added successfully');
                    $scope.quantity= '';
                }

            }
        }else{
            $window.alert('You Should Add Amount To Your Purches');
        }
    }

}]);
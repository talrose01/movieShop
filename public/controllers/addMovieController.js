
app.controller('addMovieCtrl', ['localStorageService','$scope','$http','$window','openPageService', function(localStorageService,$scope,$http,$window,openPageService) {
    var ctrl=this;
    var dict={};
    var Categories=[];

    ctrl.init = function() {

        $http.get("http://localhost:3000/directors/getAllDirectors").then(function (response) {
            ctrl.directors=response.data;
            ctrl.index= ctrl.directors.length;
                   }, function (errResponse) {

        }).then(function (res) {
            $http.get("http://localhost:3000/categories/getAllCategories").then(function (response) {
                ctrl.categories=response.data;
            }, function (errResponse) {

            })
        });

    }
    ctrl.addDirector = function() {
        var Notexist = true;
        for (i = 0; i < ctrl.directors.length; i++) {
            if (ctrl.directors[i].firstName == $scope.DFirstName && ctrl.directors[i].lastName == $scope.DLirstName) {
                Notexist = false;
                break;
            }
        }
        if (Notexist) {
            ctrl.index = ctrl.index + 1;
            ctrl.directors.push({
                "firstName": $scope.DFirstName,
                "lastName": $scope.DLirstName,
                "directorId": ctrl.index
            });

            var director = {};
            director.firstName = $scope.DFirstName;
            director.lastName = $scope.DLirstName;
            $http.post("http://localhost:3000/directors/addDirector", director).then(function (response) {
                if (response.data == 'true') {
                    alert('the director added!')

                }
            }, function (errResponse) {

            })

        }
        else{
            alert('the director already Exist, Please Try Again!')
        }
        Notexist = true;
    }

    ctrl.addMovie = function () {
        console.log(' $scope.director.directorId')
        console.log($scope.director)
        console.log(' $scope.director.directorId')
        var obj = {
            "movieName": $scope.movieName,
            "directorId": $scope.director,
            "description": $scope.description,
            "price": $scope.price,
            "stockAmount": $scope.stockAmount,
            "publishedYear": $scope.publishedYear,
            "language": $scope.language,
            "picturePath": $scope.picturePath,
            "categoryId": $scope.categoryId
        }

/*        $http.post("http://localhost:3000/movies/addMovie", obj).then(function (response) {
            var data = response.data;


            if (data=='true') {
                openPageService.openPage('/addMovie');
                alert("The Movie Added !");

                openPageService.openPage('/');
            } else {
                alert("There was a problem, please try again");
            }
        });*/
        $http.post("http://localhost:3000/movies/getMovieByName",obj).then(function (response) {
            console.log('response.dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
            console.log(response.data)
            console.log(response.data.length)
            ctrl.index=response.data.length;

        }, function (errResponse) {

        }).then(function (res) {
            if(ctrl.index==0){
                $http.post("http://localhost:3000/movies/addMovie", obj).then(function (response) {
                    var data = response.data;


                    if (data=='true') {
                        openPageService.openPage('/addMovie');
                        alert("The Movie Added !");

                        openPageService.openPage('/');
                    } else {
                        alert("There was a problem, please try again");
                    }
                });
            }
            else{
                alert("There movie alredy exist, please try new one");
            }

        });
    };
}]);

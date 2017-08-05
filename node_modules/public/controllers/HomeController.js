
/////////////////////////////////////////////////
app.controller('mainController', ['openPageService','$route','openPageService','localStorageService','UserService','$scope','$http','$window',function (openPageService,$route,openPageService,localStorageService,UserService,$scope,$http,$window) {
    function myFunction() {
        var input, filter, table, tr, td, i;
        input = document.getElementById("myInput");
        filter = input.value.toUpperCase();
        table = document.getElementById("myTable");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0];
            if (td) {
                if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }

    var d = new Date();
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    var n = month[d.getMonth()];
    $scope.month=n;
    let vm = this;
    vm.showModal=false;
    vm.greeting = 'Have a nice day';
    vm.userService = UserService;

    vm.closeModal=function() {
        vm.showModal=false;
    }
    let topFive=function() {

        var requestedgetTopFive = "http://localhost:3000/movies/getTopFive";
        return  $http.get(requestedgetTopFive).then(function (response) {
            //   vm.getTopFive=response.data;
            $scope.getTopFive=response.data;
            // $route.reload();
        }, function (errResponse) {
            console.error('error in products');
        }).then(newMovies);

    }

    let isAdmin=function (res) {
        return $http.post("http://localhost:3000/clients/isAdmin", id).then(function (response) {
            if(response.data =='true')
            {
                vm.userService.isAdmin = true;

            }
        }, function (error) {
            console.error('error');
        });
    }
    let newMovies=function () {

        if (vm.userService.isLoggedIn == true) {
            var requestedNewMovies = "http://localhost:3000/movies/getNewestMovies";
            return   $http.get(requestedNewMovies).then(function (response) {
                $scope.products=response.data;
            }, function (errResponse) {
                console.error('error in products');
            });
        }


    }

    vm.homeInit=function(){
        var requestedgetTopFive = "http://localhost:3000/movies/getTopFive";
        return  $http.get(requestedgetTopFive).then(function (response) {
            $scope.getTopFive=response.data;
        }, function (errResponse) {
            console.error('error in products');
        }).then(newMovies);

    }
    vm.loginInit=function(){

        var userExist =  decodeURIComponent(document.cookie);
        if(userExist!="") {
            vm.userService.isLoggedIn = true;
            var userName= localStorageService.cookie.get();
            vm.userName=userExist.substring(7);
            vm.userName=vm.userName.replace("=", " ");
            vm.userService.userName=""+vm.userName.substring(0,vm.userName.length-1);

            if(vm.userName[vm.userName.length-1]=='1'){
                vm.userService.isAdmin = true;
            }

        }
    }

    vm.logout=function(){
        vm.userService.isAdmin=false;
        vm.userService.isLoggedIn=false;
        localStorageService.cookie.clearAll();
        localStorageService.clearAll();
        vm.userService.logout();
        openPageService.openPage('/');
        ;
    }

    vm.addToCart = function (movieId,movieName, quantity, price,language,picturePath,description) {
        var intQuantity = parseInt(quantity);
        if (quantity > 0) {

            $window.alert("You add To Cart "+ quantity +" "+"parts of the Movie :"+movieName) ;
            // vm.showModal=true;
            let lsLength = localStorageService.length();
            let valueStored = localStorageService.get(movieId);
            if (!valueStored) {
                var insert={};
                insert.picturePath = picturePath;
                insert.language = language;
                insert.description = description;
                insert.movieName = movieName;
                insert.quantity = parseInt(quantity);
                insert.price = price*insert.quantity;
                if (localStorageService.set(movieId, insert)){

                    $scope.quantity= ' ';
                   // $window.alert('data was added successfully');
                }

                else{
                    $window.alert('failed to add the data');
                }

            }
            else{

                var delte=localStorageService.get(movieId)
                console.log(delte)
                localStorageService.remove(movieId);
                var insert={};
                insert.language=language;
                insert.picturePath = picturePath;
                insert.movieName=movieName;
                insert.quantity=delte.quantity;
                insert.quantity= insert.quantity+parseInt(quantity);
                insert.price=delte.price+(price*parseInt(quantity));
                if (localStorageService.set(movieId, insert)){
                 //   $window.alert('data was added successfully');
                    $scope.quantity=  ' ';
                }

            }
        } else {
            $window.alert('You Should Add Amount To Your Purches') ;
        }
    }
}]);

app.controller('OrdersReportCtrl', ['UserService','localStorageService','$scope','$http','$window','openPageService', function(UserService,localStorageService,$scope,$http,$window,openPageService) {
    var ctrl=this;
    var dict={};
    $scope.Orders=[];
    var exist=0;
    $scope.addRow = function(){

        for(i=0;i<$scope.Orders.length;i++){
            if($scope.Orders[i].movieId==$scope.movie.movieId){
                alert('this movie already exist clear all or add other movie');
                exist=1;
                break;
            }
        }
        if(exist==0){
            $scope.Orders.push({ "movieId":$scope.movie.movieId,"movieName":$scope.movie.movieName, "amount": $scope.amount });
            $scope.movie='';
            ctrl.supplier =$scope.supplier;
            $scope.supplier='';
            $scope.amount='';

        }
        exist=0
    };
    ctrl.change= function() {
        alert('The Last Supplier You Choose Will Be Your Supplier!')
    }
    ctrl.clear = function() {
        $scope.Orders=[];
    }
    ctrl.init = function() {
        $http.get( "http://localhost:3000/movies/getAllMovies").then(function(response) {
            ctrl.Movies = response.data;
        }, function(errResponse){
            console.error('error in requestedNewMovies');
        }).then(function (res) {
            $http.get("http://localhost:3000/reports/getReportNum").then(function (response) {
                console.log(response.data);
                ctrl.orderId=parseInt(response.data[0].reportId)+1;
            }, function (errResponse) {
            })
        })
        ctrl.suppliers= [
            {supplierId : '1', firstName : 'eli', lastName : ' cohen'},
            {supplierId : '2', firstName : 'dan', lastName : ' hen'},
            {supplierId : '3', firstName : 'ron', lastName : ' mor'},
            {supplierId : '4', firstName : 'efi', lastName : ' ben'},
            {supplierId : '5', firstName : 'ben', lastName : ' dvis'},
            {supplierId : '6', firstName : 'dani', lastName : ' cohen'}

        ];

    }
    ctrl.sendReport = function () {

        ctrl.UserName=UserService.userName.substring(0,UserService.userName.length-11);
        console.log(ctrl.UserName);
        var send="('"+ctrl.UserName+"',"+ctrl.supplier.supplierId+")";
        var sendA="";
        /*( orderId, movieId,amount ), ( Value1, Value2 )*/
        for (i = 0; i < $scope.Orders.length; i++) {
            if (i == 0) {
                /*ctrl.orderId*/
                sendA += "(" + ctrl.orderId + "," + $scope.Orders[i].movieId + "," + $scope.Orders[i].amount + ")";
            }
            else {
                sendA += ",(" + ctrl.orderId + "," + $scope.Orders[i].movieId + "," + $scope.Orders[i].amount + ")";
            }
        }

        var obj = {
            "reportQuery":send ,
            "reportMoviesQuery": sendA
        }
        console.log(obj);
        $http.post("http://localhost:3000/reports/addReport", obj).then(function (response) {
            var data = response.data;

            if (data=='true') {
                //openPageService.openPage('/OrdersReport');
                alert("The Report Added !");
                ctrl.clear();
                ctrl.orderId= ctrl.orderId+1;

            } else {
                alert("There was a problem, please try again");
            }
        });

    };
}]);
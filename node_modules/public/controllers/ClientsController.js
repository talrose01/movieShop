
app.controller('ClientsController', ['$route','$scope','$http','$window', function($route,$scope,$http,$window) {
    var ctrl=this;
    ctrl.init=function(){
        $http.get("http://localhost:3000/clients/getAllClients").then(function (response) {

            ctrl.cliensList = response.data;
            console.log(response.data);

        }, function (errResponse) {
            console.error('Error Categories');
        })
    }
    ctrl.removeClient=function(UserName){
        var obj={}
        obj.UserName=UserName;
        $http.put("http://localhost:3000/clients/deleteClient",obj).then(function (response) {
            $window.alert('the user have been removed');
            // window.location.reload();
            $route.reload();
        }, function (errResponse) {
            console.error('Error Categories');
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
}]);

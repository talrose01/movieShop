app.controller('cartController', ['UserService','$route','openPageService','localStorageService','$scope','$http','$window', function(UserService,$route,openPageService,localStorageService,$scope,$http,$window) {

    var ctrl=this;

    var values = [];
    var keys = Object.keys(localStorage)
    var i = keys.length-1;
    var sum=0;
    var order="";
    console.log(i);
    while (i>=0 ) {
        var obj={};

        var insert={};
        obj.movieId=keys[i];
        var insert= JSON.parse(localStorage.getItem(keys[i]))
        obj.price=insert.price;
        obj.description=insert.description;
        obj.movieName=insert.movieName;
        obj.language=insert.language;
        obj.picturePath=insert.picturePath;
        obj.quantity=insert.quantity;
        sum=sum+(obj.price*obj.quantity)
        order=order+obj.movieId.substring(7)+'*'+obj.quantity+'*';
        values.push(obj);
        i--;
    }
    order=order.substring(0,order.length-1);

    ctrl.products=values;
    $scope.myFieldLabel = sum;

    ctrl.removeMovie=function (movieId) {
        localStorageService.remove(movieId.substring(7));
        $window.alert("movie removed");
        $route.reload();
    }

    ctrl.showModal=false;
    ctrl.NotPrevious=false;
    ctrl.showPrevious= function ()
    {
        var userName={};
        userName.userName=UserService.userName;
        userName.userName=userName.userName.substring(0,userName.userName.length-11)
        console.log(userName.userName)
        $http.post("http://localhost:3000/orders/getPreviousOrders", userName).then(function (response){
            console.log(response.data)
            ctrl.prevOrders=response.data;
            if(ctrl.prevOrders.length>0){
                ctrl.showModal=true;

            }
            else{
                ctrl.NotPrevious=true;
            }
        })


    }
    ctrl.closeModal=function() {
        ctrl.showModal=false;
    }
    ctrl.closeModalNot=function() {
        ctrl.NotPrevious=false;
    }
    ctrl.showDetailsModal=false;

    ctrl.showDetails= function (productId)
    {
        ctrl.currentOrder=productId;
        var obj={};
        obj.orderId=productId;
        $http.post("http://localhost:3000/orders/getOrderDetails", obj).then(function (response){
            console.log(response.data);
            ctrl.details=response.data;
        })
        ctrl.showDetailsModal=true;
    }
    ctrl.closeModalDetails=function() {
        ctrl.showDetailsModal=false;
    }

    ctrl.movieDetail=false;

    ctrl.showMovieDetail= function (movie)
    {
        console.log('ctrl.movieDetailctrl.movieDetailctrl.movieDetail')

        ctrl.movieDetailList=movie;
        ctrl.movieDetail=true;
    }
    ctrl.closeMovieDetail=function() {

        ctrl.movieDetail=false;
    }

    ctrl.buyCart = function () {
        var orderToInsert={};
        orderToInsert.UserName=UserService.userName.substring(0,UserService.userName.length-11);
              var currentdate= new Date();
        //********order month*******************
        var curMonth=currentdate.getMonth()+1;
        var newMonth=parseInt(curMonth);
        var lastMonth="";
        var shipmentYear = parseInt(currentdate.getFullYear())+1
        if(newMonth<10)
            lastMonth="0"+curMonth;
        //********order date*******************
        var curDay=currentdate.getDate();
        var newDay=parseInt(curDay);
        var lastDay=curDay;
        if(newDay<10){
            lastDay="0"+curDay;
        }
        //********shipment month*******************
        var curshipmentMonth=currentdate.getMonth()+1;
        var newshipmentMonth=parseInt(curshipmentMonth);
        var lastshipmentMonth="";
        if(newshipmentMonth<10)
            lastshipmentMonth="0"+curshipmentMonth;
        //********order date*******************
        var curshipmentDay=currentdate.getDate();
        var newshipmentDay=parseInt(curshipmentDay);
        var lastshipmentDay=curshipmentDay;
        if(newshipmentDay<10){
            lastshipmentDay="0"+curshipmentDay;
        }


        var datetime = currentdate.getFullYear()+ "-"+ lastMonth + "-"+ lastDay;


        var shipmentDate= new Date();
        var datetimeShipment =  shipmentYear+"-"+ lastshipmentMonth  + "-"+ lastshipmentDay;
        orderToInsert.orderDate= datetime
        orderToInsert.shipmentDate= datetimeShipment;
        orderToInsert.Dollar= 3.2;
        orderToInsert.totalPrice= $scope.myFieldLabel;
        orderToInsert.movieList=order;
        var orderDitails="Your OrderDetails: ";

        $http.post("http://localhost:3000/orders/addOrder",orderToInsert).then(function (response){
            ctrl.message=response.data;

            for (var j = 0; j <ctrl.message.length; j++){
                orderDitails=orderDitails+"\norderId: "+(ctrl.message[j]).orderId+"\nUserName: "+(ctrl.message[j]).UserName+"\norderDate: "+(ctrl.message[j]).orderDate.substring(0,10)+"\nshipmentDate:2017-09-10"+"\nDollar: "+(ctrl.message[j]).Dollar+"\ntotalPrice: "+(ctrl.message[j]).totalPrice;


            }
            $scope.myFieldLabel='0';

                $window.alert(orderDitails)
            localStorage.clear();
            ctrl.products=[];

        },function (error) {console.error('error');});

    }
}]);
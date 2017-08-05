app.controller('registerCtrl', ['UserService','localStorageService','$scope','$http','$window','openPageService', function(UserService,localStorageService,$scope,$http,$window,openPageService) {
    var ctrl=this;
    var dict={};

    var Categories=[];
    ctrl.getCategories = function() {
        loadXMLDoc();
        ctrl.userName=UserService.userName;
        $http.get("http://localhost:3000/categories/getAllCategories").then(function (response) {
            for (i = 0; i < response.data.length; i++) {
                Categories[i] = response.data[i].categoryName;
                dict[response.data[i].categoryName]=[response.data[i].categoryId];
            }

            $scope.Categories = Categories;

        }, function (errResponse) {

        });
    }

    var currentdate= new Date();
    var curMonth=currentdate.getMonth()+1;
    var newMonth=parseInt(curMonth);
    var lastMonth=curMonth;
    if(newMonth<10)
        lastMonth="0"+curMonth;
     var curDay=currentdate.getDate();
    var newDay=parseInt(curDay);
    var lastDay=curDay;
    if(newDay<10){
        lastDay="0"+curDay;
    }

    var datetime = currentdate.getFullYear()+ "-"+ lastMonth + "-"+ lastDay;

    $scope.backToHomePage = function () {
        openPageService.openPage('/');
    };

    function loadXMLDoc() {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                myFunction(this);
            }
        };
        xmlhttp.open("GET", "countries.xml", true);
        xmlhttp.send();
    }
    function myFunction(xml) {
        var i;
        var xmlDoc = xml.responseXML;
        var temp = [];
        var x = xmlDoc.getElementsByTagName("Country");
        for (i = 0; i <x.length; i++) {
            var json = { "ID" :x[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue.toString(),
                "Name" :x[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue.toString()}
            temp.push(json);
        }
        ctrl.Countries = temp;
        ctrl.selectedCountry = ctrl.Countries[4];
    }

    $scope.register = function () {
console.log(ctrl.selectedCountry.Name)
        var obj = {
            "UserName": $scope.userName,
            "city": $scope.city,
            "password": $scope.password,
            "Mail": $scope.email,
            "country": ctrl.selectedCountry.Name,
            "adress": $scope.address,
            "phone": $scope.phone,
            "firstName": $scope.firstName,
            "lastName": $scope.lastName,
            "creditCardNumber": $scope.creditCardNumber,
            "LastLogin": datetime,
            "categoryA": dict[$scope.categoryA],
            "categoryB": dict[$scope.categoryB],
            "categoryC": dict[$scope.categoryC],
            "question1": $scope.question1,
            "question2": $scope.question2,
            "answer1": $scope.answer1,
            "answer2": $scope.answer2,
            "isADmin": 0

        }
        if( UserService.userName!="guest"){

            obj.isADmin=$scope.singleSelect;

        }

        $http.post("http://localhost:3000/clients/register", obj).then(function (response) {
            var data = response.data;


            if (data=='true') {
                $window.alert('The User added!');
                if( UserService.userName=="guest"){

                    openPageService.openPage('/login');
                    console.log('heeeeeeeeeeeeeeeeeeeeeeeeee')
                }
                else{


                    openPageService.openPage('/');
                }

            } else {

                alert("This UserName Is Already Exist, Try Again");

            }
        });
    };
}]);
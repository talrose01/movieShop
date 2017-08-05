app.controller('forgotPassword', ['UserService','$scope','$window','$http','openPageService',function(UserService,$scope,$window,$http,openPageService) {
    var ctrl=this;
    var dict={};
    var UserName={};
    ctrl.getQuestions = function() {
        UserName.UserName=$scope.UserName;
        if(UserName.UserName=== undefined){
            alert('You Should Insert User Name To Get Questions')

        }
        else{
            $http.post("http://localhost:3000/clients/getQuestions", UserName).then(function (response) {

                $scope.qustion1 = response.data[0].question1;

                $scope.qustion2 = response.data[0].question2;
                ctrl.answer1=response.data[0].answer1;
                ctrl.answer2=response.data[0].answer2;
            }, function (errResponse) {
                console.error('Error while fetching notes');
            });
        }

    }
    ctrl.checkPass = function() {
        if(UserName.UserName=== undefined){
            alert('You Should Insert User Name To Get Questions and Press on Enter Button');

        }
        else{
            if($scope.answer1==ctrl.answer1 && $scope.answer2== ctrl.answer2){

                $http.post("http://localhost:3000/clients/getPassword", UserName).then(function (response) {
                    ctrl.password=response.data[0].password;
                    $window.alert("Your Password is:  "+ctrl.password)
                    openPageService.openPage('/login');
                }, function (errResponse) {
                    console.error('Error while fetching notes');
                });
            }
            else{
                $window.alert("Your Answers Are Not Correct")
            }
        }

    }

}]);

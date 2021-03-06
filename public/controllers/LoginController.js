app.controller('loginController', ['$scope','openPageService','localStorageService','UserService', '$location', '$window',

    function($scope,openPageService,localStorageService,UserService, $location, $window) {
        let self = this;
self.service=UserService;
        self.login = function(valid,userName,password) {
            if (valid) {
                self.user.username=userName;
                var coo="client."+self.user.username;
                self.user.password=password;

                UserService.login(self.user).then(function (success) {

                    if (success.data!='false') {

                        let cookieVal = "";
                        var name = coo + "=";
                        var decodedCookie = decodeURIComponent(document.cookie);
                        var ca = decodedCookie.split(';');


                        for (var i = 0; i < ca.length; i++) {
                            var c = ca[i];
                            while (c.charAt(0) == ' ') {
                                c = c.substring(1);
                            }
                            if (c.indexOf(name) == 0) {
                                cookieVal = c.substring(name.length, c.length);
                            }
                        }

                        if (cookieVal == "") {
                            //***
                            var today = new Date();
                            var dd = today.getDate();
                            var mm = today.getMonth() + 1; //January is 0!
                            var yyyy = today.getFullYear();

                            if (dd < 10) {
                                dd = '0' + dd
                            }

                            if (mm < 10) {
                                mm = '0' + mm
                            }

                            today = mm + '/' + dd + '/' + yyyy+success.data[0].isADmin;
                            //*****

                            self.user.date = today;
                            if (localStorageService.cookie.set(self.user.username, today), 3) {
                                //window.location.reload();
                            }
                            else
                                $window.alert('failed to add the cookie');
                        } else
                            $window.alert('failed to add the cookie');
                        $location.path('/');
                    }
                }, function (error) {
                    self.errorMessage = error.data;

                })

            }
        };
    }]);
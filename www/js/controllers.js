angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})



.controller('product-deatil-controller', function($scope, $state, $ionicViewSwitcher) {
  $scope.pid  = 10000;

  $scope.buy = function(pid){
    $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
    $state.go('order');
  }
})



.controller('order-controller', function($scope, $state, $ionicViewSwitcher) {
    $scope.backToProductDetailPage = function() {
      $ionicViewSwitcher.nextDirection('back'); // 'forward', 'back', etc.
      $state.go('home');
    }
})



.controller('account-controller', function($scope, $rootScope, $state, $ionicViewSwitcher, Auth) {
    $scope.logedin = Auth.islogin();
    //debugger;
    $scope.logout = Auth.logout;

    if ($scope.logedin) {
        Auth.loginUser( function(userInfo) {
          $scope.loginUser  = userInfo;
        }, function(error) {

        });
    } else {
        $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
        $state.go('login');
    }

    $scope.login = function() {      
      $state.go('login');
    }

    $scope.resetpwd = function() {
        $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
        $state.go('resetpwd', {}, {reload: true});
    }

    $scope.logoutSuccess = function() {
        $scope.logedin = false;
        $state.go('home', {}, {reload: true});
    }

})



.controller('resetpwd-controller', function($scope, $rootScope, $state, $timeout, $ionicViewSwitcher, Auth) {

    if (!Auth.islogin()) {
      $state.go('login', {}, {reload: true});
      return;
    }

    var currentUser   = $rootScope.currentUser;

    $scope.resetPwdM = {};

    $scope.backToAccountPage = function() {
        $ionicViewSwitcher.nextDirection('back'); // 'forward', 'back', etc.
        $state.go('account');
    }

    $scope.resetpwd = function() {
        if ($scope.resetPwdM.oldPwd === undefined || $scope.resetPwdM.oldPwd === '') {
          toolTip($scope, $timeout, "请输入原始密码", 'danger');
          return;
        }

        if ($scope.resetPwdM.newPwd === undefined || $scope.resetPwdM.newPwd === ''
            || ($scope.resetPwdM.newPwd && ($scope.resetPwdM.newPwd.length < 6 || $scope.resetPwdM.newPwd.length > 16))) {
          toolTip($scope, $timeout, "请输入新密码, 且新密码长度6-16位, 首尾不能有空格！", 'danger');
          return;
        }

        if ($scope.resetPwdM.newPwd != $scope.resetPwdM.newPwdAgain) {
          toolTip($scope, $timeout, "两次输入的新密码不一致，请重新输入新密码!", 'danger');
          return;
        }

        Auth.resetPasswd(
              {
                oldPwd: $scope.resetPwdM.oldPwd, 
                newPwd: $scope.resetPwdM.newPwd,
                userToken: currentUser.value,
                tokenType: currentUser.tokenType
              }
              ,function(result) {
                toolTip($scope, $timeout, "修改成功.", 'info');
                return;
              }, function(e) {
                toolTip($scope, $timeout, e.message, 'danger');
                return;
              }
        );
    }
})



.controller('register-controller', function($scope, $state, $timeout, $state, $ionicViewSwitcher, Auth) {
    $scope.r    = 1;
    $scope.regM = {};
    $scope.uploading  = false;
    $scope.regSuccess = false;

    $scope.refreshCode = function() {
      $scope.r = $scope.r + 1;
    }

    // $scope.sendSMS = function() {
    //   if (!$scope.regM.checkcode) return;

    //   toolTip($scope, $timeout, "手机号码格式不正确", 'danger');
    // }

    $scope.register = function() {
        var username      = $scope.regM.username;
        var passwd        = $scope.regM.passwd;
        var checkcode     = $scope.regM.checkcode;

        var username_reg  = /^([A-Za-z0-9_\-\.\@]){6,16}$/;

        if(typeof(username) == 'undefined' || username_reg.test(username) == false) {          
          toolTip($scope, $timeout, "用户名不符合规范!(6-16位! 仅限: a-z A-Z 0-9 @ - _ .)", 'danger');
          return;
        }

        if(typeof(passwd) == 'undefined' || (passwd.trim().length < 6 || passwd.trim().length > 16)) {          
          toolTip($scope, $timeout, "密码输入有误!(6-16位,首尾不含空格!)", 'danger');
          return;
        }

        if(typeof(checkcode) == 'undefined' || checkcode.toString().trim().length != 6) {          
          toolTip($scope, $timeout, "验证码输入有误!", 'danger');
          return;
        }

        Auth.register({
          username: username,
          passwd: passwd,
          checkcode: checkcode
        }, function(result){
            $scope.regSuccess = true;
            //toolTip($scope, $timeout, "恭喜你, 注册成功! 现在去登陆吧.", 'info');
        }, function(error) {
            toolTip($scope, $timeout, error.message, 'danger');
        });
    }

    $scope.goToLoginPage = function() {
        $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
        $state.go('login', {}, {reload: true});
    }
})



.controller('login-controller', function($scope, $rootScope, $ionicViewSwitcher, $state, $ionicPopup, $timeout, Auth) {
    $scope.tabIndex   = 1;
    $scope.logM = {};

    $scope.tabClick = function(tabIndex) {
      $scope.tabIndex = tabIndex;
    }

    $scope.login = function() {
      Auth.login({username: $scope.logM.username, passwd: $scope.logM.passwd}, function(error, result) {
        if (result.error) {
          toolTip($scope, $timeout, result.message, 'danger');
          return;
        }

        Auth.loginSuccess(result.data, function() {
          $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
          $state.go('account', {}, {reload: true});
        });
      });
    }

    $scope.register = function() {
      $state.go('register', {}, {reload: true});
    }
});

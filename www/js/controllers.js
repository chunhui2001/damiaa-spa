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



.controller('account-controller', function($scope, $state, Auth) {
    $scope.logedin = Auth.islogin();

    $scope.login = function() {      
      $state.go('login');
    }
   // window.location.reload();
    $scope.logout = Auth.logout;
    $scope.logoutSuccess = function() {
      $scope.logedin = false;
       $state.go($state.current, {}, {reload: true});
    }
})



.controller('register-controller', function($scope, $state, $timeout) {
    $scope.r    = 1;
    $scope.regM = {};
    $scope.uploading = false;

    $scope.refreshCode = function() {
      $scope.r = $scope.r + 1;
    }

    $scope.sendSMS = function() {
      if (!$scope.regM.checkcode) return;

      toolTip($scope, $timeout, "手机号码格式不正确", 'danger');
    }

    $scope.register = function() {
        debugger;
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
          //window.location.reload();
        });
      });
    }

    $scope.register = function() {
      $state.go('register', {}, {reload: true});
    }
});

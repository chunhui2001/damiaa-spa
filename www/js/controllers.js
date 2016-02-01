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



.controller('account-controller', function($scope, $state) {
    $scope.login = function() {      
      $state.go('login');
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

      function toolTip(message, type) {
        $scope.isDanger = type === 'danger';
        $scope.isInfo   = type === 'info';
        $scope.isError  = type === 'error';

        $scope.message = message;

        $timeout(function () {
          $scope.isDanger = false;
          $scope.isInfo = false;
          $scope.isError = false;
        }, 3000);
      }

      toolTip("手机号码格式不正确", 'danger');
    }
})



.controller('login-controller', function($scope, $state, $ionicPopup) {
    $scope.tabIndex   = 1;

    $scope.tabClick = function(tabIndex) {
      $scope.tabIndex = tabIndex;
    }

    $scope.login = function() {
      var alertPopup = $ionicPopup.alert({
         title: '登陆失败!',
         template: '用户名或密码错误， 请重新输入！'
       });
    }

    $scope.register = function() {
      $state.go('register');
    }
});

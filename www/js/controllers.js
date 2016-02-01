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



.controller('product-deatil-controller', function($scope, $state) {
  $scope.pid  = 10000;

  $scope.buy = function(pid){
    $state.go('order');
  }
})



.controller('order-controller', function($scope, $state) {

})



.controller('account-controller', function($scope, $state) {
    $scope.login = function() {      
      $state.go('login');
    }
})



.controller('register-controller', function($scope, $state) {
    
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

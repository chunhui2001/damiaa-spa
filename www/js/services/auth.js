angular.module('starter')
.factory('Auth',
  function($http, $rootScope, $cookieStore, $alert) {

  return {
    login: function(user, callback) {

      $http.post('/login', user)
        .success(function(data) {
          return callback(null, data);
        })
        .error(function(e) {
          return callback(e);
        });
    },
    loginSuccess: function(user, callback) {
      $cookieStore.put('user', user);
      $rootScope.currentUser = $cookieStore.get('user');

      if (!callback) return;

      callback();
    },
    logout: function(success, failed) {
      return $http.post('/logout', $cookieStore.get('user')).success(function(data) {
        $rootScope.currentUser  = null;
        $rootScope.userInfo     = null;

        $cookieStore.remove('user');
        $cookieStore.remove('userInfo');

        if (success) success();
      }).error(function(e) {
        if (failed) failed(e);
      });
    },
    islogin: function() {      
      $rootScope.currentUser = $cookieStore.get('user');
      return $rootScope.currentUser != null;
    },
    loginUser: function(success, failed) {

      $rootScope.currentUser  = $cookieStore.get('user');
      $rootScope.userInfo     = $cookieStore.get('userInfo');

      if ($rootScope.currentUser != null && $rootScope.userInfo != null) 
          return success($rootScope.userInfo);

      if ($rootScope.currentUser == null) {
          return success(null);
      }

      $http.post('/userinfo', $rootScope.currentUser)
        .success(function(data) {

            $cookieStore.put('userInfo', data.data);
            $rootScope.userInfo = $cookieStore.get('userInfo');

            if (success) return success(data.data);
        })
        .error(function(e) {
            if (failed) return failed(e);
        });
    }
  };
});
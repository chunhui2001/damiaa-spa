angular.module('starter')
.factory('Auth',
  function($http, $rootScope, $cookieStore, $window, $alert) {

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

      // var expireDate = new Date();
      // expireDate.setDate(expireDate.getDate() + 7);

      // $cookieStore.put('user', user, {'expires': expireDate});
      // $rootScope.currentUser = $cookieStore.get('user');

      $window.localStorage['user']  = angular.toJson(user);
      $rootScope.currentUser  = JSON.parse($window.localStorage['user']);

      if (!callback) return;

      callback();
    },
    logout: function(success, failed) {

      var user  = null;

      if ($window.localStorage['user']) {
        user  = JSON.parse($window.localStorage['user']);
      }

      return $http.post('/logout', user).success(function(data) {
        $rootScope.currentUser  = null;
        $rootScope.userInfo     = null;

        // $cookieStore.remove('user');
        // $cookieStore.remove('userInfo');

        $window.localStorage['user'] = null;
        $window.localStorage['userInfo'] = null;

        if (success) success();
      }).error(function(e) {
        if (failed) failed(e);
      });
    },
    islogin: function() {      
      // $rootScope.currentUser  = $cookieStore.get('user');

      $rootScope.currentUser  = null;

      if ($window.localStorage['user']) {
        $rootScope.currentUser  = JSON.parse($window.localStorage['user']);
      }

      return $rootScope.currentUser != null;
    },
    loginUser: function(success, failed) {

      // $rootScope.currentUser  = $cookieStore.get('user');
      // $rootScope.userInfo     = $cookieStore.get('userInfo');

      $rootScope.currentUser  = null;
      $rootScope.userInfo     = null;

      if ($window.localStorage['user']) {
        $rootScope.currentUser  = JSON.parse($window.localStorage['user']);
      }

      if ($window.localStorage['userInfo']) {
        $rootScope.userInfo  = JSON.parse($window.localStorage['userInfo']);
      }

      if ($rootScope.currentUser != null && $rootScope.userInfo != null) 
          return success($rootScope.userInfo);

      if ($rootScope.currentUser == null) {
          return success(null);
      }

      $http.post('/userinfo', $rootScope.currentUser)
        .success(function(data) {
            // var expireDate = new Date();
            // expireDate.setDate(expireDate.getDate() + 7);

            // $cookieStore.put('userInfo', data.data, {'expires': expireDate});
            // $rootScope.userInfo = $cookieStore.get('userInfo');

            $window.localStorage['userInfo']  = angular.toJson(data.data);
            $rootScope.userInfo                 = data.data;

            if (success) return success(data.data);
        })
        .error(function(e) {
            if (failed) return failed(e);
        });
    }, 
    resetPasswd: function(formData, success, failed) {
      var formDataObj   = {
          oldPwd: null,
          newPwd: null,
          userToken: null,
          tokenType: null
      };

      angular.extend(formDataObj, formData);

      $http.post('/resetpwd', formDataObj)
        .success(function(data) {
          if (data.error) {
            return failed(data);
          }

          return success();
        })
        .error(function(e) {
          return failed(e);
        });
    },
    register: function(formData, success, failed) {
      var formDataObj = {
          username: null,
          passwd: null,
          checkcode: null
      };

      angular.extend(formDataObj, formData);
      $http.post('/register', formDataObj)
        .success(function(data) {
          if (data.error) {
            return failed(data);
          }
          return success();
        })
        .error(function(e) {
          return failed(e);
        });
    },
    getPaySign: function(user, prepay_id, success, failed) {
        $http.post('/order/sign/' + prepay_id, {user: user})
          .success(function(result) {   
            if (result.error) {
              return failed(result);
            }
            return success(result.data);
          })
          .error(function(e) {
            return failed(e);
        });
    }
  };
});
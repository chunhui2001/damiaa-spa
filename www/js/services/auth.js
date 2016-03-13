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

      var expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + 7);

      $cookieStore.put('user', user, {'expires': expireDate});
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
      $rootScope.currentUser  = $cookieStore.get('user');
      //$rootScope.userInfo     = $cookieStore.get('userInfo');

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
            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 7);

            $cookieStore.put('userInfo', data.data, {'expires': expireDate});
            $rootScope.userInfo = $cookieStore.get('userInfo');

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
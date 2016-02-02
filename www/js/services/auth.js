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
    loginSuccess: function(data, callback) {
      $cookieStore.put('user', data);
      $rootScope.currentUser = $cookieStore.get('user');

      if (!callback) return;

      callback();
    },
    logout: function(success, failed) {
      return $http.post('/logout', $cookieStore.get('user')).success(function(data) {
        $rootScope.currentUser = null;
        $cookieStore.remove('user');

        if (success) success();
      }).error(function(e) {
        if (failed) failed();
      });
    },
    islogin: function() {      
      $rootScope.currentUser = $cookieStore.get('user');
      return $rootScope.currentUser != null;
    }//,
    // signup: function(user) {
    //   return $http.post('/api/signup', user)
    //     .success(function() {
    //       $location.path('/login');

    //       $alert({
    //         title: 'Congratulations!',
    //         content: 'Your account has been created.',
    //         placement: 'top-right',
    //         type: 'success',
    //         duration: 3
    //       });
    //     })
    //     .error(function(response) {
    //       $alert({
    //         title: 'Error!',
    //         content: response.data,
    //         placement: 'top-right',
    //         type: 'danger',
    //         duration: 3
    //       });
    //     });
    // },
    // logout: function() {
    //   return $http.get('/api/logout').success(function() {
    //     $rootScope.currentUser = null;
    //     $cookieStore.remove('user');
    //     $alert({
    //       content: 'You have been logged out.',
    //       placement: 'top-right',
    //       type: 'info',
    //       duration: 3
    //     });
    //   });
    // }
  };
});
angular.module('starter')
.factory('UserService',
  function($http, $rootScope, $cookieStore, $filter) {

  return {
    statistic: function(user, success, failed) {

      $http.post('/statistic', user)
        .success(function(result) {   
          return success(result.data);
        })
        .error(function(e) {
          return failed(e);
        });
    }

  };
});
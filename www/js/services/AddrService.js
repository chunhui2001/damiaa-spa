angular.module('starter')
.factory('AddrService',
  function($http, $rootScope) {

  return {
    list: function(user, success, failed) {
      $http.post('/addr/list', {user: user})
        .success(function(result) {
          if (result.error) {
            return failed(result);
          }
          return success(result.data);
        })
        .error(function(e) {
          return failed(e);
        });
    },
    setdefault: function(user, addrid, success, failed) {
      $http.post('/addr/set', {user: user, addrid:addrid})
        .success(function(result) {
          if (result.error) {
            return failed(result);
          }
          return success(result.data);
        })
        .error(function(e) {
          return failed(e);
        });
    },
  };
});
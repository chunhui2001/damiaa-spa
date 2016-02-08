angular.module('starter')
.factory('RegionService',
  function($http, $rootScope) {

  return {
    list: function(name, code, success, failed) {
      $http.get('/region/' + name + '/' + code)
        .success(function(result) {          
          return success(result);
        })
        .error(function(e) {
          return failed(e);
        });
    }
  };
});
angular.module('starter')
.factory('GoodsService',
  function($http, $rootScope, $cookieStore, $filter) {

  return {
    get: function(user, goodsid, success, failed) {
      $http.post('/goods/' + goodsid, {user: user})
        .success(function(result) {   
          return success(result.data);
        })
        .error(function(e) {
          return failed(e);
        });
    }
  };
});
angular.module('starter')
.factory('OrderService',
  function($http, $rootScope, $cookieStore, $filter) {

  return {
    setup: function(user, orderData, success, failed) {
      $http.post('/order/setup', {user: user, orderData: orderData})
        .success(function(result) {   
          return success(result.data);
        })
        .error(function(e) {
          return failed(e);
        });
    },
    detail: function(user, orderid, success, failed) {
      $http.post('/order/' + orderid, {user: user})
        .success(function(result) {   
          return success(result.data);
        })
        .error(function(e) {
          return failed(e);
        });
    },
    list: function(user, success, failed) {
      $http.post('/order', {user: user})
        .success(function(result) {   
          return success(result.data);
        })
        .error(function(e) {
          return failed(e);
        });
    }
  };
});
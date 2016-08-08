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
    updateAddress: function(user, addrid, orderId, success, failed) {
      $http.post('/addr/updateAddr', {user: user, addrid:addrid, orderId: orderId})
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
    del: function(user, addr, success, failed) {
      $http.post('/addr/' + addr.id + '/del', {user: user})
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
    add: function(user, addrObj, success, failed) {
      var addr  = {
        province: null,
        area: null,
        city: null,
        detail: null,
        street: '',
        linkMan: null,
        linkPone: null
      };


      angular.extend(addr, addrObj);
      $http.post('/addr/add', {user: user, addr:addr})
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
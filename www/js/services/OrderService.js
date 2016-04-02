angular.module('starter')
.factory('OrderService',
  function($http, $rootScope, $cookieStore, $filter) {

  return {
    setup: function(user, orderData, success, failed) {
      $http.post('/order/setup', {user: user, orderData: orderData})
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
    detail: function(user, orderid, success, failed) {
      $http.post('/order/' + orderid, {user: user})
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
    list: function(user, success, failed) {
      $http.post('/order', {user: user})
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
    listUserOrders: function(user, status, success, failed) {
      $http.post('/user-orders/' + status, {user: user})
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
    cancel: function(user, order, success, failed) {
      $http.post('/order/cancel/' + order.id, {user: user, action: 'updateStatus', status: 'CANCEL'})
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
    del: function(user, order, success, failed) {
      $http.post('/order/del/' + order.id, {user: user})
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
    flushOrder: function(user, params, success, failed) {
        $http.post('/order/flush/' + params.orderid, {user: user, postData: params})
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
    cancelSended: function(user, params, success, failed) {
        $http.post('/order/cancel-sended/' + params.userid + '/' + params.orderid, {user: user})
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
    orderEvents: function(user, orderid, success, failed) {
        $http.post('/order/' + orderid + '/events', {user: user})
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
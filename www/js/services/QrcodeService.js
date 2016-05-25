angular.module('starter')
.factory('QrcodeService',
  function($http) {

  return {
    random: function(user, success, failed) {
      $http.post('/qrcode/random', {user: user})
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
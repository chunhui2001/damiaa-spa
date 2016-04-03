angular.module('starter')
.factory('PartnerService',
  function($http) {

  return {
    saveParter: function(user, postData, success, failed) {
      $http.post('/partner', {user: user, partner: postData})
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
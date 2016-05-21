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
    },
    getPartner: function(user, partnerid, success, failed) {
        $http.post('/partner/' + partnerid, {user: user})
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
    updateParter: function(user, partner, success, failed) {
        $http.put('/partner/' + partner.id, {user: user, partner: partner})
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
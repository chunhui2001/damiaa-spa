angular.module('starter')
.factory('WChatService',
  function($http) {

  return {
    getWxUserInfo: function(wxOpenIDCode, wxOpenIDStateCode, success, failed) {
      $http.get('/wxuserinfo/'+wxOpenIDCode+'/' + wxOpenIDStateCode)
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
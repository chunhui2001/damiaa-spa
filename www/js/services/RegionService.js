angular.module('starter')
.factory('RegionService',
  function($http, $rootScope, $cookieStore, $filter) {

  return {
    list: function(name, code, success, failed) {
      // var cookieKey   = name + '-' + code;

      // if($cookieStore.get(cookieKey) != null && $cookieStore.get(cookieKey).length > 0) {
      //   return success($cookieStore.get(cookieKey));
      // }

      $http.get('/region/' + name + '/' + code)
        .success(function(result) {   

          //$cookieStore.put(cookieKey, result);  

          return success(result);
        })
        .error(function(e) {
          return failed(e);
        });
    },

    getRegionNameByCode: function(name, code, success) {
        var cookieKey   = name + '-' + code;
        var regionList  = $cookieStore.get(cookieKey);

        return success($filter('filter')(regionList, function (prov) {return prov.code === code;})[0].name);
    }

  };
});
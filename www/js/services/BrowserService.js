angular.module('starter')
.factory('Browser',
  function($window) {

  return {
    detect: function() {

      var userAgent = $window.navigator.userAgent;

      var browsers = {
          chrome: /chrome/i, 
          safari: /safari/i, 
          firefox: /firefox/i, 
          ie: /internet explorer/i,
          mobile: /mobile/i
      };

      for(var key in browsers) {
        if (browsers[key].test(userAgent)) {
            return key;
        }
      };

       return 'unknown';
    }

  };
});
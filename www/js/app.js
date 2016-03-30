// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var starter = angular.module('starter', ['ionic', 'ngCookies', 'ngMessages', 'mgcrea.ngStrap', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(0);
  //$ionicConfigProvider.backButton.text('').icon('ion-ios7-arrow-left');
  //$ionicConfigProvider.backButton.previousTitleText(false);
  $ionicConfigProvider.backButton.text('').icon('ion-chevron-left').previousTitleText(false);

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('home', {
    url: '/home',
    views: {
      'home': {
        templateUrl: 'views/product-deatil.html',
        controller: 'product-deatil-controller'
      }
    }
  })


  .state('order', {
    url: '/order/:gid',
    views: {
      'order': {
        templateUrl: 'views/order.html',
        controller: 'order-controller'
      }
    }
  })

  
  .state('payment', {
    url: '/payment/:oid',
    views: {
      'payment': {
        templateUrl: 'views/payment.html',
        controller: 'payment-controller'
      }
    }
  })

  
  .state('paymentComplete', {
    url: '/pay-complete/:oid',
    views: {
      'paymentComplete': {
        templateUrl: 'views/pay-complete.html',
        controller: 'paymentComplete-controller'
      }
    }
  })


  .state('account', {
    url: '/account',
    views: {
      'account': {
        templateUrl: 'views/account.html',
        controller: 'account-controller'
      }
    }
  })


  .state('accountOrders', {
    url: '/account-orders',
    views: {
      'accountOrders': {
        templateUrl: 'views/account-orders.html',
        controller: 'account-orders-controller'
      }
    }
  })


  .state('account-orders', {
    url: 'account/orders',
    views: {
      'account': {
        templateUrl: 'views/account-orders.html',
        controller: 'account-orders-controller'
      }
    }
  })


  .state('account-uorders', {
    url: 'account/uorders',
    views: {
      'account': {
        templateUrl: 'views/account-uorders.html',
        controller: 'account-uorders-controller'
      }
    }
  })


  .state('account-addr', {
    url: 'account/addr',
    views: {
      'account': {
        templateUrl: 'views/account-addr.html',
        controller: 'account-addr-controller'
      }
    }
  })


  .state('login', {
    url: '/login/:b',
    views: {
      'login': {
        templateUrl: 'views/login.html',
        controller: 'login-controller'//,        
        //params: ['b']
      }
    }
  })


  .state('register', {
    url: '/register',
    views: {
      'register': {
        templateUrl: 'views/register.html',
        controller: 'register-controller'
      }
    }
  })

  .state('resetpwd', {
    url: '/resetpwd',
    views: {
      'resetpwd': {
        templateUrl: 'views/resetpwd.html',
        controller: 'resetpwd-controller'
      }
    }
  })

  // .state('product', {
  //   url: '/product',
  //   views: {
  //     'product': {
  //       templateUrl: 'views/product-deatil.html',
  //       controller: 'product-deatil-controller'
  //     }
  //   }
  // })
  // .state('tab.chat-detail', {
  //   url: '/chats/:chatId',
  //   views: {
  //     'tab-chats': {
  //       templateUrl: 'views/order.html',
  //       controller: 'order-controller'
  //     }
  //   }
  // })



  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home');

});




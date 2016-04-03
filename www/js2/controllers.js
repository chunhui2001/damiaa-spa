angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})



.controller('product-deatil-controller', function($scope, $state, $ionicViewSwitcher, Auth) {
  $scope.pid  = 10000;

  $scope.buy = function(pid){

    // if (!Auth.islogin()) {
    //   $state.go('login', {'b':'home'}, {reload: true});
    //   return;
    // }

    $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
    $state.go('order', {'gid': '941174731905'}); // '305657400791', '941174731905'
  }
})



.controller('order-controller', function($scope, $rootScope, $state, $location, $timeout
    , $stateParams, $ionicViewSwitcher
    , Auth, OrderService, GoodsService, AddrService) {

    $scope.countSelectedVal     = 1;
    $scope.deliverySingleCosts  = 5.00;
    $scope.marketPrice          = false;
    $scope.unitPrice            = false;
    $scope.isSpecial            = false;
    $scope.orderAddr            = false;
    $scope.orderAddrText        = '';
    $scope.nowrapNormal         = false;

    $scope.inProgress1          = true;
    $scope.inProgress2          = true;
    $scope.inProgress3          = false;

    var goodsId   = $stateParams.gid;

    if (!Auth.islogin()) {
      $state.go('login', {'b':'order/' + goodsId}, {reload: true});
      return;
    }

    $scope.currentGoods  = {};


    var currentUser   = $rootScope.currentUser;




    GoodsService.get(currentUser, goodsId, function(result) {
      $scope.inProgress1          = false;
      $scope.currentGoods         = result.goods;

      if (result.specialPrice) {
        $scope.unitPrice            = result.specialPrice;
        $scope.isSpecial            = true;
      } else {
        $scope.unitPrice            = result.goods.marketPrice;
      }


      $scope.marketPrice          = result.goods.marketPrice;

      $scope.totalPrice         = calculatePrice($scope.countSelectedVal, $scope.unitPrice);
      $scope.totalDeliveryCosts = calculateDeliveryPrice($scope.countSelectedVal, $scope.deliverySingleCosts);
      $scope.orderPrice         = (parseFloat($scope.totalPrice) + parseFloat($scope.totalDeliveryCosts)).toFixed(2);
    }, function(error) {
      
    });

    AddrService.list(currentUser, function(result) {
      $scope.inProgress2          = false;

      if (result.length == 1) {
        $scope.orderAddr = result[0];
      } 

      if (result.length == 0) {
        return;
      } else if (result.length == 1) {
        $scope.orderAddr = result[0];
      } else {
        angular.forEach(result, function(value) {
          if (value.defaults) $scope.orderAddr = value;
        });
      }

      $scope.orderAddrText  = //value.province.split('(')[0] +
                              " " + $scope.orderAddr.linkMan
                              + " " + $scope.orderAddr.linkPone
                              + " " + $scope.orderAddr.city.split('(')[0] 
                              + " " + $scope.orderAddr.area.split('(')[0] 
                              + " " + $scope.orderAddr.detail.split('(')[0] ;
    }, function(error) {

    });

    

    $scope.backToProductDetailPage = function() {
      $ionicViewSwitcher.nextDirection('back'); // 'forward', 'back', etc.
      $state.go('home');
    }

    function calculatePrice(count, unitPrice) {
      return (unitPrice * count).toFixed(2);
    }

    function calculateDeliveryPrice(count, singlePrice) {
      return count >=3 ? (0).toFixed(2) : (count + singlePrice - 1).toFixed(2);
    }

    $scope.countChange  = function(countVal) {
      $scope.countSelectedVal  = parseInt(countVal);
      $scope.totalPrice         = calculatePrice($scope.countSelectedVal, $scope.unitPrice);
      $scope.totalDeliveryCosts = calculateDeliveryPrice($scope.countSelectedVal, $scope.deliverySingleCosts);
      $scope.orderPrice         = (parseFloat($scope.totalPrice) + parseFloat($scope.totalDeliveryCosts)).toFixed(2);

    }

    $scope.setupOrder = function() {
      $scope.inProgress3          = true;

      if (!$scope.orderAddr) {
        toolTip($scope, $timeout, "请添加收货地址", 'danger');
        return;
      }

      var buyCount  = $scope.countSelectedVal;
      var orderData   = {
          paymethod : '1',
          addrid    : $scope.orderAddr.id
      };

      orderData[goodsId]  = buyCount;

      OrderService.setup(currentUser, orderData, function(result) {
        $scope.inProgress3          = false;
        // success
        // forward to payment page
        $state.go('payment', {'oid': result.id});
      }, function(error) {
        
      });
    }

    $scope.showAddrDetail = function() {
      $scope.nowrapNormal = !$scope.nowrapNormal;
    }

    $scope.changeAddress = function() {
      $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
        $state.go('account-addr', {}, {reload: true});
    }
})



.controller('paymentComplete-controller', function(
    $scope, $rootScope, $state, $stateParams, $ionicViewSwitcher
    , $interval, $timeout, Auth, OrderService) {

    // 在新页面中:
    // 需调用api确认支付状态, 提示用户 "正在等待微信返回支付状态"
    // 2 秒后, 每 1 秒中调一次 api， 连调 15 次, 
    // 如果 15 次后都没有查到结果, 则提示用户不要再次支付、不要尝试刷新页面、请到历史订单页面查看支付状态, 或联系客服人员

    var oid         = $stateParams.oid;
    var inProgress  = false;

    $scope.maxTryCount      = 25;
    $scope.currentTryCount  = 25;
    $scope.currentOrder     = {};
    $scope.paySuccess       = false;
    //$scope.isFailed         = false;  // 暂时不关注失败状态
    $scope.unKnow           = false;
    $scope.isComplete       = false;
    $scope.titleText        = '等待返回支付结果';


    if (!oid) return;

    if (!Auth.islogin()) {
      $state.go('login', {'b':'payment/' + oid}, {reload: true});
      return;
    }

    var currentUser   = $rootScope.currentUser;



    var currentIntervalId = $interval(function () {
        if ($scope.paySuccess || $scope.currentTryCount <= 0) { // || $scope.isFailed) {

            if ($scope.paySuccess) {
                $scope.isComplete   = true;
                $scope.titleText    = '支付成功';
            } else {
                // 25 秒以后还没有成功或失败的话，说明微信还没有返回支付状态
                $scope.unKnow       = !$scope.paySuccess;// && $scope.isFailed;
                $scope.titleText    = '支付状态未知';
                $scope.isComplete   = true;
            }

            $interval.cancel(currentIntervalId);
        }

        $scope.currentTryCount  = $scope.currentTryCount - 1;

        if ($scope.currentTryCount < ($scope.maxTryCount - 2) && $scope.currentTryCount % 3 == 0 && !inProgress) {
            inProgress = true;

            OrderService.detail(currentUser, oid, function(result) {

                inProgress  = false;

                $scope.currentOrder   = result.order;
                $scope.paySuccess     = result.order.status == 'CASHED';
                //$scope.isFailed       = true;
                //$scope.paySuccess = true;
                if ($scope.paySuccess) {
                    $scope.isComplete   = true;
                }
            }, function(error) {
              
            });

        }
    }, 1000);


    

    $scope.orderList = function() {        
        // $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
        // $state.go('account-orders', {}, {reload: true});
        $location.path('/account-orders' + oid);
    }
})



.controller('payment-controller', function(
    $scope, $rootScope, $state, $stateParams, $ionicViewSwitcher, $location, $window, Auth, OrderService) {

    // $state.go('paymentComplete', {'oid': '941174731905'});
    var oid       = $stateParams.oid;
    var prePayId  = false;

    if (!oid) return;

    if (!Auth.islogin()) {
      $state.go('login', {'b':'payment/' + oid}, {reload: true});
      return;
    }


    var currentUser   = $rootScope.currentUser;
    

    $scope.currentOrder   = {};
    $scope.orderItems     = {};
    $scope.inProgress     = true;
    $scope.inProgress2    = false;


    OrderService.detail(currentUser, oid, function(result) {
      $scope.inProgress   = false;
      $scope.currentOrder = result.order;
      $scope.orderItems   = result.orderItems;

      prePayId  = result.order.prePayId;
    }, function(error) {
      
    });

    $scope.onPaymentClick = function() {
      //http://damiaa.com/pay/8555074241827141919/bearer/3d4694c2-8a51-4aa9-a4a9-dd956e5b0b8b
      $window.location.href = 'http://damiaa.com/pay/' 
                      + oid + '-' + currentUser.tokenType + '-' + currentUser.value;
      return;
    }

    // function onBridgeReady(){
    //    $scope.inProgress2    = true;

    //    Auth.getPaySign(currentUser, $scope.currentOrder.prePayId, function(result){
    //         if (result['package'].substring(result['package'].indexOf('=') + 1) != $scope.currentOrder.prePayId) {
    //           $scope.inProgress2    = false;
    //           alert('支付订单号不匹配，非法请求！');
    //           return;
    //         }
 
    //         WeixinJSBridge.invoke(
    //            'getBrandWCPayRequest', {
    //                "appId" : result.appId,     //公众号名称，由商户传入     
    //                "timeStamp" : result.timeStamp,         //时间戳，自1970年以来的秒数     
    //                "nonceStr" : result.nonceStr, //随机串     
    //                "package" : result['package'],     
    //                "signType" : result.signType,         //微信签名方式：     
    //                "paySign" : result.paySign //微信签名 
    //            },
    //            function(res){   
    //                $scope.inProgress2    = false;
    //                // 支付完成
    //                if(res.err_msg == "get_brand_wcpay_request:ok" ) {
    //                   $state.go('paymentComplete', {'oid': oid});
    //                   // 在新页面中:
    //                   // 需调用api确认支付状态, 提示用户 "正在等待微信返回支付状态"
    //                   // 2 秒后, 每 1 秒中调一次 api， 连调 15 次, 
    //                   // 如果 15 次后都没有查到结果, 则提示用户不要再次支付、不要尝试刷新页面、请到历史订单页面查看支付状态, 或联系客服人员
    //                } else {
    //                   $scope.inProgress2    = false;
    //                   //alert(res.err_msg);
    //                }

    //                //alert(res.err_msg);
    //            }
    //        ); 

    //    }, function(err) {
    //       $scope.inProgress2    = false;
    //       alert('错误，请联系管理员!');
    //    });

    // }
})



.controller('account-controller', function($scope, $rootScope, $state, $ionicViewSwitcher, Auth, UserService) {
    $scope.logedin  = Auth.islogin();
    $scope.logout   = Auth.logout;

    $scope.inProgress1  = false;
    $scope.inProgress2  = false;

    if ($scope.logedin) {
        $scope.inProgress1  = true;
        $scope.inProgress2  = true;

        Auth.loginUser( function(userInfo) {
          $scope.inProgress1  = false;
          $scope.loginUser    = userInfo;
        }, function(error) {

        });

        UserService.statistic($rootScope.currentUser, function(result) {
            $scope.inProgress2  = false;
            $scope.loginUserStatistic = {};
            angular.extend($scope.loginUserStatistic, result);
        }, function(error) {

        });
    } else {
        $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
        $state.go('login');
    }

    $scope.login = function() {      
      $state.go('login');
    }

    $scope.resetpwd = function() {
        $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
        $state.go('resetpwd', {}, {reload: true});
    }

    $scope.logoutSuccess = function() {
        $scope.logedin = false;
        $state.go('home', {}, {reload: true});
    }

    $scope.addrList = function() {        
        $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
        $state.go('account-addr', {}, {reload: true});
    }

    $scope.orderList = function() {        
        $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
        $state.go('account-orders', {}, {reload: true});
    }

    $scope.userOrders = function() {        
        $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
        $state.go('account-uorders', {}, {reload: true});
    }

    $scope.fansList   = function() {
        $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
        $state.go('account-fans', {}, {reload: true});
    }
})



.controller('account-fans-controller', function(
    $scope, $rootScope, $state, $ionicModal, $ionicViewSwitcher
    , Auth, UserService, PartnerService) {

    $scope.logedin  = Auth.islogin();
    $scope.logout   = Auth.logout;
    $scope.fansList = Auth.logout;
    $scope.defaultType  = 'CANGMAI';
    $scope.currentFans  = null;
    $scope.originFans   = null;


    if (!$scope.logedin) {
      return;
    }

    UserService.fansList($rootScope.currentUser, function(result) {
        $scope.fansList = result;
    }, function(error) {

    });

    $scope.selectChange = function(type) {
        $scope.currentFans.partnerType = type;
    }

    $scope.showModel  = function(fans) {
        $scope.originFans   = fans;
        $scope.currentFans  = angular.copy(fans);
        if (!$scope.currentFans.partnerType) $scope.currentFans.partnerType = $scope.defaultType;
        $scope.modal.show();
    }

    $scope.closeModal  = function() {
        $scope.modal.hide();
    }

    $scope.saveModal  = function() {
        var thePartner   = $scope.currentFans;
        if (!thePartner.partnerType) thePartner.partnerType = $scope.defaultType;

        PartnerService.saveParter($rootScope.currentUser, thePartner, function(result) {
            $scope.originFans.partnerType   = result.type;
            $scope.modal.hide();   
        }, function(error) {

        });   
    }

    $scope.showPartnerDetail = function(partner) {
      alert(partner.openid);
    }

    $scope.delPartner   = function(partner) {
      alert(partner.openid);
    }


    $ionicModal.fromTemplateUrl('modals/fans-form-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
})



.controller('resetpwd-controller', function($scope, $rootScope, $state, $timeout, $ionicViewSwitcher, Auth) {

    if (!Auth.islogin()) {
      $state.go('login', {'b':'resetpwd'}, {reload: true});
      return;
    }

    var currentUser   = $rootScope.currentUser;

    $scope.resetPwdM = {};

    $scope.backToAccountPage = function() {
        $ionicViewSwitcher.nextDirection('back'); // 'forward', 'back', etc.
        $state.go('account');
    }

    $scope.resetpwd = function() {
        if ($scope.resetPwdM.oldPwd === undefined || $scope.resetPwdM.oldPwd === '') {
          toolTip($scope, $timeout, "请输入原始密码", 'danger');
          return;
        }

        if ($scope.resetPwdM.newPwd === undefined || $scope.resetPwdM.newPwd === ''
            || ($scope.resetPwdM.newPwd && ($scope.resetPwdM.newPwd.length < 6 || $scope.resetPwdM.newPwd.length > 16))) {
          toolTip($scope, $timeout, "请输入新密码, 且新密码长度6-16位, 首尾不能有空格！", 'danger');
          return;
        }

        if ($scope.resetPwdM.newPwd != $scope.resetPwdM.newPwdAgain) {
          toolTip($scope, $timeout, "两次输入的新密码不一致，请重新输入新密码!", 'danger');
          return;
        }

        Auth.resetPasswd(
              {
                oldPwd: $scope.resetPwdM.oldPwd, 
                newPwd: $scope.resetPwdM.newPwd,
                userToken: currentUser.value,
                tokenType: currentUser.tokenType
              }
              ,function(result) {
                toolTip($scope, $timeout, "修改成功.", 'info');
                return;
              }, function(e) {
                debugger;
                toolTip($scope, $timeout, e.message, 'danger');
                return;
              }
        );
    }
})



.controller('register-controller', function($scope, $state, $timeout, $state
                                            , $ionicViewSwitcher, $location
                                            , Auth, WChatService) {
    $scope.r    = 1;
    $scope.regM = {};
    $scope.uploading  = false;
    $scope.regSuccess = false;

    $scope.wxOpenIDCode       = $location.search().code;
    $scope.wxOpenIDStateCode  = $location.search().state;
    $scope.wxUserInfo         = false;

    if ($scope.wxOpenIDCode && $scope.wxOpenIDStateCode) {
        WChatService.getWxUserInfo($scope.wxOpenIDCode, $scope.wxOpenIDStateCode, function(result) {
            $scope.wxUserInfo = result;
        }, function(err) {
          
        });
    }

    $scope.refreshCode = function() {
        $scope.r = $scope.r + 1;
    }

    // $scope.sendSMS = function() {
    //   if (!$scope.regM.checkcode) return;

    //   toolTip($scope, $timeout, "手机号码格式不正确", 'danger');
    // }

    $scope.register = function() {

        if (!$scope.wxUserInfo) {
          return;
        }

        var username      = $scope.regM.username;
        var passwd        = $scope.regM.passwd;
        var checkcode     = $scope.regM.checkcode;

        var username_reg  = /^([A-Za-z0-9_\-\.\@]){6,16}$/;

        if(typeof(username) == 'undefined' || username_reg.test(username) == false) {          
          toolTip($scope, $timeout, "用户名不符合规范!(6-16位! 仅限: a-z A-Z 0-9 @ - _ .)", 'danger');
          return;
        }

        if(typeof(passwd) == 'undefined' || (passwd.trim().length < 6 || passwd.trim().length > 16)) {          
          toolTip($scope, $timeout, "密码输入有误!(6-16位,首尾不含空格!)", 'danger');
          return;
        }

        if(typeof(checkcode) == 'undefined' || checkcode.toString().trim().length != 6) {          
          toolTip($scope, $timeout, "验证码输入有误!", 'danger');
          return;
        }

        Auth.register({
          username: username,
          passwd: passwd,
          checkcode: checkcode,
          openid: $scope.wxUserInfo.openid,
          unionid: $scope.wxUserInfo.unionid,
          headimgurl: $scope.wxUserInfo.headimgurl
        }, function(result){
            $scope.regSuccess = true;
            //toolTip($scope, $timeout, "恭喜你, 注册成功! 现在去登陆吧.", 'info');
        }, function(error) {
            toolTip($scope, $timeout, error.message, 'danger');
        });
    }

    $scope.goToLoginPage = function() {
        $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
        $state.go('login', {}, {reload: true});
    }
})



.controller('login-controller', function($scope, $stateParams, $rootScope, $ionicViewSwitcher, $state, $location, $ionicPopup, $timeout, Auth) {

    if (Auth.islogin()) {
        $state.go('account', {}, {reload: true});
        return;
    }


    $scope.b          = $stateParams.b;
    $scope.tabIndex   = 1;
    $scope.logM       = {};
    $scope.inProgress   = false;

    $scope.tabClick = function(tabIndex) {
      $scope.tabIndex = tabIndex;
    }

    $scope.login = function() {

      if (!$scope.logM.username || !$scope.logM.passwd) {
        toolTip($scope, $timeout, "请输入用户名和密码!", 'danger');
          return;
      }

      $scope.inProgress = true;

      Auth.login({username: $scope.logM.username, passwd: $scope.logM.passwd}, function(error, result) {
        $scope.inProgress   = false;

        if (result.error) {
          toolTip($scope, $timeout, result.message, 'danger');
          return;
        }

        Auth.loginSuccess(result.data, function() {
          $ionicViewSwitcher.nextDirection('forward'); // 'forward', 'back', etc.
          //$state.go($scope.b ? $scope.b : 'account', {}, {reload: true});

          $location.path('/' + $scope.b ? $scope.b : 'account');
        });
      });
    }

    $scope.register = function() {
      //https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbfbeee15bbe621e6&redirect_uri=http%3A%2F%2Fwww.damiaa.com%2Fregister
      $state.go('register', {}, {reload: true});

      //$location.path('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbfbeee15bbe621e6&redirect_uri=http%3A%2F%2Fwww.damiaa.com%2Fregister&response_type=code&scope=snsapi_base&state=asdfsfsd#wechat_redirect');
    }
})

.controller('account-uorders-controller', function(
      $scope, $rootScope, $ionicViewSwitcher, $state
      , $timeout, $filter, $location, $ionicModal
      , Auth, OrderService) {

    if (!Auth.islogin()) {
        $state.go('login', {'b':'account-orders'});
      return;
    }

    var currentUser         = $rootScope.currentUser;

    $scope.userOrderList    = [];
    $scope.inProgress       = true;
    $scope.deliveryM        = { selectedItem: 'YOUZHENG', deliveryNo: null, currentOrderId: null, userid: null, openid: null };
    $scope.currentOrder     = null;
    $scope.orderEvents      = null;



    $scope.showModel  = function(order) {
      $scope.currentOrder               = order;
      $scope.deliveryM.userid           = order.userId;
      $scope.deliveryM.openid           = order.openId;
      $scope.deliveryM.currentOrderId   = order.id;
      $scope.deliveryM.deliveryNo       = null;
      $scope.modal.show();
    }

    $scope.closeModal  = function(orderid) {
      $scope.modal.hide();
    }

    $scope.saveModal  = function() {

        if (!$scope.deliveryM.deliveryNo) {
          return;
        }

        var deliveryCompany   = $scope.deliveryM.selectedItem;
        var deliveryNo        = $scope.deliveryM.deliveryNo;
        var orderid           = $scope.deliveryM.currentOrderId;
        var userid            = $scope.deliveryM.userid;
        var openid            = $scope.deliveryM.openid;

        OrderService.flushOrder(currentUser
              , { deliveryCompany:deliveryCompany, deliveryNo: deliveryNo, orderid: orderid, userid:userid, openid:openid }
              , function(result) {
                
            angular.extend($scope.currentOrder, result);

            $scope.modal.hide();

        }, function(error) {

        });        
    }

    $scope.deliveryChange   = function(deliverySelectedItem) {
        $scope.deliveryM.selectedItem = deliverySelectedItem;
    }

    $scope.cancelSended     = function(order) {
        var orderid     = order.id;
        var userid      = order.userId;

        OrderService.cancelSended(currentUser, {
            orderid:orderid, userid:userid
        }, function(result){
            angular.extend(order, result);
        }, function(err){
            debugger;
        });
    }

    OrderService.listUserOrders(currentUser, 'CASHED,SENDED', function(result) {
        $scope.inProgress       = false;
        $scope.userOrderList    = result;
    }, function(error) {

    });


    $ionicModal.fromTemplateUrl('modals/my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });




    $scope.showEvents  = function(order) {
      order.inProgress2 = true;

      OrderService.orderEvents(currentUser, order.id, function(result) {
          $scope.currentOrder   = order;
          $scope.orderEvents    = result;
          order.inProgress2     = false;
          
          $scope.orderEventsModal.show();
      }, function(error) {

      });
    }

    $scope.closeModal  = function(orderid) {
      $scope.modal.hide();
      $scope.orderEventsModal.hide();
    }

    $ionicModal.fromTemplateUrl('modals/order-events-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.orderEventsModal = modal;
    });
})

.controller('account-orders-controller', function(
      $scope, $rootScope, $ionicViewSwitcher, $state
      , $ionicPopup, $ionicModal, $timeout, $filter, $location
      , Auth, OrderService) {

    if (!Auth.islogin()) {
        $state.go('login', {'b':'account-orders'});
      return;
    }

    var currentUser         = $rootScope.currentUser;

    $scope.userOrderList    = [];
    $scope.inProgress       = true;
    $scope.currentOrder     = null;
    $scope.orderEvents      = null;

    OrderService.list(currentUser, function(result) {
      $scope.inProgress       = false;
      $scope.userOrderList    = result;
    }, function(error) {

    });

    $scope.goPay = function(oid) {
      $location.path('/payment/' + oid);
    }

    $scope.doCancel = function(order) {
      OrderService.cancel(currentUser, order, function(result) {   
        angular.extend(order, result);
        order.statusText = '已取消';
      }, function(error) {

      });
    }

    $scope.doDel = function(order) {
      OrderService.del(currentUser, order, function(result) {
        angular.extend(order, result);
        $scope.userOrderList.splice($scope.userOrderList.indexOf(order),1);
      }, function(error) {

      });
    }

    $scope.showEvents  = function(order) {
      order.inProgress2 = true;

      OrderService.orderEvents(currentUser, order.id, function(result) {
          $scope.currentOrder   = order;
          $scope.orderEvents    = result;
          order.inProgress2    = false;

          $scope.orderEventsModal.show();

      }, function(error) {

      });
    }

    $scope.closeModal  = function(orderid) {
      $scope.orderEventsModal.hide();
    }

    $ionicModal.fromTemplateUrl('modals/order-events-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.orderEventsModal = modal;
    });

})


.controller('account-addr-controller', function(
      $scope, $rootScope, $ionicViewSwitcher, $state, $ionicPopup, $timeout, $filter
      , Auth, AddrService, RegionService) {

    $scope.userAddrList   = [];
    $scope.isNewAddr      = false;
    $scope.inProgress     = true;

    if (!Auth.islogin()) {
        $state.go('login', {'b':'account-addr'});
      return;
    }

    var currentUser   = $rootScope.currentUser;

    AddrService.list(currentUser, function(data) {
      $scope.inProgress     = false;
      $scope.userAddrList   = data;
    }, function(error) {
      if (error.data == '4000') {
        $state.go('login', {'b':'account-addr'});
        return;
      }
    });


    $scope.setDefault = function(addr_id) {

      var currentAddrEntry  = $filter('filter')($scope.userAddrList, function (d) {return d.id === addr_id;})[0];

      if (currentAddrEntry.defaults) return;

      AddrService.setdefault(currentUser, addr_id, function(data) {

          angular.forEach($scope.userAddrList, function(value, key) {
            value.defaults = false;
          });

          currentAddrEntry.defaults = true;
      }, function(error) {
        
      });
    }

    $scope.province   = [];
    $scope.cities     = [];
    $scope.area       = [];

    $scope.provinceCode   = '-1';    
    $scope.cityCode       = '-1';   
    $scope.areaCode       = '-1';

    $scope.provinceDefaultSelectedCode  = '-1';
    $scope.cityDefaultSelectedCode      = '-1';
    $scope.areaDefaultSelectedCode      = '-1';

    $scope.provinceDefaultSelectedItem = {"id":"-1","code":"-1","name":"省"};
    $scope.cityDefaultSelectedItem     = {"id":"-1","code":"-1","name":"市"};
    $scope.areaDefaultSelectedItem     = {"id":"-1","code":"-1","name":"区"};

    $scope.addrM    = {};


    RegionService.list('province', '-1', function(result) {
        $scope.province = result;//[$scope.provinceDefaultSelectedItem].concat(result);
    });

    RegionService.list('city', $scope.provinceCode, function(result) {
        $scope.cities = result;//[$scope.cityDefaultSelectedItem].concat(result);
    });

    RegionService.list('area', $scope.cityCode , function(result) {
        $scope.area = result;//[$scope.areaDefaultSelectedItem].concat(result);
    });

    
    $scope.regionChange = function(selectedItemVal, name) {
      if (name == 'province') {
        $scope.provinceCode = selectedItemVal;

        RegionService.list('city', selectedItemVal, function(result) {
          $scope.cities = result;//[$scope.cityDefaultSelectedItem].concat(result);
        });

        $scope.cityCode = '-1';
        $scope.areaCode = '-1';
      }

      if (name == 'city') {
        $scope.cityCode = selectedItemVal;
        $scope.areaCode = '-1';
      }

      if (name != 'area') {
        RegionService.list('area', selectedItemVal , function(result) {
          $scope.area = result;//[$scope.areaDefaultSelectedItem].concat(result);
        });
      } else {        
        $scope.areaCode = selectedItemVal;
      }

    }

    $scope.onDeleteAddr = function(addr) {

      if (addr.defaults) {
        toolTip($scope, $timeout, '默认地址无法删除！', 'danger');
        return;
      }

      AddrService.del(currentUser, addr, function(affectRowCount) {
        if (affectRowCount > 0) {
          // $scope.userAddrList.splice($scope.userAddrList.indexOf(addr), 1);
          // $scope.userAddrList = $filter('filter')($scope.userAddrList, {id: addr.id})
          $scope.userAddrList = $scope.userAddrList.filter(function(item) {
              return item.id !== addr.id;
          });
        }
      }, function(error) {
        
      });
    }

    $scope.add_addr = function () {
        $scope.isNewAddr = !$scope.isNewAddr;
    }

    $scope.save_addr = function () {
        $scope.isLinkManErr   = false;
        $scope.isLinkPhoneErr   = false;

        $scope.isProvErr   = false;
        $scope.isCityErr   = false;
        $scope.isAreaErr   = false;

        $scope.isDetailErr   = false;

        if (!$scope.addrM.linkMan || $scope.addrM.linkMan.length == 0 || !$scope.addrM.linkPhone || $scope.addrM.linkPhone.length == 0) {

          $scope.isLinkManErr   = !$scope.addrM.linkMan || $scope.addrM.linkMan.length == 0;
          $scope.isLinkPhoneErr = !$scope.addrM.linkPhone || $scope.addrM.linkPhone.length == 0;

          toolTip($scope, $timeout, '请输入"收货人姓名"和"联系电话"', 'danger');
          return;
        }

        if ($scope.provinceCode == '-1' || $scope.cityCode == '-1' || $scope.areaCode == '-1') {

          $scope.isProvErr = $scope.provinceCode == '-1';
          $scope.isCityErr = $scope.cityCode == '-1';
          $scope.isAreaErr = $scope.areaCode == '-1';

          toolTip($scope, $timeout, '请选择 “省、市、区”', 'danger');
          return;
        }

        if (!$scope.addrM.detail || $scope.addrM.detail.length == 0) {

          $scope.isDetailErr   = !$scope.addrM.detail || $scope.addrM.detail.length == 0;

          toolTip($scope, $timeout, '请输入"详细地址"', 'danger');
          return;
        }

        var currentAddr   = {
            "area": $scope.areaCode, 
            "city": $scope.cityCode,  
            "detail": $scope.addrM.detail, 
            "province": $scope.provinceCode,  
            "linkMan": $scope.addrM.linkMan, 
            "linkPone": $scope.addrM.linkPhone
          };

        AddrService.add(currentUser, currentAddr, function(newAddr) {
          // add the newest addr object to current list of address
          //$scope.userAddrList
          $scope.userAddrList = [newAddr].concat($scope.userAddrList);

          $scope.isNewAddr = false;
        }, function(error) {
          
        });
    }
});

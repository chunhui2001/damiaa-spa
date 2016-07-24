var URL 		= require('url');
var _ 			= require("underscore");
var _s 			= require("underscore.string");


var httpClient 		= require('../common/http-client').httpClient;
var endpoints 		= require('../common/endpoints');
var endpoints_wx 	= require('../common/endpoints-wx');



var province 	= require('../json-data/region/province.json');
var city 		= require('../json-data/region/city.json');
var area 		= require('../json-data/region/area.json');



function updateOrder(params, user, callback) {
	var userToken 		= user.value;
	var tokenType 		= user.tokenType;

	var orderid 		= params.orderid;

    var endpoints_order_detail 	= URL.parse(endpoints.order_detail.replace("{{{orderid}}}", orderid));

    var reqBody 	= params;


    httpClient(endpoints_order_detail, reqBody, 'put', {type: tokenType, token: userToken}, function(error, result) {

		return callback(error, result);
	});
}



module.exports 	= { 
	setup: function (req, res, next) {		
		var userToken 		= req.body.user.value;
		var tokenType 		= req.body.user.tokenType;

		var orderData 		= req.body.orderData;


	    var sendResult  				= {error: false, message: null, data: null};
	    var sendResult2  				= {error: false, message: null, data: null};	
	    var sendResult3  				= {error: false, message: null, data: null};		

		var endpoints_order_setup 		= URL.parse(endpoints.order_setup);    
		var endpoints_unified_order 	= URL.parse(endpoints_wx.unified_order);


		httpClient(endpoints_order_setup, orderData, 'post', {type: tokenType, token: userToken}, function(error, result) {

			if (error) {
	    		sendResult.error 	= true;
	    		sendResult.data 	= error;
	    		sendResult.message 	= error;
	    		return res.json(sendResult);
	    	}

	    	if (result.error) {
		    	sendResult.data 	= result.data;
		    	sendResult.message 	= result.message;
		    	sendResult.error 	= result.error;
	    		return res.json(sendResult);
	    	} 


	    	var currentOrder 	= result.data;
	    	var isTest 			= ['ofnVVw9aVxkxSfvvW373yuMYT7fs'].indexOf(currentOrder.openId) != -1;


	    	// TODO, need to be remove

    		// 订单创建成功, 调用微信统一下单API
    		// https://api.mch.weixin.qq.com/pay/unifiedorder
    		var theParams 		= {
				body 			: 'AA精米 特级米 现磨现卖', 			// 'AA精米 特级米 现磨现卖'
				out_trade_no 	: currentOrder.id,			//
				total_fee 		: isTest ? 1 : currentOrder.orderMoney * 100,	//
				userid 			: currentOrder.userId,		//
				openid 			: currentOrder.openId		// 
			};

			httpClient(endpoints_unified_order, {orderParams: theParams}
					, 'post', {type: tokenType, token: userToken}, function(newError, newResult) {

				if (newError) {
		    		sendResult2.error 	= true;
		    		sendResult2.data 	= newError;
		    		sendResult2.message = newError;
		    		return res.json(sendResult2);
		    	}

		    	if (newResult.error) {
			    	sendResult2.data 	= newResult.data;
			    	sendResult2.message = newResult.message;
			    	sendResult2.error 	= newResult.error;
		    		return res.json(sendResult2);
		    	} 

		    	// 预订单创建成功, 订单号更新订单， 把 prepay_id 存储到订单表中
				var userid 		= currentOrder.userId;
				var order_id 	= currentOrder.id;
				var prepay_id 	= newResult.data.prepay_id;


				updateOrder({orderid: order_id, action: 'updatePrePayId', prepay_id: prepay_id}
	    			, req.body.user, function(newError3, newResult3) {

			    	if (newError3) {
			    		sendResult3.error 	= true;
			    		sendResult3.data 	= newError3;
			    		sendResult3.message = newError3;
			    		return res.json(sendResult3);
			    	}

			    	sendResult3 		= newResult3;
			    	//sendResult3.data.id 	= order_id;
					return res.json(sendResult3);

			    });

			});
			// end TODO, need to be remove
    		
		});
	}, 
	get: function(req, res, next) {		
		var userToken 		= req.body.user.value;
		var tokenType 		= req.body.user.tokenType;

		var orderid 		= req.params.orderid;


	    var sendResult  			= {error: false, message: null, data: null};	
	    var endpoints_order_detail 	= URL.parse(endpoints.order_detail.replace("{{{orderid}}}", orderid));

		httpClient(endpoints_order_detail, null, 'get', {type: tokenType, token: userToken}, function(error, result) {

			if (error) {
	    		sendResult.error 	= true;
	    		sendResult.data 	= error.data;
	    		sendResult.message 	= error.message;
	    		return res.json(sendResult);
	    	}

	    	if (result) {
		    	sendResult.data 	= result.data;
		    	sendResult.message 	= result.message;
		    	sendResult.error 	= result.error;
	    	}

			return res.json(sendResult);
		});
	}, 
	list: function(req, res, next) {		
		var userToken 		= req.body.user.value;
		var tokenType 		= req.body.user.tokenType;


	    var sendResult  			= {error: false, message: null, data: null};	
	    var endpoints_order_list 	= URL.parse(endpoints.order_list);

		httpClient(endpoints_order_list, null, 'get', {type: tokenType, token: userToken}, function(error, result) {

			if (error) {
	    		sendResult.error 	= true;
	    		sendResult.data 	= error.data;
	    		sendResult.message 	= error.message;
	    		return res.json(sendResult);
	    	}

	    	if (result) {
		    	sendResult.data 	= result.data;
		    	sendResult.message 	= result.message;
		    	sendResult.error 	= result.error;
	    	}
	    	
			return res.json(sendResult);
		});
	}, 
	listUserOrders: function(req, res, next) {
		var userToken 		= req.body.user.value;
		var tokenType 		= req.body.user.tokenType;
		var orderStatus 	= req.params.status;


	    var sendResult  				= {error: false, message: null, data: null};	
	    var endpoints_list_user_orders 	= URL.parse(endpoints.list_user_orders.replace('{{{orderStatus}}}', orderStatus));
	
	    httpClient(endpoints_list_user_orders, null, 'get', {type: tokenType, token: userToken}, function(error, result) {

			if (error) {
	    		sendResult.error 	= true;
	    		sendResult.data 	= error.data;
	    		sendResult.message 	= error.message;
	    		return res.json(sendResult);
	    	}

	    	if (result) {
		    	sendResult.data 	= result.data;
		    	sendResult.message 	= result.message;
		    	sendResult.error 	= result.error;
	    	}
	    	
			return res.json(sendResult);
		});
	},
	update: function(req, res, next) {
	    updateOrder({orderid: req.params.orderid, action: 'updateStatus', status: req.body.status}
	    			, req.body.user, function(err, result) {

	    	var sendResult  			= {error: false, message: null, data: null};	
	    	
	    	if (err) {
	    		sendResult.error 	= true;
	    		sendResult.data 	= err.data;
	    		sendResult.message 	= err.message;
	    		return res.json(sendResult);
	    	}

	    	if (result) {
		    	sendResult.data 	= result.data;
		    	sendResult.message 	= result.message;
		    	sendResult.error 	= result.err;
	    	}

			return res.json(sendResult);

	    });
	}, 
	del: function(req, res, next) {
		var userToken 		= req.body.user.value;
		var tokenType 		= req.body.user.tokenType;

		var orderid 		= req.params.orderid;

	    var sendResult  			= {error: false, message: null, data: null};	
	    var endpoints_order_detail 	= URL.parse(endpoints.order_detail.replace("{{{orderid}}}", orderid));

	    httpClient(endpoints_order_detail, null, 'delete', {type: tokenType, token: userToken}, function(error, result) {

			if (error) {
	    		sendResult.error 	= true;
	    		sendResult.data 	= error.data;
	    		sendResult.message 	= error.message;
	    		return res.json(sendResult);
	    	}

	    	if (result) {
		    	sendResult.data 	= result.data;
		    	sendResult.message 	= result.message;
		    	sendResult.error 	= result.error;
	    	}

			return res.json(sendResult);
		});
	}, 
	getPaySign: function(req, res, next) {
		var userToken 		= req.body.user.value;
		var tokenType 		= req.body.user.tokenType;

		var prepayid 		= req.params.prepayid;

// 		"appId" : "wx2421b1c4370ec43b",     //公众号名称，由商户传入     
//      "timeStamp" :" 1395712654",         //时间戳，自1970年以来的秒数     
//      "nonceStr" : "e61463f8efa94090b1f366cccfbbb444", //随机串     
//      "package" : "prepay_id=" + currentOrder.prePayId,     
//      "signType" : "MD5",         //微信签名方式：     
//      "paySign" : "70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名 
		
	    var sendResult  			= {error: false, message: null, data: null};	
	    var endpoints_gen_paysign 	= endpoints_wx.gen_paysign.replace("{{{prepayid}}}", prepayid);

	    httpClient(endpoints_gen_paysign, null, 'get', {type: tokenType, token: userToken}, function(error, result) {

			if (error) {
	    		sendResult.error 	= true;
	    		sendResult.data 	= error.data;
	    		sendResult.message 	= error.message;
	    		return res.json(sendResult);
	    	}

	    	if (result) {
		    	sendResult.data 	= result.data;
		    	sendResult.message 	= result.message;
		    	sendResult.error 	= result.error;
	    	}

			return res.json(sendResult);
		});	
	},
	flush: function(req, res, next) {

		var userToken 		= req.body.user.value;
		var tokenType 		= req.body.user.tokenType;

		var orderid 				= req.params.orderid;
		var deliveryCompany 		= req.body.postData.deliveryCompany;
		var deliveryNo 				= req.body.postData.deliveryNo;
		var userid 					= req.body.postData.userid;
		var openid 					= req.body.postData.openid;



	    var sendResult  			= {error: false, message: null, data: null};	

	    var endpoints_order_flush 	= URL.parse(endpoints.order_flush);

	    httpClient(endpoints_order_flush
	    		, {
	    			userid: userid,
	    			openid: openid,
	    			orderid: orderid,
	    			delivery_company: deliveryCompany,
	    			delivery_no: deliveryNo
	    		}, 'post', {type: tokenType, token: userToken}, function(error, result) {

			if (error) {
	    		sendResult.error 	= true;
	    		sendResult.data 	= error.data;
	    		sendResult.message 	= error.message;
	    		return res.json(sendResult);
	    	}

	    	if (result) {
		    	sendResult.data 	= result.data;
		    	sendResult.message 	= result.message;
		    	sendResult.error 	= result.error;
	    	}

			return res.json(sendResult);
		});
	},
	cancelSended: function(req, res, next) {

		var userToken 		= req.body.user.value;
		var tokenType 		= req.body.user.tokenType;

		var userid 			= req.params.userid;
		var orderid 		= req.params.orderid;

		var sendResult  					= {error: false, message: null, data: null};	
	    var endpoints_order_cancel_send 	= URL.parse(endpoints.order_cancel_sended.replace('{{{userid}}}',userid).replace('{{{orderid}}}',orderid));


	    httpClient(endpoints_order_cancel_send
	    		, null, 'get', {type: tokenType, token: userToken}, function(error, result) {

			if (error) {
	    		sendResult.error 	= true;
	    		sendResult.data 	= error.data;
	    		sendResult.message 	= error.message;
	    		return res.json(sendResult);
	    	}

	    	if (result) {
		    	sendResult.data 	= result.data;
		    	sendResult.message 	= result.message;
		    	sendResult.error 	= result.error;
	    	}

			return res.json(sendResult);
		});
	},
	events: function(req, res, next) {

		var userToken 		= req.body.user.value;
		var tokenType 		= req.body.user.tokenType;

		var orderid 		= req.params.orderid;

		var sendResult  					= {error: false, message: null, data: null};	
	    var endpoints_order_events 	= URL.parse(endpoints.order_events.replace('{{{orderid}}}',orderid));


	    httpClient(endpoints_order_events
	    		, null, 'get', {type: tokenType, token: userToken}, function(error, result) {

			if (error) {
	    		sendResult.error 	= true;
	    		sendResult.data 	= error.data;
	    		sendResult.message 	= error.message;
	    		return res.json(sendResult);
	    	}

	    	if (result) {
		    	sendResult.data 	= result.data;
		    	sendResult.message 	= result.message;
		    	sendResult.error 	= result.error;
	    	}

			return res.json(sendResult);
		});
	}
}
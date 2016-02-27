var URL 		= require('url');
var _ 			= require("underscore");
var _s 			= require("underscore.string");


var httpClient 	= require('../common/http-client').httpClient;
var endpoints 	= require('../common/endpoints');



var province 	= require('../json-data/region/province.json');
var city 		= require('../json-data/region/city.json');
var area 		= require('../json-data/region/area.json');




module.exports 	= { 
	setup: function (req, res, next) {		
		var userToken 		= req.body.user.value;
		var tokenType 		= req.body.user.tokenType;

		var orderData 		= req.body.orderData;


	    var sendResult  			= {error: false, message: null, data: null};	    
		var endpoints_order_setup 	= URL.parse(endpoints.order_setup);


		httpClient(endpoints_order_setup, orderData, 'post', {type: tokenType, token: userToken}, function(error, result) {

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
	update: function(req, res, next) {
		var userToken 		= req.body.user.value;
		var tokenType 		= req.body.user.tokenType;

		var orderid 		= req.params.orderid;

	    var sendResult  			= {error: false, message: null, data: null};	
	    var endpoints_order_detail 	= URL.parse(endpoints.order_detail.replace("{{{orderid}}}", orderid));

	    var reqBody 	= {};

	    if (req.body.action == 'updateStatus') {
	    	reqBody.action 	= 'updateStatus';
	    	reqBody.status 	= req.body.status;
	    }

	    httpClient(endpoints_order_detail, reqBody, 'put', {type: tokenType, token: userToken}, function(error, result) {

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
	}
}
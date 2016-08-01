var URL 		= require('url');
var _ 			= require("underscore");
var _s 			= require("underscore.string");


var httpClient 	= require('../common/http-client').httpClient;
var endpoints 	= require('../common/endpoints');




module.exports 	= { 
	get: function(req, res, next) {		
		var userToken 		= req.body.user.value;
		var tokenType 		= req.body.user.tokenType;

		var goodsid 		= req.params.goodsid;


	    var sendResult  			= {error: false, message: null, data: null};	

	    sendResult.data = goodsid;


	    var endpoints_goods_detail 	= URL.parse(endpoints.goods_detail.replace("{{{goodsid}}}", goodsid));

	    console.log(userToken, 'userToken');
	    console.log(tokenType, 'tokenType');
	    

	    console.log(endpoints_goods_detail, 'endpoints_goods_detail');
		httpClient(endpoints_goods_detail, null, 'get', {type: tokenType, token: userToken}, function(error, result) {
			console.log(error || result, 'error || result');
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
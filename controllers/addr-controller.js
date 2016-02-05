var URL 		= require('url');
var _s 			= require("underscore.string");


var httpClient 	= require('../common/http-client').httpClient;
var endpoints 	= require('../common/endpoints');

module.exports 	= { 
	list: function (req, res, next) {		
		var userToken 		= req.body.user.value;
		var tokenType 		= req.body.user.tokenType;


	    var sendResult  				= {error: false, message: null, data: null};	    
		var endpoints_user_addr_list 	= URL.parse(endpoints.user_addr_list);


		httpClient(endpoints_user_addr_list, null, 'get', {type: tokenType, token: userToken}, function(newError, newResult) {

			if (newError) {
	    		sendResult.error 	= true;
	    		sendResult.data 	= newError;
	    		sendResult.message 	= newError.message;
	    		return res.json(sendResult);
	    	}

	    	if (newResult) {
		    	sendResult.data 	= newResult.data;
		    	sendResult.message 	= newResult.message;
		    	sendResult.error 	= newResult.error;
	    	}

			return res.json(sendResult);
		});
	},	
	set: function (req, res, next) {		
		var userToken 		= req.body.user.value;
		var tokenType 		= req.body.user.tokenType;
		var addrId 			= req.body.addrid;


	    var sendResult  				= {error: false, message: null, data: null};	    
		var endpoints_user_addr_set 	= URL.parse(endpoints.user_addr_set);


		httpClient(endpoints_user_addr_set, {addrid:addrId}, 'post'
			, {type: tokenType, token: userToken}, function(newError, newResult) {

			if (newError) {
	    		sendResult.error 	= true;
	    		sendResult.data 	= newError;
	    		sendResult.message 	= newError.message;
	    		return res.json(sendResult);
	    	}

	    	if (newResult) {
		    	sendResult.data 	= newResult.data;
		    	sendResult.message 	= newResult.message;
		    	sendResult.error 	= newResult.error;
	    	}

	    	console.log(newResult);

			return res.json(sendResult);
		});
	}
}
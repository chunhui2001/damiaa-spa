var _ 			= require("underscore");
var URL 		= require('url');
var httpClient 	= require('../common/http-client').httpClient;
var endpoints 	= require('../common/endpoints');

module.exports 	= { 
	savePartner: function (req, res, next) {		
		
		var userToken 		= req.body.user.value;
		var tokenType 		= req.body.user.tokenType;
		var partner 		= req.body.partner;

	    var sendResult  			= {error: false, message: null, data: null};
	    var endpoints_partner 		= URL.parse(endpoints.partners);

		httpClient(endpoints_partner, partner, 'post', {type: tokenType, token: userToken}, function(error, result) {

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
	getPartner: function(req, res, next) {
		
		var userToken 		= req.body.user.value;
		var tokenType 		= req.body.user.tokenType;
		var partnerId 		= req.params.partnerId;

		var sendResult  				= {error: false, message: null, data: null};
	    var endpoints_get_partner 		= URL.parse(endpoints.get_partners.replace("{{{partnerId}}}", partnerId));

		httpClient(endpoints_get_partner, null, 'get', {type: tokenType, token: userToken}, function(error, result) {

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
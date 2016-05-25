var _ 			= require("underscore");
var URL 		= require('url');
var httpClient 	= require('../common/http-client').httpClient;
var endpoints 	= require('../common/endpoints');


module.exports 	= { 
	random: function (req, res, next) {		
		
		var userToken 		= req.body.user.value;
		var tokenType 		= req.body.user.tokenType;

		var sendResult  				= {error: false, message: null, data: null};
	    var endpoints_qrcode 			= URL.parse(endpoints.qrcode);

	    httpClient(endpoints_qrcode, null, 'get', {type: tokenType, token: userToken}, function(error, result) {

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
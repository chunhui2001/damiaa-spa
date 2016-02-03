var URL 		= require('url');
var httpClient 	= require('../common/http-client').httpClient;
var endpoints 	= require('../common/endpoints');

module.exports 	= { 
	login: function (req, res, next) {
		var username    = req.body.username;
	    var passwd      = req.body.passwd;

	    var sendResult  = {error: false, message: null, data: null};

	    if (!username || !passwd) {
	        sendResult.error = true;
	        sendResult.message  = 'please provide username and passwd as parameter';
	    }

	    // validate user and passwd
	    // http://localhost:8088/oauth/token?grant_type=password
	    //&client_id=spa-clients&client_secret=spa&username=keesh.zhang&password=111111
	    var endpoints_access_token 	= endpoints.get_access_token.replace('{{{username}}}', username).replace('{{{password}}}', passwd);
	    var refresh_token 			= endpoints.refresh_token;

	    httpClient(URL.parse(endpoints_access_token), null, 'get', null, function(error, result) {
	    	if (error) {
	    		sendResult.error 	= true;
	    		sendResult.data 	= error;
	    		return res.json(sendResult);
	    	}

	    	if (result.httpErrorCode == 400) {
	    		sendResult.error 	= true;
	    		sendResult.data 	= result;
	    		sendResult.message 	= '用户名或密码错误!';
	    		return res.json(sendResult);
	    	}

	    	if (!result.refreshToken) {
	    		sendResult.error 	= true;
	    		sendResult.data 	= result;
	    		sendResult.message 	= endpoints_access_token;
	    		console.log(endpoints_access_token);
	    		return res.json(sendResult);
	    	}

    		var refreshToken 	= result.refreshToken.value;

    		refresh_token = URL.parse(refresh_token.replace('{{{refresh_token}}}', refreshToken));

    		httpClient(refresh_token, null, 'get', null, function(newError, newResult) {
    			if (newError) {
		    		sendResult.error 	= true;
		    		sendResult.data 	= newError;
		    		return res.json(sendResult);
		    	}

		    	sendResult.data = newResult;

    			return res.json(sendResult);
    		});
	    });
	},
	logout: function(req, res, next) {
		var refreshToken 	= req.body.refreshToken.value;

		refresh_token = URL.parse(endpoints.refresh_token.replace('{{{refresh_token}}}', refreshToken));

	    var sendResult  = {error: false, message: null, data: null};

	    httpClient(refresh_token, null, 'get', null, function(newError, newResult) {
			if (newError) {
	    		sendResult.error 	= true;
	    		sendResult.data 	= newError;
	    		return res.json(sendResult);
	    	}

	    	sendResult.data = newResult;

			return res.json(sendResult);
		});
	},
	userinfo: function(req, res, next) {
		var tokenType 	= req.body.tokenType;
		var token 		= req.body.value;

		var endpoints_user_info = URL.parse(endpoints.get_user_info);

	    var sendResult  = {error: false, message: null, data: null};


	    httpClient(endpoints_user_info, null, 'get', {type: tokenType, token: token}, function(newError, newResult) {
	    	console.log(newResult, 9888);

			if (newError) {
	    		sendResult.error 	= true;
	    		sendResult.data 	= newError;
	    		sendResult.message 	= newError.message;
	    		return res.json(sendResult);
	    	}

	    	sendResult.data = newResult.data;
	    	sendResult.message 	= newResult.message;
	    	sendResult.error 	= newResult.error;

			return res.json(sendResult);
		});
	}
}
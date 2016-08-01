var URL 		= require('url');
var _s 			= require("underscore.string");


var httpClient 		= require('../common/http-client').httpClient;
var endpoints 		= require('../common/endpoints');
var ENDPOINTS_WX 	= require('../common/endpoints-wx');
var GLOBAL_CONFIG	= require('../config/config-global');

module.exports 	= { 
	getWxUserInfo: function(req, res, next) {
		var code 		= req.params.code;
		var stateCode 	= req.params.state;

	    var sendResult  = {error: false, message: null, data: code};

	    if (GLOBAL_CONFIG.OPENID_STATE_CODE != stateCode) {
	    	sendResult = true;
	    	sendResult.data 	= "state code invalidate";

	    	return res.json(sendResult);
	    }

		httpClient(ENDPOINTS_WX.get_openid.replace('{{{CODE}}}', code)
				, null, 'get', {type: 'bearer', token: GLOBAL_CONFIG.WCHAT_TOKEN_CODE}
				, function(error, result) {

			if (error) {
	    		sendResult.error 	= true;
	    		sendResult.data 	= error;
	    		return res.json(sendResult);
	    	}

	    	sendResult.data = result.data;
	    	
			return res.json(sendResult);
		});

	},
	wxUserInfo: function(code, state, callback) {
		var stateCode 	= state;

	    var sendResult  = {error: false, message: null, data: code};

	    if (GLOBAL_CONFIG.OPENID_STATE_CODE != stateCode) {
	    	sendResult.error = true;
	    	sendResult.message 	= "state code invalidate";

	    	return callback(sendResult);
	    }

		httpClient(ENDPOINTS_WX.get_openid.replace('{{{CODE}}}', code)
				, null, 'get', {type: 'bearer', token: GLOBAL_CONFIG.WCHAT_TOKEN_CODE}
				, function(error, result) {

			if (error) {
	    		sendResult.error 	= true;
	    		sendResult.data 	= error;

	    		return callback(sendResult);
	    	}

	    	
	    	sendResult.data = result.data;
	    	
			return callback(sendResult);
		});
	},
	login: function (req, res, next, cback) {

		var username    = req.body.username || req.openid;
	    var passwd      = req.body.passwd 	|| req.passwd;

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
	    
	    console.log(endpoints_access_token, 'endpoints_access_token');
	    
	    httpClient(URL.parse(endpoints_access_token), null, 'get', null, function(error, result) {

	    	console.log(error || result, 'error, result');
	    	if (error) {
	    		sendResult.error 	= true;
	    		sendResult.data 	= error;

	    		if (cback) return cback(null, sendResult);
	    		
	    		return res.json(sendResult);
	    	}

	    	if (!result || result.httpErrorCode == 400 || result.error) {
	    		sendResult.error 	= true;
	    		sendResult.data 	= result;
	    		sendResult.message 	= '用户名或密码错误!';

	    		if (cback) return cback(null, sendResult);

	    		return res.json(sendResult);
	    	}

	    	if (!result.refresh_token) {
	    		sendResult.error 	= true;
    			sendResult.data 	= result;
	    		sendResult.message 	= endpoints_access_token;

	    		if (cback) return cback(null, sendResult);

    			return res.json(sendResult);
	    	}

	    	sendResult.data 	= {
	    		value: result.access_token,
	    		tokenType: result.token_type,
	    		refreshToken : {
	    			value: result.refresh_token
	    		},
	    		scope: result.scope.split(' '),
	    		expiresIn: result.expires_in
	    	};


    		if (cback) return cback(null, sendResult);

    		return res.json(sendResult);

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


	    httpClient(endpoints_user_info, null, 'get', {type: tokenType, token: token}, function(error, result) {

			if (error) {
	    		sendResult.error 	= true;
	    		sendResult.data 	= error;
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
	statistic: function(req, res, next) {
		var tokenType 	= req.body.tokenType;
		var token 		= req.body.value;

		var endpoints_user_statistic 	= URL.parse(endpoints.get_user_statistic);

	    var sendResult  = {error: false, message: null, data: null};

	    httpClient(endpoints_user_statistic, null, 'get', {type: tokenType, token: token}, function(error, result) {

			if (error) {
	    		sendResult.error 	= true;
	    		sendResult.data 	= error;
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
	resetPasswd: function(req, res, next) {		
		var oldPwd 			= req.body.oldPwd;
		var newPwd 			= req.body.newPwd;
		var userToken 		= req.body.userToken;
		var tokenType 		= req.body.tokenType;

		var endpoints_resetpwd 	= URL.parse(endpoints.resetpwd);


	    var sendResult  = {error: false, message: null, data: null};

	    // if (!oldPwd || oldPwd.length == 0) {
	    // 	sendResult.error 	= true;
	    // 	sendResult.message 	= '请提供原始登陆密码! ';
	    // }

	    // if (!newPwd || newPwd.length == 0 || 
	    // 	 (newPwd && (_s(newPwd).trim().length < 6 || _s(newPwd).trim().length > 16))) {
	    // 	sendResult.error 	= true;
	    // 	sendResult.message += '请输入新密码, 且新密码长度6-16位, 首尾不能有空格！ ';
	    // }

	    if (sendResult.error) {	    	
			return res.json(sendResult);
	    }

	    newPwd = _s(newPwd).trim()._wrapped;

	    var postdata 	= {oldPwd:oldPwd, newPwd:newPwd};


		httpClient(endpoints_resetpwd, postdata, 'post', {type: tokenType, token: userToken}, function(error, result) {

			if (error) {
	    		sendResult.error 	= true;
	    		sendResult.data 	= error;
	    		sendResult.message 	= error.message;
	    		return res.json(sendResult);
	    	}

	    	sendResult.data 	= result.data;
	    	sendResult.message 	= result.message;
	    	sendResult.error 	= result.error;

			return res.json(sendResult);
		});


	},
	register: function(req, res, next) {
		var username 	= req.body.username;
		var passwd 		= req.body.passwd;
		var checkcode 	= req.body.checkcode;

		var openid 		= req.body.openid;
		var unionid 	= req.body.unionid;
		var headimgurl 	= req.body.headimgurl;


		var endpoints_user_register 	= URL.parse(endpoints.user_register);


	    var sendResult  = {error: false, message: null, data: null};

	    if (req.session.checkcode != checkcode) {
	    	sendResult.error = true;
	    	sendResult.message = "验证码不正确，请重新输入！";

			return res.json(sendResult);
	    }

	    httpClient(endpoints_user_register
	    		, {name: username, passwd: passwd, openId:openid, unionId:unionid, photo:headimgurl}
	    		, 'post', null, function(error, result) {

			if (error) {
	    		sendResult.error 	= true;
	    		sendResult.data 	= error;
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
	fansList: function(req, res, next) {
		var tokenType 	= req.body.tokenType;
		var token 		= req.body.value;

		var endpoints_get_fans_list 	= URL.parse(ENDPOINTS_WX.get_fans_list);

	    var sendResult  = {error: false, message: null, data: null};
	    
	    httpClient(endpoints_get_fans_list, null, 'get', {type: tokenType, token: token}, function(error, result) {
	    	
			if (error) {
	    		sendResult.error 	= true;
	    		sendResult.data 	= error;
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
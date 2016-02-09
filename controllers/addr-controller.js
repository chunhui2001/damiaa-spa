var URL 		= require('url');
var _ 			= require("underscore");
var _s 			= require("underscore.string");


var httpClient 	= require('../common/http-client').httpClient;
var endpoints 	= require('../common/endpoints');



var province 	= require('../json-data/region/province.json');
var city 		= require('../json-data/region/city.json');
var area 		= require('../json-data/region/area.json');




module.exports 	= { 
	list: function (req, res, next) {		
		var userToken 		= req.body.user.value;
		var tokenType 		= req.body.user.tokenType;


	    var sendResult  				= {error: false, message: null, data: null};	    
		var endpoints_user_addr_list 	= URL.parse(endpoints.user_addr_list);

		httpClient(endpoints_user_addr_list, null, 'get', {type: tokenType, token: userToken}, function(newError, newResult) {

			if (newError) {
	    		sendResult.error 	= true;
	    		sendResult.data 	= newError.data;
	    		sendResult.message 	= newError.message;
	    		return res.json(sendResult);
	    	}

	    	if (newResult) {
	    		//console.log(newResult, 89);
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

			return res.json(sendResult);
		});
	},	
	add: function (req, res, next) {		
		var userToken 		= req.body.user.value;
		var tokenType 		= req.body.user.tokenType;
		var addr 			= req.body.addr;


	    var sendResult  				= {error: false, message: null, data: null};	    
		var endpoints_user_addr_add 	= URL.parse(endpoints.user_addr_add);



		addr.province 	= _.where(province, {code: addr.province})[0].name + "(" + addr.province + ")";
		addr.city 		= _.where(city, {code: addr.city})[0].name + "(" + addr.city + ")";
		addr.area 		= _.where(area, {code: addr.area})[0].name + "(" + addr.area + ")";


		httpClient(endpoints_user_addr_add, addr, 'post'
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

			return res.json(sendResult);
		});
	},	
	del: function (req, res, next) {	
		var userToken 		= req.query.token;
		var tokenType 		= req.query.tokenType;
		var addrid 			= req.params.addrid;


		var endpoints_user_addr_del 	= URL.parse(endpoints.user_addr_del.replace('/:addrid', '/' + addrid));

	    
	    var sendResult  				= {error: false, message: null, data: null};	

	    httpClient(endpoints_user_addr_del, null, 'delete'
			, {type: tokenType, token: userToken}, function(error, result) {

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
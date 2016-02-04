var request = require('request');
var URL 	= require('url');

function httpClient (url, parmas, method, certificate, callback) {

    var parmas 	= parmas ? parmas : {};
    var options = {
		url: typeof(url) == 'object' ? URL.format(url) : url,
		method: method.toUpperCase(),
		json: parmas,
		headers: {
			'Content-Type': 'application/json',
	        'accept': 'application/json'
		}
	};

    if(certificate){
        var auth = null;

        if (certificate.type && certificate.token) {
            auth = certificate.type +' ' + certificate.token;
        } else {
            auth = 'Basic ' + new Buffer(certificate.username + ':' + certificate.password).toString('base64');
        }

        options.headers['Authorization'] 	= auth;
    }

    request(options, function(error, response, body) {

		if (!error && response.statusCode == 200) {
			try {				
				var info = JSON.parse(body);
				return callback(null,info);
			} catch(e) {
				return callback(null,body);
			}
		}

		return callback(error,null);
	});

}

exports.httpClient = httpClient;


// var url = URL.parse("http://api-staging.damiaa.com");


// httpClient(url, null, 'get', null, function(error, result) {
// 	console.log(result);
// });

// var url = URL.parse("http://127.0.0.1:8088/me");


// httpClient(url, null, 'get', {type: 'bearer', token: '4bfe101e-db9d-48ae-b42c-607d781f800a'}, function(error, result) {
// 	console.log(result);
// });

var url = URL.parse("http://127.0.0.1:8088/resetpwd");


httpClient(url, {oldPwd:'ddd', newPwd: '111'}, 'post', {type: 'bearer', token: 'a461854b-e55f-4c29-bc60-b8ddb8f0baf4'}, function(error, result) {
	if (error) return console.log(error);
	console.log(result);
});


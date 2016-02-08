'use strict';

var http    = require('http');
var request = require('request');
var URL     = require('url');

exports.httpClient = function(url, parmas, method, certificate, callback) {

    var parmas     = parmas ? parmas : {};
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

        options.headers['Authorization']    = auth;
    }

    request(options, function(error, response, body) {

        if (!error) {
            try {               
                var info = JSON.parse(body);

                if (info.message.indexOf('Invalid access token') != -1) {
                    return callback({error: true, message: info.message, data: null}, null);
                }

                return callback(null,info);
            } catch(e) {

                if (body && body.message && body.message.indexOf('Invalid access token') != -1) {
                    return callback({error: true, message: body.message, data: 4000}, null);
                }

                return callback(null,body);
            }
        }


        return callback(error,null);
    });




    // if(!parmas) parmas = {};

    // var parmasString = JSON.stringify(parmas);

    // var headers = {
    //     'Content-Type': 'application/json',
    //     'Content-Length': Buffer.byteLength(parmasString)
    // };

    // if(certificate){
    //     var auth = null;

    //     if (certificate.type && certificate.token) {
    //         auth = certificate.type +' ' + certificate.token;
    //     } else {
    //         auth = 'Basic ' + new Buffer(certificate.username + ':' + certificate.password).toString('base64');
    //     }
        
    //     headers = {
    //         'accept': 'application/json',
    //         'Authorization': auth
    //     };
    // }

    // var options = {
    //     host: url.hostname,
    //     port: url.port ? url.port : 80,
    //     path: url.path,
    //     method: method,
    //     headers: headers
    // };

    // var req = http.request(options, function(res) {
    //     res.setEncoding('utf-8');

    //     var responseString = '';

    //     res.on('data', function(data) {
    //         responseString += data;
    //     });

    //     res.on('end', function() {
    //         var resultObject = JSON.parse(responseString);
    //         callback(null,resultObject);
    //     });
    // });

    // req.on('error', function(e) {
    //     callback(e,null);
    // });

    // // send data
    // req.write(parmasString);
    // req.end();
}

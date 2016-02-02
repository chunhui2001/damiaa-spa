'use strict';

var http = require('http');

exports.httpClient = function(url, parmas, method, certificate, callback) {

    if(!parmas) parmas = {};
    var parmasString = JSON.stringify(parmas);

    var headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(parmasString)
    };

    if(certificate){
        var auth = 'Basic ' + new Buffer(certificate.username + ':' + certificate.password).toString('base64');
        headers = {
            'accept': 'application/json',
            'Authorization': auth
        };
    }

    var options = {
        host: url.hostname,
        port: url.port ? url.port : 80,
        path: url.path,
        method: method,
        headers: headers
    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf-8');

        var responseString = '';

        res.on('data', function(data) {
            responseString += data;
        });

        res.on('end', function() {
            var resultObject = JSON.parse(responseString);
            callback(null,resultObject);
        });
    });

    req.on('error', function(e) {
        callback(e,null);
    });

    // send data
    req.write(parmasString);
    req.end();
}

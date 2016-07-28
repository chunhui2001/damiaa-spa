var http 			  = require('http');
var express 		= require('express');
var path 			  = require('path');
var logger 			= require('morgan');

var cookieParser 	= require('cookie-parser');
var bodyParser 		= require('body-parser');
var session 		  = require('express-session');

var captchap 		    = require('./common/captchap').captchap;
var genuuid 		    = require('./common/gen-uuid');

var GLOBAL_CONFIG   = require('./config/config-global');

console.log(GLOBAL_CONFIG);

var app = express();


var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'example.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.set('port', process.env.PORT || 8100);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
//app.use(allowCrossDomain);
app.use(express.static(path.join(__dirname, 'www')));
app.use(session({
  genid: function(req) {
    return genuuid() // use UUIDs for session IDs
  },
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized:false
}));


var accountController     = require('./controllers/account-controller');
var addrController        = require('./controllers/addr-controller');
var regionController      = require('./controllers/region-controller');
var orderController       = require('./controllers/order-controller');
var goodsController       = require('./controllers/goods-controller');
var partnerController     = require('./controllers/partner-controller');
var qrcodeController      = require('./controllers/qrcode-controller');


app.get('/checkcode', function(req, res, next) {
    captchap(req, res, next);
});

app.get('/authorized_back', function(req, res) {

    var wxOpenIDCode       = req.query['code'];
    var wxOpenIDStateCode  = req.query['state'].split('__')[0];
    var return_url         = req.query['state'].split('__')[1];

    console.log(req.query['state'], 'req.query[state]');

    if (GLOBAL_CONFIG.OPENID_STATE_CODE != wxOpenIDStateCode) {
        return res.status(200).end('invalid request!');
    }

    // get openid by wxOpenIDCode
    accountController.wxUserInfo(wxOpenIDCode, wxOpenIDStateCode, function(result) {

        if (result.error) {
            return res.status(200).end(result.message || result.data);
        }

        console.log(result, 'accountController.wxUserInfo');

        var redirect  = '/#/login/' + '?openid=' + wxOpenIDCode + '::' + wxOpenIDStateCode;
        
        if (return_url && return_url.length > 0) {
            redirect = redirect + '&b=' + return_url;
            console.log(return_url, 'return_url');
        }

        res.redirect(redirect);

    });

    
});

// https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbfbeee15bbe621e6&redirect_uri=
// http%3A%2F%2Fwww.damiaa.com%2Fregister&response_type=code&scope=snsapi_base&state=HbYFbj4CAlo72uPw#wechat_redirect


app.post('/login', accountController.login);
app.post('/logout', accountController.logout);
app.post('/userinfo', accountController.userinfo);
app.post('/resetpwd', accountController.resetPasswd);
app.post('/register', accountController.register);
app.post('/statistic', accountController.statistic);
app.post('/fanslist', accountController.fansList);
app.post('/partner', partnerController.savePartner);
app.post('/partner/:partnerId', partnerController.getPartner);
app.put('/partner/:partnerId', partnerController.updatePartner);
app.put('/partner/:partnerId/qrcode', partnerController.qrcode);

app.post('/qrcode/random', qrcodeController.random);

app.get('/wxuserinfo/:code/:state',   accountController.getWxUserInfo);

app.post('/addr/list',  addrController.list);
app.post('/addr/set',   addrController.set);
app.post('/addr/updateAddr',   addrController.updateAddr);
app.post('/addr/add',   addrController.add);
app.post('/addr/:addrid/del',   addrController.del);

app.get('/region/:name/:code',   regionController.list);

app.post('/order',  orderController.list);
app.post('/order/setup',  orderController.setup);
app.post('/order/:orderid',  orderController.get);
app.post('/order/cancel/:orderid',  orderController.update);
app.post('/order/del/:orderid',  orderController.del);
app.post('/order/sign/:prepayid',  orderController.getPaySign);
app.post('/order/flush/:orderid',  orderController.flush);
app.post('/order/cancel-sended/:userid/:orderid',  orderController.cancelSended);
app.post('/order/:orderid/events',  orderController.events);

app.post('/user-orders/:status',  orderController.listUserOrders);

app.post('/goods/:goodsid',  goodsController.get);




app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send({ message: err.message });
});



http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port') + ', ' + app.get('env'));
});
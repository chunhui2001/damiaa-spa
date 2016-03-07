var http 			  = require('http');
var express 		= require('express');
var path 			  = require('path');
var logger 			= require('morgan');

var cookieParser 	= require('cookie-parser');
var bodyParser 		= require('body-parser');
var session 		  = require('express-session');

var captchap 		= require('./common/captchap').captchap;
var genuuid 		= require('./common/gen-uuid');

var app = express();

app.set('port', process.env.PORT || 8100);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
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


app.get('/checkcode', function(req, res, next) {
    captchap(req, res, next);
});



app.post('/login', accountController.login);
app.post('/logout', accountController.logout);
app.post('/userinfo', accountController.userinfo);
app.post('/resetpwd', accountController.resetPasswd);
app.post('/register', accountController.register);
app.post('/statistic', accountController.statistic);


app.post('/addr/list',  addrController.list);
app.post('/addr/set',   addrController.set);
app.post('/addr/add',   addrController.add);
app.delete('/addr/:addrid',   addrController.del);

app.get('/region/:name/:code',   regionController.list);


app.post('/order',  orderController.list);
app.post('/order/setup',  orderController.setup);
app.post('/order/:orderid',  orderController.get);
app.put('/order/:orderid',  orderController.update);
app.post('/order/del/:orderid',  orderController.del);


app.post('/goods/:goodsid',  goodsController.get);




app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send({ message: err.message });
});



http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
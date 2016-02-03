var http 			= require('http');
var express 		= require('express');
var path 			= require('path');
var logger 			= require('morgan');
var cookieParser 	= require('cookie-parser');
var bodyParser 		= require('body-parser');
var session 		= require('express-session');

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


var accountController   = require('./controllers/account-controller');


app.get('/checkcode', function(req, res, next) {
    captchap(req, res, next);
});



app.post('/login', accountController.login);
app.post('/logout', accountController.logout);
app.post('/userinfo', accountController.userinfo);




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
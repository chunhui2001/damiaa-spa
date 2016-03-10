var _ 				= require('underscore');

var devConfig 		= require('./config-dev');
var localConfig 	= require('./config-local');
var prodConfig 		= require('./config-prod');
var stagingConfig 	= require('./config-staging');


var externalConfig 	= null;

switch(process.env.NODE_ENV) {
	case "development":
		externalConfig = devConfig;
		break;
	case "local":
		externalConfig = localConfig;
		break;
	case "production":
		externalConfig = prodConfig;
		break;
	case "staging":
		externalConfig = stagingConfig;
		break;
	default:
		externalConfig = devConfig;
}


var globalConfig 	= {
	PORT: '8100',
	DAMIAA_API_HOSTNAME: 'api-staging.damiaa.com',
	STATIC_SERVER_HOSTNAME: 'static-local.damiaa.com',
	WCHAT_SERVER_HOSTNAME: 'wchat.damiaa.com',
	WCHAT_TOKEN_CODE: '9k95gXBkaFfj3zIgm6veQ9FXF0Rc5UeiLpPp9RduquVRGSZz',

	OPENID_STATE_CODE: 'HbYFbj4CAlo72uPw',
};


module.exports = _.extend(globalConfig, externalConfig);
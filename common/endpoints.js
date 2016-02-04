
var host 	= process.env.DAMIAA_API_HOSTNAME || 'http://api-staging.damiaa.com';

module.exports = {
	get_access_token : host + '/oauth/token?grant_type=password&client_id=ios-clients&client_secret=ios&username={{{username}}}&password={{{password}}}',
	refresh_token: host + '/oauth/token?grant_type=refresh_token&client_id=ios-clients&client_secret=ios&refresh_token={{{refresh_token}}}',
	get_user_info: host + '/me',
	resetpwd: host + '/resetpwd',
	user_register: host + '/register'
}
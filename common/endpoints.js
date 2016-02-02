
var host 	= process.env.DAMIAA_API_HOSTNAME || 'http://api-staging.damiaa.com';

module.exports = {
	get_access_token : host + '/oauth/token?grant_type=password&client_id=spa-clients&client_secret=spa&username={{{username}}}&password={{{password}}}',
	refresh_token: host + '/oauth/token?grant_type=refresh_token&client_id=spa-clients&client_secret=spa&refresh_token={{{refresh_token}}}'
}
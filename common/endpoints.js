
var host 	= process.env.DAMIAA_API_HOSTNAME || 'http://api-staging.damiaa.com';

module.exports = {
	get_access_token : host + '/oauth/token?grant_type=password&client_id=ios-clients&client_secret=ios&username={{{username}}}&password={{{password}}}',
	refresh_token: host + '/oauth/token?grant_type=refresh_token&client_id=ios-clients&client_secret=ios&refresh_token={{{refresh_token}}}',
	
	get_user_info: host + '/me',
	get_user_statistic: host + '/statistic',

	resetpwd: host + '/resetpwd',
	user_register: host + '/register',

	user_addr_list: host + '/addr/list',
	user_addr_set: host + '/addr/set',
	user_addr_add: host + '/addr',
	user_addr_del: host + '/addr/:addrid',

	order_setup: host + '/order/',
	order_list: host + '/order/',
	order_detail: host + '/order/{{{orderid}}}',



	goods_detail: host + '/goods/{{{goodsid}}}',
}
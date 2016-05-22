
var GLOBAL_CONFIG   = require('../config/config-global');

var host 	= 'http://' + GLOBAL_CONFIG.DAMIAA_API_HOSTNAME;

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
	order_flush: host + '/flush-order/',
	order_cancel_sended: host + '/console/order/cancel-sended/{{{userid}}}/{{{orderid}}}',
	order_events: host + '/console/order/{{{orderid}}}/events',

	goods_detail: host + '/goods/{{{goodsid}}}',

	list_user_orders: host + '/console/user-orders/{{{orderStatus}}}',

	partners: host + '/partners',
	partners_with_id: host + '/partners/{{{partnerId}}}',
	partners_qrcode: host + '/partners/{{{partnerId}}}/qrcode',
}
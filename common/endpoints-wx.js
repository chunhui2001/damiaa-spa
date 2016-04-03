
var GLOBAL_CONFIG   = require('../config/config-global');

var host 	= 'http://' + GLOBAL_CONFIG.WCHAT_SERVER_HOSTNAME;

module.exports = {
	get_openid : host + '/openid/{{{CODE}}}/authorization_code',	
	unified_order: host + '/unifiedorder',
	gen_paysign: host + '/gen-paysign/{{{prepayid}}}',


	get_fans_list: host + '/fanslist',
}
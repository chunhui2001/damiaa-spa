var _ 	= require("underscore");

var province 	= require('../json-data/region/province.json');
var city 		= require('../json-data/region/city.json');
var area 		= require('../json-data/region/area.json');

module.exports 	= { 
	list: function (req, res, next) {		
		var name 		= req.params.name;		
		var code 		= req.params.code;

		

		if (name === 'city') {
			// the code is province code
			// get cities by province code
			return res.json(_.where(city, {provincecode: code}));
		}

		if (name === 'area') {
			// the code is province code
			// get cities by province code
			return res.json(_.filter(_.where(area, {citycode: code}), function(a) {
				
				return a.name != '市辖区';
			}));
		}

		if (code === "-1") {
			return res.json(_.filter(province, function(prov) {
				if (prov.code == "710000" || prov.code == "810000" || prov.code == "820000") {
					return false;
				} else return true
			}));
		}

		return res.json(null);
	}
}
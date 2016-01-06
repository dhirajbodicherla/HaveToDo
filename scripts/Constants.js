import Util from './Util.js';

var Constants = {
	"colors": [
		"#FFFFFF", // white
		"#E6E73B", // yellow
		"#F29507", // orange
		"#D01B1B", // light red
		"#920000" // red
	],
	"defaultItemStructure": {
	    'boards': []
	},
	"defaultListStructure": function(){
		return [
			{
			    'name': 'Todo',
			    'id': Util.UUID(),
			    'cards': []
			}, {
			    'name': 'Today',
			    'id': Util.UUID(),
			    'cards': []
			}, {
			    'name': 'Done',
			    'id': Util.UUID(),
			    'cards': []
			}
		];
	}
};

export default Constants;
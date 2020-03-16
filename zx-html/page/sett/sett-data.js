window.onload = function() {
	getAgent();
	setElems();
	setAgent();
	setInner();
}

var config = {
	name: "sett",
};


var items = [
{title: '设置', colorIdx: 1,
list: [
{title: 'Style', vice: 'Select the style of color mode', default: 0, key: 'colorType',
lines: ['Black', 'Dark', 'Normal', 'Bright']},

{title: 'Data', vice: 'Select a data to init', default: 0, key: 'dataIdx',
lines: ['Default', 'Data1', 'Data2', 'Data3']},

{title: 'Init', vice: 'Get, set or clear the data', default: 0, key: 'initType',
lines: ['Get', 'Set', 'Clear']},

{title: 'Alert', vice: 'Is alert message or not?', default: 0, key: 'isAlert',
lines: ['Not Alert', 'Alert']},

{title: 'Devil', vice: 'Is use devil mode text?', default: 0, key: 'isDevil',
lines: ['Not Devil', 'Devil']},

{title: 'View', vice: 'Data to table, line, kv, list view', default: 1, key: 'viewType',
lines: ['Date to View']},
]},

];
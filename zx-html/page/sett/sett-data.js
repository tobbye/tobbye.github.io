window.onload = function() {
	getAgent();
	setElems();
	setAgent();
}

var config = {
	name: "sett",
};


var items = [
{title: '设置', colorIdx: 1,
list: [
{title: 'Style', vice: 'Select the style of color mode', default: 0, key: 'colorType',
lines: ['deep', 'normal', 'bright', 'dark']},

{title: 'Data', vice: 'Select a data to init', default: 0, key: 'dataIdx',
lines: ['default', 'data1', 'data2', 'data3']},

{title: 'Init', vice: 'Get, set or clear the data', default: 0, key: 'initType',
lines: ['Get', 'Set', 'Clear']},

{title: 'Alert', vice: 'Is alert message or not?', default: 0, key: 'isAlert',
lines: ['Not Alert', 'Alert']},
]},
];
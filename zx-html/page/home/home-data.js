window.onload = function() {
	getAgent();
	setElems();
	setAgent();
}


var config = {
	name: "home",
	depotArr: [],
	depotCur: [],
	depotIdx: [],
	depotPer: [],
	depotNum: 8888,
	depotLen: [5,5],
	lvlDict: "金木水火土",
	rowDict: "ABCDEFGHI",
	colDict: "123456789",
};


var items = [
{title:"主页", colorIdx: 1,
list: [
{title:"藏宝图", vice:"无数人前往探索，却无所获", isDepot:1}
]},
];
window.onload = function() {
    getAgent();
	setElems();
	setAgent();
	setInner();
}

var config = {
	name: "stat",
	list: ["-cur", "-rec"],
	date: {flex: 50, align:"left"},
	inve: {flex: 50, align:"right"},
	grab: {flex: 50, align:"right"},
	gain: {flex: 50, align:"right"},
};


var items = [

{title:"日计", colorIdx: 1, seed: 1,
list: [
{title:"今日统计", vice:"2019/1/15日",
lines: [
{date:"日期", inve:"投入总量",grab:"抢夺总量",gain:"收益总量"},
{date:"2019年<br/>1月15日"},
]},
{title:"近7日统计", vice:"2019/1/8日 - 2019/1/14日",
lines: [
{date:"日期", inve:"投入总量",grab:"抢夺总量",gain:"收益总量"},
{date:"2019年<br/>11月14日"},
{date:"2019年<br/>1月13日"},
{date:"2019年<br/>1月12日"},
{date:"2019年<br/>1月11日"},
{date:"2019年<br/>1月10日"},
{date:"2019年<br/>1月9日"},
{date:"2019年<br/>1月8日"},
]},
]},


{title:"周计", colorIdx: 2, seed: 7,
list: [
{title:"本周统计", vice:"2019/第3周",
lines: [
{date:"日期", inve:"投入总量",grab:"抢夺总量",gain:"收益总量"},
{date:"2019年<br/>第3周"},
]},
{title:"近4周统计", vice:"2018/第51周 - 2019/第2周",
lines: [
{date:"日期", inve:"投入总量",grab:"抢夺总量",gain:"收益总量"},
{date:"2019年<br/>第2周"},
{date:"2019年<br/>第1周"},
{date:"2018年<br/>第52周"},
{date:"2018年<br/>第51周"},
]},
]},

{title:"月计", colorIdx: 3, seed: 30,
list: [
{title:"本月统计", vice:"2019/1月",
lines: [
{date:"日期", inve:"投入总量",grab:"抢夺总量",gain:"收益总量"},
{date:"2019年<br/>1月"},
]},
{title:"近12月统计", vice:"2018/1月 - 2018/12月",
lines: [
{date:"日期", inve:"投入总量",grab:"抢夺总量",gain:"收益总量"},
{date:"2018年<br/>12月"},
{date:"2018年<br/>11月"},
{date:"2018年<br/>10月"},
{date:"2018年<br/>9月"},
{date:"2018年<br/>8月"},
{date:"2018年<br/>7月"},
{date:"2018年<br/>6月"},
{date:"2018年<br/>5月"},
{date:"2018年<br/>4月"},
{date:"2018年<br/>3月"},
{date:"2018年<br/>2月"},
{date:"2018年<br/>1月"},
]},
]},


{title:"年计", colorIdx: 4, seed: 365,
color: {deep:"#648", normal:"#86a", light:"#cae"},
list: [
{title:"今年统计", vice:"2019年",
lines: [
{date:"日期", inve:"投入总量",grab:"抢夺总量",gain:"收益总量"},
{date:"2019年<br/>至今"},
]},
{title:"近2年统计", vice:"2017年 - 2018年",
lines: [
{date:"日期", inve:"投入总量",grab:"抢夺总量",gain:"收益总量"},
{date:"2018年<br/>全年"},
{date:"2017年<br/>全年"},
]},
]},
];



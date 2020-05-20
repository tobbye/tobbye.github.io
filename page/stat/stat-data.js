window.onload = function() {
    getAgent();
	setElems();
	setAgent();
}

var cfg = {
	name: "stat",
	list: ["-cur", "-rec"],
};


var items = [

{title:"日计", colorIdx: 1, seed: 1,
list: [
{title:"今日统计", vice:"2019/1/15日",
lines: [
{date:"日期", inve:"投入总量",grab:"抢夺总量",gain:"收益总量"},
{date:"2019年1月15日"},
]},
{title:"近7日统计", vice:"2019/1/8日 - 2019/1/14日",
lines: [
{date:"日期", inve:"投入总量",grab:"抢夺总量",gain:"收益总量"},
{date:"2019年11月14日"},
{date:"2019年1月13日"},
{date:"2019年1月12日"},
{date:"2019年1月11日"},
{date:"2019年1月10日"},
{date:"2019年1月9日"},
{date:"2019年1月8日"},
]},
]},


{title:"周计", colorIdx: 2, seed: 7,
list: [
{title:"本周统计", vice:"2019/第3周",
lines: [
{date:"日期", inve:"投入总量",grab:"抢夺总量",gain:"收益总量"},
{date:"2019年第3周"},
]},
{title:"近4周统计", vice:"2018/第51周 - 2019/第2周",
lines: [
{date:"日期", inve:"投入总量",grab:"抢夺总量",gain:"收益总量"},
{date:"2019年第2周"},
{date:"2019年第1周"},
{date:"2018年第52周"},
{date:"2018年第51周"},
]},
]},

{title:"月计", colorIdx: 3, seed: 30,
list: [
{title:"本月统计", vice:"2019/1月",
lines: [
{date:"日期", inve:"投入总量",grab:"抢夺总量",gain:"收益总量"},
{date:"2019年1月"},
]},
{title:"近12月统计", vice:"2018/1月 - 2018/12月",
lines: [
{date:"日期", inve:"投入总量",grab:"抢夺总量",gain:"收益总量"},
{date:"2018年12月"},
{date:"2018年11月"},
{date:"2018年10月"},
{date:"2018年9月"},
{date:"2018年8月"},
{date:"2018年7月"},
{date:"2018年6月"},
{date:"2018年5月"},
{date:"2018年4月"},
{date:"2018年3月"},
{date:"2018年2月"},
{date:"2018年1月"},
]},
]},


{title:"年计", colorIdx: 4, seed: 365,
list: [
{title:"今年统计", vice:"2019年",
lines: [
{date:"日期", inve:"投入总量",grab:"抢夺总量",gain:"收益总量"},
{date:"2019年至今"},
]},
{title:"近2年统计", vice:"2017年 - 2018年",
lines: [
{date:"日期", inve:"投入总量",grab:"抢夺总量",gain:"收益总量"},
{date:"2018年全年"},
{date:"2017年全年"},
]},
]},
];



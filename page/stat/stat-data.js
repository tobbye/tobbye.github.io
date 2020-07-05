window.onload = function() {
    Config.init();
    Alert.init();
	Stat.init();
}

var cfg = {
	name: "stat",
	list: ["-cur", "-rec"],
	string: {
		inve: '投入',
		grab: '抢夺',
		gain: '收益',
		give: '投放',
	}
};


var items = [

{title:"日计", seed: 1,
list: [
{title:"今日统计", vice:"2019年1月15日",
lines: [
{date:"2019年 1月15日"},
]},
{title:"近7日统计", vice:"2019年月8日 - 2019年1月14日",
lines: [
{date:"2019年 11月14日"},
{date:"2019年 1月13日"},
{date:"2019年 1月12日"},
{date:"2019年 1月11日"},
{date:"2019年 1月10日"},
{date:"2019年 1月9日"},
{date:"2019年 1月8日"},
]},
]},


{title:"周计", seed: 7,
list: [
{title:"本周统计", vice:"2019年第3周",
lines: [
{date:"2019年第3周"},
]},
{title:"近4周统计", vice:"2018年第51周 - 201年第2周",
lines: [
{date:"2019年 第2周"},
{date:"2019年 第1周"},
{date:"2018年 第52周"},
{date:"2018年 第51周"},
]},
]},

{title:"月计", seed: 30,
list: [
{title:"本月统计", vice:"2019年1月",
lines: [
{date:"2019年 1月"},
]},
{title:"近12月统计", vice:"2018年1月 - 2018年12月",
lines: [
{date:"2018年 12月"},
{date:"2018年 11月"},
{date:"2018年 10月"},
{date:"2018年 9月"},
{date:"2018年 8月"},
{date:"2018年 7月"},
{date:"2018年 6月"},
{date:"2018年 5月"},
{date:"2018年 4月"},
{date:"2018年 3月"},
{date:"2018年 2月"},
{date:"2018年 1月"},
]},
]},


{title:"年计", seed: 365,
list: [
{title:"今年统计", vice:"2019年",
lines: [
{date:"2019年至今"},
]},
{title:"近2年统计", vice:"2017年 - 2018年",
lines: [
{date:"2018年全年"},
{date:"2017年全年"},
]},
]},
];



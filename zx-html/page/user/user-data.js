window.onload = function() {
	getAgent();
	setElems();
	setAgent();
	setInner();
}

var config = {
	name: "user",
	minWidth: "24%",
	tagColor: "#a66",
    order: ["1st", "2nd", "3rd", "4th"],
	lines: [
		{order: 1, value: 948670, group: "无关系的", uid: 'd110001', name: '李刚猛', ladd: 18, tag: ['自定义标签1', '自定义标签2', '自定义标签3'], mark: ['身份标签1', '身份标签2']},
		{order: 2, value: 699972, group: "无关系的", uid: 'd110002', name: '王坚强', ladd: 20, tag: ['自定义标签1', '自定义标签2', '自定义标签3'], mark: ['排名标签1', '排名标签2']},
		{order: 3, value: 690663, group: "无关系的", uid: 'd110002', name: '张雄壮', ladd: 17, tag: ['自定义标签1', '自定义标签2', '自定义标签3'], mark: ['阶层标签1', '阶层标签2']},
		{order: 4, value: 582830, group: "无关系的", uid: 'd110004', name: '章威武', ladd: 12, tag: ['自定义标签1', '自定义标签2', '自定义标签3'], mark: ['成就标签1', '成就标签2']},
		{order: 5, value: 414480, group: "无关系的", uid: 'd110005', name: '徐福贵', ladd: 17, tag: ['自定义标签1', '自定义标签2', '自定义标签3'], mark: ['评价标签1', '评价标签2']},
		{order: 6, value: 341222, group: "无关系的", uid: 's110006', name: '赵铁柱', ladd: 15, tag: ['自定义标签1', '自定义标签2', '自定义标签3'], mark: ['理财专家', '投资顾问']},
		{order: 7, value: 202098, group: "无关系的", uid: 's110007', name: '赵铁牛', ladd: 15, tag: ['自定义标签1', '自定义标签2', '自定义标签3'], mark: ['理财专家', '投资顾问']},
		{order: 8, value: 132256, group: "无关系的", uid: 's110008', name: '赵铁蛋', ladd: 15, tag: ['自定义标签1', '自定义标签2', '自定义标签3'], mark: ['理财专家', '投资顾问']},
	],
};


var items = [
	
{title:"资料", colorIdx: 1,
list:[{
name: "[ZX]官方助手",
uid: "1234567890", 
area: "上海·静安区",
sex: "女",
age: 3,
auth: "已认证", 
ladd: 15, 
cls: "高阶用户",
rankAll: "999+",
rankCity: "67", 
rankArea: "5",
valueAll: 256950, 
valueUsed: 251700, 
valueSurplus: 5250,
tipsRank: "按照总权值和所在区域进行排名",
tipsTag: "点击标签搜索赞助商和淘金者<br/>搜索结果按照标签分配的权值排序",
color: {deep:"#846", normal:"#a68", light:"#eac"},
editDetail: {text: "编辑资料", bgcolor:"green"},
editTags: {text: "编辑标签", bgcolor:"green"},
tags: [
{text: "投资", value: 203350, limit: 200000, allot: 0.50},
{text: "理财", value: 42680, limit: 40000, allot: 0.40},
{text: "收益", value: 5670, limit: 5000, allot: 0.10},
]},
]},

{title:"动态", colorIdx: 2,
list: [{title:"我的动态", vice:"共25条动态", 
lines:[
{date:"今天", time:"5分钟前", desc:"我的阶梯提升至15阶！", unit:"[ZX]官方助手(15阶)"},
{date:"今天", time:"2小时前", desc:"抢夺了此淘金者的5阶资金福袋", unit:"李刚猛(9阶)"},
{date:"昨天", time:"20时32分", desc:"关注了此赞助商", unit:"[ZX]官方赞助(17阶)"},
{date:"昨天", time:"19时12分", desc:"抢夺了此赞助商的3阶推广红包", unit:"[ZX]官方赞助(17阶)"},
{date:"2019年9月27日", time:"19时09分", desc:"抢夺了此淘金者的7阶资金福袋", unit:"王坚强(12阶)"},
{date:"2019年9月27日", time:"16时15分", desc:"抢夺了此淘金者的4阶资金福袋", unit:"张雄壮(12阶)"},
{date:"2019年9月27日", time:"15时31分", desc:"关注了此淘金者", unit:"赵铁蛋(10阶)"},
{date:"2019年9月26日", time:"14时22分", desc:"关注了此淘金者", unit:"赵铁牛(10阶)"},
{date:"2019年9月26日", time:"14时07分", desc:"关注了此淘金者", unit:"赵铁柱(10阶)"},
{date:"2019年9月26日", time:"12时00分", desc:"提现本金125元", unit:"[ZX]官方助手(15阶)"},
{date:"2019年9月26日", time:"09时55分", desc:"投入资金6阶*1倍", unit:"[ZX]官方助手(15阶)"},


]},
]},

{title:"成就", colorIdx: 3,
list: [{title:"今日任务", vice:"已完成3条 / 共12条", 
lines:[
{name:"勤劳的淘金者", desc:"今日参与抢夺资金次数达到10次", prect:"100%", value: "完满达成！"},
{name:"芒种", desc:"今日投入资金总量达到10000元", prect:"100%", value: "完满达成！"},
{name:"丰收日", desc:"今日抢夺资金总量达到10000元", prect:"95%", value: "9523/10000"},
{name:"致富奔小康", desc:"今日抢夺红包金额达到100元", prect:"98%", value: "98/100"},
{name:"社会主义的接班人", desc:"今日排行榜排名提升20名", prect:"55%", value: "11/20"},
{name:"叫我雷锋同志", desc:"今日与3名同志建立关系", prect:"33%", value: "1/3"},

]},
{title:"我的成就", vice:"已完成7条 / 共42条", 
lines:[
{name:"劳动模范", desc:"参与抢夺资金福袋1000次", prect:"32%", value: "325/1000"},
{name:"豪气冲天", desc:"投入资金总量达到100万元", prect:"100%", value: "完满达成！"},
{name:"光芒万丈", desc:"抢夺资金总量达到100万元", prect:"73%", value: "73万/100万"},
{name:"迈入中产", desc:"抢夺红包金额达到10000元", prect:"66%", value: "6606/10000"},
{name:"中流砥柱", desc:"成功进入到排行榜前2000名", prect:"0%", value: "未达成"},
{name:"情比金坚", desc:"与300名同志建立关系", prect:"40%", value: "120/300"},

]},

]},
];


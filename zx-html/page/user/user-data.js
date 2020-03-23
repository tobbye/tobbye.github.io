window.onload = function() {
	getAgent();
	setElems();
	setAgent();
	setInner();
}

var config = {
	name: "user",

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
valueStr: "分配权值<h2>#1</h2>",
allotStr: "分配策略<h2>#2%</h2>",
editDetail: {
	text: "编辑资料", btype:"permit"},
editTags: {
	text: "编辑标签", btype:"permit"},
tags: [
{tag: "投资", value: 203350, limit: 200000, allot: 50},
{tag: "理财", value: 42680, limit: 40000, allot: 40},
{tag: "收益", value: 5670, limit: 5000, allot: 10},
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


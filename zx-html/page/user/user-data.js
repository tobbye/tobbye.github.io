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
	lines: [
		{uid: '110001', name: '苹果Apple', ladd: 18, tag: ['手机', '电脑', '手表'], mark: ['500强', '科技公司']},
		{uid: '110002', name: '腾讯Tencent', ladd: 20, tag: ['英雄联盟', '王者荣耀', '地下城与勇士'], mark: ['500强', '游戏公司']},
		{uid: '110002', name: '阿里巴巴Alibaba', ladd: 20, tag: ['支付宝', '淘宝', '1688'], mark: ['500强', '服务公司']},
		{uid: '110004', name: '山东蓝翔职业技术学院', ladd: 20, tag: ['挖掘机', '技术', '哪家强'], mark: ['技术培训', '技术学院']},
		{uid: '110005', name: '洛丽塔有限公司', ladd: 17, tag: ['处女座', '完美主义者', '被害妄想症'], mark: ['二次元', '中二病']},
		{uid: '110006', name: '朝鲜金氏家族', ladd: 15, tag: ['金日成', '金正日', '金正恩'], mark: ['地表最强家族', '北朝鲜霸主']},
	],
};


var items = [
	
{title:"资料", colorIdx: 1,
list:[{
name: "众鑫聚合官方助手",
uid: "1234567890", 
area: "上海·静安区",
sex: "女",
age: 3,
auth: "已认证", 
ladd: 19, 
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
{date:"今天", time:"5分钟前", desc:"我的阶梯提升至18阶！", unit:"众鑫聚合官方助手(18阶)"},
{date:"今天", time:"2小时前", desc:"抢夺了此淘金者的5阶资金福袋", unit:"SAI(9阶)"},
{date:"昨天", time:"20时32分", desc:"关注了此赞助商", unit:"特仑苏(17阶)"},
{date:"昨天", time:"19时12分", desc:"抢夺了此赞助商的3阶推广红包", unit:"特仑苏(17阶)"},
{date:"2019年9月27日", time:"19时09分", desc:"抢夺了此淘金者的7阶资金福袋", unit:"I'm Robot(12阶)"},
{date:"2019年9月27日", time:"16时15分", desc:"抢夺了此淘金者的4阶资金福袋", unit:"Kong心菜(12阶)"},
{date:"2019年9月27日", time:"15时31分", desc:"关注了此淘金者", unit:"欧阳铁蛋(10阶)"},
{date:"2019年9月26日", time:"14时22分", desc:"关注了此淘金者", unit:"欧阳铁牛(10阶)"},
{date:"2019年9月26日", time:"14时07分", desc:"关注了此淘金者", unit:"欧阳铁柱(10阶)"},
{date:"2019年9月26日", time:"12时00分", desc:"提现本金125元", unit:"众鑫聚合官方助手(18阶)"},
{date:"2019年9月26日", time:"09时55分", desc:"投入资金6阶*1倍", unit:"众鑫聚合官方助手(18阶)"},


]},
]},

{title:"成就", colorIdx: 3,
list: [{title:"今日任务", vice:"已完成3条 / 共12条", 
lines:[
{name:"勤劳的淘金者", desc:"今日参与抢夺资金次数达到10次", prect:"100%", value: "完满达成！"},
{name:"致富奔小康", desc:"今日抢夺资金总量达到1000元", prect:"66%", value: "666/1000"},
{name:"和谐社会", desc:"今日完成一次借入和借出操作", prect:"100%", value: "完满达成！"},
{name:"社会主义的接班人", desc:"今日成功进入到排行榜前20名", prect:"0%", value: "20/999"},
{name:"叫我雷锋同志", desc:"今日与3名同志建立关系", prect:"33%", value: "1/3"},

]},
{title:"我的成就", vice:"已完成7条 / 共42条", 
lines:[
{name:"勤劳的淘金者", desc:"今日参与抢夺资金福袋10次", prect:"70%", value: "7/10"},
{name:"致富奔小康", desc:"今日抢夺资金金额达到1000元", prect:"66%", value: "666/1000"},
{name:"和谐社会", desc:"今日完成一次借入和借出操作", prect:"100%", value: "完满达成！"},
{name:"社会主义的接班人", desc:"今日成功进入到排行榜前20名", prect:"0%", value: "20/999"},
{name:"叫我雷锋同志", desc:"今日与3名同志建立关系", prect:"33%", value: "1/3"},

]},

]},
];


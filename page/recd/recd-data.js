window.onload = function() {
    Config.init();
    Alert.init();
    Recd.init();
}

var cfg = {
	name: "recd",
	sort: [
	    {type:201, idx:0, left:1, right:0},
	    {type:202, idx:0, left:0, right:1},
	    {type:301, idx:1, left:1, right:0},
	    {type:302, idx:1, left:0, right:1},
	    {type:401, idx:2, left:1, right:0},
	    {type:402, idx:2, left:0, right:1},
    ],
    order: [],
};


var items = [

{title:"本金", 
list: [
{title:"本金记录", vice:"2019年1月",
left: "充值<h3>￥#0", right: "提现<h3>￥#0",
lines: [
{stamp: "时间", left: "充值记录", right: "提现记录"},

]}
]},


{title:"资金",  
list: [
{title:"资金记录", vice:"2019年1月",
left: "投入<h3>￥#0", right: "抢夺<h3>￥#0",
lines: [
{stamp: "时间", left: "投入记录", right: "抢夺记录"},

]}
]},


{title:"收益", 
list: [
{title:"收益记录", vice:"2019年1月",
left: "获取<h3>￥#0", right: "提现<h3>￥#0",
lines: [
{stamp: "时间", left: "获取记录", right: "提现记录"},

]}
]},
];



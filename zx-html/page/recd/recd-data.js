window.onload = function() {
    getAgent();
    getjson();
	setElems();
	setAgent();
    setInner();
}

var config = {
	name: "recd",
	sort: [
	    {type:201, idx:0, left:1, right:0},
	    {type:202, idx:0, left:0, right:1},
	    {type:301, idx:1, left:1, right:0},
	    {type:302, idx:1, left:0, right:1},
	    {type:401, idx:2, left:1, right:0},
	    {type:402, idx:2, left:0, right:1},
    ],
};


var items = [

{title:"本金", colorIdx: 1,
list: [
{title:"本金记录", vice:"2019年1月",
left: "<h4>充值</h4>￥#0", right: "<h4>提现</h4>￥#0",
lines: [
{stamp: "时间", left: "充值记录", right: "提现记录"},

]}
]},


{title:"资金",  colorIdx: 2,
list: [
{title:"资金记录", vice:"2019年1月",
left: "<h4>投入</h4>￥#0", right: "<h4>抢夺</h4>￥#0",
lines: [
{stamp: "时间", left: "投入记录", right: "抢夺记录"},

]}
]},


{title:"收益", colorIdx: 3,
list: [
{title:"收益记录", vice:"2019年1月",
left: "<h4>获取</h4>￥#0", right: "<h4>提现</h4>￥#0",
lines: [
{stamp: "时间", left: "获取记录", right: "提现记录"},

]}
]},
];



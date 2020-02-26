window.onload = function() {
    getAgent();
	setElems();
	setAgent();
    setInner();
}

var config = {
	name: "recd",
};


var items = [

{title:"本金", colorIdx: 1,
list: [
{title:"本金记录", vice:"2019年1月",
left: "<h4>充值</h4>￥{0}", right: "<h4>提现</h4>￥{0}",
lines: [
{stamp: "时间", left: "充值记录", right: "提现记录"},
{stamp: "<h4>1月25日</h4>07:50", left: 2500, right: 0},
{stamp: "<h4>1月18日</h4>17:33", left: 12568, right: 0},
{stamp: "<h4>1月18日</h4>09:25", left: 5570, right: 1720},
{stamp: "<h4>1月15日</h4>21:20", left: 0, right: 4576},
{stamp: "<h4>1月13日</h4>11:18", left: 0, right: 5217},
{stamp: "<h4>1月13日</h4>07:38", left: 5780, right: 0},
{stamp: "<h4>1月12日</h4>15:34", left: 0, right: 4576},
{stamp: "<h4>1月10日</h4>10:06", left: 0, right: 52050},
{stamp: "<h4>1月8日</h4>17:41", left: 50000, right: 0},
{stamp: "<h4>1月8日</h4>12:25", left: 120000, right: 120000},
{stamp: "<h4>1月7日</h4>08:18", left: 52180, right: 0},
{stamp: "<h4>1月3日</h4>06:22", left: 6584, right: 0},
]}
]},


{title:"资金",  colorIdx: 2,
list: [
{title:"资金记录", vice:"2019年1月",
left: "<h4>投入</h4>￥{0}", right: "<h4>抢夺</h4>￥{0}",
lines: [
{stamp: "时间", left: "投入记录", right: "抢夺记录"},
{stamp: "<h4>1月25日</h4>07:50", left: 2500, right: 0},
{stamp: "<h4>1月18日</h4>17:33", left: 12568, right: 0},
{stamp: "<h4>1月18日</h4>09:25", left: 5570, right: 1720},
{stamp: "<h4>1月15日</h4>21:20", left: 0, right: 4576},
{stamp: "<h4>1月13日</h4>11:18", left: 0, right: 5217},
{stamp: "<h4>1月13日</h4>07:38", left: 5780, right: 0},
{stamp: "<h4>1月12日</h4>15:34", left: 0, right: 4576},
{stamp: "<h4>1月10日</h4>10:06", left: 0, right: 52050},
{stamp: "<h4>1月8日</h4>17:41", left: 50000, right: 0},
{stamp: "<h4>1月8日</h4>12:25", left: 120000, right: 120000},
{stamp: "<h4>1月7日</h4>08:18", left: 52180, right: 0},
{stamp: "<h4>1月3日</h4>06:22", left: 6584, right: 0},
]}
]},


{title:"收益", colorIdx: 3,
list: [
{title:"收益记录", vice:"2019年1月",
left: "<h4>获取</h4>￥{0}", right: "<h4>提现</h4>￥{0}",
lines: [
{stamp: "时间", left: "获取记录", right: "提现记录"},
{stamp: "<h4>1月25日</h4>07:50", left: 2500, right: 0},
{stamp: "<h4>1月18日</h4>17:33", left: 12568, right: 0},
{stamp: "<h4>1月18日</h4>09:25", left: 5570, right: 1720},
{stamp: "<h4>1月15日</h4>21:20", left: 0, right: 4576},
{stamp: "<h4>1月13日</h4>11:18", left: 0, right: 5217},
{stamp: "<h4>1月13日</h4>07:38", left: 5780, right: 0},
{stamp: "<h4>1月12日</h4>15:34", left: 0, right: 4576},
{stamp: "<h4>1月10日</h4>10:06", left: 0, right: 52050},
{stamp: "<h4>1月8日</h4>17:41", left: 50000, right: 0},
{stamp: "<h4>1月8日</h4>12:25", left: 120000, right: 120000},
{stamp: "<h4>1月7日</h4>08:18", left: 52180, right: 0},
{stamp: "<h4>1月3日</h4>06:22", left: 6584, right: 0},
]}
]},
];



window.onload = function() {
    Config.init();
    Alert.init();
    Tran.init();
    Task.init();
}



let cfg = {
	name: 'tran',
	inveCount: 20,
	laddCount: 25,
	laddSrc: '../../picture/ladd/',
	btnName: ['doit', 'quit', 'redo', 'abon', 'start', 'throw', 'open', 'home', 'follow', 'close'],
	btnText: ['抢夺', '取消', '重置', '丢弃', '开始', '丢弃', '打开', '分享', '关注', '关闭'],
};



let items = [
{title: '投入',
list: [
{title: '我的投入', vice: '投入的资金可被淘金者抢夺', 
logTips: '投入资金<h5>投入资金后可以抢夺等量的资金</h5>',
dot: 1, 
type: 'mine', 
group: '淘金者',
titleInfo: '我的资料', 
flexStr: '#0的投入',
laddStr: '阶梯<br/><h3>#0阶</h3>',
pieceStr: '剩余份数<br/><h3>#0份</h3>',
priceStr: '单个金额<br/><h3>#0元</h3>',
timesStr: '已传播<br/><h3>#0次</h3>',
doitText: '查看',
lines: []},
{title: '选择投入', vice: '投入资金后可以抢夺等量的资金', 
logTips: '投入资金<h5>投入资金后可以抢夺等量的资金</h5>',
dot: 1, 
type:'inve',
titleInfo: '淘金者资料', 
flexStr: '投入预览',
laddStr: '阶梯<br/><h3>#0阶</h3>',
pieceStr: '投入份数<br/><h3>#0份</h3>',
priceStr: '单个金额<br/><h3>#0元</h3>',
timesStr: '可传播<br/><h3>#0次</h3>',
doitText: '投入资金',
lines: []},
]},


{title: '抢夺', 
list: [
{title: '资金福袋', vice: '抢夺投入的资金以提高可获收益上限',
logTips: '抢夺淘金者资金<h5>完成的任务越多获得的资金越多</h5>',
dot: 1, 
type:'grab',
group: '淘金者', 
packType:'资金福袋', 
// taskTypes:['tetris', 'labyrinth', 'snake', 'puzzle', 'jigsaw'], 
taskTypes:['puzzle'], 
titlePack: '发现一个福袋', 
titleTask:'任务#0-#1', 
titleResult:'恭喜您获得了', 
titleInfo: '淘金者资料', 
flexStr: '#0的投入',
laddStr: '阶梯<br/><h3>#0阶</h3>',
pieceStr: '剩余份数<br/><h3>#0份</h3>',
priceStr: '单个金额<br/><h3>#0元</h3>',
timesStr: '已传播<br/><h3>#0次</h3>',
doitText: '抢夺资金',
lines: []}, 
]},


{title: '获取', 
list: [
{title: '收益红包', vice: '抢夺投放的红包来获取收益',
logTips: '获取赞助商红包<h5>完成的任务越多获得的红包金额越大</h5>',
dot: 100, 
type:'gain',
group: '赞助商', 
packType:'收益红包', 
// taskTypes:['puzzle', 'jigsaw', 'snake', 'labyrinth', 'tetris'], 
taskTypes:['puzzle'], 
titlePack: '发现一个红包', 
titleTask:'任务#0-#1', 
titleResult:'恭喜您获得了', 
titleInfo: '赞助商资料', 
flexStr: '#0的投放',
laddStr: '阶梯<br/><h3>#0阶</h3>',
pieceStr: '剩余份数<br/><h3>#0份</h3>',
priceStr: '单个金额<br/><h3>#0元</h3>',
timesStr: '已传播<br/><h3>#0次</h3>',
doitText: '获取红包',
lines: []},
]}
];

let items_sponer = [
{title: '投放', 
list: [
{title: '我的投放', vice: '投放的红包可被淘金者抢夺', 
dot: 1, 
type:'mine',
group: '赞助商',
packType:'红包', 
taskTypes:['puzzle', 'jigsaw', 'snake', 'labyrinth', 'tetris'], 
titlePack: '发现一个红包', 
titleTask:'任务#0-#1', 
titleResult:'恭喜您获得了', 
titleInfo: '赞助商资料', 

flexStr: '#0的投放',
laddStr: '阶梯<br/><h3>#0阶</h3>',
pieceStr: '剩余份数<br/><h3>#0份</h3>',
priceStr: '单个金额<br/><h3>#0元</h3>',
timesStr: '已传播<br/><h3>#0次</h3>',
doitText: '查看',
lines: [
{index: '1548342507258', stamp: '2019-01-24 23:08:27', ladder: 12, ladd: 8, multi: 3, inver: '我', tag: ['众鑫淘金', '海量红包', '等你发掘']},
{index: '1548342507258', stamp: '2019-01-23 12:18:10', ladder: 9, ladd: 5, multi: 15, inver: '我', tag: ['众鑫淘金', '海量红包', '等你发掘']},
]},
{title: '选择阶梯', vice: '投入资金后可以抢夺等量的资金', 
dot: 1, 
type:'inve',
inverStr: '投放者: ', 
flexStr: '投放预览',
laddStr: '阶梯<br/><h3>#0阶</h3>',
pieceStr: '投入份数<br/><h3>#0份</h3>',
priceStr: '单个金额<br/><h3>#0元</h3>',
timesStr: '可传播<br/><h3>#0次</h3>',
doitText: '投放红包',
lines: []},
]},
];

let instance = {
	mine: [
		{nexu:1, uid:'d50001', sid:'s40001'},
		{nexu:2, uid:'d50001', sid:'s40002'},
	],
	grab: [
		{nexu:1, uid:'d10001', sid:'s40001'},
		{nexu:1, uid:'d10002', sid:'s40002'},
		{nexu:1, uid:'d10003', sid:'s40003'},
		{nexu:1, uid:'d10004', sid:'s40004'},
		{nexu:1, uid:'d10005', sid:'s40005'},
		{nexu:1, uid:'d10006', sid:'s40006'},
		{nexu:1, uid:'d10007', sid:'s40007'},
		{nexu:1, uid:'d10008', sid:'s40008'},
		{nexu:1, uid:'d10009', sid:'s40009'},
		{nexu:1, uid:'d10010', sid:'s40001'},
		{nexu:1, uid:'d20001', sid:'s40002'},
		{nexu:1, uid:'d20002', sid:'s40003'},
		{nexu:1, uid:'d20003', sid:'s40004'},
		{nexu:1, uid:'d20004', sid:'s40005'},
		{nexu:1, uid:'d20005', sid:'s40006'},
		{nexu:1, uid:'d20006', sid:'s40007'},
		{nexu:1, uid:'d20007', sid:'s40008'},
		{nexu:1, uid:'d20008', sid:'s40009'},
	],
	gain: [
        {nexu:1, uid: 's40001'},
        {nexu:1, uid: 's40002'},
        {nexu:1, uid: 's40003'},
        {nexu:1, uid: 's40004'},
        {nexu:1, uid: 's40005'},
        {nexu:1, uid: 's40006'},
        {nexu:1, uid: 's40007'},
        {nexu:1, uid: 's40008'},
        {nexu:1, uid: 's40009'},
	],
};



let items_ghost = [
{ id: 0, title: '修炼', 
list: [
{title: '修炼中', vice: '请勿打扰！谢谢！', 
dot: 1, 
isGrab: 1, 
group: '凡人',
inverStr: '修炼者: ', 
flexStr: '#0正在修炼',
laddStr: '阶梯<br/><h3>#0阶</h3>',
pieceStr: '剩余份数<br/><h3>#0份</h3>',
priceStr: '单个金额<br/><h3>#0元</h3>',
timesStr: '已传播<br/><h3>#0次</h3>',
btnName: ['quit'],
btnText: ['关闭'],
lines: [
{index: '1548342507258', stamp: '2019-01-24</br><h3>23:08:27',ladder: 12,  ladd: 8, multi: 3, inver: '我', tag: ['众鑫淘金', '海量红包', '等你发掘']},
{index: '1548342507258', stamp: '2019-01-23</br><h3>12:18:10',ladder: 9,  ladd: 5, multi: 15, inver: '我', tag: ['众鑫淘金', '海量红包', '等你发掘']},
]},
{title: '修炼道场', vice: '绝世神功，在此练成！', 
dot: 1, 
isGrab: 0, 
group: '凡人',
inverStr: '修炼者: ', 
flexStr: '武功秘籍',
laddStr: '阶梯<br/><h3>#0阶</h3>',
pieceStr: '投入份数<br/><h3>#0份</h3>',
priceStr: '单个金额<br/><h3>#0元</h3>',
timesStr: '可传播<br/><h3>#0次</h3>',
btnName: ['doit', 'quit'],
btnText: ['修炼', '放弃'],
lines: []},
]},


{ id: 1, title: '斩妖', 
list: [
{title: '锁妖塔', vice: '我杀！故我在！！！',
dot: 1, 
isGrab: 1, 
group: '妖女', 
instance: 'ghost',
packTitle: '放下屠刀 立地成佛', 
taskTitle:'任务#0-#1', 
taskType:['puzzle', 'jigsaw'], 
resultTitle:'恭喜您获得了', 
packType:'妖精的尾巴', 

inverStr: '领主: ', 
flexStr: '#0的栖息地',
laddStr: '阶梯<br/><h3>#0阶</h3>',
pieceStr: '剩余份数<br/><h3>#0份</h3>',
priceStr: '单个金额<br/><h3>#0元</h3>',
timesStr: '已传播<br/><h3>#0次</h3>',
btnName: ['doit', 'quit', 'redo', 'abon', 'start', 'throw', 'open', 'home', 'follow', 'close'],
btnText: ['挑战', '放弃', '重置', '返回', '开始', '丢弃', '事了拂衣去', '分享', '关注', '深藏功与名'],
lines: []}, 
]},


{ id: 3, title: '除魔',
list: [
{title: '魔界', vice: '破山贼易，破心魔难！',
dot: 100, 
isGrab: 1, 
group: '魔鬼', 
instance: 'monster',
packTitle: '阿弥陀佛 善哉善哉', 
taskTitle:'任务#0-#1', 
taskType:['puzzle', 'jigsaw'], 
resultTitle:'恭喜您获得了', 
packType:'魔石', 

inverStr: '领主: ', 
flexStr: '#0的栖息地',
laddStr: '阶梯<br/><h3>#0阶</h3>',
pieceStr: '剩余份数<br/><h3>#0份</h3>',
priceStr: '单个金额<br/><h3>#0元</h3>',
timesStr: '已传播<br/><h3>#0次</h3>',
btnName: ['doit', 'quit', 'redo', 'abon', 'start', 'throw', 'open', 'home', 'follow', 'close'],
btnText: ['挑战', '放弃', '重置', '返回', '开始', '丢弃', '事了拂衣去', '分享', '关注', '深藏功与名'],
lines: []},
]}
];

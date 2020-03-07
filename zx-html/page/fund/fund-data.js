window.onload = function() {
	getAgent();
	setConfig();
	setElems();
	setAgent();
	setInner();
}

function setConfig() {
	localData.init("init");
}

var config = {
	name: "fund",
	outerOffset: 230,
	innerOffset: 818, 
	minHeight: 900,
	radius: "30px",
	border: [[""],["TopLeft", "TopRight"],["BottomLeft"],["BottomRight"]],
	dict: "HIJKLMNOPQRSTUV",
};

var items = [
{title: "本金", colorIdx: 1,
list:[
{title:"我的本金", vice:"I.可以提现/H.充值本金 = ", allow:"HIJKL", trrow: 3,
lines:[
[{col:2, text:"H.充值本金", border:1}], 
[{col:1, text:"I.可以提现", border:2}, {col:1, text:"J.已经投入", border:3}], [],
[{col:2, text:"L.可用本金", border:1}], 
[{col:1, text:"K.可以投入", border:2}, {col:1, text:"J.已经投入", border:3}],
], 
blocks:[
[{row:2, text:"H.充值本金"}, {row:1, text:"I.可以提现"}, {}],
[{row:1, text:"J.已经投入"}, {row:2, text:"L.可用本金"}],
[{}, {row:1, text:"K.可以投入"}]
],
buttons:[
[{idx:201, text:"充值", title:"本金充值", tran:"H*1|I*1|K*1|L*1", limit: "h", bgcolor: "green"}],
[{idx:202, text:"提现", title:"本金提现", tran:"H*-1|I*-1|K*-1|L*-1", limit:"I", bgcolor: "red"}],
[{idx:203, text:"方格视图", bgcolor:"red"}, {idx:204, text:"查看记录", title:"本金记录"}, {idx:205, text:"列表视图", bgcolor:"green"}],
]},
]},

{title: "资金", colorIdx: 2,
list:[
{title:"我的资金", vice:"O.可以抢夺/M.上次投入 = ", allow: "MNOPQ", trrow: 3,
lines: [
[{col:2, text:"M.上次投入", border:1}], 
[{col:1, text:"N.已经抢夺", border:2}, {col:1, text:"O.可以抢夺", border:3}], [],
[{col:2, text:"Q.累计投入", border:1}], 
[{col:1, text:"P.累计抢夺", border:2}, {col:1, text:"O.可以抢夺", border:3}],
], 
blocks: [
[{row:2, text:"M.上次投入"}, {row:1, text:"N.已经抢夺"}],
[{row:1, text:"O.可以抢夺"}, {row:2, text:"Q.累计投入"}],
[{}, {row:1, text:"P.累计抢夺"}],
],
buttons:[
[{idx:301, text:"投入", title:"投入资金", tran:"M*1|Q*1|O*1|J*1|I*-1|K*-1|R*0.01|S*0.01", limit:"K", bgcolor: "green"}],
[{idx:302, text:"抢夺", title:"抢夺资金", tran:"N*1|P*1|I*1|K*1|O*-1|J*-1", limit:"O", bgcolor: "red"}],
[{idx:303, text:"方格视图", bgcolor:"red"}, {idx:304, text:"查看记录", title:"资金记录"}, {idx:305, text:"列表视图", bgcolor:"green"}],
]},
]},

{title: "收益", colorIdx: 3, 
list:[
{title:"我的收益", vice:"S.可获收益/R.收益上限 = ", allow: "RSTUV", trrow: 3,
lines:[
[{col:2, text:"R.收益上限", border:1}], 
[{col:1, text:"S.可获收益", border:2}, {col:1, text:"T.已获收益", border:3}], [],
[{col:2, text:"T.已获收益", border:1}], 
[{col:1, text:"U.可以提现", border:2}, {col:1, text:"V.已经提现", border:3}],
],
blocks:[
[{row:3, text:"R.收益上限"}, {row:1, text:"S.可获收益"}],
[{row:2, text:"T.已获收益"}, {row:1, text:"U.可以提现"}],
[{row:1, text:"V.已经提现"}],
],
buttons:[
[{idx:401, text:"获取", title:"收益获取", tran:"T*1|U*1|S*-1", limit:"S", bgcolor: "green"}],
[{idx:402, text:"提现", title:"收益提现", tran:"V*1|U*-1", limit:"U", bgcolor: "red"}],
[{idx:403, text:"方格视图", bgcolor:"red"}, {idx:404, text:"查看记录", title:"收益记录"}, {idx:405, text:"列表视图", bgcolor:"green"}],
]},
]},
];



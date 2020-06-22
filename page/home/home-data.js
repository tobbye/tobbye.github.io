window.onload = function() {
    Config.init();
    Alert.init();
	Home.init();
}


var cfg = {
	name: "home",
	isRank: true,
};


var items = [
{title:"主页", 
list: [

{title:"我的领地", vice:"查询到#1条结果", buttonIdx: [0,1,3],
isResult:1,
lines: [
	{uid: 'd50001', pos: 'HELLO-217'},
	{uid: 'd50001', pos: 'MY-116'},
	{uid: 'd50001', pos: 'NAME-95'},
	{uid: 'd50001', pos: 'IS-168'},
	{uid: 'd50001', pos: 'ERGOU-7'},
]},
{title:"新大陆", vice:"一片处女地等待您的探索", 
isDepot:1,
btnStr: `
	<div class="flex">
        <button class="button" state="permit" name="clear" onclick="Depot.toHome()">中心区域</button>
    </div>
	<div class="flex">
        <button class="button" state="permit" name="enter" onclick="Depot.toEnter()">探索</button>
        <button class="button" state="permit" name="enter" onclick="Depot.toEnter()">占领</button>
    </div>`,
},
{title:"公共领地", vice:"查询到#1条结果", buttonIdx: [0,1,3],
isResult:1,
lines: [
	{uid: 'd10001'},
	{uid: 'd10002'},
	{uid: 'd10003'},
	{uid: 'd20001'},
	{uid: 'd20002'},
	{uid: 'd20003'},
	{uid: 's40001'},
	{uid: 's40002'},
	{uid: 's40003'},
	{uid: 'd50001'},
	{uid: 'd50002'},
	{uid: 'd50003'},
]},
]},
];
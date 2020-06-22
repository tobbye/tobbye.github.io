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
{title:"天机图", vice:"天机不可泄露！", 
isDepot:1,
btnStr: `
	<div class="flex">
        <button class="button" state="permit" name="clear" onclick="Depot.toHome()">主页</button>
    </div>
	<div class="flex">
        <button class="button" state="permit" name="enter" onclick="Depot.toEnter()">进入</button>
    </div>`,
},
{title:"结果", vice:"查询到#1条结果", buttonIdx: [0,1,3],
isResult:1,
lines: [
{uid: 'd120001', name: '二狗子本人', ladd: 7, tag: ['你好', '我叫', '二狗子'], mark: ['二狗俱乐部', '二狗家族']},
{uid: 's110004', name: '萌萌职业技术学院', ladd: 20, tag: ['挖掘机', '技术', '哪家强'], mark: ['技术培训', '技术学院']},
{uid: 's110005', name: '萌萌部落格', ladd: 17, tag: ['孤独症患者', '抑郁症患者', '强迫症患者'], mark: ['二次元', '中二病']},
{uid: 'd120005', name: '二狗子的老婆', ladd: 6, tag: ['年龄25', '体重150', '身高150'], mark: ['二狗俱乐部', '二狗家族']},
{uid: 's110006', name: '萌萌家族', ladd: 15, tag: ['大萌', '二萌', '小萌'], mark: ['武林萌主', '天下第一萌']},
{uid: 'd120007', name: '二狗子的表妹', ladd: 11, tag: ['王源', '王俊凯', '易烊千玺'], mark: ['二狗俱乐部', '二狗家族']},
{uid: 's210004', name: '萌萌美容美发', ladd: 17, tag: ['理发', '美容', '美发'], mark: ['空标签', '空标签']},
{uid: 'd120006', name: '二狗子的岳父', ladd: 8, tag: ['象棋大师', '围棋七段', '格斗冠军'], mark: ['二狗俱乐部', '二狗家族']},
{uid: 's210009', name: '萌萌养生堂', ladd: 16, tag: ['针灸', '拔火罐', '刮痧'], mark: ['空标签', '空标签']},
{uid: 's210009', name: '萌萌汽修', ladd: 16, tag: ['保养', '修车', '洗车'], mark: ['金牌修理师', '金牌技师']},
]},
]},
];
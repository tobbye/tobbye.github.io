window.onload = function() {
	getAgent();
	setElems();
	setAgent();
    setInner();
}

var config = {
	name: 'inve',
	laddCount: 25,
	laddSrc: '../../picture/ladd/',
	showColor: 'red',
	hideColor: 'green',
	color: [
	{deep:'#684',normal:'#8a6', light:'#cea'}, 
	{deep:'#468',normal:'#68a', light:'#ace'},
	{deep:'#648',normal:'#86a', light:'#cae'},
	{deep:'#864',normal:'#a86', light:'#eca'},
	{deep:'#846',normal:'#a68', light:'#eac'},
	],
	btnName: ['next',  'doit', 'quit', 'redo', 'abon', 'open', 'more', 'close'],
};

var items = [
{ id: 0, title: '投入', colorIdx: 1,
list: [
{title: '我的投入', vice: '投入的资金可被淘金者抢夺', 
dot: 1, isGrab: 1, 
inverStr: '投入者：', flexStr: '的投入',
laddStr: '阶梯<br/><h3>{0}阶</h3>',
pieceStr: '剩余份数<br/><h3>{0}份</h3>',
priceStr: '单个金额<br/><h3>{0}元</h3>',
timesStr: '已传播<br/><h3>{0}次</h3>',
btnName: ['quit'],
btnText: ['关闭'],
lines: [
{index: '1548342507258', stamp: '2019-01-24</br>23:08:27', 
ladd: 8, multi: 3, inver: '我', tag: ['众鑫淘金', '海量红包', '等你发掘']},
{index: '1548342507258', stamp: '2019-01-23</br>12:18:10', 
ladd: 5, multi: 15, inver: '我', tag: ['众鑫淘金', '海量红包', '等你发掘']},
]},
{title: '选择阶梯', vice: '投入资金后可以抢夺等量的资金', 
dot: 1, isGrab: 0, 
inverStr: '投入者：', flexStr: '投入预览',
laddStr: '阶梯<br/><h3>{0}阶</h3>',
pieceStr: '投入份数<br/><h3>{0}份</h3>',
priceStr: '单个金额<br/><h3>{0}元</h3>',
timesStr: '可传播<br/><h3>{0}次</h3>',
btnName: ['doit', 'quit'],
btnText: ['投入', '取消'],
lines: []},
]},


{ id: 1, title: '抢夺', colorIdx: 2,
list: [
{title: '资金池', vice: '抢夺资金以提高可获收益上限', 
dot: 1, isGrab: 1, instance: 'vip_str',
inverStr: '投入者：', flexStr: '的投入',
laddStr: '阶梯<br/><h3>{0}阶</h3>',
pieceStr: '剩余份数<br/><h3>{0}份</h3>',
priceStr: '单个金额<br/><h3>{0}元</h3>',
timesStr: '已传播<br/><h3>{0}次</h3>',
btnName: ['next', 'quit', 'redo', 'abon', 'open', 'more', 'close'],
btnText: ['抢夺', '取消', '重置', '丢弃', '打开', '查看', '关闭'],
lines: []}, 
]},


// { id: 2, title: '投放', colorIdx: 3,
// list: [
// {title: '我的投放', vice: '投放的红包可被投入者抢夺', 
// dot: 100, isGrab: 1,
// inverStr: '投放者：', flexStr: '的投放',
// laddStr: '阶梯<br/><h3>{0}阶</h3>',
// pieceStr: '剩余份数<br/><h3>{0}份</h3>',
// priceStr: '单个金额<br/><h3>{0}元</h3>',
// timesStr: '已传播<br/><h3>{0}次</h3>',
// btnName: ['quit'],
// btnText: ['关闭'],
// lines: [
// {index: '1548342507364', stamp: '2019-01-24</br>23:08:27', 
// ladd: 13, multi: 1, inver: '我', tag: ['众鑫淘金', '海量红包', '等你发掘']},
// ]},
// {title: '选择区域', vice: '选择在附近或在指定市区投放'},
// {title: '设置内容', vice: '设置每一阶梯红包要投放的推广内容'},
// {title: '选择阶梯', vice: '向抢夺红包和资金的淘金者展示推广内容', 
// dot: 100, isGrab: 0, 
// inverStr: '投放者：', flexStr: '投放预览',
// laddStr: '阶梯<br/><h3>{0}阶</h3>',
// pieceStr: '投放份数<br/><h3>{0}份</h3>',
// priceStr: '单个金额<br/><h3>{0}元</h3>',
// timesStr: '可传播<br/><h3>{0}次</h3>',
// btnName: ['doit', 'quit'],
// btnText: ['投放', '取消'],
// lines: []},
// ]},


{ id: 3, title: '获取', colorIdx: 3,
list: [
{title: '红包池', vice: '抢夺投放的红包来获取收益', 
dot: 100, isGrab: 1, instance: 'car_str',
inverStr: '投放者：', flexStr: '的投放',
laddStr: '阶梯<br/><h3>{0}阶</h3>',
pieceStr: '剩余份数<br/><h3>{0}份</h3>',
priceStr: '单个金额<br/><h3>{0}元</h3>',
timesStr: '已传播<br/><h3>{0}次</h3>',
btnName: ['next', 'quit', 'redo', 'abon', 'open', 'more', 'close'],
btnText: ['获取', '取消', '重置', '丢弃', '打开', '查看', '关闭'],
lines: []},
]}
];


var useragent = `
张雄壮,
李刚猛,
王坚强,
赵震撼,
章威武,
`;

var instance = {
	vip_str : `
Chanel/香奈儿,
Louis Vuitton/路易威登,
Dior/迪奥,
Gucci/古驰,
Armani/阿玛尼,
Versace/范思哲,
MaxMara/玛克斯马拉,
Hermes/爱马仕,
Tiffany/蒂芙尼,
Prada/普拉达,
Burb erry/博柏利,
Givenchy/纪梵希,
Fendi/芬迪,
Baolida/巴黎世家,
Ferra gamo/菲拉格慕,
Valen tino/瓦伦迪诺
`,

	car_str : `
Bentley/宾利,
Rolls Royce/劳斯莱斯,
Aston Martin/阿斯顿马丁,
Land Rover/路虎,
Jaguar/捷豹,
Lincoln/林肯,
Cadi llac/凯迪拉克,
Jeep/吉普,
Buick/别克,
Ford/福特,
Chrysler/克莱斯勒,
Dodge/道奇,
Chevro let/雪佛兰,
Acura/讴歌,
Lexus/雷克萨斯,
Infiniti/英菲尼迪,
Toyota/丰田,
Nissan/日产,
Honda/本田,
Mazda/马自达,
Subaru/斯巴鲁,
Maybach/迈巴赫,
Mercedes Benz/梅塞德斯奔驰,
Porsche/保时捷,
BMW /宝马,
Audi/奥迪,
Volks wagen/大众,
Ferrari/法拉利,
Lamborg hini/兰博基尼,
Maserati/玛莎拉蒂,
Alfa Romeo/阿尔法罗密欧,
Fiat/菲亚特,
Red Banner/红旗,
Qirui/奇瑞,
GreatWall/长城,
Byd/比亚迪,
Changan/长安,
Geely/吉利
`,
};


window.onload = function() {
    getAgent();
    setElems();
    setAgent();
    setInner();
}

var config = {
    name: "rank",
    rankCount: 10,
    order: ["1st", "2nd", "3rd", "4th"],
    buttons:[
        { idx:0, text: '发消息', bgcolor: 'green'},
        { idx:1, text: '添加关注', bgcolor: 'green'},
        { idx:2, text: '取消关注', bgcolor: 'red'},
        { idx:3, text: '查看主页', bgcolor: 'indigo'},
    ],
    unit: {
        uid: 'uid001', 
        name: 'The Sponsor', 
        ladd: 17, 
        tag: ['自定义标签1', '自定义标签2', '自定义标签3'], 
        mark: ["身份标签1", "身份标签2"],
        mark2: ["阶层标签1", "阶层标签2"],
        mark3: ["成就标签1", "成就标签2"],
        mark4: ["排名标签1", "排名标签2"],
        mark5: ["评价标签1", "评价标签2"],
        desc: `<h3>谁能告诉我花儿为什么那么红？</h3>
        陈晴晴2009，叶梦梦2009，王嫚嫚2010，胡泱秧2013，邓小丽2016，赵素华2016，黎桂清2017，章威威2018，
        崔慧珍2019，鲍青青2019，汤小英2019，张沙沙2019觉得很赞！`,

    },
        chat: [
    {text:"大佬您好，我这有个价值20亿的项目需要投资，您是否要了解一下？", time:"11：25", isMine:0},
    {text:"好的，你说吧，抓重点说。", time:"11：25", isMine:1},
    {text:"如何一块变两块？", time:"11：25", isMine:0},
    {text:`今天一块变两块，明天两块变四块；
后天四块变八块，大后天一十六块；
十天二零四八块，一月二十一亿块。`, time:"11：27", isMine:0},
    {text:`方法：
1).培养一种繁殖周期是1天的生物体
2).剪下蚂蚁的寻路基因植入此生物体内
3).剪下蜜蜂的采集基因进行改造
4).在采集基因上镶嵌3.66毫克黄金（价值1元，金价273/克）
5).把采集基因植入此生物体内
6).把此生物体投放到非洲金矿
7).在31天后把蚁后投放到金矿上
8).在蚁后的吸引下这些生物体聚集到一起，数一数，有21.47亿个
9).关键时刻到了，一把火（3000度以上）烧死这么多的生物体
10).等冷却凝固后，地上一堆黄色金属，称重约7.866吨，价值估算21.47亿元
如此目标实现！`, time:"11：27", isMine:0},

    {text:`二狗子，你这个项目我很有兴趣，你先市场调研一下，出个详细的策划案出来，把步骤和具体细节都罗列出来，最好到非洲金矿实地考察一下。`, time:"11：30", isMine:1},
    {text:`另外PPT也是必不可少的，一定要做的美观一点，你上次那个「母猪如何择优配种」项目就是栽在PPT上，做的像狗屎一样，这次可不能再像上次那样瞎搞了。`, time:"11：30", isMine:1},
    {text:`启动资金的问题你不用担心，我大力支持。加油干！二狗子！`, time:"11：30", isMine:1},
    ],
};


var items = [

{title:"日榜", colorIdx: 1, seed: 1,
list:[
{title: '1.1 赞助商投放', text: '投放', vice: '2019年1月15日', group: "赞助商", seed: 1e4, lines:[], buttonIdx:[0,1,3]},
{title: '1.2 赞助商捐赠', text: '捐赠', vice: '2019年1月15日', group: "赞助商", seed: 1e2, lines:[], buttonIdx:[0,1,3]},
{title: '1.3 淘金者投入', text: '投入', vice: '2019年1月15日', group: "淘金者", seed: 1e3, lines:[], buttonIdx:[0,1,3]},
{title: '1.4 淘金者抢夺', text: '抢夺', vice: '2019年1月15日', group: "淘金者", seed: 1e3, lines:[], buttonIdx:[0,1,3]},
{title: '1.5 淘金者收益', text: '收益', vice: '2019年1月15日', group: "淘金者", seed: 1e1, lines:[], buttonIdx:[0,1,3]},
{title: '1.6 淘金者捐赠', text: '捐赠', vice: '2019年1月15日', group: "淘金者", seed: 1e1, lines:[], buttonIdx:[0,1,3]},
]},


{title:"周榜", colorIdx: 2, seed: 7,
list:[
{title: '2.1 赞助商投放', text: '投放', vice: '2019年第2周', group: "赞助商", seed: 1e4, lines:[], buttonIdx:[0,1,3]},
{title: '2.2 赞助商捐赠', text: '捐赠', vice: '2019年第2周', group: "赞助商", seed: 1e2, lines:[], buttonIdx:[0,1,3]},
{title: '2.3 淘金者投入', text: '投入', vice: '2019年第2周', group: "淘金者", seed: 1e3, lines:[], buttonIdx:[0,1,3]},
{title: '2.4 淘金者抢夺', text: '抢夺', vice: '2019年第2周', group: "淘金者", seed: 1e3, lines:[], buttonIdx:[0,1,3]},
{title: '2.5 淘金者收益', text: '收益', vice: '2019年第2周', group: "淘金者", seed: 1e1, lines:[], buttonIdx:[0,1,3]},
{title: '2.6 淘金者捐赠', text: '捐赠', vice: '2019年第2周', group: "淘金者", seed: 1e1, lines:[], buttonIdx:[0,1,3]},
]},


{title:"月榜", colorIdx: 3, seed: 30,
list:[
{title: '3.1 赞助商投放', text: '投放', vice: '2018年12月', group: "赞助商", seed: 1e4, lines:[], buttonIdx:[0,1,3]},
{title: '3.2 赞助商捐赠', text: '捐赠', vice: '2018年12月', group: "赞助商", seed: 1e2, lines:[], buttonIdx:[0,1,3]},
{title: '3.3 淘金者投入', text: '投入', vice: '2018年12月', group: "淘金者", seed: 1e3, lines:[], buttonIdx:[0,1,3]},
{title: '3.4 淘金者抢夺', text: '抢夺', vice: '2018年12月', group: "淘金者", seed: 1e3, lines:[], buttonIdx:[0,1,3]},
{title: '3.5 淘金者收益', text: '收益', vice: '2018年12月', group: "淘金者", seed: 1e1, lines:[], buttonIdx:[0,1,3]},
{title: '3.6 淘金者捐赠', text: '捐赠', vice: '2018年12月', group: "淘金者", seed: 1e1, lines:[], buttonIdx:[0,1,3]},
]},


{title:"总榜", colorIdx: 4, seed: 750,
list:[
{title: '4.1 赞助商投放', text: '投放', vice: '2017年4月5日至今', group: "赞助商", seed: 1e4, lines:[], buttonIdx:[0,1,3]},
{title: '4.2 赞助商捐赠', text: '捐赠', vice: '2017年4月5日至今', group: "赞助商", seed: 1e2, lines:[], buttonIdx:[0,1,3]},
{title: '4.3 淘金者投入', text: '投入', vice: '2017年4月5日至今', group: "淘金者", seed: 1e3, lines:[], buttonIdx:[0,1,3]},
{title: '4.4 淘金者抢夺', text: '抢夺', vice: '2017年4月5日至今', group: "淘金者", seed: 1e3, lines:[], buttonIdx:[0,1,3]},
{title: '4.5 淘金者收益', text: '收益', vice: '2017年4月5日至今', group: "淘金者", seed: 1e1, lines:[], buttonIdx:[0,1,3]},
{title: '4.6 淘金者捐赠', text: '捐赠', vice: '2017年4月5日至今', group: "淘金者", seed: 1e1, lines:[], buttonIdx:[0,1,3]},
]},
];

var industry = `
01-农,
02-林,
03-畜牧,
04-渔,
05-农、林、牧、渔专业及辅助性活动,
06-煤炭开采和洗选,
07-石油和天然气开采,
08-黑色金属矿采选,
09-有色金属矿采选,
10-非金属矿采选,
11-开采专业及辅助性活动,
12-其他采矿,
13-农副食品加工,
14-食品制造,
15-酒、饮料和精制茶制造,
16-烟草制品,
17-纺织,
18-纺织服装、服饰,
19-皮革、毛皮、羽毛及其制品和制鞋,
20-木材加工和木、竹、藤、棕、草制品,
21-家具制造,
22-造纸和纸制品,
23-印刷和记录媒介复制,
24-文教、工美、体育和娱乐用品制造,
25-石油、煤炭及其他燃料加工,
26-化学原料和化学制品制造,
27-医药制造,
28-化学纤维制造,
29-橡胶和塑料制品,
30-非金属矿物制品,
31-黑色金属冶炼和压延加工业,
32-有色金属冶炼和压延加工,
33-金属制品,
34-通用设备制造,
35-专用设备制造,
36-汽车制造,
37-铁路、船舶、航空航天和其他运输设备制造,
38-电气机械和器材制造,
39-计算机、通信和其他电子设备制造,
40-仪器仪表制造,
41-其他制造,
42-废弃资源综合利用,
43-金属制品、机械和设备修理,
44-电力、热力生产和供应,
45-燃气生产和供应,
46-水的生产和供应,
47-房屋建筑,
48-土木工程建筑,
49-建筑安装,
50-建筑装饰、装修和其他建筑,
51-批发,
52-零售,
53-铁路运输,
54-道路运输,
55-水上运输,
56-航空运输,
57-管道运输,
58-多式联运和运输代理,
59-装卸搬运和仓储,
60-邮政,
61-住宿,
62-餐饮,
63-电信、广播电视和卫星传输服务,
64-互联网和相关服务,
65-软件和信息技术服务,
66-货币金融服务,
67-资本市场服务,
68-保险,
69-其他金融,
70-房地产,
71-租赁,
72-商务服务,
73-研究和试验发展,
74-专业技术服务,
75-科技推广和应用服务,
76-水利管理,
77-生态保护和环境治理,
78-公共设施管理,
79-土地管理,
80-居民服务,
81-机动车、电子产品和日用产品修理,
82-其他服务,
83-教育,
84-卫生,
85-社会工作,
86-新闻和出版,
87-广播、电视、电影和录音制作,
88-文化艺术,
89-体育,
90-娱乐,
91-中国共产党机关,
92-国家机构,
93-人民政协、民主党派,
94-社会保障,
95-群众团体、社会团体和其他成员组织,
96-基层群众自治组织,
97-国际组织
`;

var instance = `
Bentley(宾利),
Rolls Royce(劳斯莱斯),
Aston Martin(阿斯顿马丁),
Land Rover(路虎),
Jaguar(捷豹),
MG(美格),
Lincoln(林肯),
Cadillac(凯迪拉克),
Jeep(吉普),
Buick(别克),
Ford(福特),
Chrysler(克莱斯勒),
Dodge(道奇),
Chevrolet(雪佛兰),
Acura(讴歌),
Lexus(雷克萨斯),
Infiniti(英菲尼迪),
Toyota(丰田),
Nissan(日产),
Honda(本田),
Mazda(马自达),
Subaru(斯巴鲁),
Maybach(迈巴赫),
Mercedes-Benz(梅塞德斯-奔驰),
Porsche(保时捷),
BMW (宝马),
Audi(奥迪),
Volkswagen(大众),
Ferrari(法拉利),
Lamborghini(兰博基尼),
Maserati(玛莎拉蒂),
Alfa Romeo(阿尔法罗密欧),
Fiat(菲亚特),
Red Banner(红旗),
Qirui(奇瑞),
GreatWall(长城),
Chonghua(中华),
Byd(比亚迪),
Changan(长安),
Geely(吉利)
`;


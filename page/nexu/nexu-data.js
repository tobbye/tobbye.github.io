window.onload = function() {
    Config.init();
    Alert.init();
	Nexu.init();
}

let cfg = {
    name: "nexu",
    isRank: false,
};




let items = [
{title: '消息', 
list: [
{title: '', vice:'', state: 'warn', buttonIdx: [0,3],
lines: [
	{uid:'d10001', nexu:3}, 
	{uid:'d10002', nexu:3}, 
	{uid:'d10003', nexu:3}, 
	{uid:'d10004', nexu:3}, 
	{uid:'d10005', nexu:3}, 
	{uid:'d10006', nexu:3}, 
	{uid:'d10007', nexu:3}, 
	{uid:'d10008', nexu:3}, 
	{uid:'d10009', nexu:3}, 
	{uid:'d10010', nexu:3},
	{uid:'d10011', nexu:3},
	{uid:'d10012', nexu:3},
]},
]},


{title: '关注', 
list: [
{title: '赞助商', vice: '强制关注的赞助商', buttonIdx: [0,1,3],
lines: [
	{uid:'s30001', nexu:1}, 
	{uid:'s30002', nexu:1}, 
	{uid:'s30003', nexu:1}, 
	{uid:'s30004', nexu:1}, 
	{uid:'s30005', nexu:1}, 
	{uid:'s30006', nexu:1},
]},

{title: '赞助商', vice:'我关注的赞助商', buttonIdx: [0,2,3],
lines: [
	{uid:'s40001', nexu:2}, 
	{uid:'s40002', nexu:2}, 
	{uid:'s40003', nexu:2}, 
	{uid:'s40004', nexu:2}, 
	{uid:'s40005', nexu:2}, 
	{uid:'s40006', nexu:2}, 
	{uid:'s40007', nexu:2}, 
	{uid:'s40008', nexu:2}, 
	{uid:'s40009', nexu:2}, 
]},

{title: '淘金者', vice:'我关注的淘金者', buttonIdx: [0,2,3],
lines: [
	{uid:'d50001', nexu:2}, 
	{uid:'d50002', nexu:2}, 
	{uid:'d50003', nexu:2}, 
	{uid:'d50004', nexu:2}, 
	{uid:'d50005', nexu:2}, 
	{uid:'d50006', nexu:2}, 
	{uid:'d50007', nexu:2}, 
	{uid:'d50008', nexu:2}, 
]},
]},


{title: '粉丝', 
list: [
{title: '淘金者', vice:'关注我的淘金者', buttonIdx: [0,1,3],
lines: [
	{uid:'d20001', nexu:1},
	{uid:'d20002', nexu:2},
	{uid:'d20003', nexu:1},
	{uid:'d20004', nexu:2},
	{uid:'d20005', nexu:1},
	{uid:'d20006', nexu:1},
	{uid:'d20007', nexu:1},
	{uid:'d20008', nexu:1},
]},
]},

];

let industry = `
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


window.onload = function() {
    getAgent();
    setElems();
    setAgent();
}

var config = {
    name: "rank",
    isRank: true,
    rankCount: 20,
    titleStr: "搜索:#0",
    buttons:[
        { idx:0, text: '发消息', btype: 'permit'},
        { idx:1, text: '添加关注', btype: 'permit'},
        { idx:2, text: '取消关注', btype: 'danger'},
        { idx:3, text: '查看主页', btype: 'defult'},
    ],

};


var items = [

{title:"日榜",
list:[
{title: '1.1 赞助商投放', text: '投放', vice: '2019年1月15日', group: "赞助商", power: 1, seed: 1e4, buttonIdx:[0,1,3]},
{title: '1.2 淘金者投入', text: '投入', vice: '2019年1月15日', group: "淘金者", power: 1, seed: 1e3, buttonIdx:[0,1,3]},
{title: '1.3 淘金者抢夺', text: '抢夺', vice: '2019年1月15日', group: "淘金者", power: 1, seed: 1e3, buttonIdx:[0,1,3]},
{title: '1.4 淘金者收益', text: '收益', vice: '2019年1月15日', group: "淘金者", power: 1, seed: 1e1, buttonIdx:[0,1,3]},
]},


{title:"周榜", 
list:[
{title: '2.1 赞助商投放', text: '投放', vice: '2019年第2周', group: "赞助商", power: 7, seed: 1e4, buttonIdx:[0,1,3]},
{title: '2.2 淘金者投入', text: '投入', vice: '2019年第2周', group: "淘金者", power: 7, seed: 1e3, buttonIdx:[0,1,3]},
{title: '2.3 淘金者抢夺', text: '抢夺', vice: '2019年第2周', group: "淘金者", power: 7, seed: 1e3, buttonIdx:[0,1,3]},
{title: '2.4 淘金者收益', text: '收益', vice: '2019年第2周', group: "淘金者", power: 7, seed: 1e1, buttonIdx:[0,1,3]},
]},


{title:"月榜", 
list:[
{title: '3.1 赞助商投放', text: '投放', vice: '2018年12月', group: "赞助商", power: 30, seed: 1e4, buttonIdx:[0,1,3]},
{title: '3.2 淘金者投入', text: '投入', vice: '2018年12月', group: "淘金者", power: 30, seed: 1e3, buttonIdx:[0,1,3]},
{title: '3.3 淘金者抢夺', text: '抢夺', vice: '2018年12月', group: "淘金者", power: 30, seed: 1e3, buttonIdx:[0,1,3]},
{title: '3.4 淘金者收益', text: '收益', vice: '2018年12月', group: "淘金者", power: 30, seed: 1e1, buttonIdx:[0,1,3]},
]},


{title:"总榜", 
list:[
{title: '4.1 赞助商投放', text: '投放', vice: '2017年4月5日至今', group: "赞助商", power: 750, seed: 1e4, buttonIdx:[0,1,3]},
{title: '4.2 淘金者投入', text: '投入', vice: '2017年4月5日至今', group: "淘金者", power: 750, seed: 1e3, buttonIdx:[0,1,3]},
{title: '4.3 淘金者抢夺', text: '抢夺', vice: '2017年4月5日至今', group: "淘金者", power: 750, seed: 1e3, buttonIdx:[0,1,3]},
{title: '4.4 淘金者收益', text: '收益', vice: '2017年4月5日至今', group: "淘金者", power: 750, seed: 1e1, buttonIdx:[0,1,3]},
]},
];

var sponer = [
"德州扒鸡-德州特产-小吃",
"山东煎饼-泰州特产-小吃",
"龙山黑陶-济南特产-手工艺品",
"龙山小米-济南特产-粮食",
"明水香稻-济南特产-粮食",
"东阿阿胶-济南特产-药材",
"章丘大葱-济南特产-调料",
"平阴玫瑰-济南特产-茶类",
"莱西大板栗-青岛特产-坚果",
"大泽山葡萄-青岛特产-水果",
"崂山绿茶-青岛特产-茶类",
"琅琊玉筋鱼-青岛特产-海产",
"泊里西施舌-青岛特产-海产",
"灵山岛海参-青岛特产-海产",
"平度大花生-青岛特产-蔬菜",
"蟠桃大姜-青岛特产-蔬菜",
"马家沟芹菜-青岛特产-蔬菜",
"胶州大白菜-青岛特产-蔬菜",
"烟台苹果-山东特产-水果",

"南京云锦-南京特产-手工艺品",
"雨花茶-南京特产-茶类",
"南京盐水鸭-南京特产-小吃",
"金陵盐水鸭-南京特产-小吃",
"羽毛贡扇-南京特产-手工艺品",
"固城湖螃蟹-南京特产-水产",
"扶余老醋-南京特产-调料",
"白马黑莓-南京特产-水果",
"八卦洲芦蒿-南京特产-蔬菜",
"洪蓝玉带糕-南京特产-小吃",
"阳澄湖大闸蟹-苏州特产-水产",
"碧螺春茶-苏州特产-茶类",
"苏绣-苏州特产-手工艺品",
"苏州豆腐干-苏州特产-小吃",
"太湖大闸蟹-苏州特产-水产",
"洞庭碧螺春茶-苏州特产-茶类",

"绿茶瓜片-六安特产-水果",
"砀山酥梨-砀山特产-水果",
"合肥龙虾-合肥特产-水产",
"黄陂湖大闸蟹-合肥特产-水产",
"白云春毫-合肥特产-茶类",
"巢湖白虾-合肥特产-水产",
"巢湖螃蟹-合肥特产-水产",
"巢湖麻鸭-合肥特产-家禽",
"三河米酒-合肥特产-酒类",
"大圩葡萄-合肥特产-水果",
"巢湖银鱼-合肥特产-水产",
"长丰草莓-合肥特产-水果",
"古井贡酒-亳州特产-洒类",
"亳白芍-亳州特产-药材",
"亳菊-亳州特产-药材",
"曹街子的萝卜-亳州特产-蔬菜",
"涡阳苔干-亳州特产-蔬菜",
"高炉酒-亳州特产-酒类",

"杭州丝绸-杭州特产-布料",
"龙井茶-杭州特产-茶类",
"西湖莼菜-杭州特产-蔬菜",
"塘栖枇杷-杭州特产-水果",
"里叶白莲-杭州特产-坚果",
"余杭径山茶-杭州特产-茶类",
"西湖龙井-杭州特产-茶类",
"张小泉剪刀-杭州特产-工具",
"建德苞茶-杭州特产-茶类",
"临安山核桃-杭州特产-坚果",
"慈溪杨梅-宁波特产-水果",
"宁波汤团-宁波特产-小吃",
"余姚杨梅-宁波特产-水果",
"象山梭子蟹-宁波特产-水产",
"慈溪葡萄-宁波特产-水果",
"慈城年糕-宁波特产-小吃",

"厦门漆线雕-厦门特产-手工艺品",
"同安凤梨穗-厦门特产-水果",
"古宅大蒜-厦门特产-调料",
"同安龙眼-厦门特产-水果",
"地瓜粉粿-厦门特产-小吃",
"上官青葱-厦门特产-调料",
"青果-厦门特产-水果",
"蚝仔煎-厦门特产-小吃",
"鳄鱼屿蚝汁-厦门特产-调料",
"海蛎煎-厦门特产-小吃",
"福州茉莉花茶-福州特产-茶类",
"连江鲍鱼-福州特产-水产",
"福州福桔-福州特产-水果",
"永泰芙蓉李干-福州特产-小吃",
"福州脱胎漆器-福州特产-手工艺品",
"福州橄榄-福州特产-水果",

"嘉定竹刻-嘉定特产-手工艺品",
"马陆葡萄-嘉定特产-水果",
"嘉定梅山猪-嘉定特产-家禽",
"嘉定白蒜-嘉定特产-调料",
"三鲜豌豆-嘉定特产-小吃",
"辣蛋片-嘉定特产-小吃",
"彭镇青扁豆-浦东特产-蔬菜",
"大白兔奶糖-浦东特产-零食",
"三林崩瓜-浦东特产-水果",
"浦东鸡-浦东特产-家禽",
"南汇水蜜桃-浦东特产-水果",
"粢饭-浦东特产-小吃",
"大团水蜜桃-浦东特产-水果",
"浦东三黄鸡-浦东特产-小吃",
"桂花糖藕-浦东特产-小吃",
"高桥松饼-浦东特产-小吃",

"平林镇大米-襄阳特产-粮食",
"南漳黑木耳-襄阳特产-菌菇",
"襄麦冬-襄阳特产-药材",
"流水西瓜-襄阳特产-水果",
"四井岗油桃-襄阳特产-水果",
"襄阳大头菜-襄阳特产-蔬菜",
"热干面-武汉特产-小吃",
"法泗大米-武汉特产-粮食",
"洪山紫菜苔-武汉特产-蔬菜",
"汉南甜玉米-武汉特产-粮食",
"黄陂荆蜜-武汉特产-蜂蜜",
"舒安藠头-武汉特产-蔬菜",
"梁子湖大河蟹-武汉特产-水产",
"蔡甸莲藕-武汉特产-蔬菜",
"黄陂马蹄-武汉特产-水果",
"武汉鸭脖-武汉特产-小吃",
];



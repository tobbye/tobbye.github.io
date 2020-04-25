window.onload = function() {
	getAgent();
	setElems();
	setAgent();
}

var config = {
	name: 'sett',
	styleName: ['dark', 'normal', 'bright', 'standard'],
	styleText: ['深色', '正常色', '亮色', '标准色'],
	typeIdx: '234567',
	typeText: '红橙蓝紫青绿',
};

var colors = [
    {normal:'#888', dark:'#333', light:'#ccc', bgd:'#eee', bright:'#888', standard:'black'},
    {normal:'#888', dark:'#ccc', light:'#333', bgd:'#111', bright:'#888', standard:'white'},
    {normal:'#c48', dark:'#957', light:'#eac', bgd:'#fde', bright:'#e28', standard:'red'},
    {normal:'#c84', dark:'#975', light:'#eca', bgd:'#fed', bright:'#e82', standard:'orange'},
    {normal:'#48c', dark:'#579', light:'#ace', bgd:'#def', bright:'#28e', standard:'blue'},
    {normal:'#84c', dark:'#759', light:'#cae', bgd:'#edf', bright:'#82e', standard:'purple'},
    {normal:'#4c8', dark:'#597', light:'#aec', bgd:'#dfe', bright:'#2e8', standard:'seagreen'},
    {normal:'#8c4', dark:'#795', light:'#cea', bgd:'#efd', bright:'#8e2', standard:'green'},
];





var items = [
{title: '设置', 
list: [
{title: '色彩', vice: '选择一个色彩样式', default: 0, key: 'colorType',
optName: ['Black', 'Colorful', 'White'],
optText: ['黑色', '彩色', '白色'],
},

{title: '数据', vice: '选择一个数据初始化', default: 0, key: 'dataIdx',
optName: ['Default', 'Data1', 'Data2', 'Data3'],
optText: ['默认', '数据1', '数据2', '数据3'],
},

{title: '初始化', vice: '获取，写入或者清空数据', default: 0, key: 'initType',
optName: ['Get', 'Set', 'Clear'],
optText: ['获取', '写入', '清空'],
},

{title: '调试', vice: '是否开启调试功能', default: 0, key: 'debugType',
optName: ['Close', 'Test', 'Open'],
optText: ['关闭', '试一试', '开启'],
},

{title: '模式', vice: '请选择一个模式', default: 0, key: 'modeType',
optName: ['Digger', 'Ghost'],
optText: ['众鑫淘金', '凡人修仙'],
},

]},
];
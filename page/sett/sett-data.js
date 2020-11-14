window.onload = function() {
    Config.init();
    Alert.init();
    Sett.init();
}

let cfg = {
	name: 'sett',
	styleName: ['dark', 'bright', 'standard'],
	styleText: ['暗色', '亮色', '标准色'],
	typeIdx: '0123456',
	typeText: '黑红橙蓝紫青绿',	
};

let colors = [
    {dark:'#333', bright:'#555', light:'#ddd', bgd:'#eee', standard:'black'},
    {dark:'#957', bright:'#b57', light:'#ecd', bgd:'#fde', standard:'red'},
    {dark:'#975', bright:'#b75', light:'#edc', bgd:'#fed', standard:'orange'},
    {dark:'#579', bright:'#57b', light:'#cde', bgd:'#def', standard:'blue'},
    {dark:'#759', bright:'#75b', light:'#dce', bgd:'#edf', standard:'purple'},
    {dark:'#597', bright:'#597', light:'#ced', bgd:'#dfe', standard:'seagreen'},
    {dark:'#795', bright:'#795', light:'#dec', bgd:'#efd', standard:'green'},
];




let items = [
{title: '设置', 
list: [
{title: '连接', vice: '请选择一个连接', default: 0, key: 'linkType',
optName: ['Github', 'Local', 'Http'],
optText: ['Github', '内网','外网'],
},

{title: '色彩', vice: '选择一个色彩样式和应用方式', default: 0, key: 'colorType',
optName: ['Text', 'Bgd', 'Page'],
optText: ['文字', '背景','标签页'],
},


{title: '调试', vice: '是否开启调试功能', default: 0, key: 'debugType',
optName: ['Close', 'Test', 'Open'],
optText: ['关闭', '试一试', '开启'],
},

// {title: '模式', vice: '请选择一个模式', default: 0, key: 'modeType',
// optName: ['Digger', 'Ghost'],
// optText: ['众鑫淘金', '凡人修仙'],
// },
]},
];
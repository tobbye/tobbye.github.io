window.onload = function() {
	getAgent();
	setElems();
	setAgent();
}

var config = {
	name: "sett",
};


var items = [
{title: '设置', colorIdx: 1,
list: [
{title: '样式', vice: '选择一个色彩样式', default: 0, key: 'colorType',
btnName: ['Black', 'Dark', 'Normal', 'Bright'],
btnText: ['黑色', '深色', '正常色', '亮色'],
},

{title: '数据', vice: '选择一个数据初始化', default: 0, key: 'dataIdx',
btnName: ['Default', 'Data1', 'Data2', 'Data3'],
btnText: ['默认', '数据1', '数据2', '数据3'],
},

{title: '初始化', vice: '获取，写入或者清空数据', default: 0, key: 'initType',
btnName: ['Get', 'Set', 'Clear'],
btnText: ['获取', '写入', '清空'],
},

{title: '调试', vice: '选择调试方式', default: 0, key: 'debugType',
btnName: ['Close', 'Console', 'Alert'],
btnText: ['关闭', '跳转', '弹窗'],
},

{title: '模式', vice: '选择一个模式', default: 0, key: 'modeType',
btnName: ['Normal', 'Ghost'],
btnText: ['正常模式', '地狱模式'],
},
]},

];
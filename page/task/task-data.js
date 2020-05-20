var task = {
	idx: 0,
	isNext: false,
	isStart: false,

};

var taskCfg = {
	logNext:'<h4>任务#idx完成</h4>请进行下一任务',
	logOpen:'<h4>任务全部完成</h4>您可以打开#pack啦!',
	puzzle: {
		name: '任务#idx-拼字',
		cellText: '口令', 
		cellTips:'正确输入口令打开#pack',
		logText: '<h4>点击格子输入口令</h4>正确输入口令打开#pack',
	},
	jigsaw: {
		name: '任务#idx-拼图',
		cellText: '目标图片', 
		cellTips:'拼出目标图片打开#pack',
		logText: '<h4>点击周围格子与中心格子交换</h4>拼出目标图片打开#pack',
		imgNone: '../../picture/head/3.jpeg',
		imgPath: '../../picture/mo/',
		funPath: '../../picture/mikao/',
        centerIdx: 4,
        cellLen: 3,
        border: 10,
        hpw: 1,
        cells: [],
	},	
}

var taskCfg_ghost = {
	logNext:'<h4>任务#0完成</h4>请进行下一任务',
	logOpen:'<h4>任务全部完成</h4>请打开#0',
	puzzle: {
		name: '拼字',
		cellText: '咒语', 
		cellTips:'正确吟诵咒语击杀女妖',
		logText: '<h4>点击格子吟诵咒语</h4>正确吟诵咒语击杀女妖',
	},
	jigsaw: {
		name: '拼图',
		cellText: '魔王画像', 
		cellTips:'拼出魔王画像封印魔王',
		logText: '<h4>点击周围格子与中心格子交换</h4>拼出魔王画像封印魔王',
		imgNone: 'https://hanyu-word-gif.cdn.bcebos.com/b49f20fd1427711e59629c8e0eb15ce01.gif',
		imgPath: 'https://ss1.baidu.com/6ONYsjip0QIZ8tyhnq/it/',
		funPath: '../../picture/mikao/',
        isNext: true,
        centerIdx: 4,
        cellLen: 3,
        border: 10,
        hpw: 1,
        cells: [],
	},
};

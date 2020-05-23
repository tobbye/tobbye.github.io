var taskData = {
	idx: 0,
	isNext: false,
	isStart: false,

};

var taskConfig = {
	logFail:'<h4>任务#idx失败</h4>谢谢参与!',
	logStop:'<h4>任务#idx中止</h4>请打开#pack',
	logNext:'<h4>任务#idx完成</h4>请进行下一任务',
	logOpen:'<h4>任务全部完成</h4>您可以打开#pack啦!',
	puzzle: {
		title: '任务#idx-拼字',
		cellText: '口令', 
		cellTips:'正确输入口令打开#pack',
		logText: '<h4>点击格子输入口令</h4>正确输入口令打开#pack',
	},
	jigsaw: {
		title: '任务#idx-拼图',
		cellText: '目标图片', 
		cellTips:'拼出目标图片打开#pack',
		logText: '<h4>点击周围格子与中心格子交换</h4>拼出目标图片打开#pack',
		imgNone: '../../picture/head/3.jpeg',
		imgPath: '../../picture/mo/',
		funPath: '../../picture/mikao/',
        border: 10,
        center: 4,
        len: 3,
        hpw: 1,
        cells: [],
	},	
	snake: {
		title:'任务#idx-贪吃蛇',
		cellText: '口令', 
		cellTips:'正确输入口令打开#pack',
		logText: '<h4>滑动屏幕控制方向</h4>吃掉文字输入口令',
        state: 'going',
        direction: 1,
        next: 1,
        body: [41, 40],  
        food: 45,
        width: 10,
        height: 10,
	},

	labyrinth: {
		title:'任务#idx-迷宫',
		cellText: '口令', 
		cellTips:'探索迷宫打开#pack',
		logText: '<h4>滑动屏幕控制方向</h4>吃掉文字输入口令',
        state: 'going',
	},
}

var taskConfig_ghost = {
	logFail:'<h4>任务#0失败</h4>请打开#0',
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
        len: 3,
        border: 10,
        hpw: 1,
        cells: [],
	},
};

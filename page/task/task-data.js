window.onload = function() {
    Config.init();
    Alert.init();
	Task.init();
	Task.creatElems();
}




var cfg = {
	name: 'task',
	desc: `自定义配置<h5>isLog=是否开启提醒, size=格子的尺寸, scale=缩放比例, col=列数, row=行数, gap=刷新间隔, word=使用的文本(以/分割), src=使用的图片.
	<br/>=== 其中size, scale在手机上设置无效 ===</h5>`
}


var items = [
{title:'贪吃蛇', 	name:"snake", 		isLog: 1, size:0, scale: 1, col: 12, row: 12, gap: 500, word:'TASK-SNAKE'},
{title:'迷宫', 		name:"labyrinth", 	isLog: 1, size:0, scale: 1, col: 12, row: 12, gap: 500, word:'TASK-LABYRINTH'},
{title:'拼字', 		name:"puzzle", 		isLog: 1, size:0, scale: 1, col: 12, row: 12, gap: 500, word:'TASK-PUZZLE'},
{title:'拼图', 		name:"jigsaw", 		isLog: 1, size:0, scale: 1, col: 3, row: 3, gap: 500, src:'http://img04.sogoucdn.com/app/a/100520021/c7dc2f290b7c5e1639cb8a27a5d1237f'},
{title:'俄罗斯方块', name:"tetris", 		isLog: 1, size:0, scale: 1, col: 12, row: 12, gap: 500, word:'TASK-TETRIS'},
];

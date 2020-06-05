window.onload = function() {
    Config.init();
    Alert.init();
	Task.init();
	Task.creatElems();
}




var cfg = {
	name: 'task',
	desc: `自定义配置<h5>size=格子的尺寸, scale=缩放比例, col=列数, row=行数, gap=刷新间隔, word=使用的文本, src=使用的图片.
	<br/>=== 其中size, scale在手机上设置无效 ===</h5>`
}


var items = [
{title:'欧拉', 		name:"euler", 		size:0, scale: 1, col: 12, row: 15, gap: 500, word:'(2+3i)(1+2i)'},
{title:'迷宫', 		name:"labyrinth", 	size:0, scale: 1, col: 12, row: 15, gap: 500, word:'TASK/LABYRINTH'},
{title:'贪吃蛇', 	name:"snake", 		size:0, scale: 1, col: 12, row: 15, gap: 500, word:'TASK/SNAKE'},
{title:'拼字', 		name:"puzzle", 		size:0, scale: 1, col: 12, row: 15, gap: 500, word:'TASK/PUZZLE'},
{title:'拼图', 		name:"jigsaw", 		size:0, scale: 1, col: 3, row: 3, gap: 500, src:'http://img04.sogoucdn.com/app/a/100520021/c7dc2f290b7c5e1639cb8a27a5d1237f'},
{title:'方块', 		name:"tetris", 		size:0, scale: 1, col: 12, row: 15, gap: 500, word:'TASK/TETRIS'},
];

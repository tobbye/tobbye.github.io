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
{
list:[
{name:'迷宫', 		typef:"labyrinth", 		size:0, scale: 1, col: 12, row: 15, gap: 500, word:'TASK/LABYRINTH'},
{name:'贪吃蛇', 		typef:"snake", 			size:0, scale: 1, col: 12, row: 15, gap: 500, word:'TASK/SNAKE'},
{name:'拼字', 		typef:"puzzle", 		size:0, scale: 1, col: 12, row: 15, gap: 500, word:'TASK/PUZZLE'},
{name:'拼图', 		typef:"jigsaw", 		size:0, scale: 1, col: 3, row: 3, gap: 500, src:'http://img04.sogoucdn.com/app/a/100520021/c7dc2f290b7c5e1639cb8a27a5d1237f'},
{name:'俄罗斯方块', 	typef:"tetris", 		size:0, scale: 1, col: 12, row: 15, gap: 500, word:'TASK/TETRIS'},
{name:'复平面', 		typef:"euler",       	count: 12, power: 15, gap: 100, posList:[[2, 1], [-1, -2]], word:'(2+i)(-1-2i)'},
]},
];

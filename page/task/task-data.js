window.onload = function() {
    Config.init();
    Alert.init();
	Task.init();
	Task.creatElems();
}




var cfg = {
	name: 'task',
}


var items = [
{title:'贪吃蛇', name:"snake"},
{title:'迷宫', name:"labyrinth"},
{title:'拼字', name:"puzzle"},
{title:'拼图', name:"jigsaw"},
{title:'俄罗斯方块', name:"tetris"},

];

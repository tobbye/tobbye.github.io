
var Task = {
    idx: 0,
    ladd: 1, 
    roll: 1,
    body: {},
};

Task.cfg = {
    logDetail:'此红包由 #inver 赞助<h5>完成的任务越多获得的#pack金额越大</h5>',
    logReady:'<h5>任务#idx准备</h5>加油！奥里给!',
    logPause:'<h5>任务#idx暂停</h5>加油！奥里给!奥里给!',
    logGoing:'<h5>任务#idx进行中</h5>加油！奥里给!奥里给!',
    logRedo:'<h5>任务#idx已重置</h5>加油！奥里给!奥里给!',
    logFail:'<h5>任务#idx失败</h5>请重置后再次尝试!',
    logStop:'<h5>任务#idx中止</h5>请打开#pack',
    logNext:'<h5>任务#idx完成</h5>请进行下一任务',
    logOpen:'<h5>任务全部完成</h5>您可以打开#pack啦!',
};

Task.gameNames = {
    tetris:'俄罗斯方块', 
    labyrinth:'迷宫', 
    snake:'贪吃蛇', 
    puzzle:'文字解密', 
    jigsaw: '拼图',
}

Task.creatTask = function(block, mix) {
    let data = document.body.data;
    let line = document.body.line;
    if (Task.index != line.index)
        Task.idx = 0;
    Task.block = block;
    Task.index = line.index;
    Task.pack = data.packType;
    Task.types = data.taskTypes;
    Task.type = Task.types[Task.idx];
    Task.typeC = 'creat' + Parse.titleCase(Task.type);
    Task[Task.typeC](line);
    Config.task = Task;

    if (Task.game && !mix) {
        Task.initTask();
        Task.checkAction('redo');
        Task.checkState('going');
        console.log (Task);
    }
}

Task.mixAnim = function(block) {
    clearInterval(Task.timer);
    clearInterval(Task.clock);
    Task.loop = Constant.clock.loop;
    Task.clock = setInterval(function() {
        if (Task.loop > 0) {
            Task.block.innerHTML = '';
            if (Task.game.mixAnim) {
                Task.game.mixAnim();
            } else {
                Task.creatTask(Task.block, true);
            }
            Task.loop--;
        } else {
            Task.checkState('going');
            clearInterval(Task.clock);
            Task.loop = Constant.clock.loop;
        }
    }, 120);  
    Task.checkAction('redo');
    if (!Task.game.mixAnim) {
        Task.initTask();
        console.log (Task); 
    }
}


Task.initTask = function() {
    Task.type = Task.types[Task.idx];
    Task.ladd = Task.idx + 1;
    Task.title = Task.text(Task.game.title);
    Elem.text(Alert.curPanel.title, Task.title);
}

Task.checkState = function(state) {
    Task.state = state;
    Task.game.state = state;
    switch (state) {
        case 'ready':
            Task.log (Task.cfg.logReady);
            break;
        case 'pause':
            Task.log (Task.cfg.logPause);
            break;
        case 'going':
            Task.log (Task.game.logTips);
            break;
        case 'succeed':
            if (Task.ladd < Task.types.length) {
                Task.initTask();  
                Task.checkAction('next');
            } else {
                Task.checkAction('open');
            }
            Task.idx ++;
            Task.clear();
            break;
        case 'ending':
            clearInterval(Task.game.timer);
            if (Task.idx > 1)
                Task.checkAction('stop');
            else
                Task.checkAction('fail');
            break;
    }
    Task.showArrow();
}


Task.checkAction = function(action) {
    Task.game.action = action;
    Elem.hide(Alert.buttons.open);
    Elem.hide(Alert.buttons.next);
    Elem.hide(Alert.buttons.redo);
    Elem.hide(Alert.buttons.abon);
    switch (action) {
        case 'open':
            Task.log (Task.cfg.logOpen);
            Elem.show(Alert.buttons.open);
            break;
        case 'next':
            Task.log (Task.cfg.logNext);
            Elem.show(Alert.buttons.next);
            break;
        case 'redo':
            Task.log (Task.cfg.logRedo);
            Elem.show(Alert.buttons.redo);
            Elem.show(Alert.buttons.abon);
            break;
        case 'stop':
            Task.log (Task.cfg.logStop);
            Elem.show(Alert.buttons.open);
            break;
        case 'fail':
            Task.log (Task.cfg.logFail);
            Elem.show(Alert.buttons.redo);
            Elem.show(Alert.buttons.abon);
            break;
    }
}


Task.showArrow = function() {
    if (Task.state == 'succeed' || Task.state == 'ending') {
        Elem.hide(Alert.buttons.up);
        Elem.hide(Alert.buttons.down);
        Elem.hide(Alert.buttons.left);
        Elem.hide(Alert.buttons.right);
    } else {
        Elem.show(Alert.buttons.up);
        Elem.show(Alert.buttons.down);  
        Elem.show(Alert.buttons.left);
        Elem.show(Alert.buttons.right);
    }
}

Task.clear = function() {
    if (Task.game) {
        clearInterval(Task.game.timer);
        Task.game = null;
    }
}


Task.initRoll = function(line) {
    Task.roll = 1;
    Task.rollMax = Math.pow(2, line.ladd);
    Task.rollNum = Math.floor(Math.random() * Task.rollMax);
    Task.getRoll(Task.rollMax, Task.rollNum); 
}

Task.getRoll = function(all, roll) {
    all = all / 2;
    if (roll > all) {
        Task.roll += 1;
        Task.getRoll(all, roll - all);
    } else{
        return Task.roll;
    }
}

Task.text = function(text) {
    return text
    .replace('#idx', Task.ladd)
    .replace('#pack', Task.pack)
    .replace('#remain', Task.remain);
}

Task.log = function(log) {
    Task.cfg.log = Task.text(log);
    Alert.log (Task.cfg.log);
}

Task.tips = function(tips) {
    let elem = Elem.creat('div', Task.block, 'cell-tips');
    elem.innerHTML = Task.text(tips);
    return elem;
}

Task.alert = function(log) {
    setTimeout(function() {alert(log)}, 200);
}


Task.setArrow = function(idx) {
    if (!Task.game) return;
    if (!Task.game.control) return;
    Task.game.control(idx);
};

document.onkeydown = function(evt) { 
    if (!Task.game) return;
    if (!Task.game.control) return;
    let idx = evt.keyCode - 37;
    Task.game.control(idx);
};












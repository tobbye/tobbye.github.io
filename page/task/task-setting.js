
var Task = {
    idx: 0,
    ladd: 1, 
    roll: 1,
};

Task.cfg = {
    logFail:'<h4>任务#idx失败</h4>请重置后再次尝试!',
    logStop:'<h4>任务#idx中止</h4>请打开#pack',
    logNext:'<h4>任务#idx完成</h4>请进行下一任务',
    logOpen:'<h4>任务全部完成</h4>您可以打开#pack啦!',
};

Task.creatTask = function(block, mix) {
    document.block = block;
    let data = document.body.data;
    let line = document.body.line;
    if (Task.index != line.index)
        Task.idx = 0;
    Task.index = line.index;
    Task.pack = data.packType;
    Task.types = data.taskTypes;
    Task.type = Task.types[Task.idx];
    Config.task = Task;
    switch (Task.type) {

        case 'snake':
            Task.creatSnake(block, line.word);
            break;
        case 'puzzle': 
            Task.creatPuzzle(block, line.word);
            break;
        case 'jigsaw':
            Task.creatJigsaw(block, line.src, line.idx);
            break;
        case 'labyrinth':
            Task.creatLabyrinth(block, line.word);
            break;
    }

    if (Task.game && !mix) {
        Task.initTask();
        Task.checkAction('redo');
        console.log(Task);
    }
}

Task.mixAnim = function(block) {
    var clock = Config.clock;
    clearInterval(clock.mixClock);
    clock.mixLoop = Config.constant.clock.mixLoop;
    clock.mixClock = setInterval(function() {
        block = block || document.block;
        if (clock.mixLoop > 0) {
            if (Task.game.mixAnim) {
                Task.game.mixAnim();
            } else {
                block.innerHTML = '';
                Task.game.isLoop = false;
                Task.creatTask(block, true);
            }
            clock.mixLoop--;
        } else {
            clearInterval(clock.mixClock);
            clock.mixLoop = Config.constant.clock.mixLoop;
        }
    }, 120);  
    if (!Task.game.mixAnim) {
        Task.initTask();
        Task.checkAction('redo');
        console.log(Task); 
    }
}


Task.initTask = function() {
    Task.type = Task.types[Task.idx];
    Task.ladd = Task.idx + 1;
    console.log(Task.game)
    Task.title = Task.game.title.replace('#idx', Task.ladd);
    Task.cfg.logText = Task.game.logText.replace('#pack', Task.pack);
    Task.cfg.orgTips = Task.game.orgTips.replace('#pack', Task.pack); 
    Task.cfg.tgtTips = Task.game.tgtTips.replace('#pack', Task.pack);
    Elem.text(Alert.panels.task.title, Task.title);
}

Task.checkState = function(state) {
    Task.state = state;
    if (state == 'stop') {
        if (Task.idx > 1)
            Task.checkAction('stop');
        else
            Task.checkAction('fail');
    } else {
        if (Task.ladd < Task.types.length) {
            Task.initTask();  
            Task.checkAction('next');
        } else {
            Task.checkAction('open');
        }
        Task.idx ++;
    }
}

Task.checkAction = function(action) {
    Task.action = action;
    Elem.hide(Alert.buttons.open);
    Elem.hide(Alert.buttons.next);
    Elem.hide(Alert.buttons.redo);
    Elem.hide(Alert.buttons.abon);
 
    if (action == 'open') {
        Task.fade(Task.cfg.logOpen);
        Elem.show(Alert.buttons.open);
    }
    if (action == 'next') {
        Task.fade(Task.cfg.logNext);
        Elem.show(Alert.buttons.next);
     }
    if (action == 'redo') {
        Task.fade(Task.cfg.logText);
        Elem.show(Alert.buttons.redo);
        Elem.show(Alert.buttons.abon);
    }
    if (action == 'stop') {
        Task.fade(Task.cfg.logStop);
        Elem.show(Alert.buttons.open);
    }
    if (action == 'fail') {
        Task.fade(Task.cfg.logFail);
        Elem.show(Alert.buttons.redo);
        Elem.show(Alert.buttons.abon);
    }

    if (action == 'redo' || action == 'fail' && Task.game.isArrow) { 
        Elem.show(Alert.buttons.up);
        Elem.show(Alert.buttons.down);
        Elem.show(Alert.buttons.left);
        Elem.show(Alert.buttons.right);
    } else {
        Elem.hide(Alert.buttons.up);
        Elem.hide(Alert.buttons.down);
        Elem.hide(Alert.buttons.left);
        Elem.hide(Alert.buttons.right);
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

Task.fade = function(log) {
    Task.cfg.fade = log.replace('#idx', Task.ladd).replace('#pack', Task.pack);
    Alert.log(Task.cfg.fade);
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












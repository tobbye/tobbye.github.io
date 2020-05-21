function initTask() {

    taskData.type = taskData.types[taskData.idx];
    taskData.name = taskConfig[taskData.type].name.replace('#idx', taskData.idx+1);
    var taskCfg = taskConfig[taskData.type];
    taskData.logFail = taskConfig.logNext.replace('#idx', taskData.idx).replace('#pack', taskData.pack);;
    taskData.logNext = taskConfig.logNext.replace('#idx', taskData.idx);
    taskData.logOpen = taskConfig.logOpen.replace('#pack', taskData.pack);
    taskData.logText = taskCfg.logText.replace('#pack', taskData.pack);
    taskData.cellTips = taskCfg.cellTips.replace('#pack', taskData.pack);
    taskData.cellText = taskCfg.cellText;   
    config.taskData = taskData;
    config.taskCfg = taskCfg;
}


function checkState() {
    taskData.idx++;
    if (!taskData.isFail) {
        if (taskData.idx < taskData.types.length) {
            initTask();  
            checkAction('next');
        } else {
            checkAction('open');
        }
    } else {
        if (taskData.idx > 0)
            checkAction('fail');
    }
}

function checkAction(action) {
    taskData.action = action;

    if (action == 'open') {
        taskData.isNext = false;
        taskData.isStart = false;
        showLog(taskData.logOpen);
        Style.display('btn-open', 'inline');
        Style.display('btn-next', 'none');
        Style.display('btn-redo', 'none');
        Style.display('btn-abon', 'none'); 
    }
    if (action == 'next') {
        taskData.isNext = true;
        taskData.isStart = false;
        showLog(taskData.logNext);
        Style.display('btn-open', 'none');
        Style.display('btn-next', 'inline');
        Style.display('btn-redo', 'none');
        Style.display('btn-abon', 'none');
     }
    if (action == 'redo') {
        taskData.isNext = false;
        taskData.isStart = true;
        showLog(taskData.logText);
        Style.display('btn-open', 'none');
        Style.display('btn-next', 'none');
        Style.display('btn-redo', 'inline');
        Style.display('btn-abon', 'inline');
    }
    if (action == 'fail') {
        taskData.isNext = true;
        taskData.isStart = true;
        showLog(taskData.logFail);
        Style.display('btn-open', 'inline');
        Style.display('btn-next', 'none');
        Style.display('btn-redo', 'none');
        Style.display('btn-abon', 'none');
    }
    console.log(taskData);
}

var timer;
function creatSnake(block, word) {
    var snake = new Snake();
    snake.init(block, word);
    console.log(snake);

    document.body.onkeydown = function(e) {
        var ev = e || window.event;
        switch(ev.keyCode)
        {
            case 38:
            if (snake.direction != 'down') {  
                snake.direction = "up";
            }
            break;
            case 40:
            if (snake.direction != "up") {
                snake.direction = "down";
            }
            break;
            case 37:
            if (snake.direction != "right") {
                snake.direction = "left";
            }
            break;
            case 39:
            if (snake.direction != "left") {
                snake.direction = "right";
            }
            break;
        }
    };
}


function Snake() {

    this.init = function(block, word) {
        this.clientWidth = document.body.clientWidth*config.page.zoom-80;
        this.block = Elem.creat('div', block, 'user-line');
        this.block.style.width = this.clientWidth + 'px';
        this.block.style.height = this.clientWidth + 'px';
        this.idx = 0;
        this.len = 10;
        this.word = word + word;
        this.direction = 'right';
        this.width = Math.floor(this.clientWidth / this.len);
        this.height = Math.floor(this.clientWidth / this.len);
        this.color = {
            body: 'dodgerblue',
            food:'darkred',
        }
        this.body = [
            {x:2, y:0},  
            {x:1, y:0},  
            {x:0, y:0}  
        ]; 
        this.food = [
            {x: 9, y: 9},
        ];
        this.draw('body');
        this.draw('food');
        this.clock();
    }

    this.draw = function(key) {
        if (key == 'food') {
            if (this.food.length < 2 && this.word.length - this.body.length > 1) {
                var x = Math.floor(Math.random()*this.len);
                var y = Math.floor(Math.random()*this.len);
                this.food.push({x:x, y:y});
            }
            this.idx = this.body.length;
        } else {
            this.idx = 0;
        }
        for (var i=0; i<this[key].length; i++) {
            var data = this[key][i];
            if (data) {  
                data.idx = this.idx + i;
                data.word = this.word[this.idx + i];
                var cell = Elem.creat('div', this.block, 'cell-snake');
                cell.id = 'cell-' + data.idx;
                cell.style.width = this.width + 'px';
                cell.style.height = this.height + 'px';
                cell.style.background = this.color[key];
                cell.style.left = data.x * this.width + 'px';
                cell.style.top = 100 + data.y * this.height + 'px';
                cell.innerHTML = data.word;
            }
        }
    };

    this.run = function() {
        for (var i=this.body.length-1; i>0; i--) {
            this.body[i].x = this.body[i-1].x;
            this.body[i].y = this.body[i-1].y;
        }
        switch(this.direction) {
            case "left":
            this.body[0].x -= 1;
            break;
            case "right":
            this.body[0].x += 1;
            break;
            case "up":
            this.body[0].y -= 1;
            break;
            case "down":
            this.body[0].y += 1;
            break;
        }
        if (this.body[0].x < 0 || this.body[0].x > this.len-1 || 
            this.body[0].y < 0 || this.body[0].y > this.len-1) {
            clearInterval(this.timer);  
            showLog("<h4>任务中止</h4>点击打开红包");
            return;  
        }

        for (var i=0; i<this.food.length; i++) {
            if (this.body[0].x == this.food[i].x && this.body[0].y == this.food[i].y) {
                this.body.push({x:null, y:null, flag: null});
                this.block.removeChild(document.getElementById('cell-'+this.food[i].idx));
                if (i == 0) {
                    this.food.splice(i, 1);
                    this.draw('food');     
                } else {
                    clearInterval(this.timer);  
                    showLog("<h4>任务中止</h4>点击打开红包");
                    return;  
                }
                if (this.body.length == this.word.length) {
                    clearInterval(this.timer);  
                    showLog("<h4>任务完成</h4>点击打开红包");

                }
            } 
        }

        for (var i=4; i<this.body.length; i++) {
            if (this.body[0].x == this.body[i].x && this.body[0].y == this.body[i].y) {
                clearInterval(this.timer);  
                showLog("<h4>任务中止</h4>点击打开红包");
                return;  
            }
        }
        this.block.innerHTML = '';
        this.draw('body');
        this.draw('food');
    };

    this.clock = function() {
        var that = this;
        this.timer = setInterval(function(){that.run()}, 300);
    };

}


function creatPuzzle(block, word) {
    var blockOrg, blockTgt;
    var taskCfg = taskConfig.puzzle;
    taskCfg.word = word;
    taskCfg.wordOrg = word.replace(/ /g, '/');
    taskCfg.wordTgt = word.replace(/[\/ ]/g, '');
    initCell(block);

    function initCell(block) {
        blockOrg = Elem.creat('div', block, 'cell-block');
        creatCell(blockOrg, false);

        blockTgt = Elem.creat('div', block, 'cell-block');
        creatCell(blockTgt, true);
        setClick('btn-redo', mixCell);
    }

    function mixCell() {
        checkAction('redo');
        var redo = Elem.get('btn-redo');
        Elem.togType(redo, 'danger');
        var clock = config.clock;
        clock.mixClock = setInterval(function() {
            if (clock.mixLoop > 0) {
                creatCell(blockTgt, true);
                clock.mixLoop--;
            } else {
                clearInterval(clock.mixClock);
                clock.mixLoop = config.constant.clock.mixLoop;
            }
        }, 100);   
    }



    //解密字块
    function creatCell(block, state) {
        taskData.isStart = state;
        taskCfg.wordCur = '';
        taskCfg.wordMix = Parse.mix(taskCfg.wordOrg);
        var wordMix = state ? taskCfg.wordMix : taskCfg.wordOrg;

        block.innerHTML = '';
        var tips = Elem.creat('div', block, 'cell-tips');
        tips.innerHTML = state ? taskData.cellTips : taskData.cellText;
        var space = Elem.creat('div', block, 'space20');
        var flex = Elem.creat('div', block, 'cell-flex');
        for(let idx in taskCfg.wordOrg) {
            if (taskCfg.wordOrg[idx] == '/') 
                flex = Elem.creat('div', block, 'cell-flex');

            if (wordMix[idx] == '/') 
                continue;
            var cell = Elem.creat('div', flex, 'cell-text');
            cell.able = true;
            cell.state = state;
            cell.innerHTML = wordMix[idx];
            cell.style.borderColor = getColorType();
            cell.style.backgroundColor = state ? 'white' : getColorLight();
            cell.onclick = function() {
                clickCell(this);
            }
        }
        var space = Elem.creat('div', block, 'space20');
    }

    function clickCell(cell) {
        if (cell.able && cell.state) {
            var wordTgt = taskCfg.wordTgt;
            var wordCur = taskCfg.wordCur;
            wordCur += cell.innerHTML;
            taskCfg.wordCur = wordCur;
            console.log('tgt:' + wordTgt + ' cur:' + wordCur);
            var redo = Elem.get('btn-redo');
            if (wordTgt.replace(wordCur, '') == wordTgt || wordTgt[0] != wordCur[0]) {
                Elem.color(cell, 'white', cfg.wrongColor);
                Elem.style(cell, 'borderColor', cfg.wrongColor);
                Elem.togType(redo, 'permit');
            } else {
                Elem.color(cell, 'white', cfg.rightColor);
                Elem.style(cell, 'borderColor', cfg.rightColor);
                Elem.togType(redo, 'danger');
            }
            if (wordTgt == wordCur) {
                checkState();
            }
            cell.able = false;
        }
    }

    function checkNext() {


    }
}






function creatJigsaw(block, src, idx) {
    var img, tips, flex, blockOrg, blockTgt;
    var taskCfg = taskConfig.jigsaw;
    taskCfg.src = src;
    taskCfg.imgSrc = src;
    taskCfg.funIdx = idx;
    taskCfg.fullPath = taskCfg.imgSrc ? taskCfg.imgSrc : taskCfg.imgNone;
    taskCfg.cellTips = taskCfg.cellTips.replace('#pack', taskData.pack);
    initCell(block, src);


    function initCell(block) {
        if (config.sett.isFun)
            taskCfg.fullPath = taskCfg.funPath + Parse.fillZero(taskCfg.funIdx, 3);
        img = new Image();
        img.src = taskCfg.fullPath;


        img.onload = function() {
            taskCfg.hpw = Math.floor(this.height / this.width * 100) / 100;
            var clientWidth = block.clientWidth;
            taskCfg.blockWidth = Math.floor(clientWidth);
            taskCfg.blockHeight = Math.floor(taskCfg.blockWidth * taskCfg.hpw);
            this.style.width = taskCfg.blockWidth + 'px';
            this.style.height = taskCfg.blockHeight + 'px';
            block.style.width = taskCfg.blockWidth + 'px';
            // block.style.margin = '0px auto';
            taskCfg.cellWidth = Math.floor((taskCfg.blockWidth - taskCfg.cellLen*taskCfg.border*2) / taskCfg.cellLen);
            taskCfg.cellHeight = Math.floor(taskCfg.cellWidth * taskCfg.hpw);
            for (var i=0;i<taskCfg.cellLen;i++) {
                for (var j=0;j<taskCfg.cellLen;j++) {
                    var idx = i*taskCfg.cellLen + j;
                    var posY = (-2*taskCfg.border-taskCfg.cellHeight) * i;
                    var posX = (-2*taskCfg.border-taskCfg.cellWidth) * j;
                    taskCfg.cells[idx] = {
                        idx: idx,
                        posX: posX,
                        posY: posY,
                    }
                }
            }
            console.log(taskCfg.cells);
            blockOrg = Elem.creat('div', block, 'cell-block');
            creatCell(blockOrg, false);
            setClick('btn-redo', mixCell);
        }
    }

    function mixCell() {
        checkAction('redo');
        var clock = config.clock;
        clock.mixClock = setInterval(function() {
            if (clock.mixLoop > 0) {
                creatCell(blockOrg, true);
                clock.mixLoop--;
            } else {
                clearInterval(clock.mixClock);
                clock.mixLoop = config.constant.clock.mixLoop;
            }
        }, 120);   
    }

    function creatCell(block, state) {
        taskData.isStart = state;
        taskData.isNext = !taskData.isStart;
        block.innerHTML = '';
        taskCfg.cells = state ? Parse.mix(taskCfg.cells) : taskCfg.cells;
        tips = Elem.creat('div', block, 'cell-tips');
        tips.innerHTML = state ? taskData.cellTips : taskData.cellText;
        flex = Elem.creat('div', block, 'cell-flex');
        flex.style.flexWrap = 'wrap';

        for (var i=0;i<taskCfg.cellLen;i++) {
            for (var j=0;j<taskCfg.cellLen;j++) {
                var idx = i*taskCfg.cellLen + j;
                var cell = Elem.creat('div', flex, 'cell-jigsaw', idx);
                cell.idx = taskCfg.cells[idx].idx;
                cell.style.width = taskCfg.cellWidth + 'px';
                cell.style.height = taskCfg.cellHeight + 'px';
                cell.style.backgroundSize = taskCfg.blockWidth + 'px ' + taskCfg.blockHeight + 'px';
                cell.style.backgroundPosition = taskCfg.cells[idx].posX + 'px ' + taskCfg.cells[idx].posY + 'px';
                cell.style.backgroundImage = `url(${taskCfg.fullPath})`
                cell.addEventListener('click', function(event) {
                    if (!taskData.isNext)
                        clickCell(event);
                });
                taskCfg.cells[idx].cellId = cell.id;
            }
        }
        checkNext();
    }

    function clickCell(event) {
        var org = flex.children[taskCfg.centerIdx];
        var tgt = event.target;
        if (org === tgt) return;
        var orgNext = org.nextSibling;
        var tgtNext = tgt.nextSibling;
        org.parentNode.insertBefore(tgt, orgNext);
        tgt.parentNode.insertBefore(org, tgtNext);
        checkNext(1);
    }

    function checkNext() {
 
        taskData.isNext = true;
        for (var i=0;i<flex.children.length;i++) {
            var child = flex.children[i];
            child.style.border = `solid ${taskCfg.border}px white`;
            if (child.idx == i) {
                // child.style.border = `solid ${taskCfg.border}px ${getColorBgd()}`;
            } else {
                taskData.isNext = false;
            }
        }

        var org = flex.children[taskCfg.centerIdx];
        org.style.border = `solid ${taskCfg.border}px ${getColorType()}`;
        if (taskData.isNext && taskData.isStart) {
        }

        if (taskData.isNext) {
            img = Elem.creat('img', blockOrg, 'image');
            img.style.width = taskCfg.blockWidth - 2*taskCfg.border + 'px';
            img.style.height = taskCfg.blockHeight - 2*taskCfg.border + 'px';
            img.style.border = `solid ${taskCfg.border}px white`;
            img.src = taskCfg.fullPath;
            if (taskData.isStart) {
                checkState();
                Elem.display(flex, 'flex');
                Elem.display(img, 'none');
                setTimeout(function() {
                    Elem.display(flex, 'none');
                    Elem.display(img, 'inline');
                }, 1000);
            } else {
                Elem.display(flex, 'none');
                Elem.display(img, 'inline');
                setTimeout(function() {
                    Elem.display(flex, 'flex');
                    Elem.display(img, 'none');
                }, 1000);
            }
        }
    }
}


function initTask() {

    taskData.type = taskData.types[taskData.idx];
    taskData.name = taskConfig[taskData.type].name.replace('#idx', taskData.idx+1);
    var taskCfg = taskConfig[taskData.type];

    taskData.logText = taskCfg.logText.replace('#pack', taskData.pack);
    taskData.cellTips = taskCfg.cellTips.replace('#pack', taskData.pack);
    taskData.cellText = taskCfg.cellText;   
    config.taskData = taskData;
    config.taskCfg = taskCfg;
}


function checkState(state) {
    taskData.state = state;
    taskData.idx++;
    taskData.logFail = taskConfig.logFail.replace('#idx', taskData.idx).replace('#pack', taskData.pack);;
    taskData.logNext = taskConfig.logNext.replace('#idx', taskData.idx);
    taskData.logOpen = taskConfig.logOpen.replace('#pack', taskData.pack);
    if (state == 'stop') {
        if (taskData.idx > 0)
            checkAction('stop');
    } else {
        if (taskData.idx < taskData.types.length) {
            initTask();  
            checkAction('next');
        } else {
            checkAction('open');
        }
    }
}

function checkAction(action) {
    taskData.action = action;
    if (action == 'open') {
        showLog(taskData.logOpen);
        Style.display('btn-open', 'inline');
        Style.display('btn-next', 'none');
        Style.display('btn-redo', 'none');
        Style.display('btn-abon', 'none'); 
    }
    if (action == 'next') {
        showLog(taskData.logNext);
        Style.display('btn-open', 'none');
        Style.display('btn-next', 'inline');
        Style.display('btn-redo', 'none');
        Style.display('btn-abon', 'none');
     }
    if (action == 'redo') {
        showLog(taskData.logText);
        Style.display('btn-open', 'none');
        Style.display('btn-next', 'none');
        Style.display('btn-redo', 'inline');
        Style.display('btn-abon', 'inline');
    }
    if (action == 'stop') {
        showLog(taskData.logFail);
        Style.display('btn-open', 'inline');
        Style.display('btn-next', 'none');
        Style.display('btn-redo', 'none');
        Style.display('btn-abon', 'none');
    }
    console.log(taskData);
}

function creatSnake(block, word) {
    var snake = new Snake();
    snake.init(block, word);
    config.taskCfg = snake;
    console.log(snake);
}

function Snake() {
    var that = this;
    var canvas, ctx;

    this.init = function(block, word) {
        this.direction = 1;  
        this.state = 'going';
        this.body = [41, 40];  
        this.food = 43;   
        this.len = 10;
        this.size = Math.floor(config.page.alertWidth / this.len);
        this.word = word.replace(/\//g,'');
        var tips = Elem.creat('div', block, 'cell-tips');
        tips.innerHTML = this.word;
        canvas = Elem.creat('canvas', block);
        canvas.width = this.len*this.size;
        canvas.height = this.len*this.size;
        ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = this.size - 20 + "px bold sans-serif";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.refresh();
    };

    this.draw = function(pos, color, idx) {
        var x = pos % this.len *this.size + 1;
        var y = ~~(pos / this.len) * this.size + 1;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, this.size-2, this.size-2);
        if (idx != null) {
            ctx.fillStyle = 'white';
            ctx.fillText(this.word[idx] || color, x+this.size/2, y+this.size/2);
        }
    };
    
    this.refresh = function() {
        this.body.unshift(this.next = this.body[0] + this.direction); 
        if (this.body.indexOf(this.next, 1) > 0 ||this.next< 0 ||this.next> this.len*this.len-1 || this.direction == 1 && this.next % this.len == 0 || this.direction == -1 && this.next % this.len == this.len-1) {
            this.state = 'fail';
            checkState('stop');
            return;
        }
        if (this.next == this.food) {
            this.state = this.body.length == this.word.length ? 'succeed':'going';
            if (this.state == 'going') {
            while (this.body.indexOf(this.food = ~~(Math.random() * this.len*this.len)) > 0);
                this.draw(this.food, "darkred", this.body.length);
            }

        } else {    
            this.draw(this.body.pop(), "white");
        }

        for (let x in this.body) {
            this.draw(this.body[x], "darkgreen", this.body.length-1-x);
        }

        if (this.state == 'going')
            setTimeout(function() {that.refresh()}, 300);  
        else
            checkState('next');

    };

    document.onkeydown = function(evt) { 
        that.direction = that.body[1] - that.body[0] == (that.next = [-1, -that.len, 1, that.len][(evt || event).keyCode - 37] || that.direction) ? that.direction : that.next;
    };
}


function creatPuzzle(block, word) {
    var puzzle = new Puzzle();
    puzzle.init(block, word);
    config.taskCfg = puzzle;
    console.log(puzzle);
}

function Puzzle() {
    var that = this;

    this.init = function(block, word) {
        var taskCfg = taskConfig.puzzle;
        for (let x in taskCfg) {
            this[x] = taskCfg[x];
        }
        this.word = word;
        this.wordOrg = word.replace(/ /g, '/');
        this.wordTgt = word.replace(/[\/ ]/g, '');
        this.blockOrg = Elem.creat('div', block, 'cell-block');
        this.creat(this.blockOrg, 'ready');

        this.blockTgt = Elem.creat('div', block, 'cell-block');
        this.creat(this.blockTgt, 'going');
        setClick('btn-redo', that.mix);
    }

    this.mix = function() {
        checkAction('redo');
        var redo = Elem.get('btn-redo');
        Elem.togType(redo, 'danger');
        var clock = config.clock;
        clock.mixClock = setInterval(function() {
            if (clock.mixLoop > 0) {
                that.creat(that.blockTgt, 'going');
                clock.mixLoop--;
            } else {
                clearInterval(clock.mixClock);
                clock.mixLoop = config.constant.clock.mixLoop;
            }
        }, 100);   
    }



    //解密字块
    this.creat = function(block, state) {
        this.state = state;
        this.wordCur = '';
        this.wordMix = Parse.mix(this.wordOrg);
        this.wordMix = state == 'going' ? this.wordMix : this.wordOrg;

        block.innerHTML = '';
        var tips = Elem.creat('div', block, 'cell-tips');
        tips.innerHTML = state == 'going' ? taskData.cellTips : taskData.cellText;
        var space = Elem.creat('div', block, 'space20');
        var flex = Elem.creat('div', block, 'cell-flex');
        for(let idx in this.wordOrg) {
            if (this.wordOrg[idx] == '/') 
                flex = Elem.creat('div', block, 'cell-flex');

            if (this.wordMix[idx] == '/') 
                continue;
            let cell = Elem.creat('div', flex, 'cell-text');
            cell.able = true;
            cell.state = state;
            cell.innerHTML = this.wordMix[idx];
            cell.style.borderColor = getColorType();
            cell.style.backgroundColor = state == 'going' ? 'white' : getColorLight();
            cell.onclick = function() {
                that.click(this);
            }
        }
        var space = Elem.creat('div', block, 'space20');
    }

    this.click = function(cell) {
        if (cell.able && cell.state) {
            this.wordCur += cell.innerHTML;
            console.log('tgt:' + this.wordTgt + ' cur:' + this.wordCur);
            var redo = Elem.get('btn-redo');
            if (this.wordTgt.replace(this.wordCur, '') == this.wordTgt || this.wordTgt[0] != this.wordCur[0]) {
                Elem.color(cell, 'white', cfg.wrongColor);
                Elem.style(cell, 'borderColor', cfg.wrongColor);
                Elem.togType(redo, 'permit');
            } else {
                Elem.color(cell, 'white', cfg.rightColor);
                Elem.style(cell, 'borderColor', cfg.rightColor);
                Elem.togType(redo, 'danger');
            }
            if (this.wordTgt == this.wordCur) {
                checkState('next');
            }
            cell.able = false;
        }
    }
}






function creatJigsaw(block, src, idx) {
    var jigsaw = new Jigsaw();
    jigsaw.init(block, src, idx);
    config.taskCfg = jigsaw;
    console.log(jigsaw)
}

function Jigsaw() {
    var that = this;
    var img, tips, flex, blockOrg, blockTgt;

    this.init = async function(block, src, idx) {
        var taskCfg = taskConfig.jigsaw;
        for (let x in taskCfg) {
            this[x] = taskCfg[x];
        }
        this.src = src;
        this.imgSrc = src;
        this.funIdx = idx;
        this.fullPath = this.imgSrc ? this.imgSrc : this.imgNone;
        this.cellTips = this.cellTips.replace('#pack', taskData.pack);
        if (config.sett.isFun)
            this.fullPath = this.funPath + Parse.fillZero(this.funIdx, 3);
        img = new Image();
        img.src = this.fullPath;
        img.onload = function() {
            that.load(block, this);
        }
    }


    this.load = function(block, img) {
        this.hpw = Math.floor(img.height / img.width * 100) / 100;
        var clientWidth = block.clientWidth;
        this.blockWidth = Math.floor(clientWidth);
        this.blockHeight = Math.floor(this.blockWidth * this.hpw);
        img.style.width = this.blockWidth + 'px';
        img.style.height = this.blockHeight + 'px';
        block.style.width = this.blockWidth + 'px';
        // block.style.margin = '0px auto';
        this.cellWidth = Math.floor((this.blockWidth - this.cellLen*this.border*2) / this.cellLen);
        this.cellHeight = Math.floor(this.cellWidth * this.hpw);
        for (var i=0;i<this.cellLen;i++) {
            for (var j=0;j<this.cellLen;j++) {
                var idx = i*this.cellLen + j;
                var posY = (-2*this.border-this.cellHeight) * i;
                var posX = (-2*this.border-this.cellWidth) * j;
                this.cells[idx] = {
                    idx: idx,
                    posX: posX,
                    posY: posY,
                }
            }
        }
        blockOrg = Elem.creat('div', block, 'cell-block');
        this.creat(blockOrg, 'ready');
        setClick('btn-redo', that.mix);
    }

    this.mix = function() {
        checkAction('redo');
        var clock = config.clock;
        clock.mixClock = setInterval(function() {
            if (clock.mixLoop > 0) {
                that.creat(blockOrg, 'going');
                clock.mixLoop--;
            } else {
                clearInterval(clock.mixClock);
                clock.mixLoop = config.constant.clock.mixLoop;
            }
        }, 120);   
    }

    this.creat = function(block, state) {
        this.state = state;
        this.cells = state == 'going' ? Parse.mix(this.cells) : this.cells;
        block.innerHTML = '';
        tips = Elem.creat('div', block, 'cell-tips');
        tips.innerHTML = state ? taskData.cellTips : taskData.cellText;
        flex = Elem.creat('div', block, 'cell-flex');
        flex.style.flexWrap = 'wrap';

        for (var i=0;i<this.cellLen;i++) {
            for (var j=0;j<this.cellLen;j++) {
                var idx = i*this.cellLen + j;
                var cell = Elem.creat('div', flex, 'cell-jigsaw', idx);
                cell.idx = this.cells[idx].idx;
                cell.style.width = this.cellWidth + 'px';
                cell.style.height = this.cellHeight + 'px';
                cell.style.backgroundSize = this.blockWidth + 'px ' + this.blockHeight + 'px';
                cell.style.backgroundPosition = this.cells[idx].posX + 'px ' + this.cells[idx].posY + 'px';
                cell.style.backgroundImage = `url(${this.fullPath})`
                cell.addEventListener('click', function(event) {
                    if (state == 'going')
                        clickCell(event);
                });
                this.cells[idx].cellId = cell.id;
            }
        }
        this.check();
    }

    this.click = function(event) {
        var org = flex.children[this.centerIdx];
        var tgt = event.target;
        if (org === tgt) return;
        var orgNext = org.nextSibling;
        var tgtNext = tgt.nextSibling;
        org.parentNode.insertBefore(tgt, orgNext);
        tgt.parentNode.insertBefore(org, tgtNext);
        this.check(1);
    }

    this.check = function() {
        if (this.state == 'going')
            this.state = 'succeed';
        for (var i=0;i<flex.children.length;i++) {
            var child = flex.children[i];
            child.style.border = `solid ${this.border}px white`;
            if (child.idx == i) {
                // child.style.border = `solid ${this.border}px ${getColorBgd()}`;
            } else {
                this.state = 'going';
            }
        }

        var org = flex.children[this.centerIdx];
        org.style.border = `solid ${this.border}px ${getColorType()}`;

        if (this.state == 'ready' || this.state == 'succeed' ) {
            img = Elem.creat('img', blockOrg, 'image');
            img.style.width = this.blockWidth - 2*this.border + 'px';
            img.style.height = this.blockHeight - 2*this.border + 'px';
            img.style.border = `solid ${this.border}px white`;
            img.src = this.fullPath;
            if (this.state == 'succeed') {
                this.check('next');
                Elem.display(flex, 'flex');
                Elem.display(img, 'none');
                setTimeout(function() {
                    Elem.display(flex, 'none');
                    Elem.display(img, 'inline');
                },1000);
            } else {
                Elem.display(flex, 'none');
                Elem.display(img, 'inline');
                setTimeout(function() {
                    Elem.display(flex, 'flex');
                    Elem.display(img, 'none');
                    setTimeout(function() {
                        that.mix();
                    },2000);
                },1000);
            }
        }
    }
}


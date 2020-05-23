
function preset(that) {
    var taskCfg = taskConfig[config.sett.taskType];
    for (let x in taskCfg) {
        that[x] = JSON.parse(JSON.stringify(taskCfg[x]));
    }
    config.taskCfg = that;
    console.log(that);
}

function initTask() {

    taskData.type = taskData.types[taskData.idx];
    taskData.title = taskConfig[taskData.type].title.replace('#idx', taskData.idx+1);
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
    taskData.logFail = taskConfig.logFail.replace('#idx', taskData.idx);
    taskData.logStop = taskConfig.logFail.replace('#idx', taskData.idx).replace('#pack', taskData.pack);
    taskData.logNext = taskConfig.logNext.replace('#idx', taskData.idx);
    taskData.logOpen = taskConfig.logOpen.replace('#pack', taskData.pack);
    if (state == 'stop') {
        if (taskData.idx > 1)
            checkAction('stop');
        else
            checkAction('fail');
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
        showLog(taskData.logStop);
        Style.display('btn-open', 'inline');
        Style.display('btn-next', 'none');
        Style.display('btn-redo', 'none');
        Style.display('btn-abon', 'none');
    }
    if (action == 'fail') {
        showLog(taskData.logFail);
        Style.display('btn-open', 'none');
        Style.display('btn-next', 'none');
        Style.display('btn-redo', 'none');
        Style.display('btn-abon', 'inline');
    }
    console.log(taskData);
}


function creatSnake(block, word) {
    var snake = new Snake();
    snake.init(body, word);
}

function Snake() {
    preset(this);
    var that = this;
    var canvas, ctx;

    this.init = function(block, word) {
        this.size = ~~(config.page.alertWidth / this.width);
        this.word = word.replace(/\//g,'');
        this.nextList = [-1, -this.width, 1, this.width];
        this.arrowList = ['left', 'up', 'right', 'down'];
        this.initCanvas(block);
        this.draw(this.food, "darkred", this.body.length);
        this.refresh(true);
    };

    this.initCanvas = function(block) {
        var tips = Elem.creat('div', block, 'cell-tips');
        tips.innerHTML = word;
        var body = Elem.creat('div', block, 'cell-tips');
        tips.innerHTML = word;
        canvas = Elem.creat('canvas', body);
        canvas.width = this.width*this.size;
        canvas.height = this.height*this.size;
        ctx = canvas.getContext('2d');
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = this.size - 20 + "px bold sans-serif";
    };

    this.draw = function(pos, color, idx) {
        var x = pos % this.width *this.size + 1;
        var y = ~~(pos / this.width) * this.size + 1;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, this.size-2, this.size-2);
        if (idx != null) {
            ctx.fillStyle = 'white';
            ctx.fillText(this.word[idx] || color, x+this.size/2, y+this.size/2);
        }
    };
    
    this.refresh = function(loop) {
        if (config.touch.direction) {
            this.arrow = config.touch.direction;
            this.arrowIdx = this.arrowList.indexOf(this.arrow);
            if (this.arrowIdx >= 0)
                this.next = this.nextList[this.arrowIdx]; 
            if (this.body[1] - this.body[0] != this.next)
                this.direction =  this.next; 
        }

        this.body.unshift(this.next = this.body[0] + this.direction);
        if (this.body.indexOf(this.next, 1) > 0) {
            return checkState('stop');
        }
        if (this.next < 0 || this.next> this.width*this.height-1 || this.direction == 1 && this.next % this.width == 0 || this.direction == -1 && this.next % this.width == this.width-1) {
            return checkState('stop');
        }
        if (this.next == this.food) {
            if (this.body.length == this.word.length) {
                this.state = 'succeed';
                return checkState('next');
            } else {
                while (this.body.indexOf(this.food = ~~(Math.random() * this.width*this.height)) > 0);
                    this.draw(this.food, "darkred", this.body.length);
            }
        } else {    
            this.draw(this.body.pop(), "white");
        }

        for (let x in this.body) {
            this.draw(this.body[x], "darkgreen", this.body.length-1-x);
        }

        if (this.state == 'going' && loop)
            setTimeout(function() {that.refresh(true)}, 200);  
    };

    this.control = function(evt) {
        if (evt.keyCode < 0 || evt.keyCode - 37 > 3) return;
        this.next = this.nextList[evt.keyCode - 37];
        this.arrow = this.arrowList[evt.keyCode - 37];
        if (this.body[1] - this.body[0] != this.next)
            this.direction =  this.next;
    };

    this.alert = function(msg) {
        setTimeout(function() {alert(msg)}, 200);
    };

    document.onkeydown = function(evt) { 
        that.control(evt);
    };
}


function creatPuzzle(block, word) {
    var puzzle = new Puzzle();
    puzzle.init(block, word);

}

function Puzzle() {
    preset(this);
    var that = this;
    var blockOrg, blockTgt;

    this.init = function(block, word) {
        this.word = word;
        this.wordOrg = word.replace(/ /g, '/');
        this.wordTgt = word.replace(/[\/ ]/g, '');
        blockOrg = Elem.creat('div', block, 'cell-block');
        this.creat(blockOrg, 'ready');

        blockTgt = Elem.creat('div', block, 'cell-block');
        this.creat(blockTgt, 'going');
        setClick('btn-redo', that.mix);
    }

    this.mix = function() {
        checkAction('redo');
        var redo = Elem.get('btn-redo');
        redo.setAttribute('state', 'danger');
        var clock = config.clock;
        clearInterval(clock.mixClock);
        clock.mixLoop = config.constant.clock.mixLoop;
        clock.mixClock = setInterval(function() {
            var clock = config.clock;
            if (clock.mixLoop > 0) {
                that.creat(blockTgt, 'going');
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
        Elem.creat('div', block, 'space20');
        var flex = Elem.creat('div', block, 'cell-flex');
        for(let idx in this.wordOrg) {
            if (this.wordOrg[idx] == '/') 
                flex = Elem.creat('div', block, 'cell-flex');

            if (this.wordMix[idx] == '/') 
                continue;
            var cell = Elem.creat('div', flex, 'cell-text');
            cell.able = true;
            cell.state = state;
            cell.innerHTML = this.wordMix[idx];
            cell.style.borderColor = getColorType();
            cell.style.backgroundColor = state == 'going' ? 'white' : getColorLight();
            cell.onclick = function() {
                that.click(this);
            }
        }
        Elem.creat('div', block, 'space20');
    }

    this.click = function(cell) {
        if (cell.able && cell.state) {
            this.wordCur += cell.innerHTML;
            console.log('tgt:' + this.wordTgt + ' cur:' + this.wordCur);
            var redo = Elem.get('btn-redo');
            if (this.wordTgt.replace(this.wordCur, '') == this.wordTgt || this.wordTgt[0] != this.wordCur[0]) {
                cell.style.color = 'white';
                cell.style.backgroundColor = cfg.wrongColor;
                cell.style.borderColor = cfg.wrongColor;
                redo.setAttribute('state', 'permit');
            } else {
                cell.style.color = 'white';
                cell.style.backgroundColor = cfg.rightColor;
                cell.style.borderColor = cfg.rightColor;
                redo.setAttribute('state', 'danger');
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

    this.init = function(block, src, idx) {
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
        this.cellWidth = Math.floor((this.blockWidth - this.len*this.border*2) / this.len);
        this.cellHeight = Math.floor(this.cellWidth * this.hpw);
        for (var i=0;i<this.len;i++) {
            for (var j=0;j<this.len;j++) {
                var idx = i*this.len + j;
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
        clearInterval(clock.mixClock);
        clock.mixLoop = config.constant.clock.mixLoop;
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

        for (var i=0;i<this.len;i++) {
            for (var j=0;j<this.len;j++) {
                var idx = i*this.len + j;
                var cell = Elem.creat('div', flex, 'cell-jigsaw', idx);
                cell.idx = this.cells[idx].idx;
                cell.style.width = this.cellWidth + 'px';
                cell.style.height = this.cellHeight + 'px';
                cell.style.backgroundSize = this.blockWidth + 'px ' + this.blockHeight + 'px';
                cell.style.backgroundPosition = this.cells[idx].posX + 'px ' + this.cells[idx].posY + 'px';
                cell.style.backgroundImage = `url(${this.fullPath})`
                cell.addEventListener('click', function(event) {
                    if (state == 'going')
                        that.click(event);
                });
                this.cells[idx].cellId = cell.id;
            }
        }
        this.check();
    }

    this.click = function(event) {
        var org = flex.children[this.center];
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

        var org = flex.children[this.center];
        org.style.border = `solid ${this.border}px ${getColorType()}`;

        if (this.state == 'ready' || this.state == 'succeed' ) {
            img = Elem.creat('img', blockOrg, 'image');
            img.style.width = this.blockWidth - 2*this.border + 'px';
            img.style.height = this.blockHeight - 2*this.border + 'px';
            img.style.border = `solid ${this.border}px white`;
            img.src = this.fullPath;
            if (this.state == 'succeed') {
                checkState('next');
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



function creatLabyrinth(block) {


    var laby = new Labyrinth();
    laby.init(block);
    console.log(laby);
}

function Labyrinth() {
    var that = this;
    var canvas, ctx;

    this.init = function(block) {

        this.col = 15;
        this.row = 20;
        this.map = [];
        this.cur = [0, 1];
        this.next = [];
        this.arrow = [];
        this.accessed = [];
        this.notAccessed = [];
        this.color = ['#eee', 'black', 'dodgerblue', 'red', 'darkorange'];
        this.arrowList = ['left', 'up', 'right', 'down'];
        this.nextList = [[0, -1], [-1, 0], [0, 1], [1, 0]];
        this.tranList = [-1, -this.col, 1, this.col];
        this.width = 2*this.col+1;
        this.height = 2*this.row+1;
        this.scale = ~~(config.page.alertWidth / this.width);
        this.initCanvas(block);
        this.initMap();
        this.fillMap();
        this.drawMap(); 
    };

    this.initCanvas = function(block) {
        canvas = Elem.creat('canvas', block);
        canvas.width = this.width*this.scale;
        canvas.height = this.height*this.scale;
        canvas.onclick = function (){
            that.downLoad();
        }
        ctx = canvas.getContext('2d');
        ctx.fillStyle = this.color[0];
        ctx.fillRect(0, 0, canvas.width, canvas.height); 
    };



    this.initMap = function() {
        for(let i = 0; i < 2 * this.row + 1; ++i) {
            this.map[i] = [];
            for(let j = 0; j < 2 * this.col + 1; ++j) {
                if((j ^ (j - 1)) === 1 && (i ^ (i - 1)) === 1) {
                    this.map[i][j] = 0;                   // 0 表示路
                    this.notAccessed.push(0);
                }else {
                    this.map[i][j] = 1;                   // 1 表示墙
                }
            }
        }
        this.map[0][1] = 2;
        this.map[this.map.length - 1][this.map[0].length - 2] = 4;
    };

    this.fillMap = function() {
        let count = this.row * this.col;
        let cur = Math.floor(Math.random()*count);
        this.accessed.push(cur);
        this.notAccessed[cur] = 1;

        while(this.accessed.length < count) {
            let rowIdx = Math.floor(cur / this.col),
                colIdx = cur % this.col;
            let num = 0,
                tgt = -1,
                rowNum, colNum;

            // 遍历上下左右顶点
            while(++num < 5) {
                let org = Math.floor(Math.random()*4);
                rowNum = rowIdx + this.nextList[org][0];
                colNum = colIdx + this.nextList[org][1];
                if(rowNum >= 0 && colNum >= 0 && rowNum < this.row && colNum < this.col && this.notAccessed[cur + this.tranList[org]] === 0) {
                    tgt = org;
                    break;
                }
            }
            // 四周顶点均被访问，则从已访问的顶点中随机抽取一个为cur
            if(tgt < 0) {
                cur = this.accessed[Math.floor(Math.random()*this.accessed.length)];
            }else {
                rowIdx = 2 * rowIdx + 1;
                colIdx = 2 * colIdx + 1;
                rowNum = rowIdx + this.nextList[tgt][0];
                colNum = colIdx + this.nextList[tgt][1];
                this.map[rowNum][colNum] = 0;
                cur = cur + this.tranList[tgt];
                this.notAccessed[cur] = 1;
                this.accessed.push(cur);
            }
        }
        this.accessed = null;
        this.notAccessed = null;
    };

    this.drawMap = function() {
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[0].length; j++) {
                if (this.map[i][j]) {

                    ctx.fillStyle = this.color[this.map[i][j]];
                    ctx.fillRect(j * this.scale, i * this.scale, this.scale, this.scale); 
                }
            }
        }
    };





    this.control = function(evt) {
        let i = this.cur[0] + this.next[0];
        let j = this.cur[1] + this.next[1];
        if (this.map[i][j] == 0) {
            this.map[i][j] = 2;
            this.arrow = [i, j];
            this.cur = this.arrow;
            ctx.fillStyle = this.color[2];
            ctx.fillRect(j * this.scale, i * this.scale, this.scale, this.scale); 
        } else if (this.map[i][j] == 1) {
            ctx.fillStyle = this.color[3];
            ctx.fillRect(j * this.scale, i * this.scale, this.scale, this.scale); 
            this.check();
        } else if (this.map[i][j] == 4) {
            return this.alert('而今迈步从头越!')
        }
    };


    this.check = function() {
        this.wall = [];
        for (let idx in this.nextList) {
            let i = this.cur[0] + this.nextList[idx][0];
            let j = this.cur[1] + this.nextList[idx][1];
            if (i < 0 || i > this.height || j < 0 || j > this.width)
                this.wall.push(this.arrowList[idx]);
            if (this.map[i][j] > 0 && this.map[i][j] < 4)
                this.wall.push(this.arrowList[idx]);
        }
        if (this.wall.length == 4)
            return this.alert('雄关漫道真如铁!')
    };

    document.onkeydown = function(evt) { 
        if (evt.keyCode < 0 || evt.keyCode - 37 > 3) return;
        that.next = that.nextList[evt.keyCode - 37];
        that.arrow = that.arrowList[evt.keyCode - 37];
        that.control(evt);
    };

    this.alert = function(msg) {
        setTimeout(function() {alert(msg)}, 200);
    };

    this.downLoad = function (){
        var oA = document.createElement("a");
        oA.download = 'labyrinth_' + new Date().getTime();
        oA.href = canvas.toDataURL("image/png");;
        document.body.appendChild(oA);
        oA.click();
        oA.remove(); // 下载之后把创建的元素删除
    }
};


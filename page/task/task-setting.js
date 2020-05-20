function initTask() {

    task.type = task.types[task.idx];
    task.name = taskCfg[task.type].name.replace('#idx', task.idx+1);
    var __cfg = taskCfg[task.type];
    task.logNext = taskCfg.logNext.replace('#idx', task.idx);
    task.logOpen = taskCfg.logOpen.replace('#pack', task.pack);
    task.logText = __cfg.logText.replace('#pack', task.pack);
    task.cellTips = __cfg.cellTips.replace('#pack', task.pack);
    task.cellText = __cfg.cellText;   
    config.taskData = task;
    config.taskCfg = __cfg;
}


function checkOpen() {
    task.idx++;
    if (task.idx < task.types.length) {
        initTask();  
        checkAction('next');
    } else {
        checkAction('open');
    }
}

function checkAction(action) {
    task.action = action;

    if (action == 'open') {
        task.isNext = false;
        task.isStart = false;
        showLog(task.logOpen);
        Style.display('btn-open', 'inline');
        Style.display('btn-next', 'none');
        Style.display('btn-redo', 'none');
        Style.display('btn-abon', 'none'); 
    }
    if (action == 'next') {
        task.isNext = true;
        task.isStart = false;
        showLog(task.logNext);
        Style.display('btn-open', 'none');
        Style.display('btn-next', 'inline');
        Style.display('btn-redo', 'none');
        Style.display('btn-abon', 'none');
     }
    if (action == 'redo') {
        task.isNext = false;
        task.isStart = true;
        showLog(task.logText);
        Style.display('btn-open', 'none');
        Style.display('btn-next', 'none');
        Style.display('btn-redo', 'inline');
        Style.display('btn-abon', 'inline');
    }
    console.log(task);
}





function creatPuzzle(block, word) {
    var blockOrg, blockTgt;
    var __cfg = taskCfg.puzzle;
    __cfg.word = word;
    __cfg.wordOrg = word.replace(/ /g, '/');
    __cfg.wordTgt = word.replace(/[\/ ]/g, '');
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
        task.isStart = state;
        __cfg.wordCur = '';
        __cfg.wordMix = Parse.mix(__cfg.wordOrg);
        var wordMix = state ? __cfg.wordMix : __cfg.wordOrg;

        block.innerHTML = '';
        var tips = Elem.creat('div', block, 'cell-tips');
        tips.innerHTML = state ? task.cellTips : task.cellText;
        var space = Elem.creat('div', block, 'space20');
        var flex = Elem.creat('div', block, 'cell-flex');
        for(let idx in __cfg.wordOrg) {
            if (__cfg.wordOrg[idx] == '/') 
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
            var wordTgt = __cfg.wordTgt;
            var wordCur = __cfg.wordCur;
            wordCur += cell.innerHTML;
            __cfg.wordCur = wordCur;
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
                checkOpen();
            }
            cell.able = false;
        }
    }

    function checkNext() {


    }
}






function creatJigsaw(block, src, idx) {
    var img, tips, flex, blockOrg, blockTgt;
    var __cfg = taskCfg.jigsaw;
    __cfg.src = src;
    if (src && src.indexOf('/') > -1) {
        var full = src.split('=');
        var part = full[1].split('/');
        var x = Math.floor(Math.random()*part.length);
        var path = full[0] + part[x] + '.jpg';
        src = path.replace('.gif.jpg', '.jpg');
    }
    __cfg.imgSrc = src;
    __cfg.hideIdx = idx;
    __cfg.fullPath = __cfg.imgPath + __cfg.imgSrc;
    __cfg.fullPath = __cfg.imgSrc ? __cfg.fullPath : __cfg.imgNone;
    __cfg.cellTips = __cfg.cellTips.replace('#pack', task.pack);
    initCell(block, src);


    function initCell(block) {
        if (config.sett.modeType == 'hide')
            __cfg.fullPath = __cfg.hidePath + Parse.fillZero(__cfg.hideIdx, 3);
        img = new Image();
        img.src = __cfg.fullPath;


        img.onload = function() {
            __cfg.hpw = Math.floor(this.height / this.width * 100) / 100;
            var clientWidth = block.clientWidth;
            __cfg.blockWidth = Math.floor(clientWidth);
            __cfg.blockHeight = Math.floor(__cfg.blockWidth * __cfg.hpw);
            this.style.width = __cfg.blockWidth + 'px';
            this.style.height = __cfg.blockHeight + 'px';
            block.style.width = __cfg.blockWidth + 'px';
            // block.style.margin = '0px auto';
            __cfg.cellWidth = Math.floor((__cfg.blockWidth - __cfg.cellLen*__cfg.border*2) / __cfg.cellLen);
            __cfg.cellHeight = Math.floor(__cfg.cellWidth * __cfg.hpw);
            for (var i=0;i<__cfg.cellLen;i++) {
                for (var j=0;j<__cfg.cellLen;j++) {
                    var idx = i*__cfg.cellLen + j;
                    var posY = (-2*__cfg.border-__cfg.cellHeight) * i;
                    var posX = (-2*__cfg.border-__cfg.cellWidth) * j;
                    __cfg.cells[idx] = {
                        idx: idx,
                        posX: posX,
                        posY: posY,
                    }
                }
            }
            console.log(__cfg.cells);
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
        task.isStart = state;
        task.isNext = !task.isStart;
        block.innerHTML = '';
        __cfg.cells = state ? Parse.mix(__cfg.cells) : __cfg.cells;
        tips = Elem.creat('div', block, 'cell-tips');
        tips.innerHTML = state ? task.cellTips : task.cellText;
        flex = Elem.creat('div', block, 'cell-flex');
        flex.style.flexWrap = 'wrap';

        for (var i=0;i<__cfg.cellLen;i++) {
            for (var j=0;j<__cfg.cellLen;j++) {
                var idx = i*__cfg.cellLen + j;
                var cell = Elem.creat('div', flex, 'cell-jigsaw', idx);
                cell.idx = __cfg.cells[idx].idx;
                cell.style.width = __cfg.cellWidth + 'px';
                cell.style.height = __cfg.cellHeight + 'px';
                cell.style.backgroundSize = __cfg.blockWidth + 'px ' + __cfg.blockHeight + 'px';
                cell.style.backgroundPosition = __cfg.cells[idx].posX + 'px ' + __cfg.cells[idx].posY + 'px';
                cell.style.backgroundImage = `url(${__cfg.fullPath})`
                cell.addEventListener('click', function(event) {
                    if (!task.isNext)
                        clickCell(event);
                });
                __cfg.cells[idx].cellId = cell.id;
            }
        }
        checkNext();
    }

    function clickCell(event) {
        var org = flex.children[__cfg.centerIdx];
        var tgt = event.target;
        if (org === tgt) return;
        var orgNext = org.nextSibling;
        var tgtNext = tgt.nextSibling;
        org.parentNode.insertBefore(tgt, orgNext);
        tgt.parentNode.insertBefore(org, tgtNext);
        checkNext(1);
    }

    function checkNext() {
 
        task.isNext = true;
        for (var i=0;i<flex.children.length;i++) {
            var child = flex.children[i];
            child.style.border = `solid ${__cfg.border}px white`;
            if (child.idx == i) {
                // child.style.border = `solid ${__cfg.border}px ${getColorBgd()}`;
            } else {
                task.isNext = false;
            }
        }

        var org = flex.children[__cfg.centerIdx];
        org.style.border = `solid ${__cfg.border}px ${getColorType()}`;
        if (task.isNext && task.isStart) {
        }

        if (task.isNext) {
            img = Elem.creat('img', blockOrg, 'image');
            img.style.width = __cfg.blockWidth - 2*__cfg.border + 'px';
            img.style.height = __cfg.blockHeight - 2*__cfg.border + 'px';
            img.style.border = `solid ${__cfg.border}px white`;
            img.src = __cfg.fullPath;
            if (task.isStart) {
                checkOpen();
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


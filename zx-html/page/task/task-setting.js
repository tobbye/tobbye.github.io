function initTask() {

    task.type = task.types[task.idx];
    task.name = taskCfg[task.type].name.replace('#idx', task.idx+1);
    var cfg = taskCfg[task.type];
    task.logNext = taskCfg.logNext.replace('#idx', task.idx);
    task.logOpen = taskCfg.logOpen.replace('#pack', task.pack);
    task.logText = cfg.logText.replace('#pack', task.pack);
    task.cellTips = cfg.cellTips.replace('#pack', task.pack);
    task.cellText = cfg.cellText;   
    config.taskData = task;
    config.taskCfg = cfg;
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
    var cfg = taskCfg.puzzle;
    cfg.word = word;
    cfg.wordOrg = word.replace(/ /g, '/');
    cfg.wordTgt = word.replace(/[\/ ]/g, '');
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
        config.mixClock = setInterval(function() {
            if (config.mixLoop > 0) {
                creatCell(blockTgt, true);
                config.mixLoop--;
            } else {
                clearInterval(config.mixClock);
                config.mixLoop = config.constant.mixLoop;
            }
        }, 100);   
    }



    //解密字块
    function creatCell(block, state) {
        task.isStart = state;
        cfg.wordCur = '';
        cfg.wordMix = Parse.mix(cfg.wordOrg);
        var wordMix = state ? cfg.wordMix : cfg.wordOrg;

        block.innerHTML = '';
        var tips = Elem.creat('div', block, 'cell-tips');
        tips.innerHTML = state ? task.cellTips : task.cellText;
        var space = Elem.creat('div', block, 'space20');
        var flex = Elem.creat('div', block, 'cell-flex');
        for(let idx in cfg.wordOrg) {
            if (cfg.wordOrg[idx] == '/') 
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
            var wordTgt = cfg.wordTgt;
            var wordCur = cfg.wordCur;
            wordCur += cell.innerHTML;
            cfg.wordCur = wordCur;
            console.log('tgt:' + wordTgt + ' cur:' + wordCur);
            var redo = Elem.get('btn-redo');
            if (wordTgt.replace(wordCur, '') == wordTgt || wordTgt[0] != wordCur[0]) {
                Elem.color(cell, 'white', config.wrongColor);
                Elem.style(cell, 'borderColor', config.wrongColor);
                Elem.togType(redo, 'permit');
            } else {
                Elem.color(cell, 'white', config.rightColor);
                Elem.style(cell, 'borderColor', config.rightColor);
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
    var cfg = taskCfg.jigsaw;
    cfg.src = src;
    if (src && src.indexOf('/') > -1) {
        var full = src.split('=');
        var part = full[1].split('/');
        var x = Math.floor(Math.random()*part.length);
        var path = full[0] + part[x] + '.jpg';
        src = path.replace('.gif.jpg', '.jpg');
    }
    cfg.imgSrc = src;
    cfg.hideIdx = idx;
    cfg.fullPath = cfg.imgPath + cfg.imgSrc;
    cfg.fullPath = cfg.imgSrc ? cfg.fullPath : cfg.imgNone;
    cfg.cellTips = cfg.cellTips.replace('#pack', task.pack);
    initCell(block, src);


    function initCell(block) {
        if (config.modeType == 'hide')
            cfg.fullPath = cfg.hidePath + Parse.fillZero(cfg.hideIdx, 3);
        img = new Image();
        img.src = cfg.fullPath;


        img.onload = function() {
            cfg.hpw = Math.floor(this.height / this.width * 100) / 100;
            var clientWidth = block.clientWidth;
            cfg.blockWidth = Math.floor(clientWidth);
            cfg.blockHeight = Math.floor(cfg.blockWidth * cfg.hpw);
            this.style.width = cfg.blockWidth + 'px';
            this.style.height = cfg.blockHeight + 'px';
            block.style.width = cfg.blockWidth + 'px';
            // block.style.margin = '0px auto';
            cfg.cellWidth = Math.floor((cfg.blockWidth - cfg.cellLen*cfg.border*2) / cfg.cellLen);
            cfg.cellHeight = Math.floor(cfg.cellWidth * cfg.hpw);
            for (var i=0;i<cfg.cellLen;i++) {
                for (var j=0;j<cfg.cellLen;j++) {
                    var idx = i*cfg.cellLen + j;
                    var posY = -cfg.cellHeight * i;
                    var posX = -cfg.cellWidth * j;
                    cfg.cells[idx] = {
                        idx: idx,
                        posX: posX,
                        posY: posY,
                    }
                }
            }
            console.log(cfg.cells);
            blockOrg = Elem.creat('div', block, 'cell-block');
            creatCell(blockOrg, false);
            setClick('btn-redo', mixCell);
        }
    }

    function mixCell() {
        checkAction('redo');
        config.mixClock = setInterval(function() {
            if (config.mixLoop > 0) {
                creatCell(blockOrg, true);
                config.mixLoop--;
            } else {
                clearInterval(config.mixClock);
                config.mixLoop = config.constant.mixLoop;
            }
        }, 120);   
    }

    function creatCell(block, state) {
        task.isStart = state;
        task.isNext = !task.isStart;
        block.innerHTML = '';
        cfg.cells = state ? Parse.mix(cfg.cells) : cfg.cells;
        tips = Elem.creat('div', block, 'cell-tips');
        tips.innerHTML = state ? task.cellTips : task.cellText;
        flex = Elem.creat('div', block, 'cell-flex');
        flex.style.flexWrap = 'wrap';

        for (var i=0;i<cfg.cellLen;i++) {
            for (var j=0;j<cfg.cellLen;j++) {
                var idx = i*cfg.cellLen + j;
                var cell = Elem.creat('div', flex, 'cell-jigsaw', idx);
                cell.idx = cfg.cells[idx].idx;
                cell.style.width = cfg.cellWidth + 'px';
                cell.style.height = cfg.cellHeight + 'px';
                cell.style.backgroundSize = cfg.blockWidth + 'px ' + cfg.blockHeight + 'px';
                cell.style.backgroundPosition = cfg.cells[idx].posX + 'px ' + cfg.cells[idx].posY + 'px';
                cell.style.backgroundImage = `url(${cfg.fullPath})`
                cell.addEventListener('click', function(event) {
                    if (!task.isNext)
                        clickCell(event);
                });
                cfg.cells[idx].cellId = cell.id;
            }
        }
        checkNext();
    }

    function clickCell(event) {
        var org = flex.children[cfg.centerIdx];
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
            child.style.border = `solid ${cfg.border}px white`;
            if (child.idx == i) {
                // child.style.border = `solid ${cfg.border}px ${getColorBgd()}`;
            } else {
                task.isNext = false;
            }
        }

        var org = flex.children[cfg.centerIdx];
        org.style.border = `solid ${cfg.border}px ${getColorType()}`;
        if (task.isNext && task.isStart) {
        }

        if (task.isNext) {
            img = Elem.creat('img', blockOrg, 'image');
            img.style.width = cfg.blockWidth - 2*cfg.border + 'px';
            img.style.height = cfg.blockHeight - 2*cfg.border + 'px';
            img.style.border = `solid ${cfg.border}px white`;
            img.src = cfg.fullPath;
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



function setElems() {
    setOuterTop();
    setOuterCenter();
    setInner();
    setAlert();
}


function setOuterTop() {
    var outerTop = Elem.get('outer-top');
    for (let x in items) {
        var btn = Elem.creat('div', outerTop, 'button-top');
        btn.innerHTML = items[x].title;
        btn.idx = x;
        btn.onclick = function() {
            setInner(this.idx);
        }
    }
}

function setOuterCenter() {
    var outerCenter = Elem.get('outer-center');
    for (let x in items) {
        var inner = Elem.creat('div', outerCenter, 'inner', x);
        setContent(inner, x);
    }
}

function setContent(inner, x) {
    var list = items[x].list
    for (let y in list) {
        var data = list[y];
        var content = Elem.creat('div', inner, 'content', y);
        setTitle(content, data);
        setNotLine(content, data);
        if (data.isGrab == 0)
            creatInveBody(content, data, x);
        if (data.isGrab == 1)
            creatGrabBody(content, data, x);
    }
}

function setTitle(content, data) {
    if (data.title) {
        var title = Elem.creat('div', content, 'title');
        title.innerHTML = data.title;
    }
    if (data.vice) {
        var vice = Elem.creat('div', content, 'vice');
        vice.innerHTML = data.vice;
    }
}


function initTempLine(data) {
    var lines = data.lines;
    if (lines.length > 0)
        return lines;
    var str = instance[data.instance].replace(/\n/g, '');
    var list = Parse.mix(str.split(','));
    for (let idx in list) {
        if (idx >= config.inveCount) break;
        var line = {};
        line.inver = list[idx].split('/')[0];
        line.group = data.group;
        line.ladder = Math.floor(20 * Math.random() * Math.random()) + 6;
        line.ladd = line.ladder - Math.floor(5 * Math.random());
        line.multi = Math.floor(100 * Math.pow(Math.random(),8)) + 1;
        line.mark = ['身份标签1', '身份标签2'];
        line.index = Math.floor((1547 + Math.random()) * 1e9);
        line.stamp = Parse.formatTime(line.index).replace(' ', '<h3>');
        line.word = list[idx].replace(/ /g, '/');
        line.wordOrg = line.word;
        line.wordTgt = line.word.replace(/\//g, '');
        lines[idx] = line;
    }
    return lines;
}


function creatGrabBody(content, data, x) {
    if (!data.lines)
        return;
    var lines = initTempLine(data);
    var block = Elem.creat('div', content, 'block');
    for (let z in lines) {
        var line = lines[z];
        if (!line.ladd) continue;
        line = initLineData(line, data.dot, data.isGrab);

        var body = Elem.creat('div', block, 'user-block');
        body.data = data;
        body.line = line;
        body.onclick = function() {
            console.log(this.line);
            setLineSelect(this);
            setDetailAlert(this);
        }
        var flex = Elem.creat('div', body, 'user-flex');
        var index = Elem.creat('div', flex, 'user-index');
        var stamp = Elem.creat('div', flex, 'user-stamp');
        index.innerHTML = '编号: ' + line.index;
        index.innerHTML += '<br/>' + data.inverStr;
        stamp.innerHTML = '时间: ' + line.stamp;

        setUserFlex(body, line);

        var flex = Elem.creat('div', body, 'user-flex');
        flex.style.marginTop = '0px';
        flex.style.marginBottom = '10px';
        var ladd = setLineText(flex, 'A', line.laddStr);
        var piece = setLineText(flex, 'B', line.pieceStr);
        var price = setLineText(flex, 'B', line.priceStr);
        var times = setLineText(flex, 'B', line.timesStr);
    }
    data.lines = lines;
}


function creatInveBody(content, data, x) {
    if (!data.lines)
        return;
    var lines = data.lines;
    var block = Elem.creat('div', content, 'block');
    for (var z = 0; z < config.laddCount; z++) {
        var line = {ladd: z+1, multi: 1}; 
        line = initLineData(line, data.dot, data.isGrab);
        lines.push(line);
        if (!line.ladd) continue;
        line.row = Math.floor(line.ladd / 5 - 0.2);

        var body = Elem.creat('div', block, 'user-flex', z);
        //Elem.color(body, line.color.deep, 'white');
        body.data = data;
        body.line = line;
        body.onclick = function() {
            console.log(this.line);
            setLineSelect(this);
            setDetailAlert(this);
        }
        var ladd = setLineText(body, 'A', line.laddStr);
        var piece = setLineText(body, 'B', line.pieceStr);
        var price = setLineText(body, 'B', line.priceStr);
        var times = setLineText(body, 'B', line.timesStr);
        if (z == 0) {
            setLineSelect(body);
        }
    }
    data.lines = lines;
    // console.log(JSON.stringify(lines));
}


function initLineData(line, dot, isGrab) {
    line.row = parseInt(line.ladd / 5 - 0.2);
    line.priceAll = 0;
    line.pieceAll = 0;
    line.timesAll = 0;
    line.priceAllList = [];    
    line.pieceAllList = [];
    line.timesAllList = [];
    for (var z = 0; z < line.ladd; z++) {
        line.priceAllList[z] = Math.pow(2, z);
        line.pieceAllList[z] = Math.pow(2, line.ladd - z - 1) * line.multi;
        line.timesAllList[z] =  line.pieceAllList[z] * dot;
    }

    line.priceAll = Math.pow(2, line.ladd - 1) * line.ladd * line.multi;
    line.pieceAll = Math.pow(2, line.ladd) * line.multi - line.multi;
    line.timesAll = line.pieceAll * dot;

    line.laddStr = '阶梯<br/><h3>' +  line.ladd + '阶</h3>';
    line.pieceStr = '总份数<br/><h3>' +  Parse.sub4Num(line.pieceAll) + '份</h3>';
    line.priceStr = '总金额<br/><h3>' +  Parse.sub4Num(line.priceAll) + '元</h3>';
    line.timesStr = '可传播<br/><h3>' +  Parse.sub4Num(line.timesAll) + '次</h3>';
    line.pieceEach = (line.priceAll / line.pieceAll).toFixed(2) + '元/份';
    if (dot == 1) {
        line.timesEach = (line.priceAll / line.timesAll).toFixed(2) + '元/次';
    } else {
        line.timesEach = (line.priceAll / line.timesAll * 1000).toFixed(2) + '元/千次';
    }
    if (!isGrab) 
        return line;
    
    line.priceCur = 0;
    line.pieceCur = 0;
    line.timesCur = 0;
    line.priceCurList = [];
    line.pieceCurList = [];
    line.timesCurList = [];
    for (var z = 0; z < line.ladd; z++) {
        var rand = Math.random() / 4 + 0.25;
        line.priceCurList[z] = line.priceAllList[z];
        line.pieceCurList[z] = Math.floor(line.pieceAllList[z] * rand);
        var rand = Math.random() / 4 + 0.50;
        if (dot == 1) rand = 1;
        line.timesCurList[z] = line.pieceAllList[z] - line.pieceCurList[z];
        line.timesCurList[z] = Math.floor(line.timesCurList[z] * rand * dot);
        line.pieceCur += line.pieceCurList[z];
        line.priceCur += line.priceCurList[z] * line.pieceCurList[z];
        line.timesCur += line.timesCurList[z];
    }
    line.laddStr = line.laddStr.replace('h3', 'h5');
    line.pieceStr = line.pieceStr.replace('h3', 'h5');
    line.priceStr = line.priceStr.replace('h3', 'h5');
    line.timesStr = line.timesStr.replace('h3', 'h5');
    line.laddStr += '倍数<br/><h3>' +  line.multi + '倍';
    line.pieceStr += '剩余份数<br/><h3>' +  Parse.sub4Num(line.pieceCur) + '份';
    line.priceStr += '剩余金额<br/><h3>' +  Parse.sub4Num(line.priceCur) + '元';
    line.timesStr += '已传播<br/><h3>' +  Parse.sub4Num(line.timesCur) + '次';
    line.pieceEach = (line.priceCur / line.pieceCur).toFixed(2) + '元/份';
    return line;
}


function setLineText(flex, attr, text) {
    var line = Elem.creat('text', flex, 'line');
    line.setAttribute('btype', attr);
    line.innerHTML = text;
    return line;
}



function setLineSelect(flex) { 
    var old = document.body.flex;
    if (old) {
        old.style.border = 'solid 0px transparent';
        old.style.marginBottom = '5px';
    }
    if (flex) {
        flex.style.border =  'solid 12px dodgerblue';
        flex.style.marginBottom =  '10px';
        document.body.flex = flex; 
    }
}


function setDetailAlert(body) {
    var data = body.data;
    var line = body.line;
    document.body.line = line;
    config.wordCur = '';
    config.puzzleText = data.puzzleText;
    config.resultText = data.resultText;
    config.cellText = data.cellText;
    config.cellTips = data.cellTips;
    config.inverStr = data.inverStr;

    var box = Elem.get('alert-box');
    var title = Elem.get('detail-title');
    var block = Elem.get('detail-block');
    Elem.color(box, '', getColorLight());
    title.innerHTML = data.flexStr.replace('#0',line.inver);
    block.style.maxHeight = config.alertHeight + 'px';
    block.innerHTML = '';


    var ladd = line.ladd - 1;
    //alert(JSON.stringify(line));
    var priceKey = 'priceAllList';
    var pieceKey = data.isGrab ? 'pieceCurList' : 'pieceAllList';
    var timesKey = data.isGrab ? 'timesCurList' : 'timesAllList';

    for (var i = 0; i < line.ladd; i++) {
        var idx = line.ladd - i - 1;
        var flex = Elem.creat('div', block, 'user-flex', idx);
        var laddStr = data.laddStr.replace('#0', (line.ladd - i));
        var pieceStr = data.pieceStr.replace('#0', Parse.sub4Num(line[pieceKey][idx]));
        var priceStr = data.priceStr.replace('#0', Parse.sub4Num(line[priceKey][idx]));
        var timesStr = data.timesStr.replace('#0', Parse.sub4Num(line[timesKey][idx]));
        var ladd = setLineText(flex, 'A', laddStr);
        var piece = setLineText(flex, 'B', pieceStr);
        var price = setLineText(flex, 'B', priceStr);
        var times = setLineText(flex, 'B', timesStr);
    }

    if(block.firstChild)
        block.firstChild.scrollIntoView();
    showAlert('detail-bg');
    showAlertButton(data);
}


function setPuzzleAlert() {
    hideAlert('detail-bg');
    Style.display('btn-open', 'none');
    Style.display('btn-redo', 'block');
    Elem.togType(Elem.get('btn-redo'), 'danger');
    var title = Elem.get('puzzle-title');
    var block = Elem.get('puzzle-block');
    title.innerHTML = config.puzzleText;
    block.innerHTML = '';
    config.wordCur = '';
    if (config.innerIdx == 1)
        creatPuzzle(block);
    if (config.innerIdx == 2)
        creatJigsaw(block);
    showAlert('puzzle-bg');
}

function creatPuzzle(block) {
    var line, blockOrg, blockTgt;
    initCell(block);

    function initCell(block) {
        line = document.body.line;
        blockOrg = Elem.creat('div', block, 'cell-block');
        creatCell(line, blockOrg, 0);

        blockTgt = Elem.creat('div', block, 'cell-block');
        creatCell(line, blockTgt, 1);
        Elem.get('btn-start').onclick = function() {
            mixCell();
        }
        Elem.get('btn-redo').onclick = function() {
            mixCell();
        }
    }

    function mixCell() {
        config.mixClock = setInterval(function() {
            if (config.mixLoop > 0) {
                var line = document.body.line;
                creatCell(line, blockTgt, 1);
                config.mixLoop--;
            } else {
                clearInterval(config.mixClock);
                config.mixLoop = config.constant.mixLoop;
            }
        }, 100);   
    }



    //解密字块
    function creatCell(line, block, mix) {
        block.innerHTML = '';
        line.mix = Parse.mix(line.word);
        var word = mix ? line.mix : line.word;

        var tips = Elem.creat('div', block, 'cell-tips');
        tips.innerHTML = mix ? config.cellTips : config.cellText;
        var space = Elem.creat('div', block, 'space20');
        var flex = Elem.creat('div', block, 'cell-flex');
        for(let idx in line.word) {
            if (line.word[idx] == '/') 
                flex = Elem.creat('div', block, 'cell-flex');

            if (word[idx] == '/') 
                continue;
            var cell = Elem.creat('div', flex, 'cell-text');
            cell.mix = mix;
            cell.able = true;
            cell.innerHTML = word[idx];
            cell.style.borderColor = getColorType();
            cell.style.backgroundColor = mix ? 'white' : getColorLight();
            cell.onclick = function() {
                clickCell(this);
            }
        }
        var space = Elem.creat('div', block, 'space20');
    }

    function clickCell(cell) {
        if (cell.mix && cell.able) {
            var color = config.curColor;
            var wordTgt = document.body.line.wordTgt;
            var wordCur = config.wordCur || '';
            wordCur += cell.innerHTML;
            config.wordCur = wordCur;
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
                Style.display('btn-open', 'inline');
                Style.display('btn-redo', 'none');
                Style.display('btn-abon', 'none');
            } else {

            }
            cell.able = false;
        }
    }
}

function creatJigsaw(block) {
    var tips, flex, blockOrg, blockTgt;
    var src = '../../picture/head/3.jpeg';
    var cellWidth, cellHight;
    var blockWidth, blockHeight;
    var hpw = 1.0;
    var cellLen = 3;
    var cells = [];
    var light = 4;
    var border = 10;
    var loop = 10;
    initCell(block);

    function initCell(block) {
        var img = new Image();
        img.src = src;
        img.onload = function() {
            hpw = this.height / this.width;
            var clientWidth = document.body.clientWidth - 76;
            blockWidth = clientWidth * config.zoom;
            blockHeight = blockWidth * hpw;
            block.style.width = blockWidth + 'px';
            block.style.margin = '0px auto';
            cellWidth = Math.floor((blockWidth - cellLen*border*2) / cellLen);
            cellHight = cellWidth * hpw;
            for (var i=0;i<cellLen;i++) {
                for (var j=0;j<cellLen;j++) {
                    var idx = i*cellLen + j;
                    var posY = -cellHight * i;
                    var posX = -cellWidth * j;
                    cells[idx] = {
                        idx: idx,
                        posX: posX,
                        posY: posY,
                    }
                }
            }
            console.log(cells);
            blockOrg = Elem.creat('div', block, 'cell-block');
            creatCell(blockOrg, cells, 0);
            Style.display('btn-redo', 'none');
            Elem.get('btn-start').onclick = function() {
                mixCell();
            }
            Elem.get('btn-redo').onclick = function() {
                mixCell();
            }
        }
    }

    function mixCell() {
        Style.display('btn-start', 'none');
        Style.display('btn-redo', 'inline');
        Elem.togType(Elem.get('btn-redo'), 'danger');
        config.mixClock = setInterval(function() {
            if (config.mixLoop > 0) {
                var line = document.body.line;
                creatCell(block, cells, 1);
                config.mixLoop--;
            } else {
                clearInterval(config.mixClock);
                config.mixLoop = config.constant.mixLoop;
            }
        }, 100);   
    }

    function creatCell(block, cells, mix) {
        block.innerHTML = '';
        cells = mix ? Parse.mix(cells) : cells;
        tips = Elem.creat('div', block, 'cell-tips');
        flex = Elem.creat('div', block, 'cell-flex');
        flex.style.flexWrap = 'wrap';
        tips.innerHTML = mix ? config.cellTips : config.cellText;
        for (var i=0;i<cellLen;i++) {
            for (var j=0;j<cellLen;j++) {
                var idx = i*cellLen + j;
                var cell = Elem.creat('div', flex, 'cell-jigsaw', idx);
                cell.idx = cells[idx].idx;
                cell.style.width = cellWidth + 'px';
                cell.style.height = cellHight + 'px';
                cell.style.backgroundSize = blockWidth + 'px ' + blockHeight + 'px';
                cell.style.backgroundPosition = cells[idx].posX + 'px ' + cells[idx].posY + 'px';
                cell.addEventListener('click', function(event) {
                    clickCell(event);
                });
                cells[idx].cell = cell;
            }
        }
        setHighLight();
    }

    function clickCell(event) {
        console.log(event);
        var org = flex.children[light];
        var tgt = event.target;
        if (org === tgt) return;
        var orgNext = org.nextSibling;
        var tgtNext = tgt.nextSibling;
        org.parentNode.insertBefore(tgt, orgNext);
        tgt.parentNode.insertBefore(org, tgtNext);
        setHighLight();
    }

    function setHighLight() {
        for (var i=0;i<cells.length;i++) {
            var cell = cells[i].cell;
            cell.style.border = `solid ${border}px white`;
        }
        var org = flex.children[light];
        org.style.border = `solid ${border}px ${getColorType()}`;
    }
}



function setResultAlert() {
    hideAlert('puzzle-bg');
    var bg = Elem.get('result-bg');
    var block = Elem.get('result-block');
    block.innerHTML = '';
    var line = document.body.line;
    rollLadd = 1;
    var allCount = Math.pow(2, line.ladd);
    var rollCount = Math.floor(Math.random() * allCount);
    getRoll(allCount, rollCount);

    var ladd = Elem.creat('div', block, 'line');
    ladd.innerHTML = line.inver + '的' + rollLadd + config.resultText;
    var pic = Elem.creat('img', block, 'img');
    pic.src = config.laddSrc + rollLadd + '.png';
    var price = Elem.creat('div', block, 'line');
    price.innerHTML = '<h2>￥' +  Parse.addSplit(line.priceAllList[rollLadd - 1]);
    showLog('<h4>恭喜您获得了</h4>' + ladd.innerText);
    showAlert('result-bg');
}

var rollLadd;
function getRoll(all, roll) {
    all = all / 2;
    if (roll > all) {
        rollLadd += 1;
        getRoll(all, roll - all);
    } else{
        return rollLadd;
    }
}

function setButton(inner, x) {
    var data = items[x].button;
    if (!data) return;
    var button = Elem.creat('div', inner, 'button');
    Elem.color(button, 'white', data.color);
    button.innerHTML = data.text;
    button.data = data;
    elems[x].button = button;
}


function setAlert() {
    setClick('btn-next', setPuzzleAlert);
    setClick('btn-redo', setPuzzleAlert);
    setClick('btn-open', setResultAlert);
}


function showAlertButton(data) {
    for (let idx in config.btnName) {
        var name = config.btnName[idx];
        var btn = Elem.get('btn-' + name);
        if (!btn) continue;
        Elem.display(btn, 'none');
    }
    for (let idx in data.btnName) {
        var name = data.btnName[idx];
        var text = data.btnText[idx];
        var btn = Elem.get('btn-' + name);
        if (!btn) continue;
        btn.innerHTML = text;
        Elem.display(btn, 'block');
    }
}





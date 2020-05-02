
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
    var list = items[x].list;
    for (let y in list) {
        var content = Elem.creat('div', inner, 'content', y);
        var data = list[y];
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
        line.ladder = Math.floor(20 * Math.random() * Math.random()) + 6;
        line.ladd = line.ladder - Math.floor(5 * Math.random());
        line.multi = Math.floor(100 * Math.pow(Math.random(),8)) + 1;
        line.index = Math.floor((1547 + Math.random()) * 1e9);
        line.stamp = Parse.formatTime(line.index).replace(' ', '<h3>');
        line.inver = list[idx].split('/')[0];
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
        line.row = parseInt(line.ladd / 5 - 0.2);
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

        setLineFlex(body, line, x);

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

    line.priceAllList = [];    
    line.pieceAllList = [];
    line.timesAllList = [];
    line.priceAll = 0;
    line.pieceAll = 0;
    line.timesAll = 0;
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

    line.priceCurList = [];
    line.pieceCurList = [];
    line.timesCurList = [];
    line.priceCur = 0;
    line.pieceCur = 0;
    line.timesCur = 0;
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


function setLineFlex(body, line, x) {
    var flex = Elem.creat('div', body, 'user-flex');
    var head = Elem.creat('img', flex, 'user-head');
    var left = Elem.creat('div', flex, 'user-left');
    var right = Elem.creat('div', flex, 'user-right');
    var name = Elem.creat('div', left, 'user-name');
    var marks = Elem.creat('div', left, 'user-flex');
    var ladd = Elem.creat('div', right, 'user-ladd');
    var group = Elem.creat('div', right, 'user-group');

    line.mark = ['身份标签1', '身份标签2'];
    if (line.mark) {
        for (let i in line.mark) {
            var mark = Elem.creat('div', marks, 'user-mark');
            mark.innerHTML = line.mark[i];
            mark.style.borderColor = getColorType(x);
        }
    }
    Elem.color(head, '', getColorLight(x));
    Elem.color(group, 'white', getColorType(x));
    Elem.style(group, 'borderColor', getColorType(x));

    name.innerHTML = line.inver;
    ladd.innerHTML = line.ladder  + '阶';
    group.innerHTML = body.data.group;
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


    var line = document.body.line;
    line.mix = Parse.mix(line.word, 1);
    var cellText = Elem.creat('div', block, 'cell-tips');
    cellText.innerHTML = config.cellText;
    setPuzzleCell(line, block, 0);

    var cellTips = Elem.creat('div', block, 'cell-tips');
    cellTips.style.marginTop = '5px';
    cellTips.innerHTML = config.cellTips;
    setPuzzleCell(line, block, 1);
    showAlert('puzzle-bg');
}


//解密字块
function setPuzzleCell(line, block, mix) {
    var str = mix ? line.mix : line.word;
    var space = Elem.creat('div', block, 'space20');
    var flex = Elem.creat('div', block, 'cell-flex');
    for(let idx in line.word) {
        if (line.word[idx] == '/') 
            flex = Elem.creat('div', block, 'cell-flex');

        if (str[idx] == '/') 
            continue;
        var textCell = Elem.creat('div', flex, 'cell-text');
        textCell.able = true;
        textCell.innerHTML = str[idx];
        textCell.style.borderColor = getColorType();
        textCell.style.backgroundColor = mix ? 'white' : getColorLight();
        textCell.onclick = function() {
            if (mix && this.able) {
                var color = config.curColor;
                var wordTgt = document.body.line.wordTgt;
                var wordCur = config.wordCur || '';
                wordCur += this.innerHTML;
                config.wordCur = wordCur;
                console.log('tgt:' + wordTgt + ' cur:' + wordCur);
                var redo = Elem.get('btn-redo');
                if (wordTgt.replace(wordCur, '') == wordTgt || wordTgt[0] != wordCur[0]) {
                    Elem.color(this, 'white', config.wrongColor);
                    Elem.style(this, 'borderColor', config.wrongColor);
                    Elem.togType(redo, 'permit');
                } else {
                    Elem.color(this, 'white', config.rightColor);
                    Elem.style(this, 'borderColor', config.rightColor);
                    Elem.togType(redo, 'danger');
                }
                if (wordTgt == wordCur) {
                    Style.display('btn-open', 'inline');
                    Style.display('btn-redo', 'none');
                    Style.display('btn-abon', 'none');
                } else {

                }
                this.able = false;
            }
        }
    }
    var space = Elem.creat('div', block, 'space20');
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
    ladd.innerHTML = line.inver + config.inverStr.substring(0, 2) + '的';
    ladd.innerHTML += rollLadd + config.resultText;
    var pic = Elem.creat('img', block, 'img');
    pic.src = config.laddSrc + rollLadd + '.png';
    var price = Elem.creat('div', block, 'line');
    price.innerHTML = '<h2>￥' +  Parse.addSplit(line.priceAllList[rollLadd - 1]);
    showLog(`<h4>恭喜您获得了</h4>${ladd.innerText}`);
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





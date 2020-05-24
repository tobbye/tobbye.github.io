
function setElems() {
    setOuterTop();
    setOuterCenter();
    setOuterBot();
    setInner();
    setAlert();
}


function setContent(inner, x) {
    var list = items[x].list
    for (let y in list) {
        var data = list[y];
        var content = Elem.creat('div', inner, 'content', y);
        setTitle(content, data);
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
    var list = Parse.mix(instance[data.instance]);
    for (let idx in list) {
        if (idx >= cfg.inveCount) break;
        var line = {};
        line.idx = idx;
        line.inver = list[idx].name;
        line.group = data.group;
        line.ladder = Math.floor(20 * Math.random() * Math.random()) + 6;
        line.ladd = line.ladder - Math.floor(5 * Math.random());
        line.multi = Math.floor(100 * Math.pow(Math.random(),8)) + 1;
        line.mark = ['身份标签1', '身份标签2'];
        line.index = Math.floor((1547 + Math.random()) * 1e9);
        line.stamp = Parse.formatTime(line.index).replace(' ', '<h3>');
        line.word = list[idx].word;
        line.src = list[idx].pic[0];
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
    for (var z = 0; z < cfg.laddCount; z++) {
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
    line.setAttribute('state', attr);
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
    document.body.data = data;

    var box = Elem.get('alert-box');
    var title = Elem.get('detail-title');
    var block = Elem.get('detail-block');
    Elem.color(box, '', getColorLight());
    title.innerHTML = data.flexStr.replace('#0',line.inver);
    block.style.maxHeight = config.page.alertHeight + 'px';
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

function setPackAlert() {
    let title, block, data;
    hideAlert('detail-bg');
    title = Elem.get('pack-title');
    block = Elem.get('pack-block');
    title.innerHTML = document.body.data.packTitle;
    block.innerHTML = '';
    data = document.body.data;
    Task.cfg.idx = 0;
    Task.cfg.pack = data.packType;
    Task.cfg.types = data.taskType;
    for (let idx in data.taskType) {
        let line, flex;
        flex = Elem.creat('div', block, 'user-flex');
        line = Elem.creat('div', flex, 'line');
        line.setAttribute('state', 'A');
        line.innerHTML = '<h3>任务' + (parseInt(idx)+1);
        line = Elem.creat('div', flex, 'line');
        line.setAttribute('state', 'B');
        line.innerHTML = '<h3>' + Task.cfg.types[idx].toUpperCase() + ' TASK';
    }
    showAlert('pack-bg');
}


function setTaskAlert() {
    let redo, title, block;
    hideAlert('pack-bg');
    redo = Elem.get('btn-redo');
    block = Elem.get('task-block');
    redo.setAttribute('state', 'danger');
    block.innerHTML = '';
    Task.creatTask(block);
    showAlert('task-bg');
}




function setResultAlert() {
    hideAlert('task-bg');
    var bg = Elem.get('result-bg');
    var block = Elem.get('result-block');
    block.innerHTML = '';
    var line = document.body.line;
    var data = document.body.data;
    Task.cfg.roll = 1;
    Task.cfg.ladd = Math.min(line.ladd, Task.cfg.ladd);
    var allCount = Math.pow(2, line.ladd);
    var rollCount = Math.floor(Math.random() * allCount);
    getRoll(allCount, rollCount);

    var ladd = Elem.creat('div', block, 'line');
    ladd.innerHTML = line.inver + '的' + Task.cfg.ladd + '阶' + Task.cfg.pack;
    var pic = Elem.creat('img', block, 'img');
    pic.src = cfg.laddSrc + Task.cfg.ladd + '.png';
    var price = Elem.creat('div', block, 'line');
    price.innerHTML = '<h2>￥' +  Parse.addSplit(line.priceAllList[Task.cfg.ladd - 1]);
    showLog('<h4>恭喜您获得了</h4>' + ladd.innerText);
    showAlert('result-bg');
}

function getRoll(all, roll) {
    all = all / 2;
    if (roll > all) {
        Task.cfg.roll += 1;
        getRoll(all, roll - all);
    } else{
        return Task.cfg.roll;
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
    btnClick('btn-doit', setPackAlert);
    btnClick('btn-abon', hideAlert);
    btnClick('btn-start', setTaskAlert);
    btnClick('btn-throw', hideAlert);
    btnClick('btn-next', setTaskAlert);
    btnClick('btn-open', setResultAlert);
}


function showAlertButton(data) {
    for (let idx in cfg.btnName) {
        var name = cfg.btnName[idx];
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





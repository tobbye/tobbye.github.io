
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


function InveLine() {

    this.initTemp = function(data, list, idx) {
        this.idx = idx;
        this.inver = list[idx].name;
        this.group = data.group;
        this.ladder = Math.floor(20 * Math.random() * Math.random()) + 6;
        this.ladd = this.ladder - Math.floor(5 * Math.random());
        this.multi = Math.floor(100 * Math.pow(Math.random(),8)) + 1;
        this.mark = ['身份标签1', '身份标签2'];
        this.index = Math.floor((1547 + Math.random()) * 1e9);
        this.stamp = Parse.formatTime(this.index).replace(' ', '<h3>');
        this.word = list[idx].word;
        this.src = list[idx].pic[0];
    };

    this.initData = function(dot, isGrab) {
        this.row = parseInt(this.ladd / 5 - 0.2);
        this.priceAll = 0;
        this.pieceAll = 0;
        this.timesAll = 0;
        this.priceAllList = [];    
        this.pieceAllList = [];
        this.timesAllList = [];
        for (var z = 0; z < this.ladd; z++) {
            this.priceAllList[z] = Math.pow(2, z);
            this.pieceAllList[z] = Math.pow(2, this.ladd - z - 1) * this.multi;
            this.timesAllList[z] =  this.pieceAllList[z] * dot;
        }

        this.priceAll = Math.pow(2, this.ladd - 1) * this.ladd * this.multi;
        this.pieceAll = Math.pow(2, this.ladd) * this.multi - this.multi;
        this.timesAll = this.pieceAll * dot;

        this.laddStr = '阶梯<br/><h3>' +  this.ladd + '阶</h3>';
        this.pieceStr = '总份数<br/><h3>' +  Parse.sub4Num(this.pieceAll) + '份</h3>';
        this.priceStr = '总金额<br/><h3>' +  Parse.sub4Num(this.priceAll) + '元</h3>';
        this.timesStr = '可传播<br/><h3>' +  Parse.sub4Num(this.timesAll) + '次</h3>';
        this.pieceEach = (this.priceAll / this.pieceAll).toFixed(2) + '元/份';
        if (dot == 1) {
            this.timesEach = (this.priceAll / this.timesAll).toFixed(2) + '元/次';
        } else {
            this.timesEach = (this.priceAll / this.timesAll * 1000).toFixed(2) + '元/千次';
        }
        if (!isGrab) 
            return this;
        
        this.priceCur = 0;
        this.pieceCur = 0;
        this.timesCur = 0;
        this.priceCurList = [];
        this.pieceCurList = [];
        this.timesCurList = [];
        for (var z = 0; z < this.ladd; z++) {
            var rand = Math.random() / 4 + 0.25;
            this.priceCurList[z] = this.priceAllList[z];
            this.pieceCurList[z] = Math.floor(this.pieceAllList[z] * rand);
            var rand = Math.random() / 4 + 0.50;
            if (dot == 1) rand = 1;
            this.timesCurList[z] = this.pieceAllList[z] - this.pieceCurList[z];
            this.timesCurList[z] = Math.floor(this.timesCurList[z] * rand * dot);
            this.pieceCur += this.pieceCurList[z];
            this.priceCur += this.priceCurList[z] * this.pieceCurList[z];
            this.timesCur += this.timesCurList[z];
        }
        this.laddStr = this.laddStr.replace('h3', 'h5');
        this.pieceStr = this.pieceStr.replace('h3', 'h5');
        this.priceStr = this.priceStr.replace('h3', 'h5');
        this.timesStr = this.timesStr.replace('h3', 'h5');
        this.laddStr += '倍数<br/><h3>' +  this.multi + '倍';
        this.pieceStr += '剩余份数<br/><h3>' +  Parse.sub4Num(this.pieceCur) + '份';
        this.priceStr += '剩余金额<br/><h3>' +  Parse.sub4Num(this.priceCur) + '元';
        this.timesStr += '已传播<br/><h3>' +  Parse.sub4Num(this.timesCur) + '次';
        this.pieceEach = (this.priceCur / this.pieceCur).toFixed(2) + '元/份';
    }

}


function initTemp(data) {
    let lines = data.lines;
    if (lines.length > 0)
        return lines;
    let list = Parse.mix(instance[data.instance]);
    for (let idx in list) {
        if (idx >= cfg.inveCount) break;
        lines[idx] = new InveLine();
        lines[idx].initTemp(data, list, idx);
    }
    return lines;
}


function creatGrabBody(content, data, x) {
    if (!data.lines)
        return;
    var lines = initTemp(data);
    var block = Elem.creat('div', content, 'block');
    for (let z in lines) {
        var line = lines[z];
        if (!line.ladd) continue;
        line.initData = line.initData || new InveLine().initData;
        line.initData(data.dot, data.isGrab);

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
        line.initData = line.initData || new InveLine().initData;
        line.initData(data.dot, data.isGrab);
        lines.push(line);
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



function setLineText(flex, attr, text) {
    var elem = Elem.creat('text', flex, 'line');
    elem.setAttribute('state', attr);
    elem.innerHTML = text;
    return elem;
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
    let data = body.data;
    let line = body.line;
    document.body.line = line;
    document.body.data = data;

    let box = Elem.get('alert-box');
    let title = Elem.get('detail-title');
    let block = Elem.get('detail-block');
    Elem.color(box, '', getColorLight());
    title.innerHTML = data.flexStr.replace('#0',line.inver);
    block.style.maxHeight = Config.page.alertHeight + 'px';
    block.innerHTML = '';


    let ladd = line.ladd - 1;
    //alert(JSON.stringify(line));
    let priceKey = 'priceAllList';
    let pieceKey = data.isGrab ? 'pieceCurList' : 'pieceAllList';
    let timesKey = data.isGrab ? 'timesCurList' : 'timesAllList';

    for (let i = 0; i < line.ladd; i++) {
        let idx = line.ladd - i - 1;
        let flex = Elem.creat('div', block, 'user-flex', idx);
        let laddStr = data.laddStr.replace('#0', (line.ladd - i));
        let pieceStr = data.pieceStr.replace('#0', Parse.sub4Num(line[pieceKey][idx]));
        let priceStr = data.priceStr.replace('#0', Parse.sub4Num(line[priceKey][idx]));
        let timesStr = data.timesStr.replace('#0', Parse.sub4Num(line[timesKey][idx]));
        let ladd = setLineText(flex, 'A', laddStr);
        let piece = setLineText(flex, 'B', pieceStr);
        let price = setLineText(flex, 'B', priceStr);
        let times = setLineText(flex, 'B', timesStr);
    }

    if(block.firstChild)
        block.firstChild.scrollIntoView();
    showAlert('detail-bg');
    showAlertButton(data);
}

function setPackAlert() {
    let title, block, data;
    hideAlert('detail-bg');
    data = document.body.data;
    title = Elem.get('pack-title');
    block = Elem.get('pack-block');
    title.innerHTML = data.packTitle;
    block.innerHTML = '';

    for (let idx in data.taskTypes) {
        let line, flex;
        flex = Elem.creat('div', block, 'user-flex');
        line = Elem.creat('div', flex, 'line');
        line.setAttribute('state', 'A');
        line.innerHTML = '<h3>任务' + (parseInt(idx)+1);
        line = Elem.creat('div', flex, 'line');
        line.setAttribute('state', 'B');
        line.innerHTML = '<h3>' + data.taskTypes[idx].toUpperCase() + ' TASK';
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
    Task.roll = 1;
    Task.ladd = Math.min(line.ladd, Task.ladd);
    var allCount = Math.pow(2, line.ladd);
    var rollCount = Math.floor(Math.random() * allCount);
    getRoll(allCount, rollCount);

    var ladd = Elem.creat('div', block, 'line');
    ladd.innerHTML = line.inver + '的' + Task.ladd + '阶' + Task.pack;
    var pic = Elem.creat('img', block, 'img');
    pic.src = cfg.laddSrc + Task.ladd + '.png';
    var price = Elem.creat('div', block, 'line');
    price.innerHTML = '<h2>￥' +  Parse.addSplit(line.priceAllList[Task.ladd - 1]);
    showLog('<h4>恭喜您获得了</h4>' + ladd.innerText);
    showAlert('result-bg');
}

getRoll = function(all, roll) {
    all = all / 2;
    if (roll > all) {
        Task.roll += 1;
        getRoll(all, roll - all);
    } else{
        return Task.roll;
    }
}

setButton = function(inner, x) {
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


showAlertButton = function(data) {
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





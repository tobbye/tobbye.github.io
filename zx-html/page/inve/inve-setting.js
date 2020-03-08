
function setElems() {
    setOuterTop();
    setOuterCenter();
    setAlert();
}


function setOuterTop() {
    var outerTop = Elem.get("outer-top");
    for (let x in items) {
        var btn = Elem.creat("div", outerTop, "button-top");
        btn.innerHTML = items[x].title;
        btn.idx = x;
        elems[x].btntop = btn;
        btn.onclick = function() {
            setInner(this.idx);
        }
    }
}

function setOuterCenter() {
    var outerCenter = Elem.get("outer-center");
    for (let x in items) {
        var inner = Elem.creat("div", outerCenter, "inner", x);
        elems[x].inner = inner;
        setContent(inner, x);
    }
}

function setContent(inner, x) {
    var list = items[x].list;
    for (let y in list) {
        var content = Elem.creat("div", inner, "content", y);
        var data = list[y];
        setTitle(content, data);
        setNotLine(content, data);
        if (data.isGrab)
            creatGrabBody(content, data, x);
        else
            creatInveBody(content, data, x);
    }
}

function setTitle(content, data) {
    if (data.title) {
        var title = Elem.creat("div", content, "title");
        title.innerHTML = data.title;
    }
    if (data.vice) {
        var vice = Elem.creat("div", content, "vice");
        vice.innerHTML = data.vice;
    }
}

function setNotLine(content, data) {
    if (data.lines) 
        return;
    var block = Elem.creat("div", content, "block");
    block.style.fontSize = "5em";
    block.style.padding = "4em";
    block.innerHTML = "此处为空";
    Elem.color(block, "#888", "white");
}


function initTempLine(data) {
    var lines = data.lines;
    if (lines.length > 0)
        return lines;
    var str = instance[data.instance].replace(/\n/g, "");
    var list = Parse.mix(str.split(","));
    for (let idx in list) {
        var line = {};
        line.ladder = Math.floor(20 * Math.random() * Math.random()) + 6;
        line.ladd = line.ladder - Math.floor(5 * Math.random());
        line.multi = Math.floor(100 * Math.random()) + 1;
        line.index = Math.floor((1547 + Math.random()) * 1e9);
        line.stamp = Parse.formatTime(line.index).replace(" ", "<h3>");
        line.inver = list[idx].split("/")[0];
        line.word = list[idx].replace(/ /g, "/");
        line.wordOrg = line.word;
        line.wordTgt = line.word.replace(/\//g, "");
        lines[idx] = line;
    }
    return lines;
}


function creatGrabBody(content, data, x) {
    if (!data.lines)
        return;
    var lines = initTempLine(data);
    var block = Elem.creat("div", content, "block");
    for (let z in lines) {
        var line = lines[z];
        if (!line.ladd) continue;
        line = initLineData(line, data.dot, data.isGrab);
        line.row = parseInt(line.ladd / 5 - 0.2);
        var body = Elem.creat("div", block, "user-block");
        body.data = data;
        body.line = line;
        body.onclick = function() {
            console.log(this.line);
            selectLine(this);
            alertDetail(this);
        }
        var flex = Elem.creat("div", body, "user-flex");
        var index = Elem.creat("div", flex, "user-index");
        var stamp = Elem.creat("div", flex, "user-stamp");
        index.innerHTML = "编号: " + line.index;
        index.innerHTML += "<br/>" + data.inverStr;
        stamp.innerHTML = "时间: " + line.stamp;

        creatLineFlex(body, line, x);

        var flex = Elem.creat("div", body, "user-flex");
        flex.style.marginTop = "0px";
        flex.style.marginBottom = "10px";
        var ladd = creatLineText(flex, line.laddStr);
        var piece = creatLineText(flex, line.pieceStr);
        var price = creatLineText(flex, line.priceStr);
        var times = creatLineText(flex, line.timesStr);
        ladd.style.flex = 17;
    }
    data.lines = lines;
}


function creatInveBody(content, data, x) {
    if (!data.lines)
        return;
    var lines = data.lines;
    var block = Elem.creat("div", content, "block");
    for (var z = 0; z < config.laddCount; z++) {
        var line = {ladd: z+1, multi: 1}; 
        line = initLineData(line, data.dot, data.isGrab);
        lines.push(line);
        if (!line.ladd) continue;
        line.row = Math.floor(line.ladd / 5 - 0.2);

        var body = Elem.creat("div", block, "user-flex", z);
        //Elem.color(body, line.color.deep, "white");
        body.data = data;
        body.line = line;
        body.onclick = function() {
            console.log(this.line);
            selectLine(this);
            alertDetail(this);
        }
        var ladd = creatLineText(body, line.laddStr);
        var piece = creatLineText(body, line.pieceStr);
        var price = creatLineText(body, line.priceStr);
        var times = creatLineText(body, line.timesStr);
        ladd.style.flex = 17;
        if (z == 0) {
            selectLine(body);
        }
    }
    data.lines = lines;
    // console.log(lines);
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

    line.laddStr = "阶梯<br/><h3>" +  line.ladd + "阶</h3>";
    line.pieceStr = "总份数<br/><h3>" +  Parse.sub4Num(line.pieceAll) + "份</h3>";
    line.priceStr = "总金额<br/><h3>" +  Parse.sub4Num(line.priceAll) + "元</h3>";
    line.timesStr = "可传播<br/><h3>" +  Parse.sub4Num(line.timesAll) + "次</h3>";
    line.pieceEach = (line.priceAll / line.pieceAll).toFixed(2) + "元/份";
    if (dot == 1) {
        line.timesEach = (line.priceAll / line.timesAll).toFixed(2) + "元/次";
    } else {
        line.timesEach = (line.priceAll / line.timesAll * 1000).toFixed(2) + "元/千次";
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
    line.laddStr = line.laddStr.replace("h3", "h4");
    line.pieceStr = line.pieceStr.replace("h3", "h4");
    line.priceStr = line.priceStr.replace("h3", "h4");
    line.timesStr = line.timesStr.replace("h3", "h4");
    line.laddStr += "倍数<br/><h3>" +  line.multi + "倍";
    line.pieceStr += "剩余份数<br/><h3>" +  Parse.sub4Num(line.pieceCur) + "份";
    line.priceStr += "剩余金额<br/><h3>" +  Parse.sub4Num(line.priceCur) + "元";
    line.timesStr += "已传播<br/><h3>" +  Parse.sub4Num(line.timesCur) + "次";
    line.pieceEach = (line.priceCur / line.pieceCur).toFixed(2) + "元/份";
    return line;
}


function creatLineText(flex, text) {
    var line = Elem.creat("text", flex, "line");
    line.innerHTML = text;
    return line;
}


function creatLineFlex(body, line, x) {
    var flex = Elem.creat("div", body, "user-flex");
    var head = Elem.creat("img", flex, "user-head");
    var left = Elem.creat("div", flex, "user-left");
    var right = Elem.creat("div", flex, "user-right");
    var name = Elem.creat("div", left, "user-name");
    var marks = Elem.creat("div", left, "user-flex");
    var ladd = Elem.creat("div", right, "user-ladd");
    var group = Elem.creat("div", right, "user-group");

    line.mark = ["身份标签1", "身份标签2"];
    if (line.mark) {
        for (let i in line.mark) {
            var mark = Elem.creat("div", marks, "user-mark");
            mark.innerHTML = line.mark[i];
            mark.style.borderColor = getColorType(x);
        }
    }
    Elem.color(head, "", getColorLight(x));
    Elem.color(group, "white", getColorType(x));
    Elem.style(group, "borderColor", getColorType(x));

    name.innerHTML = line.inver;
    ladd.innerHTML = line.ladder  + "阶";
    group.innerHTML = body.data.group;
}


function selectLine(flex) { 
    var old = config.flex;
    if (old) {
        old.style.border = "solid 0px transparent";
        old.style.marginBottom = "5px";
    }
    if (flex) {
        flex.style.border =  "solid 12px red";
        flex.style.marginBottom =  "10px";
        config.flex = flex; 
    }
}


function alertDetail(body) {
    var data = body.data;
    var line = body.line;
    config.line = line;
    config.wordCur = "";
    config.puzzleText = data.puzzleText;
    config.cellText = data.cellText;
    config.cellTips = data.cellTips;
    var ladd = line.ladd - 1;
    //alert(JSON.stringify(line));
    var priceKey = "priceAllList";
    var pieceKey = data.isGrab ? "pieceCurList" : "pieceAllList";
    var timesKey = data.isGrab ? "timesCurList" : "timesAllList";
    var block = Elem.get("detail-block");
    block.style.maxHeight = config.alertHeight + "px";
    block.innerHTML = "";

    for (var i = 0; i < line.ladd; i++) {
        var idx = line.ladd - i - 1;
        var flex = Elem.creat("div", block, "user-flex", idx);
        var ladd = Elem.creat("text", flex, "line");
        var piece = Elem.creat("text", flex, "line");
        var price = Elem.creat("text", flex, "line");
        var times = Elem.creat("text", flex, "line");
        ladd.style.flex = "15";
        ladd.innerHTML = data.laddStr.replace("{0}", (line.ladd - i));
        piece.innerHTML = data.pieceStr.replace("{0}", Parse.sub4Num(line[pieceKey][idx]));
        price.innerHTML = data.priceStr.replace("{0}", Parse.sub4Num(line[priceKey][idx]));
        times.innerHTML = data.timesStr.replace("{0}", Parse.sub4Num(line[timesKey][idx]));
    }

    var box = Elem.get("alert-box");
    var title = Elem.get("detail-title");
    box.style.backgroundColor = getColorLight();
    title.innerHTML = data.flexStr.replace("{0}",line.inver);
    if(block.firstChild)
        block.firstChild.scrollIntoView();
    showAlert("detail-bg");
    showAlertButton(data);
}


function alertPuzzle() {
    Style.display("detail-bg", "none");
    Style.display("puzzle-bg", "block");
    Style.display("btn-open", "none");
    Style.display("btn-redo", "block");
    Style.color("btn-redo", "", "red");
    var block = Elem.get("puzzle-block");
    block.innerHTML = "";
    config.wordCur = "";
    var title = Elem.get("puzzle-title");
    title.innerHTML = config.puzzleText;
    
    var line = config.line;
    line.mix = Parse.mix(line.word, 1);
    var cellText = Elem.creat("div", block, "cell-tips");
    cellText.innerHTML = config.cellText;
    creatPuzzle(line, block, 0);

    var cellTips = Elem.creat("div", block, "cell-tips");
    cellTips.style.marginTop = "5px";
    cellTips.innerHTML = config.cellTips;
    creatPuzzle(line, block, 1);
}


//解密字块
function creatPuzzle(line, block, mix) {
    var str = mix ? line.mix : line.word;
    var space = Elem.creat("div", block, "space20");
    var flex = Elem.creat("div", block, "cell-flex");
    for(let idx in line.word) {
        if (line.word[idx] == "/") 
            flex = Elem.creat("div", block, "cell-flex");

        if (str[idx] == "/") 
            continue;
        var textCell = Elem.creat("div", flex, "cell-text");
        textCell.able = true;
        textCell.innerHTML = str[idx];
        textCell.style.borderColor = getColorType();
        textCell.style.backgroundColor = mix ? "white" : getColorLight();
        textCell.onclick = function() {
            if (mix && this.able) {
                var color = config.curColor;
                var wordTgt = config.line.wordTgt;
                var wordCur = config.wordCur || "";
                wordCur += this.innerHTML;
                config.wordCur = wordCur;
                console.log("tgt:" + wordTgt + " cur:" + wordCur);
                if (wordTgt.replace(wordCur, "") == wordTgt || wordTgt[0] != wordCur[0]) {
                    Elem.color(this, "white", "red");
                    Elem.style(this, "borderColor", "red");
                    Style.color("btn-redo", "white", "green");
                } else {
                    Elem.color(this, "white", "green");
                    Elem.style(this, "borderColor", "green");
                    Style.color("btn-redo", "white", "red");
                }
                if (wordTgt == wordCur) {
                    Style.display("btn-open", "inline");
                    Style.display("btn-redo", "none");
                    Style.display("btn-abon", "none");
                } else {

                }
                this.able = false;
            }
        }
    }
    var space = Elem.creat("div", block, "space20");
}


function alertResult() {
    Style.display("puzzle-bg", "none");
    Style.display("result-bg", "block");
    var bg = Elem.get("result-bg");
    var block = Elem.get("result-block");
    block.innerHTML = "";
    var line = config.line;
    rollLadd = 1;
    var allCount = Math.pow(2, line.ladd);
    var rollCount = Math.floor(Math.random() * allCount);
    getRoll(allCount, rollCount);

    var ladd = Elem.creat("div", block, "line");
    ladd.innerHTML = rollLadd + "阶红包";
    var pic = Elem.creat("img", block, "img");
    pic.src = config.laddSrc + rollLadd + ".png";
    var price = Elem.creat("div", block, "line");
    price.innerHTML = "<h2>￥" +  Parse.addSplit(line.priceAllList[rollLadd - 1]);
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
    var button = Elem.creat("div", inner, "button");
    Elem.color(button, "white", data.color);
    button.innerHTML = data.text;
    button.data = data;
    elems[x].button = button;
}


function setAlert() {
    hideAlert();
    Elem.get("btn-next").onclick = function() {
        alertPuzzle();
    }
    Elem.get("btn-doit").onclick = function() {
        hideAlert();
    }
    Elem.get("btn-quit").onclick = function() {
        hideAlert();
    }
    Elem.get("btn-close").onclick = function() {
        hideAlert();
    }
    Elem.get("btn-redo").onclick = function() {
        alertPuzzle();
    }
    Elem.get("btn-abon").onclick = function() {
        hideAlert();
    }
    Elem.get("btn-open").onclick = function() {
        alertResult();
    }
}


function showAlertButton(data) {
    for (let idx in config.btnName) {
        var name = config.btnName[idx];
        var btn = Elem.get("btn-" + name);
        if (!btn) continue;
        btn.style.display = "none";
    }
    for (let idx in data.btnName) {
        var name = data.btnName[idx];
        var text = data.btnText[idx];
        var btn = Elem.get("btn-" + name);
        if (!btn) continue;
        btn.innerHTML = text;
        btn.style.display = "inline";
    }
}





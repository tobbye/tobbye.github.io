
function setElems() {
    setOuterTop();
    setOuterCenter();
    setAlert();
}


function setOuterTop() {
    var outerTop = Elem.get("outer-top");
    for (let x in items) {
        var btn = Elem.set("div", outerTop, "button-top");
        btn.innerHTML = items[x].title;
        btn.idx = x;
        elems[x].btntop = btn;
        btn.onclick = function() {
            values.innerIdx = this.idx;
            setInner();
        }
    }
}

function setOuterCenter() {
    var outerCenter = Elem.get("outer-center");
    for (let x in items) {
        var inner = Elem.set("div", outerCenter, "inner", x);
        elems[x].inner = inner;
        setContent(inner, x);
    }
}

function setContent(inner, x) {
    var list = items[x].list;
    for (let y in list) {
        var content = Elem.set("div", inner, "content", x+y);
        var data = list[y];
        if (data.title)
            setTitle(content, data, x);
        if (!data.lines)
            setNotLine(content, x);
        if (data.lines) {
            if (data.isGrab)
                setGrabLine(content, data, x, y);
            else
                setInveLine(content, data, x, y);
        }
    }
}

function setTitle(content, data, x) {
    //TITLE
    var title = Elem.set("div", content, "title");
    title.innerHTML = data.title;
    title.x = x;
    //VICE
    var vice = Elem.set("div", content, "vice");
    vice.innerHTML = data.vice;
    vice.x = x;
}

function setNotLine(content, x) {
    var block = Elem.set("div", content, "block");
    block.style.fontSize = "5em";
    block.style.padding = "4em";
    block.innerHTML = "此处为空";
    Elem.color(block, "#888", "white");
}


function setTempLine(data) {
    var lines = data.lines;
    if (lines.length > 0)
        return lines;
    var str = instance[data.instance];
    var list = Parse.mix(str.split(','));
    for (let idx in list) {
        var line = {};
        line.ladder = Math.floor(20 * Math.random() * Math.random()) + 6;
        line.ladd = line.ladder - Math.floor(5 * Math.random());
        line.multi = Math.floor(100 * Math.random()) + 1;
        line.index = Math.floor((1547 + Math.random()) * 1e9);
        line.stamp = Parse.formatTime(line.index).replace(' ', '<h3>');
        line.inver = list[idx].split('/')[0];
        line.word = list[idx].replace(/\n/g, "").replace(/ /g, "/");
        line.wordOrg = line.word;
        line.wordTgt = line.word.replace(/\//g, "");
        lines[idx] = line;
    }
    return lines;
}


function setGrabLine(content, data, x, y) {
    var lines = setTempLine(data);
    var list = Elem.set("div", content, "block");
    for (let z in lines) {
        var line = lines[z];
        if (!line.ladd) continue;
        line = setLineData(line, data.dot, data.isGrab);
        line.row = parseInt(line.ladd / 5 - 0.2);
        var block = Elem.set("div", list, "block", z);
        block.x = x;
        block.y = y;
        block.z = z;
        block.line = line;
        block.onclick = function() {
            console.log(this.line);
            setDetailStyle(this);
            setDetailAlert(this);
        }
        var flex = Elem.set("div", block, "flex");
        //INDEX
        var index = Elem.set("text", flex, "line");
        Elem.flex(index, "left", 30);
        Elem.style(flex, "marginBottom", '0px');
        index.innerHTML = "编号: " + line.index;
        index.innerHTML += "<br/>" + data.inverStr;
        //STAMP
        var stamp = Elem.set("text", flex, "line");
        stamp.innerHTML = "时间: " + line.stamp;
        Elem.flex(stamp, "right", 20);

        setLineDetail(block, line, x);

        var flex = Elem.set("div", block, "flex");
        flex.style.marginBottom = "10px";
        var ladd = setLineText(flex, line.laddStr);
        var piece = setLineText(flex, line.pieceStr);
        var price = setLineText(flex, line.priceStr);
        var times = setLineText(flex, line.timesStr);
        ladd.style.flex = 17;
    }
    items[x].list[y].lines = lines;
}


function setInveLine(content, data, x, y) {
    var lines = data.lines;
    //BLOCK
    var block = Elem.set("div", content, "block");

    for (var z = 0; z < config.laddCount; z++) {
        var line = {ladd: z+1, multi: 1}; 
        line = setLineData(line, data.dot, data.isGrab);
        lines.push(line);
        if (!line.ladd) continue;
        line.row = Math.floor(line.ladd / 5 - 0.2);

        //FLEX
        var flex = Elem.set("div", block, "flex", z);
        //Elem.color(flex, line.color.deep, "white");
        flex.x = x;
        flex.y = y;
        flex.z = z;
        flex.line = line;
        flex.onclick = function() {
            console.log(this.line);
            setDetailStyle(this);
            setDetailAlert(this);
        }
        var ladd = setLineText(flex, line.laddStr);
        var piece = setLineText(flex, line.pieceStr);
        var price = setLineText(flex, line.priceStr);
        var times = setLineText(flex, line.timesStr);
        ladd.style.flex = 17;
        if (z == 0) {
            elems[x].flex = flex;
            setDetailStyle(flex);
        }
    }
    items[x].list[y].lines = lines;
    // console.log(lines);
}


function setLineData(line, dot, isGrab) {

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
    line.pieceEach = (line.priceCur / line.pieceCur).toFixed(2) + '元/份';
    line.laddStr = line.laddStr.replace("h3", "h4");
    line.pieceStr = line.pieceStr.replace("h3", "h4");
    line.priceStr = line.priceStr.replace("h3", "h4");
    line.timesStr = line.timesStr.replace("h3", "h4");
    line.laddStr += "倍数<br/><h3>" +  line.multi + "倍";
    line.pieceStr += "剩余份数<br/><h3>" +  Parse.sub4Num(line.pieceCur) + "份";
    line.priceStr += "剩余金额<br/><h3>" +  Parse.sub4Num(line.priceCur) + "元";
    line.timesStr += "已传播<br/><h3>" +  Parse.sub4Num(line.timesCur) + "次";
    line.pieceEach = (line.priceCur / line.pieceCur).toFixed(2) + '元/份';
    return line;
}


function setLineText(flex, text) {
    var line = Elem.set("text", flex, "line");
    line.innerHTML = text;
    return line;
}


function setLineDetail(block, data, x) {
    var line = Elem.set("div", block, "user-block");
    line.block = {};
    line.body = Elem.set("div", line, "blk-body");
    line.tag = Elem.set("div", line, "blk-tag");
    line.desc = Elem.set("div", line, "blk-desc");
    line.button = Elem.set("div", line, "blk-button");
    line.flex = Elem.set("div", line.body, "user-flex");
    line.head = Elem.set("img", line.flex, "user-head");
    line.left = Elem.set("div", line.flex, "user-left");
    line.name = Elem.set("div", line.left, "user-name");
    line.mark = Elem.set("div", line.left, "user-flex");
    line.right = Elem.set("div", line.flex, "user-right");
    line.ladd = Elem.set("div", line.right, "user-ladd");
    line.nexu = Elem.set("div", line.right, "user-nexu");

    data.mark = ['身份标签1', '身份标签2'];
    if (data.mark) {
        for (let i in data.mark) {
            var mark = Elem.set("div", line.mark, "user-mark");
            mark.innerHTML = data.mark[i];
            mark.style.borderColor = getColorType(x);
        }
    }
    Elem.color(line.head, "", getColorLight(x));
    Elem.color(line.nexu, "white", getColorType(x));
    Elem.style(line.nexu, "borderColor", getColorType(x));

    data.nexu = items[x].group;
    line.name.innerHTML = data.inver;
    line.ladd.innerHTML = (data.ladder || data.ladd) + "阶";
    line.nexu.innerHTML = data.nexu;
}


function setDetailStyle(flex) { 
    var x = flex.x;
    var old = elems[x].flex;
    if (old) {
        old.style.border = "solid 0px transparent";
        old.style.marginBottom = "5px";
    }
    if (flex) {
        flex.style.border =  "solid 12px red";
        flex.style.marginBottom =  "10px";
        elems[x].flex = flex; 
    }
}


function setDetailAlert(flex) {
    var x = flex.x;
    var y = flex.y;
    var z = flex.z;
    var data = items[x].list[y];
    var line = flex.line;
    config.line = line;
    config.wordCur = "";
    config.puzzleText = data.puzzleText;
    var ladd = line.ladd - 1;
    //alert(JSON.stringify(line));
    var color = items[x].color;
    var priceKey = "priceAllList";
    var pieceKey = data.isGrab ? "pieceCurList" : "pieceAllList";
    var timesKey = data.isGrab ? "timesCurList" : "timesAllList";
    var block = Elem.get("detail-block");
    block.style.maxHeight = config.alertHeight + "px";
    block.innerHTML = "";

    for (var i = 0; i < line.ladd; i++) {
        var idx = line.ladd - i - 1;
        var flex = Elem.set("div", block, "flex", idx);
        var ladd = Elem.set("text", flex, "line");
        var piece = Elem.set("text", flex, "line");
        var price = Elem.set("text", flex, "line");
        var times = Elem.set("text", flex, "line");
        ladd.style.flex = "15";
        ladd.innerHTML = data.laddStr.replace("{0}", (line.ladd - i));
        piece.innerHTML = data.pieceStr.replace("{0}", Parse.sub4Num(line[pieceKey][idx]));
        price.innerHTML = data.priceStr.replace("{0}", Parse.sub4Num(line[priceKey][idx]));
        times.innerHTML = data.timesStr.replace("{0}", Parse.sub4Num(line[timesKey][idx]));
    }

    // block.scrollIntoView(true);
    var box = Elem.get("alert-box");
    var title = Elem.get("detail-title");
    box.style.backgroundColor = getColorLight(x);
    title.innerHTML = line.inver || ""; 
    title.innerHTML += data.flexStr;
    showAlert(data);
}


function setPuzzleAlert() {
    Style.display("detail-bg", "none");
    Style.display("puzzle-bg", "inline");
    Style.display("btn-open", "none");
    Style.display("btn-redo", "inline");
    Style.color("btn-redo", "white", "red");
    var block = Elem.get("puzzle-block");
    block.innerHTML = "";
    config.wordCur = "";
    var title = Elem.get("puzzle-title");
    title.innerHTML = config.puzzleText;
    
    var line = config.line;
    line.mix = Parse.mix(line.word, 1);
    var cellText = Elem.set("div", block, "line-text");
    cellText.innerHTML = "口令";
    setPuzzleCell(line, block, 0);

    var cellTips = Elem.set("div", block, "line-text");
    cellTips.style.marginTop = "5px";
    cellTips.innerHTML = "输入正确口令打开红包";
    setPuzzleCell(line, block, 1);
}


//解密字块
function setPuzzleCell(line, block, mix) {
    var str = mix ? line.mix : line.word;
    var space = Elem.set("div", block, "space20");
    var flex = Elem.set("div", block, "cell-flex");
    for(let idx in line.word) {
        if (line.word[idx] == "/") 
            flex = Elem.set("div", block, "cell-flex");

        if (str[idx] == "/") 
            continue;
        var textCell = Elem.set("div", flex, "cell-text");
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
    var space = Elem.set("div", block, "space20");
}


function setResultAlert() {
    Style.display("puzzle-bg", "none");
    Style.display("result-bg", "inline");
    var bg = Elem.get("result-bg");
    var block = Elem.get("result-block");
    block.innerHTML = "";
    var line = config.line;
    rollLadd = 1;
    var allCount = Math.pow(2, line.ladd);
    var rollCount = Math.floor(Math.random() * allCount);
    getRoll(allCount, rollCount);
    console.log(allCount + 'rollCount:' + rollCount);

    var ladd = Elem.set("div", block, "line");
    ladd.innerHTML = rollLadd + "阶红包";
    var pic = Elem.set("img", block, "img");
    pic.src = config.laddSrc + rollLadd + ".png";
    var price = Elem.set("div", block, "line");
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
    var button = Elem.set("div", inner, "button");
    Elem.color(button, "white", data.color);
    button.innerHTML = data.text;
    button.data = data;
    elems[x].button = button;
}


function setAlert() {
    hideAlert();
    Elem.get("btn-next").onclick = function() {
        setPuzzleAlert();
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
        setPuzzleAlert();
    }
    Elem.get("btn-abon").onclick = function() {
        hideAlert();
    }
    Elem.get("btn-open").onclick = function() {
        setResultAlert();
    }
}


function showAlert(data) {
    showAlertButton(data);
    Style.display("alert-bg", "block");
    Style.display("alert-box", "block");
    Style.display("detail-bg", "block");
    Style.display("puzzle-bg", "none");
    Style.display("result-bg", "none");
}


function hideAlert() {
    Style.display("alert-bg", "none");
    Style.display("alert-box", "none");
    Style.display("detail-bg", "none");
    Style.display("puzzle-bg", "none");
    Style.display("result-bg", "block");
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





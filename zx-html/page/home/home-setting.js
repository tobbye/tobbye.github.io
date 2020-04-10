function setElems() {
	setOuterTop();
	setOuterCenter(0);
}


function setOuterTop() {

}


function setOuterCenter(x) {
    var outerCenter = Elem.get("outer-center");
    outerCenter.innerHTML = "";
    var inner = Elem.creat("div", outerCenter, "inner", x);
    setInner(x);
    setContent(inner, x);
}

function setContent(inner, x) {
	var list = items[x].list;
    for (let y in list) {
        var content = Elem.creat("div", inner, "content", y);
        var data = list[y];
        setTitle(content, data);
		if (data.isDepot)
			creatDepotBody(content);
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

function creatDepotBody(content, data) {
    var num = 25*25*25*25*25;
    var idx = getDepotIdx(num, []);
    config.depotIdx = Parse.reverse(idx);
    config.depotCur = Parse.reverse(idx);
    idx = Parse.reverse(idx);
    console.log(idx);
    var flex = Elem.creat("div", content, "flex");
    var table = Elem.creat("table", content, "table");
    var button = Elem.creat("div", content, "button-depot");
    Elem.togType(button, "permit");
    for (var i=0; i<idx.length; i++) {
        var tag = Elem.creat("div", flex, "button-depot", i);
        tag.i = i;
        tag.onclick = function() {
            setDepotTag(this, table);
        }
        setDepotTag(tag, table);
    }
}

function setDepotTag(tag, table) {
    table.innerHTML = "";
    var idx = config.depotIdx[tag.i];
    var cur = config.depotCur[tag.i];
    var per = config.depotPer[tag.i];
    var row = [];
    for (var x=0;x<idx[0];x++) {
    	var col = [];
        var tr = Elem.creat("tr", table, "row-depot");
        for (var y=0;y<idx[1];y++) {
            var td = Elem.creat("td", tr, "col-depot");
            var rnd = Math.random() < 0.9 ? 0:Math.random()*100;
            col[y] = rnd == 0 ? "-" : rnd.toFixed(0) + "%";
            td.depotText = config.lvlDict[tag.i] + config.rowDict[x] + config.colDict[y];
            td.innerHTML = "<h3>" + config.lvlDict[tag.i] + "</h3>"
            td.innerHTML += "<h2>" + config.rowDict[x] + config.colDict[y] + "</h2>";
            td.innerHTML += per ? per[x][y] : col[y];
            td.cur = [x+1, y+1];
            td.tag = tag;
            td.onclick = function() {
                setDepotClick(this);
            }
            if (x == cur[0]-1 && y == cur[1]-1)
                setDepotClick(td);
        }
        row[x] = col;
    }
    config.depotPer[tag.i] = per || row;
}

function setDepotClick(td) {
    td.tag.innerHTML = td.innerHTML;
    config.depotCur[td.tag.i] = td.cur;
    config.depotArr[td.tag.i] = td.depotText;
    var oldTd = config.depotTd;
    if (oldTd) Elem.color(oldTd, getColorType(), "white");
    Elem.color(td, "white", getColorType());
    config.depotTd = td;
    var button = td.tag.parentNode.parentNode.lastChild;
    button.innerHTML = "<h3>" + config.depotArr.join("-") + "</h3>";
    console.log(button.innerHTML);
}


function getDepotIdx(num, idx) {
    if (num <= 0)
        return [1, 5];

    if (num <= 25) {
        num = Math.floor((num-1)/5) + 1;
        idx.push([num, 5]);
        return idx;
    }

    if (num > 25) {
        idx.push([5, 5]);
        num = Math.floor((num-1)/25) + 1;
        return getDepotIdx(num, idx);
    }
}
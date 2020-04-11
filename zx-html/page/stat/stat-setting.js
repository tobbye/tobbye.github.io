function setElems() {
	setOuterTop();
	setOuterCenter();
}


function setOuterTop() {
	var outerTop = Elem.get("outer-top");
	for (let x in items) {
		var btn = Elem.creat("div", outerTop, "button-top");
		btn.innerHTML = items[x].title;
		btn.idx = x;
		btn.onclick = function() {
			setOuterCenter(this.idx);
		}
	}
}

function setOuterCenter(x) {
    var outerCenter = Elem.get("outer-center");
    outerCenter.innerHTML = "";
    var inner = Elem.creat("div", outerCenter, "inner", x);
    setContent(inner, x || 0);
    setInner(x);
}

function setContent(inner, x) {
    var list = items[x].list;
    for (let y in list) {
        var content = Elem.creat("div", inner, "content", x+y);
        var data = list[y];
        setTitle(content, data, x);
        setLine(content, data, x, y);
    }
}


function setTitle(content, data, x) {
    if (data.title) {
	    var title = Elem.creat("div", content, "title");
	    title.innerHTML = data.title;
    }
    if (data.vice) {
	    var vice = Elem.creat("div", content, "vice");
	    vice.innerHTML = data.vice;
	}
}


function setLine(content, data, x, y) {
	if (!data.lines) return;
	var block = Elem.creat("div", content, "block", x);
	for (let z in data.lines) {
		var _data = data.lines[z];
		_data.seed = items[x].seed;

		//BLOCK
		var flex = Elem.creat("div", block, "flex", z);
		var date = setCell(flex, _data, "date", z, 0, 0);
		var inve = setCell(flex, _data, "inve", z, 1e3, 1e4);
		var grab = setCell(flex, _data, "grab", z, 1e3, 1e4);
		var gain = setCell(flex, _data, "gain", z, 1e1, 1e2);
	}
}

function setCell(flex, data, k, z, a, b) {
	var cell = Elem.creat("div", flex, "cell", k);
	var value = Math.floor(a + b* (Math.random() * 0.33 + 0.33) * data.seed * 5);
	Elem.flex(cell, config[k].align, config[k].flex);
	data[k] = data[k] || "￥" + Parse.sub4Num(value);
	cell.innerHTML = data[k];
	if (cell.innerHTML.replace("年", "") != cell.innerHTML)
		cell.innerHTML = "<h4>" + cell.innerHTML.replace("年", "年</h4>");
	return cell;
}








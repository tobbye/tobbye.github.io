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
			setInner(this.idx);
		}
	}
}

function setOuterCenter() {
    var outerCenter = Elem.get("outer-center");
    for (let x in items) {
        var inner = Elem.creat("div", outerCenter, "inner", x);
        setContent(inner, x);
    }
}

function setContent(inner, x) {
    var list = items[x].list;
    for (let y in list) {
        var content = Elem.creat("div", inner, "content", x+y);
        var data = list[y];
        if (data.title)
            setTitle(content, data, x);
        if (!data.lines)
            setNotLine(content, x);
        if (data.lines) {
            setLine(content, data.lines, x, y);
        }
    }
}


function setTitle(content, data, x) {
    //TITLE
    var title = Elem.creat("div", content, "title");
    title.innerHTML = data.title;
    title.x = x;
    //VICE
    var vice = Elem.creat("div", content, "vice");
    vice.innerHTML = data.vice;
    vice.x = x;
}


function setLine(content, lines, x, y) {

	var block = Elem.creat("div", content, "block", x);
	for (let z in lines) {
		var data = lines[z];
		data.seed = items[x].seed;
		// data.color = items[x].color;

		//BLOCK
		var flex = Elem.creat("div", block, "flex", z);
		var date = setCell(flex, data, "date", 0, 0);
		var inve = setCell(flex, data, "inve", 1e3, 1e4);
		var grab = setCell(flex, data, "grab", 1e3, 1e4);
		var gain = setCell(flex, data, "gain", 1e1, 1e2);
	}
}

function setCell(flex, data, k, a, b) {
	var cell = Elem.creat("div", flex, "cell", k);
	var value = Math.floor(a + b* (Math.random() * 0.33 + 0.33) * data.seed * 5);
	Elem.flex(cell, config[k].align, config[k].flex);
	if (data[k]) {
		cell.innerHTML = data[k];
	} else {
		cell.innerHTML = "￥" + Parse.sub4Num(value);
		data[k] = value;
	}
	if (cell.innerHTML.replace("年", "") != cell.innerHTML)
		cell.innerHTML = "<h4>" + cell.innerHTML.replace("年", "年</h4>");
	return cell;
}


function setButton(inner, x) {

}




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
		setLine(content, data);
		setBlock(content, data);
		setButton(content, data);
    }
}


function setTitle(content, data) {
	if (data.title) {
		var title = Elem.creat("div", content, "title");
		title.innerHTML = data.title;
	}
	if (data.vice) {
		var vice = Elem.creat("div", content, "vice");
		var va = values[data.vice.split('/')[0].split('.')[0]];
		var vb = values[data.vice.split('/')[1].split('.')[0]];
		var vc = Math.abs(va / vb).toFixed(4);
		vice.innerHTML = data.vice + vc;
		// console.log(data.vice + vc);
	}
}


//设置Line视图
function setLine(content, data) {
	var trs = data.lines;
	var table = Elem.creat("table", content, "table-line");
	Elem.height(table, config.theHeight);
	Elem.display(table, "none");
	for (let y in trs) {
		var tr = Elem.creat("tr", table, "tr", y);
		var tds = trs[y];
		for (let z in tds) {
			var td = Elem.creat("td", tr);
			var col = tds[z].col;
			if (!col) {
				Elem.color(td, "#222", "#eee");
				continue;
			}
			td.colSpan = col;
			var key = tds[z].text.split('.')[0];
			var size = col > 1 ? "<h3>" : "<h4>";
			tds[z].value = values[key];
			text = tds[z].text + "<br/>" + size + formatKey(key);
			td.innerHTML = text;

			var border = config.border[tds[z].border];
			for(let i in border) {
				var radius = "border" + border[i] + "Radius";
				td.style[radius] = config.radius;
			}
		}
	}
}


//设置Block视图
function setBlock(content, data) {
	var trs = data.blocks;
	var table = Elem.creat("table", content, "table-block");
	Elem.height(table, config.theHeight);
	for (let y in trs) {
		var tr = Elem.creat("tr", table, "tr", y);
		var tds = trs[y];
		for (let z in tds) {
			var td = Elem.creat("td", tr);
			var row = tds[z].row;
			if (!row) {
				Elem.color(td, "#222", "#eee");
				continue;
			}
			td.rowSpan = row;
			var text = tds[z].text;
			var key = text.split('.')[0];
			tds[z].value = values[key];
			text = "<h3>" + text.replace('.', "</h3>");
			text += "<br/>" + formatKey(key);
			td.innerHTML = text;
		}
	}
}


//切换视图 Line和Block
function togItem(item) {
	var color, view;
	var data = item.data;
	if (data.idx % 100 == 4) {
		Storage.set("recd-innerIdx", values.innerIdx);
		window.location.href = "../recd/recd.html";
		return;
	}
	if (data.idx % 100 == 3) {
		color = ["red", "green"];
		view = ["none", "table"];
	}
	if (data.idx % 100 == 5) {
		color = ["green", "red"];
		view = ["table", "none"];
	}
	var lines = Elem.getClass("table-line");
	var blocks = Elem.getClass("table-block");
	var buttons = Elem.getClass("button-min");
	for (let x in lines)
		Elem.display(lines[x], view[0]);
	for (let y in blocks)
		Elem.display(blocks[y], view[1]);
	for (let z in buttons) {
		if (buttons[z].innerHTML == "方格视图")
			Elem.color(buttons[z], "", color[0]);
		if (buttons[z].innerHTML == "列表视图")
			Elem.color(buttons[z], "", color[1]);
	}

}


function setButton(content, data) {
	var list = data.buttons;
	var block = Elem.creat("div", content, "block");
	for (let y in list) {
		var flex = Elem.creat("div", block, "flex");
		for(let z in list[y]) {
			var data = list[y][z];
			var button = Elem.creat("div", flex, "button", data.idx);
			button.data = data;
			button.innerHTML = data.text;
			if (!data.limit)
				button.className = "button-min"; 
			Elem.color(button, "", data.bgcolor);
			button.onclick = function() {
				if (!this.data.limit) {
					togItem(this);
					return;
				}
				showAlert();
				var data = this.data;
				var title = Elem.get("alert-title");
				var limit = Elem.get("alert-limit");
				var input = Elem.get("alert-input");
				Style.color("alert-box", "", getColorLight());
				Style.color("alert-input", getColorType(), "#eee");
				input.focus();
				input.min = 0;
				input.max = values[data.limit];
				input.dataready = data;
				title.innerHTML = data.title;
				limit.innerHTML = "(范围：0-" + input.max + ")";
			}
		}
	}
}

//设置弹窗
function setAlert() {
	for (let i in config.button) {
		var data = config.button[i];
		var button = Elem.get("button-" + data[0]);
	}

	hideAlert();
	tapAlertBox("alert-bg");
	tapAlertBox("button-cancel");
	tapAlertBox("button-confirm");

}


//点击弹窗Box
function tapAlertBox(id) {
	Elem.get(id).onclick = function() {
		hideAlert();
		var input = Elem.get("alert-input");
		if (input.value == 0) 
			return;
		if (id == "button-confirm") {
			input.data = input.dataready;
			if (input.data.idx == 301 && values.M == values.N) {
				values.M = 0;
				values.N = 0;
			}
			savejson(input);
			refresh();
		} else {
			input.value = 0;
		}
	};
}

function savejson(input) {
	var date = new Date();
	var json = {
		date: Parse.getDate(date),
		time: Parse.getTime(date),
		type: input.data.idx,
		value: input.value
	}
	Storage.add("recd-json", json);
}


//刷新页面
function refresh() {
	var input = Elem.get("alert-input");
	var limit = Elem.get("alert-limit");
	var list = input.data.tran.split('|');

	for (let i in list) {
		var line = list[i].split('*');
		var val = parseInt(input.value) * parseFloat(line[1]);
		if (line[2])
			val *= values[line[2]];
		values[line[0]] += val;
		values[line[0]] = Math.round(values[line[0]]);
	}
	// values.R = Math.floor(values.Q / 100);
	localData.save();
}


//输入事件
function onInput() {
	var input = Elem.get("alert-input");
	input.value = Math.max(input.min, input.value);
	input.value = Math.min(input.max, input.value);
}


function getLineText(data, i) {
	return data.text.split('/')[i];
}

function getLineValue(data, i, values) {
	var text = getLineText(data, i);
	var key = text.split('.')[0];
	var value = formatKey(key);
	return value;
}


function formatKey(key) {
	return "￥" + Parse.addSplit(Math.abs(values[key]));
}

function setElems() {
	setOuterTop();
	setOuterCenter();
	setAlert();
}


function setOuterTop() {
	var outerCenter = Elem.get("outer-center");
	var outerTop = Elem.get("outer-top");
	for (let x in items) {
		var btn = Elem.set("div", outerTop, "button-top");
		btn.innerHTML = items[x].title.replace('我的', '');
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
		var title = Elem.set("div", inner, "content", "title");
		var line = Elem.set("div", inner, "content", "line");
		var block = Elem.set("div", inner, "content", "block");
		var button = Elem.set("div", inner, "content", "button");
		var color = items[x].color;
		elems[x].inner = inner;
		setTitle(title, x);
		setLine(line, x);
		setBlock(block, x);
		setButton(button, x);
		Elem.display(line, "none");
		Elem.height(line, config.theHeight);
		Elem.height(block, config.theHeight);
	}
}

//切换视图 Line和Block
function togItem(item) {
	var key, view;
	var data = item.data;
	if (data.idx % 100 == 4) {
		Storage.set("recd-innerIdx", values.innerIdx);
		window.location.href = "../recd/recd.html";
		return;
	}
	if (data.idx % 100 == 3) {
		key = ["firstChild", "lastChild"];
		view = ["none", "block"];
	}

	if (data.idx % 100 == 5) {
		key = ["lastChild", "firstChild"];
		view = ["block", "none"]; 
	}
	var inners = Elem.getClass("inner");
	for (let i in inners) {
		var childs = inners[i].childNodes;
		if (!childs) continue;
		Elem.display(childs[1], view[0]);
		Elem.display(childs[2], view[1]);
		var parent = childs[3].lastChild.lastChild;
		Elem.color(parent[key[0]], "white", "red");   
		Elem.color(parent[key[1]], "white", "green"); 
	}
}

function setTitle(content, x) {
	var data = items[x];

	//TITLE
	var title = Elem.set("div", content, "title");
	title.innerHTML = data.title;
	elems[x].title = title;
	//VICE
	var vice = Elem.set("div", content, "vice");
	var va = values[data.vice.split('/')[0].split('.')[0]];
	var vb = values[data.vice.split('/')[1].split('.')[0]];
	var vc = Math.abs(va / vb).toFixed(4);
	vice.innerHTML = data.vice + vc;
	// console.log(data.vice + vc);
}


//设置Line视图
function setLine(content, x) {
	var trs = items[x].lines;
	var table = Elem.set("table", content, "table", x);
	Elem.height(table, config.theHeight - 30);
	for (let y in trs) {
		var tr = Elem.set("tr", table, "tr", y);
		var tds = trs[y];
		for (let z in tds) {
			var td = Elem.set("td", tr);
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
function setBlock(content, x) {
	var table = Elem.set("table", content, "table", x);
	Elem.height(table, config.theHeight - 30);
	var trs = items[x].blocks;
	for (let y in trs) {
		var tr = Elem.set("tr", table, "tr", y);
		var tds = trs[y];
		for (let z in tds) {
			var td = Elem.set("td", tr);
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


function setButton(content, x, y) {
	var block = Elem.set("div", content, "block", x);
	var list = items[x].buttons;
	for (let y in list) {
		var flex = Elem.set("div", block, "flex");
		for(let z in list[y]) {
			var data = list[y][z];
			var button = Elem.set("div", flex, "button", data.idx);
			button.data = data;
			button.innerHTML = data.text;
			if (!data.limit)
				button.className = "button-min"; 
			Elem.color(button, "white", data.bgcolor);
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
				Style.color("alert-input", data.bgcolor, "#eee");
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
		if (id == "button-confirm") {
			input.data = input.dataready;
			if (input.data.idx == 301 && values.M == values.N) {
				values.M = 0;
				values.N = 0;
			}
		refresh();
	} else {
		input.value = 0;
	}
};
}

//输入事件
function onInput() {
	var input = Elem.get("alert-input");
	input.value = Math.max(input.min, input.value);
	input.value = Math.min(input.max, input.value);
}


//显示弹窗
function showAlert() {
	Style.display("alert-bg", "inline");
	Style.display("alert-box", "inline");
}

//隐藏弹窗
function hideAlert() {
	Style.display("alert-bg", "none");
	Style.display("alert-box", "none");
}


//刷新页面
function refresh() {
	var input = Elem.get("alert-input");
	var limit = Elem.get("alert-limit");
	var list = input.data.tran.split('|');


	for (let i in list) {
		var line = list[i].split('*');
		for (let j in line) {
			var val = parseInt(input.value) * parseFloat(line[1]);
			if (line[2])
				val *= values[line[2]];
		}
		values[line[0]] += val;
		values[line[0]] = Math.round(values[line[0]]);
	}
	// values.R = Math.floor(values.Q / 100);
	localData.save();
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

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
		btn.onclick = function() {
			setOuterCenter(this.idx);
		}
	}
}

function setOuterCenter(x) {
    x = x || 0;
    var outerCenter = Elem.get("outer-center");
    outerCenter.innerHTML = "";
    var inner = Elem.creat("div", outerCenter, "inner", x);
    setInner(x);
    setContent(inner, x);
}


function setContent(inner, x) {
	var list = items[x].list;
	for (let y in list) {
		var content = Elem.creat("div", inner, "content", x+y);
		var data = list[y];
		setTitle(content, data);
		setNotLine(content, data);
		setLine(content, data, x, y);
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
}


function setLine(content, data, x, y) {
	data.lines = initTempLine(data, x, y);
	var block = Elem.creat("div", content, "block");
	for (let z in data.lines) {
		var line = data.lines[z];
		var body = Elem.creat("div", block, "user-block");

		body.flex = setLineFlex(body, line, x);
		body.data = data;
		body.line = line;
		body.x = x;
		body.onclick = function() {
			config.line = this.line;
			config.lines = this.data.lines;
			console.log(this.line);
			setDetailAlert(this);
		}
	}
}

function setLineFlex(body, line, x) {
	var top = Elem.creat("div", body, "user-top");
	var order = Elem.creat("div", top, "user-order");
	var value = Elem.creat("div", top, "user-value");

	var flex = Elem.creat("div", body, "user-flex");
	var head = Elem.creat("img", flex, "user-head");
	var left = Elem.creat("div", flex, "user-left");
	var right = Elem.creat("div", flex, "user-right");
	var name = Elem.creat("div", left, "user-name");
	var marks = Elem.creat("div", left, "user-flex");
	var ladd = Elem.creat("div", right, "user-ladd");
	var group = Elem.creat("div", right, "user-group");
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
	order.innerHTML = line.order;
	value.innerHTML = line.value;
	name.innerHTML = line.name;
	ladd.innerHTML = line.ladd + "阶";
	group.innerHTML = line.group;
	return flex;
}


function setDetailAlert(elem) {
	var box = Elem.get("alert-box");
	var block = Elem.get("detail-block");
	Elem.color(box, "", getColorLight(x));
	block.innerHTML = "";

	var x = elem.x;
	var line = elem.line;
	var data = elem.data;
	var body = Elem.creat("div", block, "user-body");
	var flex = setLineFlex(body, line, x);
	var tags = Elem.creat("div", body, "user-tags");
	var desc = Elem.creat("div", body, "user-desc");
	if (line.tag) {
		for (let i in line.tag) {
			var tag = Elem.creat("div",tags, "user-tag");
			tag.innerHTML = line.tag[i];
			tag.onclick = function() {
				setSearchAlert(this);
			}
		}
	}

	desc.innerHTML = line.desc.replace(/\n/g, "<br/>");;
	
	var button = Elem.get("detail-button");
	button.innerHTML = "";
	for (let k in data.buttonIdx) {
		var _idx = data.buttonIdx[k];
		var _data = config.buttons[_idx];
		//BUTTON
		var btn = Elem.creat("div", button, "button");
		btn.setAttribute("btype", _data.btype);
		btn.innerHTML = _data.text;
		btn.data = _data;
		btn.elem = elem;
		btn.onclick = function () {
			setNexu(this);
		}
	}
	showAlert("detail-bg");
}


function initTempLine(data, x, y) {
	var lines = [];
	var temps = Parse.mix(industry.split(','));
	for (let z in temps) {
		if (z >= config.rankCount) break;
		var unit = tempData.unitData;
		var line = {
			uid: unit.uid,
			tag: unit.tag,
			mark: unit.mark,
			desc: unit.desc,
			name: temps[z].replace("\n", ""),
			group: data.group,
		};

		line.order = parseInt(z) + 1 + "th";
		if (line.order.length == 3)
			line.order = line.order.replace("1th", "1st").replace("2th", "2nd").replace("3th", "3rd");
		// setNotFlex()
		var seed = items[x].seed * data.seed;
		var rand = Math.floor((Math.random()+40-z) * 2 * seed);
		line.value = data.text + ": ￥" + Parse.sub4Num(rand);
		line.ladd = Math.floor(Math.random() * 20) + 3;
		line.desc = "<h3>" + line.name + "的描述</h3>";
		line.desc += "THE DESCRIBE OF " + line.name + "<br/>";
		line.desc += "THE DESCRIBE OF " + line.name + "<br/>";
		line.desc += "THE DESCRIBE OF " + line.name + "<br/>";
		lines.push(line);
	}
	return lines;
}

function setNexu(btn) {
	var data = btn.data;
	if (data.idx == 0)
		setChatAlert();
	if (data.idx == 2) {
		hideAlert();
		Elem.remove(btn.elem);
		Parse.remove(config.lines, config.line);
	}
}

function setAlert() {
	
}




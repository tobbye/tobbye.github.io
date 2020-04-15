function setElems() {
	setOuterTop();
	setOuterCenter();
	setInner();
	setAlert();
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
		var content = Elem.creat("div", inner, "content", y);
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


function setLine(content, data, x, y) {
	if (!data.lines) 
		return;
	var lines = data.lines;
	var block = Elem.creat("div", content, "block");
	for (let z in lines) {
		var line = lines[z];
		var body = Elem.creat("div", block, "user-block");
		var flex = setLineFlex(body, line, x);
		flex.data = data;
		flex.line = line;
		flex.x = x;
		flex.onclick = function() {
			elems.line = this.line;
			elems.lines = this.data.lines;
			console.log(this.line);
			setDetailAlert(this);
		}
	}
}

function setLineFlex(body, line, x) {
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
	line.group = line.uid[0].replace("s","赞助商").replace("d","淘金者");

	name.innerHTML = line.name;
	ladd.innerHTML = line.ladd + "阶";
	group.innerHTML = line.group;
	return flex;
}


function setDetailAlert(flex) {
	var box = Elem.get("alert-box");
	var block = Elem.get("detail-block");
	Elem.color(box, "", getColorLight(x));
	block.innerHTML = "";

	var x = flex.x;
	var data = flex.data;
	var line = elems.line;
	var body = Elem.creat("div", block, "user-body");
	var head = setLineFlex(body, line, x);
	var tags = Elem.creat("div", body, "user-tags");
	var desc = Elem.creat("div", body, "user-desc");

	if (line.tag) {
		for (let i in line.tag) {
			var tag = Elem.creat("div",tags, "user-tag");
			tag.innerHTML = line.tag[i];
			tag.onclick  = function() {
				setSearchAlert(this);
			}
		}
	}
	line.desc = "<h3>" + line.name + "的描述</h3>";
	line.desc += "THE DESCRIBE OF " + line.name + "<br/>";
	line.desc += "THE DESCRIBE OF " + line.name + "<br/>";
	line.desc += "THE DESCRIBE OF " + line.name + "<br/>";
	desc.innerHTML = line.desc;
	
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
		btn.flex = flex;
		btn.onclick = function () {
			setNexu(this);
		}
	}
	showAlert("detail-bg");
}


function setNexu(btn) {
	var data = btn.data;
	if (data.idx == 0)
		setChatAlert();
	if (data.idx == 2) {
		hideAlert();
		Elem.remove(btn.flex);
		Parse.remove(elems.lines, elems.line);
	}
}

function setAlert() {

}




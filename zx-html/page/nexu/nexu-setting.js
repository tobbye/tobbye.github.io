
function setElems() {
	setOuterTop();
	setOuterCenter();
}


function setOuterTop() {
	var outerTop = Elem.get("outer-top");
	for (let x in items) {
		var btn = Elem.set("text", outerTop, "button-top");
		btn.innerHTML = items[x].title;
		btn.idx = x;
		elems[x].btntop = btn;
		if (config.isMobile)
			btn.style.minWidth = config.minWidth;
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
		if (data.lines.length > 0) {
			setLine(content, data.lines, x, y);
		} else {
			setNotLine(content, x);
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
    Elem.color(block, "#666", "#eee");
}


function setLine(content, lines, x, y) {

	var list = Elem.set("div", content, "block");
	for (let z in lines) {
		var data = lines[z];
		var line = Elem.set("div", list, "user-line", z);
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

		line.x = x;
		line.y = y;
		line.z = z;
		line.show = false;
		line.data = data;
		line.onclick = function() {
			if (values.line == this) 
				values.line = null;
			else
				console.log(this.data);
			showLine(values.line, false);
			showLine(this, !this.show);
			values.line = this;
		}
		setFlex(line);
	}
}

function showLine(line, display) {
	if (line) {
		line.show = display;
		if (display) {
			line.style.margin = "20px 0px";
			Elem.display(line.tag, "flex");
			Elem.display(line.desc, "block");
			Elem.display(line.button, "flex");
		} else {
			line.style.margin = "5px 0px";
			Elem.display(line.tag, "none");
			Elem.display(line.desc, "none");
			Elem.display(line.button, "none");
		}
	}
}

function setFlex(line) {
	var x = line.x;
	var y = line.y;
	var z = line.z;
	var list = items[x].list[y];
	data = line.data;
	data.button = items[x].button;
	if (data.tag) {
		for (let i in data.tag) {
			var tag = Elem.set("div", line.tag, "user-tag");
			tag.innerHTML = data.tag[i];
		}
	}
	if (data.mark) {
		for (let i in data.mark) {
			var mark = Elem.set("div", line.mark, "user-mark");
			mark.innerHTML = data.mark[i];
			mark.style.borderColor = getColorType(x);
		}
	}
	// line.head.src = "../../picture/user_head_1.png";
	Elem.color(line.head, "", getColorLight(x));
	Elem.color(line.nexu, "white", getColorType(x));
	Elem.style(line.nexu, "borderColor", getColorType(x));
	if (data.uid.replace('s', '') != data.uid) 
		data.nexu = "赞助商";
	else if (data.uid.replace('d', '') != data.uid) 
		data.nexu = "淘金者";
	else 
		data.nexu = "未知用户";

	line.name.innerHTML = data.name;
	line.ladd.innerHTML = data.ladd + "阶";
	line.nexu.innerHTML = data.nexu;
	line.desc.innerHTML = data.name + "的描述<br/>THE DESCRIBE OF " + data.name;
	line.desc.innerHTML += "<br/>" + data.name + "的描述<br/>THE DESCRIBE OF " + data.name;
	line.desc.innerHTML += "<br/>" + data.name + "的描述<br/>THE DESCRIBE OF " + data.name;
	if (data.uid == "100001")
		line.desc.innerHTML = config.desc;

	
	for (let k in data.button) {
		var key = data.button[k];
		var value = config.button[key];
		//BUTTON
		var button = Elem.set("div", line.button, "button");
		Elem.color(button, "white", value.color);
		button.innerHTML = value.nexu;
		button.data = value;
		button.onclick = function () {
			setNexu(this);
		}
	}	
}

function setNexu(button) {
	var btnData = button.data;
	var line = values.line;
	var idx = line.idx;
	var org = line.x;
	if (btnData.org.length == 0)
		alert(JSON.stringify(line));

	for(let i in btnData.org) {
		if (org == btnData.org[i]) {
			var tgt = btnData.tgt[i];
			line.org = tgt;
			items[tgt].lines.push(line.data);
			//items[org].lines.splice(idx, 1);
			line.idx = items[tgt].lines.length - 1;
			var inner = Elem.getClass("inner")[tgt];
			var block = inner.childNodes[1];
			block.appendChild(line.block);
			Elem.remove(line.float);
			setFlex(line);
			line.nexu.innerHTML = btnData.act + btnData.nexu;
			return;
		}
	}
}

function setButton(data) {

}


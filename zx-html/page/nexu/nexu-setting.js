
function setElems() {
	setOuterTop();
	setOuterCenter();
	setAlert();
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
		setTitle(content, data);
		setNotLine(content, data);
		setLine(content, data, x, y);
	}
}

function setTitle(content, data) {
	if (data.title) {
		var title = Elem.set("div", content, "title");
		title.innerHTML = data.title;
	}
	if (data.vice) {
		var vice = Elem.set("div", content, "vice");
		vice.innerHTML = data.vice;
	}
}


function setNotLine(content, data) {
	if (data.lines) 
		return;
    var block = Elem.set("div", content, "block");
    block.style.fontSize = "5em";
    block.style.padding = "4em";
    block.innerHTML = "此处为空";
}


function setLine(content, data, x, y) {
	if (!data.lines) 
		return;
	var lines = data.lines;
	var list = Elem.set("div", content, "block");
	for (let z in lines) {
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
		line.data = lines[z];
		line.onclick = function() {
			if (config.line == this) 
				config.line = null;
			else
				console.log(this.data);
			showLine(config.line, false);
			showLine(this, !this.show);
			config.line = this;
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
	var data = line.data;
	data.button = items[x].list[y].button;
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
	var line = config.line;
	var idx = line.idx;
	var org = line.x;
	if (btnData.idx == 1)
		showChat();

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
			return;
		}
	}
}

function setAlert() {
	setChat();
	hideAlert();
}




function setChat() {

	var block = Elem.get("chat-block");
	for (let i in config.chat) {
		var data = config.chat[i];
		var cls = data.isMine ? "right" : "left";
		setChatText(block, cls, data.text);
	}
	var send = Elem.get("btn-send");
	send.block = block;
	send.onclick = function() {
		var input = Elem.get("alert-textarea");
		setChatText(this.block, "right", input.value);
		input.style.color = getColorLight();
		input.value = "输入内容";
	}
}


function setChatText(block, cls, value) {
	if (value == "" || value == "输入内容") {
		Style.display("alert", "none");
		return;
	}
	var flex = Elem.set("div", block, "chat-" + cls);
	var text = Elem.set("div", flex, "text-" + cls);
	text.innerHTML = value.replace(/\n/g, "<br/>");
	text.scrollIntoView();
}



function showChat() {
	Style.display("alert", "block");
    Style.display("chat-bg", "block");
	var box = Elem.get("alert-box");
	var block = Elem.get("chat-block");
	var title = Elem.get("chat-title");
	var input = Elem.get("alert-textarea");
	box.style.backgroundColor = getColorLight();
	box.style.maxHeight = (config.windHeight - 440) + "px";
	block.style.maxHeight = (config.windHeight - 703) + "px";
	block.lastChild.scrollIntoView();
	input.style.color = getColorLight();
	title.innerHTML = config.line.data.name;
}


function onFocus() {
	var box = Elem.get("alert-box");
	var block = Elem.get("detail-block");
	box.style.maxHeight = (config.windHeight - 940) + "px";
	block.style.maxHeight = (config.windHeight - 1203) + "px";
	block.lastChild.scrollIntoView();
	var input = Elem.get("alert-textarea");
	input.style.color = getColorType();
	input.value = "";

	// Style.height("detail-block", "550px");
}


//隐藏弹窗
function hideAlert() {
    Style.display("alert", "none");
    Style.display("chat-bg", "none");
    Style.display("detail-bg", "none");
    Style.display("puzzle-bg", "none");
    Style.display("result-bg", "none");
}

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
			setInner(this.idx);
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
	var block = Elem.set("div", content, "block");
	for (let z in lines) {
		var line = lines[z];
		var body = Elem.set("div", block, "user-block");
		var flex = setLineFlex(body, line, x);
		flex.data = data;
		flex.line = line;
		flex.x = x;
		flex.onclick = function() {
			config.line = this.line;
			console.log(this);
			setDetailAlert(this);
		}
	}
}

function setLineFlex(body, line, x) {
	var flex = Elem.set("div", body, "user-flex");
	var head = Elem.set("img", flex, "user-head");
	var left = Elem.set("div", flex, "user-left");
	var right = Elem.set("div", flex, "user-right");
	var name = Elem.set("div", left, "user-name");
	var marks = Elem.set("div", left, "user-flex");
	var ladd = Elem.set("div", right, "user-ladd");
	var group = Elem.set("div", right, "user-group");
	if (line.mark) {
		for (let i in line.mark) {
			var mark = Elem.set("div", marks, "user-mark");
			mark.innerHTML = line.mark[i];
			mark.style.borderColor = getColorType(x);
		}
	}
	Elem.color(head, "", getColorLight(x));
	Elem.color(group, "white", getColorType(x));
	Elem.style(group, "borderColor", getColorType(x));
	if (line.uid.replace('s', '') != line.uid) 
		line.group = "赞助商";
	else if (line.uid.replace('d', '') != line.uid) 
		line.group = "淘金者";
	else 
		line.group = "未知用户";

	name.innerHTML = line.name;
	ladd.innerHTML = line.ladd + "阶";
	group.innerHTML = line.group;
	return flex;
}


function setDetailAlert(flex) {
	Style.display("alert", "block");
	Style.display("detail-bg", "block");
	var block = Elem.get("detail-block");
	block.innerHTML = "";
	var x = flex.x;
	var data = flex.data;
	var line = flex.line;
	var body = Elem.set("div", block, "user-body");
	var top = setLineFlex(body, line, x);
	var tags = Elem.set("div", body, "user-tags");
	var desc = Elem.set("div", body, "user-desc");

	if (line.tag) {
		for (let i in line.tag) {
			var tag = Elem.set("div",tags, "user-tag");
			tag.innerHTML = line.tag[i];
		}
	}

	desc.innerHTML = line.name + "的描述<br/>THE DESCRIBE OF " + line.name;
	desc.innerHTML += "<br/>" + line.name + "的描述<br/>THE DESCRIBE OF " + line.name;
	desc.innerHTML += "<br/>" + line.name + "的描述<br/>THE DESCRIBE OF " + line.name;

	
	var button = Elem.get("detail-button");
	button.innerHTML = "";
	for (let k in data.buttonIdx) {
		var _idx = data.buttonIdx[k];
		var _data = config.buttons[_idx];
		//BUTTON
		var btn = Elem.set("div", button, "button");
		Elem.color(btn, "white", _data.bgcolor);
		btn.innerHTML = _data.text;
		btn.data = _data;
		btn.onclick = function () {
			setNexu(this);
		}
	}
	Style.color("alert-box", "", getColorLight(x));
}


function setNexu(btn) {
	var data = btn.data;
	if (data.idx == 0)
		showChat();

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
    	Style.display("chat-bg", "none");
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
    Style.display("detail-bg", "none");
	var box = Elem.get("alert-box");
	var block = Elem.get("chat-block");
	var title = Elem.get("chat-title");
	var input = Elem.get("alert-textarea");
	box.style.backgroundColor = getColorLight();
	box.style.maxHeight = (config.windHeight - 440) + "px";
	block.style.maxHeight = (config.windHeight - 703) + "px";
	block.lastChild.scrollIntoView();
	input.style.color = getColorLight();
	title.innerHTML = config.line.name;
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

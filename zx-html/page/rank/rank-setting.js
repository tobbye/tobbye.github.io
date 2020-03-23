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

		body.flex = creatLineFlex(body, line, x);
		body.line = line;
		body.data = data;
		body.x = x;
		body.onclick = function() {
			config.line = this.line;
			console.log(this.line);
			alertDetail(this);
		}
	}
}

function creatLineFlex(body, line, x) {
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


function alertDetail(body) {
	Style.display("alert", "block");
	Style.display("detail-bg", "block");
	var block = Elem.get("detail-block");
	block.innerHTML = "";
	var x = body.x;
	var line = body.line;
	var data = body.data;
	var body = Elem.creat("div", block, "user-body");
	var flex = creatLineFlex(body, line, x);
	var tags = Elem.creat("div", body, "user-tags");
	var desc = Elem.creat("div", body, "user-desc");

	if (line.tag) {
		for (let i in line.tag) {
			var tag = Elem.creat("div",tags, "user-tag");
			tag.innerHTML = line.tag[i];
			tag.onclick = function() {
				setTagSearch(this);
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
		btn.onclick = function () {
			setNexu(this);
		}
	}
	Style.color("alert-box", "", getColorLight(x));
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
			name: temps[z],
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
		//line.desc = line.name + "的描述";
		lines.push(line);
	}
	return lines;
}

function setNexu(btn) {
	var data = btn.data;
	if (data.idx == 0)
		showChat();

}

function setAlert() {
	setChat();
	hideAlert();
	Elem.get("btn-close").onclick = function() {
		hideAlert();
	}
}



function setTagSearch(button) {
	hideAlert();
	var box = Elem.get("alert-box");
    var title = Elem.get("search-title");
    var block = Elem.get("search-block");
    block.innerHTML = "";
    block.style.maxHeight = config.alertHeight + "px";
    Elem.color(box, "", getColorLight());
    title.innerHTML = "标签搜索:" + button.innerHTML;
	for (let z in tempData.searchData) {
		var line = Elem.creat("div", block, "user-line", z);
		line.top = Elem.creat("div", line, "user-top");
		line.order = Elem.creat("div", line.top, "user-order");
		line.value = Elem.creat("div", line.top, "user-value");
		line.flex = Elem.creat("div", line, "user-flex");
		line.head = Elem.creat("img", line.flex, "user-head");
		line.left = Elem.creat("div", line.flex, "user-left");
		line.name = Elem.creat("div", line.left, "user-name");
		line.mark = Elem.creat("div", line.left, "user-flex");
		line.right = Elem.creat("div", line.flex, "user-right");
		line.ladd = Elem.creat("div", line.right, "user-ladd");
		line.group = Elem.creat("div", line.right, "user-group");
		var data = tempData.searchData[z];
		setFlex(data, line);
	}
    showAlert("search-bg");
}

function setFlex(data, line) {
	var order = data.order + "th";
	if (order.length == 3)
		data.order = order.replace("1th", "1st").replace("2th", "2nd").replace("3th", "3rd");
	if (data.mark) {
		for (let i in data.mark) {
			var mark = Elem.creat("div", line.mark, "user-mark");
			mark.innerHTML = data.mark[i];
			mark.style.borderColor = getColorType();
		}
	}
	data.group = data.uid[0].replace("s","赞助商").replace("d","淘金者");
	
	Elem.color(line.group, "white", getColorType());
	Elem.style(line.group, "borderColor", getColorType());
	line.head.style.backgroundColor = getColorLight();
	// line.head.src = "../../picture/head1.jpg";
	line.order.innerHTML = data.order;
	line.value.innerHTML = "权值: " + Parse.sub4Num(data.value);
	line.name.innerHTML = data.name;
	line.group.innerHTML = data.group;
	line.ladd.innerHTML = data.ladd + "阶";
}

function setChat() {

	var block = Elem.get("chat-block");
	for (let i in tempData.chatData) {
		var data = tempData.chatData[i];
		var cls = data.isMine ? "right" : "left";
		creatChatText(block, cls, data.text);
	}
	var send = Elem.get("btn-send");
	send.block = block;
	send.onclick = function() {
		var input = Elem.get("chat-textarea");
		creatChatText(this.block, "right", input.value);
		input.style.color = getColorLight();
		input.value = "输入内容";
	}
}


function creatChatText(block, cls, value) {
	if (value == "" || value == "输入内容") {
		Style.display("alert", "none");
    	Style.display("chat-bg", "none");
		return;
	}
	var flex = Elem.creat("div", block, "chat-" + cls);
	var text = Elem.creat("div", flex, "text-" + cls);
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
	var input = Elem.get("chat-textarea");
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
	var input = Elem.get("chat-textarea");
	input.style.color = getColorType();
	input.value = "";

	// Style.height("detail-block", "550px");
}

function setElems() {
	setOuterTop();
	setOuterCenter();
}


function setOuterTop() {
	return;
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
		if (data.title)
			setTitle(content, data, x);
		if (data.lines.length == 0)
			return;
		setLine(content, data, x, y);
		if (y == 0) {
			setStyle(content, data.lines, x, y);
		}
		if (y == 1) {
			var box = Elem.creat("div", content, "text");
			box.id = "data-box";
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



function setLine(content, data, x, y) {

	var flex = Elem.creat("div", content, "alert-flex");
	for (let z in data.lines) {
		var btn = Elem.creat("div", flex, "button-top");
		btn.innerHTML = data.lines[z];
		btn.y = y;
		btn.z = z;
		btn.data = data;
		Elem.color(btn, "dodgerblue", "#fff");
		btn.onclick = function() {
			var btnText = this.innerHTML.toLowerCase();
    		var setting = Storage.get("setting") || new Object();
			setting[this.data.key] = btnText;
			Storage.set("setting", setting);
			var nodes = this.parentNode.childNodes;
			for (let idx in nodes) {
				if (this.innerHTML == nodes[idx].innerHTML)  {
		            Elem.color(nodes[idx], "white", "dodgerblue");
		        } else {
		            Elem.color(nodes[idx], "dodgerblue", "#fff");
		        }				
			}
			btnText = btnText.replace("default", "values");
			var value = Storage.get(btnText);
			if (this.y == 2)
				value = localData.init(btnText);
			if (Elem.get('data-box'))
				Elem.get('data-box').innerHTML = JSON.stringify(value);
		}
		if (data.default == z) 
			btn.onclick();
	}
}

function setStyle(content, lines, x, y) {
	var line;
	for (let x in colors) {
		for (let z in lines) {
			if (x == 0) continue;
			if (z == 0)
				line = Elem.creat("div", content, "flex");
			var cell = Elem.creat("div", line, "cell");
			var key = lines[z].toLowerCase();
			cell.innerHTML = colors[x][key];
			Elem.color(cell, "white", cell.innerHTML);
		}
	}
}


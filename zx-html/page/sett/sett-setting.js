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
		var inner = Elem.set("div", outerCenter, "inner", x);
		setContent(inner, x);
	}
}

function setContent(inner, x) {
	var list = items[x].list;
	for (let y in list) {
		var content = Elem.set("div", inner, "content", y);
		var data = list[y];
		if (data.title)
			setTitle(content, data, x);
		if (data.lines.length == 0)
			return;
		setLine(content, data, x, y);
		if (y == 0) {
			setStyle(content, data.lines, x, y);
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



function setLine(content, data, x, y) {

	var flex = Elem.set("div", content, "alert-flex");
	for (let z in data.lines) {
		var btn = Elem.set("div", flex, "button-top");
		btn.innerHTML = data.lines[z];
		btn.onclick = function() {
			var value = this.innerHTML.toLowerCase();
			Storage.set(data.key, value);
			var nodes = this.parentNode.childNodes;
			for (let idx in nodes) {
				if (this.innerHTML == nodes[idx].innerHTML)  {
		            Elem.color(nodes[idx], "white", "dodgerblue");
		        } else {
		            Elem.color(nodes[idx], "dodgerblue", "#eee");
		        }				
			}
			if (y == 2)
				localData.init(value);
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
				line = Elem.set("div", content, "flex");
			var cell = Elem.set("div", line, "cell");
			cell.innerHTML = colors[x][lines[z]];
			Elem.color(cell, "white", cell.innerHTML);
		}
	}
}


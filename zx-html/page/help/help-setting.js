function setElems() {
	getAgent();
	setOuterTop();
	setOuterCenter();
	setAgent();
	// setInner();
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
		var content = Elem.set("div", inner, "content", x+y);
		var data = list[y];
		if (data.title)
			setTitle(content, data, x);
		if (data.lines.length == 0)
			return;
		setLine(content, data, x, y);
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

	var flex = Elem.set("div", content, "block");
	for (let z in data.lines) {
		var btn = Elem.set("div", flex, "button-top");
		btn.innerHTML = data.lines[z];
		btn.onclick = function() {
			var key = data.title.toLowerCase() + "-type";
			Storage.set(key, this.innerHTML.toLowerCase());
			var nodes = this.parentNode.childNodes;
			for (let idx in nodes) {
				if (this.innerHTML == nodes[idx].innerHTML)  {
		            Elem.color(nodes[idx], "white", "dodgerblue");
		        } else {
		            Elem.color(nodes[idx], "dodgerblue", "#eee");
		        }				
			}
		}
		if (z == 0) btn.onclick();
	}
}
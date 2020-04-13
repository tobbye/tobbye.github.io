function setElems() {
	setOuterTop();
	setOuterCenter();
	setInner();
}


function setOuterTop() {
	
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
		setTitle(content, data, x);
		setLine(content, data, x, y);
		if (y == 0) {
			setStyle(content, data.btnName, x, y);
		}
		if (y == 1) {
			var box = Elem.creat("div", content, "text");
			box.id = "data-box";
		}
	}
}

function setTitle(content, data, x) {
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

	var flex = Elem.creat("div", content, "alert-flex");
	for (let z in data.btnName) {
		var btn = Elem.creat("div", flex, "button-top");
		btn.y = y;
		btn.z = z;
		btn.key = data.key;
		btn.btnName = data.btnName[z];
		btn.btnText = data.btnText[z];
		btn.innerHTML = btn.btnText;
		Elem.color(btn, "dodgerblue", "#fff");
		btn.onclick = function() {
			var btnName = this.btnName.toLowerCase();
    		var setting = Storage.get("setting") || new Object();
			setting[this.key] = btnName;
			Storage.set("setting", setting);
			var nodes = this.parentNode.childNodes;
			for (let idx in nodes) {
				if (this.innerHTML == nodes[idx].innerHTML)  {
		            Elem.color(nodes[idx], "white", "dodgerblue");
		        } else {
		            Elem.color(nodes[idx], "dodgerblue", "#fff");
		        }				
			}
			btnName = btnName.replace("default", "values");
			var value = Storage.get(btnName);
			if (this.y == 2)
				value = localData.init(btnName);
			if (Elem.get('data-box'))
				Elem.get('data-box').innerHTML = JSON.stringify(value);
		}
		if (data.default == z) 
			btn.onclick();
	}
}

function setStyle(content, lines, x, y) {
	var table = Elem.creat("table", content, "table");
	table.style.color = "white";
	var tr;
	for (let x in colors) {
		for (let z in lines) {
			if (x == 0) continue;
			if (z == 0)
				tr = Elem.creat("tr", table, "row", x);
			var td = Elem.creat("td", tr, "col");
			var key = lines[z].toLowerCase();
			td.innerHTML = colors[x][key];
			Elem.color(td, "", td.innerHTML);
		}
	}
}


function setElems() {
	setOuterTop();
	setOuterCenter();
	setInner();
}


function setOuterTop() {
	var outerTop = Elem.get('outer-top');
	for (let x in items) {
		var btn = Elem.creat('div', outerTop, 'button-top');
		btn.innerHTML = items[x].title;
		btn.idx = x;
		btn.onclick = function() {
			setInner(this.idx);
		}
	}
}

function setOuterCenter() {
    var outerCenter = Elem.get('outer-center');
    for (let x in items) {
    	var inner = Elem.creat('div', outerCenter, 'inner', x);
    	setContent(inner, x);
    }
}

function setContent(inner, x) {
    var list = items[x].list;
    for (let y in list) {
        var content = Elem.creat('div', inner, 'content', y);
        var data = list[y];
        setTitle(content, data, x);
        setLine(content, data, x, y);
    }
}


function setTitle(content, data, x) {
    if (data.title) {
	    var title = Elem.creat('div', content, 'title');
	    title.innerHTML = data.title;
    }
    if (data.vice) {
	    var vice = Elem.creat('div', content, 'vice');
	    vice.innerHTML = data.vice;
	}
}


function setLine(content, data, x, y) {
	if (!data.lines) return;
	var block = Elem.creat('table', content, 'block', x);
	for (let z in data.lines) {
		var _data = data.lines[z];
		_data.seed = items[x].seed;

		//BLOCK
		var flex = Elem.creat('tr', block, 'flex', z);
		var date = setCell(flex, _data, 'date', 'A', 0, 0);
		var inve = setCell(flex, _data, 'inve', 'B', 1e3, 1e4);
		var grab = setCell(flex, _data, 'grab', 'B', 1e3, 1e4);
		var gain = setCell(flex, _data, 'gain', 'B', 1e1, 1e2);
	}
}

function setCell(flex, data, k, idx, a, b) {
	var cell = Elem.creat('td', flex, 'cell'+idx);
	var value = Math.floor(a + b* (Math.random() * 0.33 + 0.33) * data.seed * 5);
	data[k] = data[k] || '￥' + Parse.sub4Num(value);
	cell.innerHTML = data[k];
	if (cell.innerHTML.replace('年', '') != cell.innerHTML)
		cell.innerHTML = '<h4>' + cell.innerHTML.replace('年', '年</h4>');
	return cell;
}








function setElems() {
	setOuterTop();
	setOuterCenter();
	setInner();
	setAlert();
	showOnline();
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
		setTitle(content, data);
		setLine(content, data);
	}
}

function setTitle(content, data) {
	if (data.title) {
		var title = Elem.creat('div', content, 'title');
		title.innerHTML = data.title;
	}
	if (data.vice) {
		var vice = Elem.creat('div', content, 'vice');
		vice.innerHTML = data.vice;
	}
}


function setLine(content, data) {
	if (!data.lines) 
		return;
	var lines = data.lines;
	var block = Elem.creat('div', content, 'block');
	for (let z in lines) {
		var line = initTempLine(lines[z]);
		var user = Elem.creat('div', block, 'user-block');
		user.flex = setUserFlex(user, line);
		user.data = data;
		user.line = line;
		user.onclick = function() {
			document.body.line = this.line;
			document.body.lines = this.data.lines;
			console.log(this.line);
			setUserAlert(this);
		}
	}
}


function initTempLine(line) {
	line.group = line.uid[0].replace('s','赞助商').replace('d','淘金者');
	line.desc = '<h3>' + line.name + '的描述</h3>';
	line.desc += 'THE DESCRIBE OF ' + line.name + '<br/>';
	line.desc += 'THE DESCRIBE OF ' + line.name + '<br/>';
	line.desc += 'THE DESCRIBE OF ' + line.name + '<br/>';
	return line;
}


function setNexu(btn) {
	var data = btn.data;
	if (data.idx == 0)
		setChatAlert();
	if (data.idx == 2) {
		hideAlert();
		Elem.remove(btn.user);
		Parse.remove(document.body.lines, document.body.line);
	}
}

function setAlert() {

}

function showOnline() {
    var gap = Math.floor(Math.random()*10000 + 2000);
    setTimeout(function() {
    	var y = Math.floor(Math.random() * items[1].list.length);
    	var z = Math.floor(Math.random() * items[1].list[y].lines.length);
    	var list = items[1].list[y];
    	var line = items[1].list[y].lines[z];
    	var text = list.vice.replace('强制', '您').replace('我', '您');
    	text = '<h4>' + text + '</h4>' + line.name + ' 上线了!';
    	showLog(text);
        showOnline();
    }, gap)
}




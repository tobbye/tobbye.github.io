function setElems() {
	setOuterTop();
	setOuterCenter();
	setInner();
	setAlert();
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
	data.lines = data.lines || initTempLine(data);
	var block = Elem.creat('div', content, 'block');
	for (let z in data.lines) {
		var line = data.lines[z];
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


function initTempLine(data) {
	var lines = [];
    var list = Parse.mix(sponer);
	for (let z in list) {
		if (z >= config.rankCount) break;
		var unit = tempData.unitData;
		var text = list[z].split('-');
		var line = {
			uid: unit.uid,
			group: data.group,
			name: text[0],
			mark: [text[1], text[2]],
			tag: unit.tag,
			desc: unit.desc,
		};

		line.order = parseInt(z) + 1 + 'th';
		if (line.order.length == 3)
			line.order = line.order.replace('1th', '1st').replace('2th', '2nd').replace('3th', '3rd');
		// setNotFlex()
		var seed = data.power * data.seed;
		var rand = Math.floor((Math.random()+40-z) * 2 * seed);
		line.value = data.text + ': ￥' + Parse.sub4Num(rand);
		line.ladd = Math.floor(Math.random() * 20) + 3;
		line.desc = '<h3>' + line.name + '的描述</h3>';
		line.desc += 'THE DESCRIBE OF ' + line.name + '<br/>';
		line.desc += 'THE DESCRIBE OF ' + line.name + '<br/>';
		line.desc += 'THE DESCRIBE OF ' + line.name + '<br/>';
		lines.push(line);
	}
	return lines;
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




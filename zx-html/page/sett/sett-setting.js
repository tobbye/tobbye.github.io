function setElems() {
	setOuterTop();
	setOuterCenter();
	setInner();
}


function setOuterTop() {
	
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
		if (data.key == 'colorType') {
			setStyle(content, data);
		}
		if (data.key == 'dataIdx') {
			var box = Elem.creat('div', content, 'text');
			box.id = 'data-box';
		}
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

	var select = Elem.creat('div', content, 'select');
	for (let z in data.optName) {
		if (!data.optName[z]) 
			return;
		var option = Elem.creat('div', select, 'option');
		option.key = data.key;
		option.optName = data.optName[z].toLowerCase();
		option.optText = data.optText[z];
		option.innerHTML = option.optText;
		option.onclick = function() {
			var optName = this.optName;
			config[this.key] = optName;
		    Storage.set('config', config);
			var childs = this.parentNode.children;
			for (var i=0; i<childs.length; i++) {
				if (this.innerHTML == childs[i].innerHTML)  {
		            childs[i].setAttribute('btype', 'live');
		        } else {
		            childs[i].setAttribute('btype', 'dead');
		        }				
			}
			optName = optName.replace('default', 'values');
			var value = Storage.get(optName);
			if (this.key == 'colorType') {
				// togStyle(this);
			}
			if (this.key == 'initType')
				value = localData.init(optName);
			if (Elem.get('data-box'))
				Elem.get('data-box').innerHTML = JSON.stringify(value);
			if (this.key == 'debugType' && this.optName == 'test') {
				config.debugType = 'close';
		        Storage.set('config', config);
		        jsonToTable(items[0]); 
			}
		}
	}
	for (var i=0; i < select.children.length; i++) {
		var child = select.children[i];
		if (child.optName == config[child.key])
			child.onclick();
	}
	// var child = select.children[data.default];
	// if (child) child.onclick();
}

function setStyle(content, data) {
	var table = Elem.creat('table', content, 'table', 'style');

	for (var x=0; x<config.typeIdx.length; x++) {
		var	tr = Elem.creat('tr', table, 'row', x);
		for (var y=0; y<config.styleName.length; y++) {
			var typeIdx = config.typeIdx[x];
			var typeText = config.typeText[x];
			var styleName = config.styleName[y];
			var styleText = config.styleText[y];
			var td = Elem.creat('td', tr, 'col');
			var color = {
				font: colors[typeIdx][styleName],
				light: colors[typeIdx].light,
				bgd: colors[typeIdx].bgd,
				text: styleText.replace('色', typeText),
				type: colors[typeIdx].standard,
				style: styleName,
			}
			console.log(color);
			td.color = color;
			td.innerHTML = color.text;
			Elem.color(td, '', color.font);
			td.onclick = function() {
				config.color = this.color;
    			Storage.set('config', config);
    			if (config.colorType == 'text')
					Elem.color(document.body, this.color.font, '#eee');
				else
					Elem.color(document.body, this.color.font, this.color.bgd);
			}
		}
	}
}

function togStyle(option) {
	var color = {};
	var table = Elem.get('table_style');
	if (option.optName == 'colorful') {
		Elem.display(table, 'block');
		return;
	}
	Elem.display(table, 'none');
	if (option.optName == 'black') {
		color = {
            font: '#333',
            light: '#ccc',
            bgd: '#eee',
            text: '黑色',
            type: 'black',
            style: 'standard',
        };
	} else if (option.optName == 'white') {
		color = {
            font: '#111',
            light: '#666',
            bgd: '#999',
            text: '白色',
            type: 'white',
            style: 'standard',
        };
	}
	config.color = color;
	Storage.set('config', config);
	Elem.color(document.body, color.font, color.bgd);
}


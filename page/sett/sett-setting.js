function setElems() {
    setOuterTop();
	setOuterCenter();
	setOuterBot();
	setInner();
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
		    Storage.set('config', config);
			var childs = this.parentNode.children;
			for (var i=0; i<childs.length; i++) {
				if (this.innerHTML == childs[i].innerHTML)  {
		            childs[i].setAttribute('btype', 'live');
		        } else {
		            childs[i].setAttribute('btype', 'dead');
		        }				
			}
			var value = Storage.get(optName);
			if (this.key == 'hostType') {
				var host = config.constant.host[optName];
				config.sett.isOnline = !(optName == 'html' || optName == 'github');
				config.sett.isLocal = optName == 'html' || optName == 'local';
					if (config.sett.isLocal && config.sett.isMobile) {
						showLog('<h4>无法连接到' + this.optText + '!</h4>' + host);
						return;
					} else {
						showLog('<h4>连接到' + this.optText + '成功!</h4>' + host);

					}
				if (config.sett.hostType != optName) {
					config.sett.hostType = optName;
					config.action.host = host;

					setTimeout(function() {
						window.location.href = config.action.host + "/page/sett/sett.html";
					}, 2000);
				}
			}
			if (this.key == 'dataType') {
				localData.init('clear');
			}
			if (this.key == 'debugType' && this.optName == 'test') {
				config.sett.debugType = 'close';
		        Storage.set('config', config);
		        jsonToTable(items[0]); 
			}
			config.sett[this.key] = optName;
		}
	}
	for (var i=0; i < select.children.length; i++) {
		var child = select.children[i];
		if (child.optName == config.sett[child.key])
			child.onclick();
	}
	// var child = select.children[data.default];
	// if (child) child.onclick();
}

function setStyle(content, data) {
	var table = Elem.creat('table', content, 'table', 'style');
	for (var x=0; x<cfg.typeIdx.length; x++) {
		var	tr = Elem.creat('tr', table, 'row', x);
		for (var y=0; y<cfg.styleName.length; y++) {
			var typeIdx = cfg.typeIdx[x];
			var typeText = cfg.typeText[x];
			var styleName = cfg.styleName[y];
			var styleText = cfg.styleText[y];
			var td = Elem.creat('td', tr, 'col');
			var color = {
				font: colors[typeIdx][styleName],
				light: colors[typeIdx].light,
				bgd: colors[typeIdx].bgd,
				style: styleName,
				type: colors[typeIdx].standard,
				text: styleText.replace('色', typeText),
			}
			td.color = color;
			td.innerHTML = color.text;
			Elem.color(td, '', color.font);
			td.onclick = function() {
				config.color = this.color;
    			Storage.set('config', config);
    			if (config.sett.colorType == 'text')
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
            style: 'standard',
            type: 'black',
            text: '黑色',
        };
	} else if (option.optName == 'white') {
		color = {
            font: '#111',
            light: '#666',
            bgd: '#999',
            style: 'standard',
            type: 'white',
            text: '白色',
        };
	}
	config.color = color;
	Storage.set('config', config);
	Elem.color(document.body, color.font, color.bgd);
}


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
			setOption(this);
		}
	}
	for (var i=0; i < select.children.length; i++) {
		var child = select.children[i];
		if (child.optName == Config.sett[child.key])
			setOption(child);
	}
	// var child = select.children[data.default];
	// if (child) child.onclick();
}
function setOptDefault(opt) {
	var childs = opt.parentNode.children;
	for (var i=0; i<childs.length; i++) {
		if (opt.innerHTML == childs[i].innerHTML)  {
            childs[i].setAttribute('state', 'live');
        } else {
            childs[i].setAttribute('state', 'dead');
        }				
	}
	var optName = opt.optName;
	if (opt.key == 'hostType') {
		var host = Config.constant.host[optName];
		showLog('<h4>成功连接到' + opt.optText + '!</h4>' + host);
	}
}

function setOption(opt) {
	var isSave = true;
	var childs = opt.parentNode.children;
	for (var i=0; i<childs.length; i++) {
		if (opt.innerHTML == childs[i].innerHTML)  {
            childs[i].setAttribute('state', 'live');
        } else {
            childs[i].setAttribute('state', 'dead');
        }				
	}
	var optName = opt.optName;
	if (opt.key == 'hostType') {
		var host = Config.constant.host[optName];
		Config.sett.isOnline = !(optName == 'html' || optName == 'github');
		Config.sett.isHtmlAll = optName == 'html';
		Config.sett.isLocalMob = optName == 'local' && Config.sett.isMobile;

		if (Config.sett.isHtmlAll || Config.sett.isLocalMob) {
			isSave = false;
			showLog('<h4>无法连接到' + opt.optText + '!</h4>' + host);
		} else if (Config.sett.hostType == optName) {
			showLog('<h4>成功连接到' + opt.optText + '!</h4>' + host);
		} else {
			showLog('<h4>准备连接到' + opt.optText + '</h4>' + host);
			Config.action.host = host;
			isSave = false;
			setTimeout(function() {
				window.location.href = Config.action.host + "/page/sett/sett.html";
			}, 2000);
		}
	}

	if (opt.key == 'debugType' && opt.optName == 'test') {
        Storage.set('Config', Config);
        jsonToTable(items[0]); 
	}
	if (isSave)
		Config.sett[opt.key] = optName;
    Storage.set('Config', Config);
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
				Config.color = this.color;
    			Storage.set('Config', Config);
    			if (Config.sett.colorType == 'text')
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
	Config.color = color;
	Storage.set('Config', Config);
	Elem.color(document.body, color.font, color.bgd);
}


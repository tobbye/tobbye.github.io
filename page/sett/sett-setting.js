let Sett = new __Sett();

function __Sett() {

	this.init = function() {
		this.creatElems();
        Container(this);
	}


	this.creatElems = function() {
		Alert.creatOuterTop(this);
		Alert.creatOuterCenter(this);
		Alert.creatOuterBot(this);
		Alert.showInner();
	}

	
    this.creatBlock = function(content, data) {
		this.creatLine(content, data);
		if (data.key == 'colorType') {
			this.setStyle(content, data);
		}
    }

	this.creatLine = function(content, data) {

		let select = Elem.creat('div', content, 'select');
		for (let z in data.optName) {
			if (!data.optName[z]) 
				return;
			let option = Elem.creat('div', select, 'option');
			option.key = data.key;
			option.optName = data.optName[z].toLowerCase();
			option.optText = data.optText[z];
			option.innerHTML = option.optText;
			option.onclick = function() {
				Sett.setOption(this);
			}
		}
		for (let i=0; i < select.children.length; i++) {
			let child = select.children[i];
			if (child.optName == Config.sett[child.key])
				Sett.setOptDefault(child);
		}
	}




	this.setOption = function(opt) {
		this.setOptDefault(opt);
		if (opt.key == 'debugType' && opt.optName == 'test') {
	        Storage.set('Config', Config);
	        Alert.toTable(items[0]); 
	        return;
		}
		Config.sett[opt.key] = opt.optName;
	    Storage.set('Config', Config);
	}

	
	this.setOptDefault = function(opt) {
		let childs = opt.parentNode.children;
		for (let i=0; i<childs.length; i++) {
			if (opt.innerHTML == childs[i].innerHTML)  {
	            childs[i].setAttribute('state', 'live');
	        } else {
	            childs[i].setAttribute('state', 'dead');
	        }				
		}
		if (opt.key == 'linkType') {
			this.setHostType(opt);
		}
	}

	this.setHostType = function(opt) {
		let optName = opt.optName;
		let link = Constant.link[optName];

		Config.sett.isOnline = !(optName == 'html' || optName == 'github');
		Config.sett.isHtmlAll = optName == 'html';
		Config.sett.isLocalMob = optName == 'local' && Config.sett.isMobile;

		if (Config.sett.linkType == optName) {
			Alert.log('<h4>成功连接到' + opt.optText + '!</h4>' + link);
		} else if (Config.sett.isHtmlAll || Config.sett.isLocalMob) {
			Alert.log('<h4>无法连接到' + opt.optText + '!</h4>' + link);
		} else {
			Alert.log('<h4>准备连接到' + opt.optText + '</h4>' + link);
			Config.action.link = link;
			setTimeout(function() {
				window.location.href = Config.action.link + "/page/sett/sett.html";
			}, 2000);
		}
    	Storage.set('Config', Config);
	}	

	this.setStyle = function(content, data) {
		let table = Elem.creat('table', content, 'table', 'style');
		for (let x=0; x<cfg.typeIdx.length; x++) {
			let	tr = Elem.creat('tr', table, 'row', x);
			for (let y=0; y<cfg.styleName.length; y++) {
				let typeIdx = cfg.typeIdx[x];
				let typeText = cfg.typeText[x];
				let styleName = cfg.styleName[y];
				let styleText = cfg.styleText[y];
				let td = Elem.creat('td', tr, 'col');
				let color = {
					font: colors[typeIdx][styleName],
					light: colors[typeIdx].light,
					dark: colors[typeIdx].dark,
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
						Elem.color(document.body, Alert.colorFont(), '#eee');
					else
						Elem.color(document.body, Alert.colorFont(), Alert.colorBgd());
				}
			}
		}
	}

	this.togStyle = function(option) {
		let color = {};
		let table = Elem.get('table_style');
		if (option.optName == 'colorful') {
			Elem.display(table, 'block');
			return;
		}
		Elem.display(table, 'none');
		if (option.optName == 'black') {
			color = {
	            font: '#333',
	            dark: '#888',
	            light: '#ccc',
	            bgd: '#eee',
	            style: 'standard',
	            type: 'black',
	            text: '黑色',
	        };
		} else if (option.optName == 'white') {
			color = {
	            font: '#111',
	            dark: '#888',
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

}

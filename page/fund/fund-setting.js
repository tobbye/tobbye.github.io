
var Fund = new __Fund();

function __Fund() {

	this.init = function() {
		this.setConfig();
		this.creatElems();
        Container(this);
	}


	this.creatElems = function() {
		Alert.creatOuterTop(this);
		Alert.creatOuterCenter(this);
		Alert.creatOuterBot(this);
		Alert.showInner();
	}

	this.creatContent = function(inner, x) {
	    let list = items[x].list;
	    for (let y in list) {
	        let content = Elem.creat('div', inner, 'content', y);
	        let data = list[y];
			this.creatTitle(content, data);
			this.creatLine(content, data);
			this.creatBlock(content, data);
			this.creatButton(content, data);
	    }
	}


	this.creatTitle = function(content, data) {
		let va = values[data.vice.split('/')[0].split('.')[0]];
		let vb = values[data.vice.split('/')[1].split('.')[0]];
		let vc = Math.abs(va / vb).toFixed(4);
		data.viceStr = data.vice + vc;
		Alert.creatTitle(content, data)
	}


	//设置Line视图
	this.creatLine = function(content, data) {
		let trs = data.lines;
		let table = Elem.creat('table', content, 'table-line');
		Elem.height(table, Config.page.flowHeight + 'px');
		Elem.hide(table);
		for (let y in trs) {
			let tds = trs[y];
			let tr = Elem.creat('tr', table, 'tr-row', y);
			for (let z in tds) {
				let td = Elem.creat('td', tr, 'td-col');
				let col = tds[z].col;
				if (!col) {
					Elem.color(td, '#222', '#eee');
					continue;
				}
				td.colSpan = col;
				let key = tds[z].text.split('.')[0];
				let size = col > 1 ? '<h2>' : '<h3>';
				tds[z].value = values[key];
				text = tds[z].text + '<br/>' + size + this.formatKey(key, 0);
				td.innerHTML = text;

				let border = cfg.border[tds[z].border];
				for(let i in border) {
					let radius = 'border' + border[i] + 'Radius';
					td.style[radius] = cfg.radius;
				}
			}
		}
	}


	//设置Block视图
	this.creatBlock = function(content, data) {
		let trs = data.blocks;
		let table = Elem.creat('table', content, 'table-block');
		Elem.height(table, Config.page.flowHeight + 'px');
		Elem.show(table, 'table');
		for (let y in trs) {
			let tr = Elem.creat('tr', table, 'tr-row', y);
			let tds = trs[y];
			for (let z in tds) {
				let td = Elem.creat('td', tr, 'td-col');
				let row = tds[z].row;
				if (!row) {
					Elem.color(td, '#222', '#eee');
					continue;
				}
				td.rowSpan = row;
				let text = tds[z].text;
				let key = text.split('.')[0];
				tds[z].value = values[key];
				text = '<h2>' + text.replace('.', '</h2>');
				text += '<h4>' + this.formatKey(key, 1) + '</h4>';
				td.innerHTML = text;
			}
		}
	}


	//切换视图 Line和Block
	this.togItem = function(item) {
		let state, view;
		let data = item.data;
		if (data.idx % 100 == 4) {
			Storage.set('recd-innerIdx', values.innerIdx);
			window.location.href = '../recd/recd.html';
			return;
		}
		if (data.idx % 100 == 3) {
			view = ['none', 'table'];
		}
		if (data.idx % 100 == 5) {
			view = ['table', 'none'];
		}
		if (item.getAttribute('state') == 'danger')
			return;
		let lines = Elem.getClass('table-line');
		let blocks = Elem.getClass('table-block');
		let buttons = Elem.getClass('button-min');
		for (let x in lines)
			Elem.show(lines[x], view[0]);
		for (let y in blocks)
			Elem.show(blocks[y], view[1]);
		for (let z in buttons) {
			Elem.show(buttons[z]);
		}
	}


	this.creatButton = function(content, data) {
		let list = data.buttons;
		let block = Elem.creat('div', content, 'block');
		for (let y in list) {
			let flex = Elem.creat('div', block, 'flex');
			for(let z in list[y]) {
				let data = list[y][z];
				let button = Elem.creat('div', flex, 'button');
				button.data = data;
				button.innerHTML = data.text;
				button.setAttribute('state', data.state);
				let tableBlock = Elem.get('table-block');
				if (!data.limit)
					button.className = 'button-min';
				button.onclick = function() {
					Fund.showEdit(this);
				}
			}
		}
	}

	this.showEdit = function(btn) {
		if (!btn.data.limit) {
			this.togItem(btn);
			return;
		}
		Alert.showPanel('edit', 1);
		let data = btn.data;
		let title = Alert.curPanel.title;
		let limit = Alert.curPanel.limit;
		let input = Alert.curPanel.input;
		Elem.color(input, getColorType(), '#eee')
		input.focus();
		input.min = 0;
		input.value = 0;
		input.max = values[data.limit];
		input.dataready = data;
		title.innerHTML = data.title;
		limit.innerHTML = '(范围：0-' + input.max + ')';
		if (Config.page.isOnline) {
			let tran = Elem.get('fundtran');
			let ref = tran.getAttribute('ref');
			let uid = Parse.getDate(null, '');
			console.log(uid);
			tran.action = setAction('fundtran', data.idx);
		}
	}

	this.onQuit = function() {
		let input = Alert.curPanel.input;
		input.value = 0;
		Alert.hidePanel();
	}


	this.onDoit = function() {
		let input = Alert.curPanel.input;
		if (input.value == 0) 
			return;
		input.data = input.dataready;
		if (input.data.idx == 301 && values.M == values.N) {
			values.M = 0;
			values.N = 0;
		}
		Alert.hidePanel();
		this.savejson(input);
		this.refresh();
	}



	this.savejson = function(input) {
		let date = new Date();
		let json = {
			date: Parse.getDate(date),
			time: Parse.getTime(date),
			type: input.data.idx,
			value: input.value
		}
		Storage.add('recd-json', json);
	}


	//刷新页面
	this.refresh = function() {
		let input = Alert.curPanel.input;
		let limit = Alert.curPanel.limit;
		let list = input.data.tran.split('|');
		let str = '';
		let idx = Config.innerIdx;
		for (let i in list) {
			let line = list[i].split('*');
			let val = parseInt(input.value) * parseFloat(line[1]);
			if (line[2])
				val *= values[line[2]];
			values[line[0]] += val;
			values[line[0]] = Math.round(values[line[0]]);
			str += line[0] + ' += ' + val + ' | ';
		}
		// values.R = Math.floor(values.Q / 100);
		Alert.log('<h4>操作成功</h4>' + input.data.title + ' ￥' +  input.value);
		console.log(str);
		// input.value = 0;
		localData.save();
		Alert.creatOuterCenter(this);
		Config.page.isInto = true;
		Alert.showInner(idx);
	}


	//输入事件
	this.onInput = function(input) {
		input.value = Math.max(input.min, input.value);
		input.value = Math.min(input.max, input.value);
	}




	this.formatKey = function(key, idx) {
		if (idx == 0)
			return '￥' + Parse.addSplit(Math.abs(values[key]));
		else
			return '￥' + Parse.sub4Num(Math.abs(values[key]));
	}

	this.setConfig = function() {
		localData.init("init");
	}
}

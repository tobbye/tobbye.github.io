var Stat = new __Stat();

function __Stat() {

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


	this.creatBlock = function(content, data, x, y) {
	    this.creatLine(content, data, x, y);
	}


	this.creatLine = function(content, data, x, y) {
		if (!data.lines) return;
		let block = Elem.creat('table', content, 'block', x);
		for (let z in data.lines) {
			let _data = data.lines[z];
			_data.seed = items[x].seed;

			//BLOCK
			let flex = Elem.creat('tr', block, 'flex', z);
			let date = this.setCell(flex, _data, 'date', 'A', 0, 0);
			let inve = this.setCell(flex, _data, 'inve', 'B', 1e3, 1e4);
			let grab = this.setCell(flex, _data, 'grab', 'B', 1e3, 1e4);
			let gain = this.setCell(flex, _data, 'gain', 'B', 1e1, 1e2);
		}
	}

	this.setCell = function(flex, data, k, idx, a, b) {
		let cell = Elem.creat('td', flex, 'cell'+idx);
		let value = Math.floor(a + b* (Math.random() * 0.33 + 0.33) * data.seed * 5);
		data[k] = data[k] || '￥' + Parse.sub4Num(value);
		cell.innerHTML = data[k];
		if (cell.innerHTML.replace('年', '') != cell.innerHTML)
			cell.innerHTML = '<h4>' + cell.innerHTML.replace('年', '年</h4>');
		return cell;
	}


}






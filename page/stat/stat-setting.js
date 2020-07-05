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
		let block = Elem.creat('div', content, 'block', x);
		for (let z in data.lines) {
			let line = data.lines[z];
			line.seed = items[x].seed;

            let flex = new this.StatFlex();
            flex.init(block, line);
		}
	}



	this.StatFlex = function() {

		this.init = function(body, line) {
			this.body = body;
			this.line = line;
			this.initFlex(line);
		}

		this.initFlex = function(line) {
			this.top = Elem.creat('div', this.body, 'user-top');
            this.order = Elem.creat('div', this.top, 'user-order');
            this.value = Elem.creat('div', this.top, 'user-value');
            Elem.text(this.order, line.date);
            Elem.text(this.value, line.value || '');
            Elem.page(this.order, Alert.colorFont());
			Elem.border(this.top, Alert.colorBgd());

			this.flex = Elem.creat('div', this.body, 'user-flex');
			this.inve = this.initCell(this.flex, line, 'inve', 1e3, 1e4);
			this.grab = this.initCell(this.flex, line, 'grab', 1e3, 1e4);
			this.gain = this.initCell(this.flex, line, 'gain', 1e1, 1e2);
		}

		this.initCell = function(flex, line, k, a, b) {
			let cell = Elem.creat('div', this.flex, 'cell');
			let value = Math.floor(a + b* (Math.random() * 0.33 + 0.33) * line.seed * 5);
			line[k] = cfg.string[k] + '<h3>￥' + Parse.sub4Num(value) + '</h3>';
			cell.innerHTML = line[k];
			Elem.border(cell, Alert.colorBgd());
			return cell;
		}
	}


}






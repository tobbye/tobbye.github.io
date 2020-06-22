

var Nexu = new __Nexu();
var UserData = new Alert.UserData();

function __Nexu() {

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
    }


	this.creatLine = function(content, data) {
		if (!data.lines) 
			return;
		let lines = data.lines;
		let block = Elem.creat('div', content, 'block');
		for (let z in lines) {
			let line = new Alert.UserData();
			line.init(lines[z]);
			this.initTemp(line);
			let body = Elem.creat('div', block, 'user-block', 'lines['+z+']');
			let flex = new Alert.UserFlex(body, line);
            flex.init(body, line);
			body.onclick = function() {
				document.body.user = this;
				Alert.bodySelect(this);
				Alert.showUser(this);
			}
			data.lines[z] = line;
		}
	}

	this.initTemp = function(line) {
		line.group = line.uid[0].replace('s','赞助商').replace('d','淘金者');
		line.desc = '<h3>' + line.name + '的描述</h3>';
		line.desc += 'THE DESCRIBE OF ' + line.name + '<br/>';
		line.desc += 'THE DESCRIBE OF ' + line.name + '<br/>';
		line.desc += 'THE DESCRIBE OF ' + line.name + '<br/>';
	}





	this.showOnline = function() {
	    let gap = Math.floor(Math.random()*20000 + 2000);
	    setTimeout(function() {
	    	let y = Math.floor(Math.random() * items[1].list.length);
	    	let z = Math.floor(Math.random() * items[1].list[y].lines.length);
	    	let list = items[1].list[y];
	    	let line = items[1].list[y].lines[z];
	    	let text = list.vice.replace('强制', '您').replace('我', '您');
	    	text = '<h4>' + text + '</h4>' + line.name + ' 上线了!';
	    	Alert.log(text);
	        this.showOnline();
	    }, gap)
	}

}




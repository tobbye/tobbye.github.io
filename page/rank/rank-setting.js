
var Rank = new __Rank();
var UserData = new Alert.UserData();

function __Rank() {

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
		data.lines = [];
		let lines = this.initTempLine(data);
		let block = Elem.creat('div', content, 'block');
		for (let z in lines) {
			let line = new Alert.UserData();
			line.init(lines[z]);
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


	this.initTempLine = function(data) {
		let lines = [];
	    let list = Parse.mix(sponer);
		for (let z in list) {
			if (z >= cfg.rankCount) break;
			let unit = tempData.unitData;
			let text = list[z].split('-');
			let line = {
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
			let seed = data.power * data.seed;
			let rand = Math.floor((Math.random()+40-z) * 2 * seed);
			line.value = data.text + ': ￥' + Parse.sub4Num(rand);
			line.ladd = Math.floor(Math.random() * 20) + 3;
			line.desc = '<div desc="center">' + line.name + '的描述</div>';
			line.desc += 'THE DESCRIBE OF ' + line.name + '<br/>';
			line.desc += 'THE DESCRIBE OF ' + line.name + '<br/>';
			line.desc += 'THE DESCRIBE OF ' + line.name + '<br/>';
			lines.push(line);
		}
		return lines;
	}

}




var Rank = new __Rank();

function __Rank() {

	this.init = function() {
		this.creatElems();
		console.log(this);
	}


	this.creatElems = function() {
		Alert.creatOuterTop(this);
		Alert.creatOuterCenter(this);
		Alert.creatOuterBot(this);
		Alert.showInner();
	}

	this.setContent = function(inner, x) {
		let list = items[x].list;
		for (let y in list) {
			let content = Elem.creat('div', inner, 'content', y);
			let data = list[y];
			Alert.creatTitle(content, data);
			this.creatLine(content, data);
		}
	}


	this.creatLine = function(content, data) {
		data.lines = data.lines || this.initTempLine(data);
		let block = Elem.creat('div', content, 'block');
		for (let z in data.lines) {
			let line = data.lines[z];
			let user = Elem.creat('div', block, 'user-block');

			user.flex = Alert.setUserFlex(user, line);
			user.data = data;
			user.line = line;
			user.onclick = function() {
				document.body.user = this;
				document.body.line = this.line;
				document.body.lines = this.data.lines;
				console.log(this.line);
				Alert.showUser(this);
			}
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
			let seed = data.power * data.seed;
			let rand = Math.floor((Math.random()+40-z) * 2 * seed);
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

}



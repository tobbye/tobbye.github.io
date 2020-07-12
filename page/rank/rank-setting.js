let Rank = new __Rank();
let UserData = new Alert.UserData();

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
		let lines = this.initTempData(data);
		let block = Elem.creat('div', content, 'block');
		for (let z in lines) {
			let line = lines[z];
			let user = new Alert.UserData();
			user.init(line);
            let body = Elem.creat('div', block, 'user-block', 'lines['+z+']');
            let flex = new Alert.UserFlex();
            flex.init(body, user);
			data.lines[z] = user;
		}
	}


	this.initTempData = function(data) {
		let lines = [];
	    let sponers = Parse.mix(sponer);
		for (let z in sponers) {
			if (z >= cfg.rankCount) break;
			let unit = tempData.unitData;
			let text = sponers[z].split('-');
			let line = {
				name: text[0],
				icon: Parse.pick(Array.from(tempData.iconStr)),
				uid: 's' + (80001 + ~~z),
				mark: [text[1], text[2]],
				tag: unit.tag,
				group: data.group,
				nexu: 1,
				ord: z,
				valStr: data.text,
			};

			line.seed = data.power * data.seed;
			line.ladd = Math.floor(Math.random() * 20) + 3,
			line.val = Math.floor((Math.random()+40-z) * 2 * line.seed);
			lines.push(line);
		}
		return lines;
	}

}



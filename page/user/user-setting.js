var User = new __User();

function __User() {

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
		if (x == 0) {
			this.creatDetail(content, data, x);
			this.creatRank(content, data);
			this.creatTags(content, data);
		}
		if (x == 1) {
			let lines = data.lines;
			this.setRecentLine(content, lines, x, y);
		}
		if (x == 2) {
			let lines = data.lines;
			this.setAchieLine(content, lines, x, y);
		}
	}

	this.creatDetail = function(content, data, x) {
		let block = Elem.creat('div', content, 'block');
		let head  = Elem.creat('img', block, 'head');
		let name  = Elem.creat('div', block, 'text-large');
		let uid   = Elem.creat('div', block, 'text-small');
		let flex1 = Elem.creat('div', block, 'flex-top');
		let area  = Elem.creat('div', flex1, 'text-small');
		let sex   = Elem.creat('div', flex1, 'text-large');
		let age   = Elem.creat('div', flex1, 'text-small');
		let flex2 = Elem.creat('div', block, 'flex-top');
		let auth  = Elem.creat('div', flex2, 'text-small');
		let ladd  = Elem.creat('div', flex2, 'text-large');
		let group = Elem.creat('div', flex2, 'text-small');
		block.id = 'bg';
		name.innerHTML = data.name;
		uid.innerHTML = 'ID: ' + data.uid;
		area.innerHTML = data.area + ' | ';
		sex.innerHTML = data.sex;
		age.innerHTML = ' | ' + data.age + '岁<br/>';
		auth.innerHTML = data.auth + ' | ';
		ladd.innerHTML = data.ladd + '阶';
		group.innerHTML = ' | ' + data.group;
		// head.innerHTML = 'zhongxin';
		// Elem.color(head, '', getColorLight());
		// Elem.style(head, 'borderColor', getColorType());
	}


	this.creatRank = function(content, data) {

		let block = Elem.creat('div', content, 'block');
		//TIPS
		let tips = Elem.creat('div', block, 'tips');
		tips.innerHTML = data.tipsRank;
		let flex1 = Elem.creat('div', block, 'flex');
		//RANK-ALL
		let all1 = Elem.creat('div', flex1, 'rank');
		let city = Elem.creat('div', flex1, 'rank');
		let area = Elem.creat('div', flex1, 'rank');
		all1.innerHTML = '全国排名<br/><h2> ' + data.rankAll;
		city.innerHTML = '全市排名<br/><h2> ' + data.rankCity;
		area.innerHTML = '全区排名<br/><h2> ' + data.rankArea;


		let flex2 = Elem.creat('div', block, 'flex');
		let all2 = Elem.creat('div', flex2, 'value');
		let used = Elem.creat('div', flex2, 'value');
		let surplus = Elem.creat('div', flex2, 'value');
		all2.innerHTML = '总权值<br/><h3>' + data.valueAll;
		used.innerHTML = '已分配<br/><h3>' + data.valueUsed;
		surplus.innerHTML = '未分配<br/><h3>' + data.valueSurplus;
	}


	this.creatTags = function(content, data) {
		let tags = data.tags;
		if (!tags) return;
		//TIPS
		let block = Elem.creat('div', content, 'block');
		let tips = Elem.creat('div', block, 'tips');
		tips.innerHTML = data.tipsTag;

		let flex1 = Elem.creat('div', block, 'flex', 1);
		let flex2 = Elem.creat('div', block, 'flex', 2);
		let flex3 = Elem.creat('div', block, 'flex', 3);
		let flex4 = Elem.creat('div', block, 'flex', 4);
		let flex5 = Elem.creat('div', block, 'flex', 5);

		for(let y in tags) {
			let _data = tags[y];
			//TAG
			let tag = Elem.creat('div', flex1, 'user-tag', y);
			tag.innerHTML = _data.tag;
			tag.btnIdx = y;
			tag.onclick = function() {
				Alert.showSearch(this);
			}

			//VALUE
			let value = Elem.creat('div', flex2, 'value', y);
			value.innerHTML = data.valueStr.replace('#1', _data.value);

			//ALLOT
			let allot = Elem.creat('div', flex3, 'allot', y);
			allot.innerHTML = data.allotStr.replace('#2', _data.allot);

			//EDIT
			let edit = Elem.creat('div', flex4, 'button-min', y);
			edit.setAttribute('state', 'permit');
			edit.innerHTML = '编辑标签';
			edit.data = _data;
			edit.idx = y;
			edit.onclick = function() {
				cfg.tagData = this.data;
				cfg.tagIdx = this.idx;
				User.setEditAlert(this);
			}
		}

		//EDIT_DETAIL
		let edit = Elem.creat('div', flex5, 'button');
		edit.setAttribute('state', 'permit');
		edit.innerHTML = '编辑资料';
		flex4.style.padding = '5px';
		flex5.style.padding = '10px 5px';
		flex5.style.marginTop = '5px';
	}


	this.setEditAlert = function(button) {
		Alert.hidePanel();
	    Alert.showPanel('edit', 1);
		let data = cfg.tagData;
	    let title = Alert.curPanel.title;
	    let block = Alert.curPanel.block;
	    block.innerHTML = block.innerHTML.replace('#0', data.tag).replace('#1', data.value).replace('#2', data.allot);
	    block.style.maxHeight = Config.page.alertHeight + 'px';
	}


	this.setAchieLine = function(content, lines, x, y) {
	    let list = items[x].list[y];
	    let block = Elem.creat('div', content, 'block', x);
	    for (let z in lines) {
	        let data = lines[z];

	        //BLOCK
	        let flex = Elem.creat('div', block, 'ach-flex', z);	
	        let left = Elem.creat('div', flex, 'ach-cell ach-left');
	        let right = Elem.creat('div', flex, 'ach-cell  ach-right');

	        data.name = '<h3>' + data.name + '</h3>';
	        data.prect = '<h3>' + data.prect + '</h3>';
	        left.innerHTML = data.name + data.desc;
	        right.innerHTML = data.prect + data.value;
	    }
	}

	this.setRecentLine = function(content, lines, x, y) {
		let list = items[x].list[y];
	    let block = Elem.creat('div', content, 'block', x);
	    for (let z in lines) {
	        let data = lines[z];
	        let title = {};
	        if (z == 0)
	       		title = Elem.creat('div', block, 'rec-title', z);	
	        else if(lines[z].date != lines[z-1].date) {
	       		title = Elem.creat('div', block, 'rec-title', z);	
	        }
	        title.innerHTML = data.date;
	        //BLOCK
	        let flex = Elem.creat('div', block, 'ach-flex', z);	
	        let left = Elem.creat('div', flex, 'ach-cell rec-left');
	        let right = Elem.creat('div', flex, 'ach-cell rec-right');
	        data.time =  data.time.replace('日', '日<h3>');
	        data.unit = '<h3>' + data.unit + '</h3>';
	        left.innerHTML = data.time;
	        right.innerHTML = data.unit + data.desc;
	    }
	}


	this.onDoit = function() {
        this.refresh();
        Alert.hidePanel();
	}

	this.onInput = function() {

	}

	this.refresh = function() {
		let data = items[0].list[0];
		let idx = cfg.tagIdx;
		let tag = Elem.get('input-tag');
		let value = Elem.get('input-value');
		let allot = Elem.get('input-allot');

		data.tags[idx] = {
			tag: tag.value,
			value: data.valueStr.replace('#1', value.value),
			allot: data.allotStr.replace('#2', allot.value)
		}
		console.log(data.tags);
		if (tag.value)
			document.querySelector('.user-tag[key="'+idx+'"]').innerHTML = tag.value;
		if (value.value)
			document.querySelector('.value[key="'+idx+'"]').innerHTML = data.valueStr.replace('#1', value.value);
		if (allot.value)
			document.querySelector('.allot[key="'+idx+'"]').innerHTML = data.allotStr.replace('#2', allot.value);
	}
}





window.onload = function() {
    Tools.init();
	Wencai.init();
}

let Source = {
	href: 'http://www.iwencai.com/unifiedwap/result?w=#word',
	doneText: ['缺少数据', '未完成', '复盘完成'],
	linkTexts: {
		base: 'base',
		YGJLR: '预告净利润',
		QTDS: '蜻蜓点水',
		WLFC: '卧龙凤雏',
		JJJ: '尖尖角',
		JJG: '节节高',
		ZT: '涨停',
		FZ: '反包',
		EFF: '二分法',
		XQJ: '辛弃疾',
		HQB: '霍去病',
		LSZ: '李时珍',
		BB: '病变',
	}
}

let Wencai = new __Wencai();
function __Wencai() {

	this.init = function() {
		this.load();
		this.creatYear();
		this.setMonth();
		this.creatMonth();
		console.log(this);
	}

	this.load = function() {
		this.outer = Tools.getElem('outer');
		this.inner = Tools.getElem('inner');
		this.table1 = Tools.getElem('table1');
		this.table2 = Tools.getElem('table2');
		this.table3 = Tools.getElem('table3');
		this.msgbox = Tools.getElem('msgbox');
		this.write = Tools.getElem('write');
		this.input = Tools.getElem('input');
		this.save = Tools.getElem('save');
	}


	this.setYear = function(year) {
		Tools.setBase('year', year);
        window.location.reload();
	}

	this.creatYear = function() {
		for (let i in yearData) {
			let data = yearData[i];
			let tr = Tools.creatElem('tr', table1, 'tr', data[0]);
			for (let j=0; j<4; j++) {
				let td = Tools.creatElem('td', tr, 'td', data[j]);
				td.setAttribute('type', 'normal');
				td.setAttribute('year', Tools.year);
				if (j == 0) {
					let date = Tools.creatElem('div', td, 'date');
					date.innerHTML  = Tools.year + '年' + data[0];
					this.link(td, data, this.advanceStr(data),'YGJLR');
				} else {
					let date = Tools.creatElem('div', td, 'date');
					date.innerHTML  = Tools.year + '年' + data[j+1][0] + '月';
					this.link(td, data[j+1], 1,'QTDS');
					this.link(td, data[j+1], 2,'WLFC');
					let btn = Tools.creatElem('button',td, 'btn');
					btn.setAttribute('big', 1);
					btn.innerHTML = data[j+1][0] + '月详情';
					btn.month = data[j+1][0];
					btn.onclick = function() {
						Tools.month = this.month;
						Tools.setBase('month', this.month);
						Wencai.setMonth();
						Wencai.creatMonth();
					}
				}
			}
		}
	}



	this.advanceStr = function(data) {
		return Tools.year+ data[0] + '预告净利润/' + Tools.year + '年' + data[1] + '市值前20';
	}



	this.setMonth = function() {
		Tools.days = [];
		this.holiday = holiday.split('\n');
		if ((Tools.year % 400 === 0) || (Tools.year % 100 !== 0 && Tools.year % 4 === 0))
			Tools.monthCount[1] = 29;
		let preDays = [];
		let curDays = [];
		let preYear = Tools.year;
		let nextYear = Tools.year;
		let preMonth = Tools.month -1;
		let nextMonth = Tools.month + 1;

		if (Tools.month == 1) {
			preMonth = 12;
			preYear = Tools.year - 1;
		} else if (Tools.month == 12) {
			nextYear = Tools.year + 1;
			nextMonth = 1;
		}

		let date = new Date(preYear, preMonth-1, 1);
		for (let i=0;i <date.getDay(); i++) {
			preDays.push(0);
		}
		for (let i=1;i <=Tools.monthCount[preMonth-1]; i++) {
			preDays.push(Tools.toDate(preYear,preMonth, i));
		}
		for (let i=1;i <=Tools.monthCount[Tools.month-1]; i++) {
			preDays.push(Tools.toDate(Tools.year, Tools.month, i));
		}
		for (let i in preDays) {
			let week = i%7; 
			if (week>0 && week<6) {
				curDays.push([preDays[i], week]); 
			}
		}
		for (let i in curDays) {
			if (!curDays[i][0])
				continue;
			 if(curDays[i][0].indexOf(Tools.month+'月') > -1) {
				let json = {
					date: curDays[i][0], 
					week: curDays[i][1], 
					preDate: curDays[i-1][0], 
					preWeek: curDays[i-5-curDays[i][1]][0],
					preMonday: curDays[i-4-curDays[i][1]][0],
					preFriday: curDays[i-0-curDays[i][1]][0],
					nextMonth: Tools.toDate(nextYear, nextMonth, Tools.monthCount[nextMonth-1]),
					holiday: '',
				};
				for (let j in this.holiday) {
					if (curDays[i][0] == this.holiday[j].split(',')[0]) {
						json.holiday = this.holiday[j].split(',')[1];
						break;
					}
				}
				Tools.days.push(json);
			}
		}
		Tools.setItem('days', Tools.days);
	}



	this.creatMonth = function() {
		table2.innerHTML = '';
		let tr = Tools.creatElem('tr', table2, 'tr');
		for (let i=1;i<Tools.days[0].week;i++) {
			let td = Tools.creatElem('td', tr, 'td');
		}
		for (let i in Tools.days) {
			let data = Tools.days[i];
			if (data.week == 1)
				tr = Tools.creatElem('tr', table2, 'tr', data.week);
			let td = Tools.creatElem('td', tr, 'td', data.date);
			td.setAttribute('type', 'normal');
			td.setAttribute('year', Tools.year);
			td.idx = Tools.toIdx(data.date);
			let date = Tools.creatElem('div', td, 'date');
			date.innerHTML = data.date.split('年')[1];
			if (data.holiday) {
				this.link(td, data, data.holiday, data.holiday);
				continue;
			}
			let div = Tools.creatElem('div', td, 'button');
			let btn = Tools.creatElem('button', div, 'btn');
			btn.setAttribute('big', 1);
			btn.innerHTML = Source.doneText[Tools.ztDone(td.idx)] + '<br/>';
			btn.idx = ~~i;
			btn.onclick = function() {
				Tools.setQuery(this.idx);
			}
			this.link(td, data, this.zhangtingStr(data),'ZT');
			this.link(td, data, this.huatuoDayStr(data),'FZ');
			// this.link(td, data, this.erfenStr(data),'EFF');
			this.link(td, data, this.xinqijiDayStr(data),'XQJ');
			this.link(td, data, this.huoqubingDayStr(data),'HQB');
			if (data.week == 1) {
				this.link(td, data, this.lishizhenWeekStr(data), 'LSZ');
			}
			if (data.week == 5) {
				this.link(td, data, this.sickWeekStr(data),'BB');
			}
		}
	}



	this.link = function(td, data, word, key) {
		data[key] = word;
		let a = Tools.creatElem('a', td, key, td.idx);

		a.setAttribute('year', Tools.year);
		a.href = Source.href.replace('#word', word);
		a.text = Source.linkTexts[key] || key;
		a.word = word;
		if (td.idx) {
			a.idx = td.idx;
			a.key = key;
			a.innerHTML = a.text + '(' + Tools.getDaily(a.idx, a.key, 1) + ')<br/>';
		} else {
			a.innerHTML = a.text + '(-)<br/>';
			return;
		}

		a.onclick = function() {
			Tools.setBase('lastIdx', this.idx);
			Tools.setBase('lastKey', this.key);
		}
		a.onmouseover = function() {
			Wencai.isclear = 0;
			msgbox.innerHTML = this.word;
			Wencai.msgbox.innerHTML = Tools.getDaily(this.idx, 'date') + ' ' + this.text;
			let array = Tools.getDaily(this.idx, this.key);
			for (let i in array) {
				let tr = Tools.creatElem('tr', Wencai.table3, this.key);
				for (let j in array[i]) {
					if (j > 2) continue;
					let td = Tools.creatElem('td', tr, this.key);
					td.setAttribute('type', 'mini');
					td.innerHTML = array[i][j];
				}
			}
		}
		a.onmouseout = function() {
			if (Tools.base.isMoblie) 
				return;
			Wencai.isclear = 1;
			setTimeout(function() {
				if (Wencai.isclear)
					msgbox.innerHTML = '';
			},3000);
			Wencai.msgbox.innerHTML = '';
			Wencai.table3.innerHTML = '';
		}
		if (a.idx == Tools.base.lastIdx && a.key == Tools.base.lastKey) {
			td.scrollIntoView(1);
			td.appendChild(this.save.parentNode);
			this.save.parentNode.style.display = 'block';
			this.save.onclick = function() {
				Wencai.saveInput(this);
			}
		}
	}

	this.saveInput =  function() {
		let array = Tools.toArray(this.input.value);
		let lastIdx = Tools.base.lastIdx;
		let lastKey = Tools.base.lastKey;
		if (lastKey == 'ZT') 
			Tools.setDaily('cur', 0);
		Tools.setDaily(lastKey, array);
		let a = Tools.getElem(lastKey + '_' + lastIdx);
		a.innerHTML = Source.linkTexts[a.key]+ '(' + Tools.getDaily(lastIdx, lastKey, 1) + ')<br/>';

		this.input.value = '';
		this.save.parentNode.style.display = 'none';
	}


	this.zhangtingStr = function(data) {
		return word.zhangting.
		replace(/{\n|\r|\t}/g,'').
		replace(/今天/g, data.date); 
	}

	this.sickDayStr = function(data) {
		return word.sickDay.
		replace(/{\n|\r|\t}/g,'').
		replace(/今天/g, data.date); 
	}

	this.sickWeekStr = function(data) {
		return word.sickWeek.
		replace(/{\n|\r|\t}/g,'').
		replace(/今天/g, data.date); 
	}

	this.lishizhenWeekStr = function(data) {
		return word.lishizhen.
		replace(/{\n|\r|\t}/g,'').
		replace(/今天/g, data.date).
		replace(/上上周/g, data.preWeek); 
	}

	this.xinqijiDayStr = function(data) {
		return word.xinqiji.
		replace(/{\n|\r|\t}/g,'').
		replace(/今天/g, data.date).
		replace(/昨天/g, data.preDate);  
	}

	this.huoqubingDayStr = function(data) {
		return word.huoqubing.
		replace(/{\n|\r|\t}/g,'').
		replace(/今天/g, data.date).
		replace(/昨天/g, data.preDate);  
	}

	this.huatuoDayStr = function(data) {
		return word.huatuo.
		replace(/{\n|\r|\t}/g,'').
		replace(/今天/g, data.date).
		replace(/昨天/g, data.preDate);  
	}

	this.erfenStr = function(data) {
		return word.erfen.
		replace(/{\n|\r|\t}/g,'').
		replace(/今天/g, data.date).
		replace(/昨天/g, data.preDate).
		replace(/上周一/g, data.preMonday).
		replace(/上周五/g, data.preFriday);
	}
}
	

let yearData = [
	['一季度', '3月31日', [1],[2],[3]],
	['二季度', '6月30日', [4],[5],[6]],
	['三季度', '9月30日', [7],[8],[9]],
	['四季度', '12月31日', [10],[11],[12]],
];

let word = {
	zhangting: `
		今天涨停,涨跌幅小于11,主板非st,
		今天的市值小于100亿`,
	sickDay: `
		今天的20日均线大于10日均线大于30日均线,
		今天的30日均线大于5日均线大于60日均线,
		今天至今涨跌幅,主板非st`,
	sickWeek: `
		今天的20周均线大于10周均线大于30周均线,
		今天的30周均线大于5周均线大于60周均线,
		今天至今涨跌幅,主板非st`,
	lishizhen: `
		上上周的20周均线大于10周均线大于30周均线,
		上上周的30周均线大于5周均线大于60周均线,
		上上周至今涨跌幅, 主板非st,今天开盘涨跌幅大于5,
		今天收盘价/上上周收盘价大于1.2`,
	xinqiji: `
		今天的涨停,涨跌幅小于11,主板非st, 
		昨天的20日均线大于10日均线大于5日均线, 
		昨天的20日均线大于30日均线大于60日均线`,
	huoqubing: `
		今天涨停,涨跌幅小于11,主板非st, 
		昨天的20日均线小于10日均线小于5日均线, 
		昨天的20日均线小于30日均线小于60日均线`,
	huatuo: `
		今天涨停,涨跌幅小于11,主板非st, 
		昨天的开盘价大于5日均线大于收盘价,
		昨天的开盘价大于10日均线大于收盘价,
		昨天的收盘价大于20日均线大于30日均线大于60日均线`,
	erfen: `
		今天最低价,(上周一开盘价＋上周五收盘价)/2,
		上周一开盘涨跌幅大于2,
		上周五周涨跌幅大于20,主板非st,`,
}




let holiday =`
2021年2月10日,春节
2021年2月11日,春节
2021年2月12日,春节
2021年2月15日,春节
2021年2月16日,春节
2021年2月17日,春节
2021年2月18日,春节
2021年4月5日,清明节
2021年5月3日,劳动节
2021年5月4日,劳动节
2021年5月5日,劳动节
2021年6月14日,端午节
2021年9月20日,中秋节
2021年9月21日,中秋节
2021年10月1日,国庆节
2021年10月4日,国庆节
2021年10月5日,国庆节
2021年10月6日,国庆节
2021年10月7日,国庆节
2022年1月3日,元旦
2022年1月31日,春节
2022年2月1日,春节
2022年2月2日,春节
2022年2月3日,春节
2022年2月4日,春节
2022年4月4日,清明节
2022年4月5日,清明节
2022年5月2日,劳动节
2022年5月3日,劳动节
2022年5月4日,劳动节
2022年6月3日,端午节
`;
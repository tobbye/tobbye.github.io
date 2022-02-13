
window.onload = function() {
    Tools.init();
	Wencai.init();
}

let Source = {
	href: 'http://www.iwencai.com/unifiedwap/result?w=#word',
	doneText: ['缺少数据', '未完成', '复盘完成'],
}

let Wencai = new __Wencai();
function __Wencai() {

	this.init = function() {
		this.load();
		this.creatYear();
		this.setMonth();
		this.creatMonth();
		this.creatConfig();
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
			for (let j in data.month) {

				let td = Tools.creatElem('td', tr, 'td', data[j]);
				td.setAttribute('type', 'normal');
				td.setAttribute('year', Tools.year);

				if (data.month[j] == 0) {
					let date = Tools.creatElem('div', td, 'date');
					date.innerHTML  = Tools.year + '年' + data.season;
					this.link(td, data, Tools.config[0]);
				} else {
					let date = Tools.creatElem('div', td, 'date');
					date.innerHTML  = Tools.year + '年' + data.month[j] + '月';
					this.link(td, data, Tools.config[1], data.month[j]);
					this.link(td, data, Tools.config[2], data.month[j]);
					let btn = Tools.creatElem('button',td, 'btn');
					btn.setAttribute('big', 1);
					btn.innerHTML = data.month[j] + '月详情';
				}
				td.month = data.month[j];
				td.onclick = function() {
					Tools.month = this.month;
					Tools.setBase('month', this.month);
					Wencai.setMonth();
					Wencai.creatMonth();
				}
			}
		}
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
		for (let i=1;i <=Tools.monthCount[nextMonth-1]; i++) {
			preDays.push(Tools.toDate(nextYear, nextMonth, i));
		}
		for (let i in preDays) {
			let week = i%7; 
			if (week>0 && week<6) {
				curDays.push([preDays[i], week]); 
			}
		}
		for (let i=0; i < curDays.length; i++) {
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
					nextDay1: curDays[i+1][0], 
					nextDay2: curDays[i+2][0],
					nextDay3: curDays[i+3][0],
					nextDay4: curDays[i+4][0],
					nextDay5: curDays[i+5][0],
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
				this.link(td, data);
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
			for (let j in Tools.config) {
				let cfg = Tools.config[j];
				for (let k in cfg.show) {
					if (data.week == cfg.show[k]) 
						this.link(td, data, cfg);
				}
			}
		}
	}



	this.link = function(td, data, cfg, month) {
		if (data.holiday) {
			let a = Tools.creatElem('a', td);
			a.innerHTML = data.holiday + '(-)<br/>';
			return;
		}
		let word = this.replaceStr(data, cfg.text, month);
		data[cfg.key] = word;
		let a = Tools.creatElem('a', td, cfg.key, td.idx);

		a.setAttribute('year', Tools.year);
		a.href = Source.href.replace('#word', word);
		a.name = cfg.name || cfg.key;
		a.word = word;
		if (td.idx) {
			a.idx = td.idx;
			a.key = cfg.key;
			a.innerHTML = a.name + '<h2>(' + Tools.getDaily(a.idx, a.key, 1) + ')<h2/>';
		} else {
			a.innerHTML = a.name + '(-)<br/>';
			return;
		}
		let count = Tools.getDaily(a.idx, a.key, 1);
		if ((a.key == 'TYKG' && count > 99) || (a.key == 'FJJS' && count < 20))
			a.setAttribute('type', 'cold');
		if ((a.key == 'TYKG' && count < 20) || (a.key == 'FJJS' && count > 99))
			a.setAttribute('type', 'hot');
		a.onclick = function() {
			Tools.setBase('lastIdx', this.idx);
			Tools.setBase('lastKey', this.key);
		}
		// a.onmouseover = function() {
		// 	Wencai.isclear = 0;
		// 	msgbox.innerHTML = this.word;
		// 	Wencai.msgbox.innerHTML = Tools.getDaily(this.idx, 'date') + ' ' + this.name;
		// 	let array = Tools.getDaily(this.idx, this.key);
		// 	for (let i in array) {
		// 		let tr = Tools.creatElem('tr', Wencai.table3, this.key);
		// 		for (let j in array[i]) {
		// 			if (j > 2) continue;
		// 			let td = Tools.creatElem('td', tr, this.key);
		// 			td.setAttribute('type', 'mini');
		// 			td.innerHTML = array[i][j];
		// 		}
		// 	}
		// }
		// a.onmouseout = function() {
		// 	if (Tools.base.isMoblie) 
		// 		return;
		// 	Wencai.isclear = 1;
		// 	setTimeout(function() {
		// 		if (Wencai.isclear)
		// 			msgbox.innerHTML = '';
		// 	},3000);
		// 	Wencai.msgbox.innerHTML = '';
		// 	Wencai.table3.innerHTML = '';
		// }
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
		a.innerHTML = a.innerHTML.replace(/\(-|\(\d*/, '(' + Tools.getDaily(lastIdx, lastKey, 1));

		this.input.value = '';
		this.save.parentNode.style.display = 'none';
	}


	this.replaceStr = function(data, text, month) {
        let monthDay = Tools.year + '年' + month + '月';
        let monthEnd = Tools.year + '年' + month + '月' + Tools.monthCount[month-1] + '日';
		return text.
		replace(/今天/g, data.date).
		replace(/昨天/g, data.preDate).
		replace(/后1天/g, data.nextDay1).
		replace(/后2天/g, data.nextDay2).
		replace(/后3天/g, data.nextDay3).
		replace(/后4天/g, data.nextDay4).
		replace(/后5天/g, data.nextDay5).
		replace(/上周一/g, data.preMonday).
		replace(/上周五/g, data.preFriday).
		replace(/上上周/g, data.preWeek).
		replace(/本月末/g, monthEnd).
		replace(/本月/g, monthDay).
		replace(/当前季度/g, Tools.year + '年' + data.season). 
		replace(/季度末/g, Tools.year + '年' + data.lastDay); 
	}

	this.creatConfig = function() {
		for (let i in Tools.config) {
			let cfg = Tools.config[i];
			if (!cfg) {
				let btn = Tools.creatElem('br', Tools.getElem('topper3'));
				continue;
			}
			cfg.text = cfg.text.replace(/\n|\r|\t|\s| /g,'');
			let btn = Tools.creatElem('button', Tools.getElem('topper3'));
			// btn.setAttribute('big', 1);
			btn.innerHTML = cfg.name;
			btn.cfg = JSON.stringify(cfg);
			btn.idx = i;
			btn.onclick = function() {
				Tools.getElem('content3').style.display = 'inline';
				Tools.getElem('textarea').value = this.cfg;
				Tools.cfgIdx = this.idx;
			}
			Tools.getElem('done').onclick = function() {
				Tools.config[Tools.cfgIdx] = JSON.parse(Tools.getElem('textarea').value);
				Tools.getElem('content3').style.display = 'none';
				Tools.setItem('config', Tools.config);
        		window.location.reload();
			}
		}
		Tools.setItem('config', Tools.config);
	}
}
	

let yearData = [
	{season: '一季度', lastDay: '3月31日', month: [0,1,2,3]},
	{season: '二季度', lastDay: '6月30日', month: [0,4,5,6]},
	{season: '三季度', lastDay: '9月30日', month: [0,7,8,9]},
	{season: '四季度', lastDay: '12月31日', month: [0,10,11,12]},
];



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

window.onload = function() {
	Wencai.init();
}

let daily;
let Wencai = new __Wencai();
function __Wencai() {

	this.href = 'http://www.iwencai.com/unifiedwap/result?w=#word';
	this.texts = {
		base: 'base',
		YGJLR: '预告净利润',
		QTDS: '蜻蜓点水',
		WLFC: '卧龙凤雏',
		JJJ: '尖尖角',
		JJG: '节节高',
		ZT: '涨停',
		ZJL: '反转',
		XQJ: '辛弃疾',
		HQB: '霍去病',
		LSZ: '李时珍',
		BB: '病变',
	};

	this.doneText = ['缺少数据', '未完成', '复盘完成'];

	this.init = function() {
		this.cfg();
		this.zoom();
		console.log(this);
	}

	this.cfg = function() {
		this.outer = this.getElem('outer');
		this.inner = this.getElem('inner');
		this.table1 = this.getElem('table1');
		this.table2 = this.getElem('table2');
		this.table3 = this.getElem('table3');
		this.msgbox = this.getElem('msgbox');
		this.write = this.getElem('write');
		this.input = this.getElem('input');
		this.save = this.getElem('save');
		this.base = this.getItem('base');
		this.year = this.base.year || 2021;
		this.month = this.base.month || 8;
		daily = this.getItem(this.year);
		console.log(daily);
		this.creatYear();
		this.setMonth();
		this.creatMonth();
	}




	this.setYear = function(year) {
		this.setBase('year', year);
        window.location.reload();
	}

	this.creatYear = function() {
		for (let i in yearData) {
			let data = yearData[i];
			data.push(this.advanceStr(data));
			let tr = this.creatElem('tr', table1, 'tr', data[0]);
			for (let j=0; j<4; j++) {
				let td = this.creatElem('td', tr, 'td', data[j]);
				td.setAttribute('type', 'normal');
				td.setAttribute('year', this.year);
				if (j == 0) {
					let date = this.creatElem('div', td, 'date');
					date.innerHTML  = this.year + '年' + data[0];
					this.link(td, data, this.advanceStr(data),'YGJLR');
				} else {
					let date = this.creatElem('div', td, 'date');
					date.innerHTML  = this.year + '年' + data[j+1][0] + '月';
					this.link(td, data[j+1], 1,'QTDS');
					this.link(td, data[j+1], 2,'WLFC');
					let btn = this.creatElem('button',td, 'btn');
					btn.setAttribute('big', 1);
					btn.innerHTML = data[j+1][0] + '月详情';
					btn.month = data[j+1][0];
					btn.onclick = function() {
						Wencai.month = this.month;
						Wencai.setMonth();
						Wencai.creatMonth();
						Wencai.setBase('month', this.month);
					}
				}

			}
		}
	}



	this.advanceStr = function(data) {
		return this.year+ data[0] + '预告净利润/' + this.year + '年' + data[1] + '市值前20';
	}

	this.monthCount = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];


	this.setMonth = function() {
		this.days = [];
		this.holiday = holiday.split('\n');
		if ((this.year % 400 === 0) || (this.year % 100 !== 0 && this.year % 4 === 0))
			this.monthCount[1] = 29;
		let preDays = [];
		let curDays = [];
		let preYear = this.year;
		let preMonth = this.month-1;

		if (this.month == 1) {
			preMonth = 12;
			preYear = this.year-1;
		}

		let date = new Date(preYear, preMonth-1, 1);
		for (let i=0;i <date.getDay(); i++) {
			preDays.push(0);
		}
		for (let i=1;i <=this.monthCount[preMonth-1]; i++) {
			preDays.push(preMonth + '月' + i + '日');
		}
		for (let i=1;i <=this.monthCount[this.month-1]; i++) {
			preDays.push(this.month + '月' + i + '日');
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
			 if(~~(curDays[i][0].split('月')[0]) == this.month) {
				let json = {
					date: curDays[i][0], 
					week: curDays[i][1], 
					preDate: curDays[i-1][0], 
					preWeek: curDays[i-5-curDays[i][1]][0],
					holiday: '',
				};
				for (let j in this.holiday) {
					if (this.year + '年' + curDays[i][0] == this.holiday[j].split(',')[0]) {
						json.holiday = this.holiday[j].split(',')[1];
						break;
					}
				}
				this.days.push(json);
			}
		}
		this.setItem('days', this.days);
	}



	this.creatMonth = function() {
		table2.innerHTML = '';
		let tr = this.creatElem('tr', table2, 'tr');
		for (let i=1;i<this.days[0].week;i++) {
			let td = this.creatElem('td', tr, 'td');
		}
		for (let i in this.days) {
			let data = this.days[i];
			if (data.week == 1)
				tr = this.creatElem('tr', table2, 'tr', data.week);
			let td = this.creatElem('td', tr, 'td', data.date);
			td.setAttribute('type', 'normal');
			td.setAttribute('year', this.year);
			td.idx = this.toIdx(this.year, data.date);
			let date = this.creatElem('div', td, 'date');
			date.innerHTML = data.date;
			if (data.holiday) {
				this.link(td, data, data.holiday, data.holiday);
				continue;
			}
			let div = this.creatElem('div', td, 'button');
			let btn = this.creatElem('button', div, 'btn');
			btn.setAttribute('big', 1);
			btn.innerHTML = this.doneText[this.ztDone(td.idx)] + '<br/>';
			btn.idx = td.idx;
			btn.onclick = function() {
				Wencai.setQuery(this.idx);
			}
			this.link(td, data, this.zhangtingStr(data),'ZT');
			this.link(td, data, this.huatuoDayStr(data),'ZJL');
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
		let a = this.creatElem('a', td, key, td.idx);

		a.setAttribute('year', this.year);
		a.href = this.href.replace('#word', word);
		a.text = this.texts[key] || key;
		a.word = word;
		if (td.idx) {
			a.idx = td.idx;
			a.key = key;
			a.innerHTML = a.text + '(' + this.getDaily(a.idx, a.key, 1) + ')<br/>';
		} else {
			a.innerHTML = a.text + '(-)<br/>';
			return;
		}

		a.onclick = function() {
			Wencai.setBase('lastIdx', this.idx);
			Wencai.setBase('lastKey', this.key);
		}
		if (a.idx == this.base.lastIdx && a.key == this.base.lastKey) {
			td.scrollIntoView(1);
			td.appendChild(this.save.parentNode);
			this.save.parentNode.style.display = 'block';
			this.save.onclick = function() {
				Wencai.saveInput(this);
			}
		}
	}

	this.saveInput =  function() {
		let array = this.toArray(this.input.value);
		let lastIdx = this.base.lastIdx;
		let lastKey = this.base.lastKey;
		if (lastKey == 'ZT') 
			this.setDaily('cur', 0);
		this.setDaily(lastKey, array);
		let a = this.getElem(lastKey + '_' + lastIdx);
		a.innerHTML = this.texts[a.key]+ '(' + this.getDaily(lastIdx, lastKey, 1) + ')<br/>';

		this.input.value = '';
		this.save.parentNode.style.display = 'none';
	}


	this.zhangtingStr = function(data) {
		return data.date + word[0] + data.date + word[1];
	}

	this.sickDayStr = function(data) {
		return data.date + word[8] + data.date + word[9] + 
		data.date + word[6];
	}

	this.sickWeekStr = function(data) {
		return data.date + word[10] + data.date + word[11] + 
		data.date + word[6];
	}

	this.lishizhenWeekStr = function(data) {
		return data.preWeek + word[10] + data.preWeek + word[11] + 
		data.preWeek + word[6] + 
		data.date + word[7] + 
		data.date + word[12] + data.preWeek + word[13];
	}

	this.xinqijiDayStr = function(data) {
		return data.date + word[0] +  
		data.preDate + word[14] + data.preDate + word[15];
	}

	this.huoqubingDayStr = function(data) {
		return data.date + word[0] +  
		data.date + word[16] + data.date + word[17];
	}

	this.huatuoDayStr = function(data) {
		return data.date + word[18] + 
		data.preDate + word[19] + data.preDate + word[20] +  
		data.preDate + word[21];  
	}

	this.setQuery = function(date) {
		let query = {
			date: date,
			cur: ~~this.getDaily(date, 'cur'),
			codes: this.getDaily(date, 'ZT'),
		}
		this.setItem('query', query);
		window.location.href = "stock.html";
	}


	this.toArray = function(str) {
		if (str.length<=10) return str;
		str = str.replace(/(?<=[^0-9 ]) /g, ',');
		let array = str.split(',');
		for (let i in array) {
			array[i] = array[i].split(' ');
		}
		return array;
	}

    this.toDate = function(idx) {
        return idx.substring(0,4) + '年' + idx[4]+idx[5] + '月' + idx[6]+idx[7] + '日';
    }

	this.toIdx = function(year, date) {
		date = date.replace('日','').split('月');
		return year+(date[0]>9?date[0]:'0'+date[0]) + (date[1]>9?date[1]:'0'+date[1]);
	}

	this.ztDone = function(idx) {
		if (!this.getDaily(idx, 'ZT'))
			return 0;
		if (this.getDaily(idx, 'cur') == this.getDaily(idx, 'ZT').length)
			return 2;
		else
			return 1;
	}



	this.getDaily = function(idx, key, islen) {
    	daily[idx] = daily[idx] || {date: this.toDate(idx)};
    	let val = daily[idx][key];
    	if (islen) {
    		if (typeof(val) === 'object')
    			return val.length;
    		if (typeof(val) === 'undefined')
    			return '-';
    	}
		return val || 0;
	}

    this.setDaily = function(key, val) {
        if (!key) return;
        let idx = this.base.lastIdx;
        daily[idx] = daily[idx] || {};
        daily[idx][key] = val;
        this.setItem(this.year, daily);
    }

    this.setBase = function(key, val) {
        if (!key) return;
        this.base[key] = val;
        this.setItem('base', this.base);
    }

    this.getItem = function(key) {
        key = 'daily' + key;
        return JSON.parse(eval(key) || localStorage.getItem(key)) || {};
    }

    this.setItem = function(key, item) {
        key = 'daily' + key;
        localStorage.setItem(key, JSON.stringify(item));
    }

	this.creatElem = function(type, parent, className, id) {
	    var e = document.createElement(type);
	    if (parent)
	        parent.appendChild(e);
	    if (className)
	        e.className = className;
	    if (id != null)
	        e.id = className + '_' + id;
	    return e;
	}

	this.getElem = function (e) {
	    if (typeof(e) === 'string')
	        return this.getElem(document.getElementById(e));
	    if (e &&  e.style)
	        return e;
	    return null;
	}

	this.zoom = function(z) {
    	this.isPhone = (/Android|webOS|iPhone|iPod|BlackBerry|Mobile|MIX/i.test(navigator.userAgent));
    	if (z) {
    		this.setBase('zoom', z);
			document.body.style.zoom = z;
    	} else {
    		document.body.style.zoom = this.base.zoom;
    	}
	}
}

let yearData = [
	['一季度', '3月31日', [1],[2],[3]],
	['二季度', '6月30日', [4],[5],[6]],
	['三季度', '9月30日', [7],[8],[9]],
	['四季度', '12月31日', [10],[11],[12]],
];

let word = [
	'涨停,涨跌幅<11,换手率小于20,主板非st,',
	'的市值<100亿,',
	'的周涨跌幅大于0,',
	'的收盘价大于',
	'的收盘价小于',
	'的收盘价,',
	'至今涨跌幅,主板非st,',
	'开盘涨跌幅大于5,',
	'的20日均线大于10日均线大于30日均线,',
	'的30日均线大于5日均线大于60日均线,',
	'的20周均线大于10周均线大于30周均线,',
	'的30周均线大于5周均线大于60周均线,',
	'的开盘价/',
	'的收盘价大于1.2,',
	'的20日均线大于10日均线大于5日均线,',
	'的20日均线大于30日均线大于60日均线,',
	'的20日均线小于10日均线小于5日均线,',
	'的20日均线小于30日均线小于60日均线,',
	'的涨停,主板非st,',
	'开盘价>5日均线>收盘价,',
	'开盘价>10日均线>收盘价,',
	'收盘价>20日均线>30日均线>60日均线,',
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
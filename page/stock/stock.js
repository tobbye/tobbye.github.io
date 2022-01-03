window.onload = function() {
    Stock.init();
}


let Source = {
    head: ['序号', '代码', '名称', '开盘', '收盘', '涨跌幅', '压力位', '突破','日期'],
    periodStr: ['前一月','前一周','前一日'],
    period: ['hrefName', 'hrefDay', 'hrefWeek', 'hrefMonth'],
    hrefName: 'http://hq.sinajs.cn/list=#market#code',
    hrefDay: 'http://q.stock.sohu.com/hisHq?code=cn_#code&start=#start&end=#end&stat=1&order=A&period=d&callback=Stock.queryDay&rt=jsonp',
    hrefWeek: 'http://q.stock.sohu.com/hisHq?code=cn_#code&start=#start&end=#end&stat=1&order=A&period=w&callback=Stock.queryWeek&rt=jsonp',
    hrefMonth: 'http://q.stock.sohu.com/hisHq?code=cn_#code&start=#start&end=#end&stat=1&order=A&period=m&callback=Stock.queryMonth&rt=jsonp',
}

let VAL = {
    DATE:0,
    OPEN:1,
    CLOSE:2,
    DEEPTH:3,
    DEGREE:4,
    LOW:5,
    HIGH:6,
    VOL:7,
    AMOUNT:8,
    SWAPE:9,
    MA3:10,
    TOP:11,
    MID:12,
    BOT:13,
    LINE:14,
    CROSS:15,
}


let daily;

let Stock = new __Stock();
function __Stock() {

    this.doneText = ['自动复盘进行中...', '复盘进行中...', '自动复盘完成', '复盘完成', '缺少数据'];

    this.init = function() {
        this.cfg();
        this.zoom();
        console.log(this);
    }

    this.cfg = function() {
        this.inner = this.getElem('inner');
        this.outer = this.getElem('outer');
        this.input = this.getElem('input');
        this.tbody = this.getElem('tbody');
        this.thead = this.getElem('thead');
        this.head = document.getElementsByTagName('head')[0];
        this.dateMonth = [];
        this.dateWeek = [];
        this.dateDay = [];
        this.getQuery();
    }

    this.getQuery = function() {
        this.days = this.getItem('days');
        this.base = this.getItem('base');
        this.year = this.base.year || 2021;
        daily = this.getItem(this.year);
        let query = this.getItem('query');
        this.query = query;

        if (query.codes.length > query.cur) {
            this.cur = query.cur;
            this.end = query.date;
            this.start = [this.end-10000, this.end-20000, this.end-30000];
            this.code = query.codes[query.cur][1];
            this.codeName = query.codes[query.cur][2]; 
            this.initHREF();
            this.getElem('btn1').innerHTML = this.doneText[this.base.auto?0:1] + this.codeName;
        } else {
            this.base.lastIdx = query.date;
            this.setDaily('cur', query.cur);
            this.setDaily('ZT', query.codes);   
            this.getElem('btn1').innerHTML = this.doneText[this.base.auto?2:3];
            if (this.base.auto)
                this.autoNext(1);
        }
        if (!query.codes)
            this.getElem('btn1').innerHTML = this.doneText[4];
        this.creatDetail();
    }

    this.autoNext = function(offset, auto) {
        if (auto) {
            this.setBase('auto', !this.base.auto);
            return;
        }
        let date = this.query.date;
        for (let i in this.days) {
            let curDate = this.toIdx(this.year, this.days[~~i].date);
            if (this.days[~~i+offset] && curDate == date) {
                curDate = this.toIdx(this.year, this.days[~~i+offset].date);
                return this.setQuery(curDate);
            }
        }
    }


    this.setQuery = function(date) {
        let query = {
            date: date,
            cur: ~~this.getDaily(date, 'cur'),
            codes: this.getDaily(date, 'ZT'),
        }
        this.setItem('query', query);
        setTimeout(function(){
            window.location.href = "stock.html";
        },this.base.auto?500:0);
    }

    this.initHREF = function() {
        this.src = [];
        this.script = [];
        this.tbody.innerHTML = '';
        this.market = this.code[0] == '6'?'sh':'sz';
        for (let i in Source.period) {
            this.src[i] = Source[Source.period[i]]
            .replace('#market', this.market)
            .replace('#start', this.start[i])
            .replace('#code', this.code)
            .replace('#end', this.end);

            if (this.script[i]) 
                this.script[i].parentNode.removeChild(this.script);
            this.script[i] = this.creatElem("script", this.head);  
            this.script[i].type = "text/javascript";
            this.script[i].src = this.src[i];
        }
        setTimeout(function() {
            Stock.judge();
        }, 2000);
    }


    this.queryDay = function(res) {
        this.queryData(res[0].hq, 1);
    }

    this.queryWeek= function(res) {
        if (res[0])
            this.queryData(res[0].hq, 2);
    }

    this.queryMonth = function(res) {
        if (eval(res.status) == 2) 
            return alert('股票代码' + this.code + '不存在!');
        if (res[0])
            this.queryData(res[0].hq, 3);
    }

    this.query30Min = function(res) {
        console.log(res);
        this.queryData(res, 4);
    }

    this.query60Min = function(res) {
        this.queryData(res, 5);
    }

    this.queryData = function(origin, idx) {

        for (let i in origin) {
        	if (i==0) continue;
            origin[i][VAL.OPEN]  = eval(origin[i][VAL.OPEN]);
            origin[i][VAL.CLOSE] = eval(origin[i][VAL.CLOSE]);
            origin[i][VAL.LOW]   = eval(origin[i][VAL.LOW]);
            origin[i][VAL.HIGH]  = eval(origin[i][VAL.HIGH]);
            origin[i][VAL.DEEPTH]   = 0;
            if (idx == 1) {
                this.dateDay = origin;
            }
            if (idx == 2) {
                this.setLadd(origin,i);
                this.dateWeek = origin;
            }
            if (idx == 3) {
                this.dateMonth = origin;
            }
        }
    }

    this.judge = function() {
        let curDay = this.dateDay[this.dateDay.length-1] || [];
        let preDay = this.dateDay[this.dateDay.length-2] || [];
        let curWeek = this.dateWeek[this.dateWeek.length-1] || [];
        if (curWeek[VAL.LINE] && 
            curDay[VAL.CLOSE] > curWeek[VAL.LINE] && 
            preDay[VAL.CLOSE] < curWeek[VAL.LINE]) {
            curWeek[VAL.CROSS] = true;
        }
        this.curDay = curDay;
        this.curWeek = curWeek;
        this.next();
    }


    this.next = function() {
        if (this.curDay[VAL.OPEN]) {
            let query = this.getItem('query');
            let curCode = query.codes[query.cur];
            curCode.push(this.curDay[VAL.OPEN]);
            curCode.push(this.curDay[VAL.CLOSE]);
            curCode.push(this.curDay[VAL.DEGREE]);
            curCode.push(this.curWeek[VAL.LINE]);
            curCode.push(this.curWeek[VAL.CROSS]);
            curCode.push(query.date);
            query.codes[query.cur] = curCode;
            query.cur += 1;
            this.setItem('query', query);
        }
        window.location.reload();
    }


    this.creatDetail = function() {
        let codes = this.query.codes;
        this.thead.innerHTML = this.toDate(this.query.date) + ' · 涨停突破';
        this.tbody.innerHTML += '<tr head=1><td>' + Source.head.join('</td><td>') + '</td></tr>';
        for (let i in codes) {
            let tr = this.creatElem('tr', this.tbody, 'tr');
            if (codes[i][7] == true)
                tr.setAttribute('head', 1)
            let mix = codes[i][4] / codes[i][6];
            if (codes[i][6] && mix >1.1) {
                tr.setAttribute('head', 2)
                codes[i][7] = 'yes';
            }
            for (let j in codes[i]) {
                let td = this.creatElem('td', tr, 'td');
                td.innerHTML = codes[i][j];
            }
        }
    }


    this.getAVG = function(data, i, day) {
        if (i >= day-1) {
            let sum = 0;
            for (let j=0; j<day; j++) {
                sum += eval(data[i-j][VAL.CLOSE])/3;
                sum += eval(data[i-j][VAL.HIGH])/3;
                sum += eval(data[i-j][VAL.LOW])/3;
            }
            return this.to2f(sum / day);
        }
        return 0;
    }


    this.tDay = 30;
    this.bDay = 30; 
    this.lDay = 30; 
    this.setLadd = function(data, idx) {
        if (idx <= this.lDay)
            return [0,0,0,0];
        data[idx].push(this.getAVG(data, idx, 3));
        let top = 0;
        for (let i=idx-this.tDay; i<=idx; i++) {
            if (top < data[i][VAL.MA3]) {
                top = data[i][VAL.MA3];
            }
        }
        let bot = top;
        for (let i=idx-this.bDay; i<=idx; i++) {
            if (bot > data[i][VAL.MA3]) {
                bot = data[i][VAL.MA3];
            }
        }
        let high = 0;
        for (let i=idx-this.lDay; i<=idx; i++) {
            if (high < data[i][VAL.CLOSE]) {
                high = data[i][VAL.CLOSE];
            }
        }

        let mid = this.to2f(top/2 + bot/2);
        data[idx].push(top);
        data[idx].push(mid);
        data[idx].push(bot);
        if (high < top*1.15 && data[idx][VAL.TOP] == data[idx-8][VAL.TOP])
            data[idx][VAL.LINE] = this.to2f(top*1.1);
        if (!data[idx][VAL.LINE] && data[idx-1][VAL.LINE] && top <= data[idx-1][VAL.TOP])
            data[idx][VAL.LINE] = (data[idx-1][VAL.LINE]);
    }


    this.compary = function(a, b) {
        a = ~~a.replace(/-/g, '');
        b = ~~b.replace(/-/g, '');
        return a<= b;
    }

    this.to2f = function(val) {
        return ~~(val * 100) / 100;
    }


    this.copy = function(json) {
        return JSON.parse(JSON.stringify(json));
    }

    this.reverse = function(array){
       let newArr = [];
       for(let i=array.length-1; i>=0; i--){
           newArr[newArr.length] = this.copy(array[i]);
       }
       return newArr;
   }

    this.bubbleSort = function(arr) {
        let len = arr.length;
        for (let i = 0; i < len-1; i++) {
            for (let j = 0; j < len-1-i; j++) {
                if (this.earlyTime(arr[j].first_time, arr[j+1].first_time)) { 
                    let temp = this.copy(arr[j+1]);       
                    arr[j+1] = this.copy(arr[j]);
                    arr[j] = temp;
                }
            }
        }
        return arr;
    }

    this.earlyTime = function(t1, t2) {
        let s1 = parseInt(t1.replace(/:/g, ''));
        let s2 = parseInt(t2.replace(/:/g, ''));
        return s1 > s2;
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



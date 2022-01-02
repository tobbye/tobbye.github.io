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
        this.getCodes();
    }

    this.getCodes = function() {
        daily = JSON.parse(localStorage.getItem('daily')) || [];
        let json = JSON.parse(localStorage.getItem('queryCodes'));
        this.json = json;
        if (json.codes.length > json.cur) {
            this.cur = json.cur;
            this.end = json.date;
            this.start = [this.end-10000, this.end-20000, this.end-30000];
            this.code = json.codes[json.cur][1];
            this.codeName = json.codes[json.cur][2]; 
            this.initHREF();
            this.getElem('btn1').innerHTML = '复盘进行中... ' + this.codeName;
        } else {
            this.setDaily(json.date, 'cur', json.cur);
            this.setDaily(json.date, 'ZT', json.codes);   
            this.getElem('btn1').innerHTML = '复盘完成';
        }
        this.creatDetail();
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
            let json = JSON.parse(localStorage.getItem('queryCodes'));
            let curCode = json.codes[json.cur];
            curCode.push(this.curDay[VAL.OPEN]);
            curCode.push(this.curDay[VAL.CLOSE]);
            curCode.push(this.curDay[VAL.DEGREE]);
            curCode.push(this.curWeek[VAL.LINE]);
            curCode.push(this.curWeek[VAL.CROSS]);
            curCode.push(json.date);
            json.codes[json.cur] = curCode;
            json.cur += 1;
            localStorage.setItem('queryCodes',JSON.stringify(json)); 
        }
        window.location.reload();
    }


    this.reload = function() {

    }


    this.creatDetail = function() {
        this.thead.innerHTML = this.toDate(this.json.date) + ' · 涨停突破';
        this.tbody.innerHTML += '<tr head=1><td>' + Source.head.join('</td><td>') + '</td></tr>';
        for (let i in this.json.codes) {
            let tr = this.creatElem('tr', this.tbody, 'tr');
            if (this.json.codes[i][7] == true)
                tr.setAttribute('head', 1)
            let mix = this.json.codes[i][4] / this.json.codes[i][6];
            if (this.json.codes[i][6] && mix >1.1)
                this.json.codes[i][7] = 'yes';
            for (let j in this.json.codes[i]) {
                let td = this.creatElem('td', tr, 'td');
                td.innerHTML = this.json.codes[i][j];
                if (j == 7)
                    td.setAttribute('head',1);
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
    this.lDay = 50; 
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
        if (high < top*1.15 && data[idx-1][VAL.TOP] == data[idx-9][VAL.TOP])
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

    this.toDate = function(date) {
        return date.substring(0,4) + '年' + date[4]+date[5] + '月' + date[6]+date[7] + '日';
    }
    
    this.toIdx = function(year, date) {
        date = date.replace('日','').split('月');
        return year+(date[0]>9?date[0]:'0'+date[0]) + (date[1]>9?date[1]:'0'+date[1]);
    }

    this.ztDone = function(idx) {
        return this.getDaily(idx, 'cur') == this.getDaily(idx, 'ZT').length;
    }

    this.getDaily = function(idx, key, islen) {
        daily[idx] = daily[idx] || {};
        let val = daily[idx][key];
        if (typeof(val) === 'object' && islen)
            return val.length;
        else
            return val || '-';
    }

    this.setDaily = function(idx, key, val) {
        daily[idx] = daily[idx] || {};
        daily[idx][key] = val;
        localStorage.setItem('daily', JSON.stringify(daily));
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
            this.setDaily('base', 'zoom', z);
            document.body.style.zoom = z;
        } else {
            document.body.style.zoom = this.getDaily('base', 'zoom');
        }
    }
}



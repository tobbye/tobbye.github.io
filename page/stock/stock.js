window.onload = function() {
    Elem.agent();
    Stock.init();
}


let Source = {
    head: ['序号', '代码', '名称', '开盘', '收盘', '涨跌幅', '压力位', '上穿'],
    periodStr: ['前一月','前一周','前一日'],
    period: ['hrefName', 'hrefDay', 'hrefWeek', 'hrefMonth', 'href30Min', 'href60Min'],
    hrefName: 'http://hq.sinajs.cn/list=#market#code',
    hrefDay: 'http://q.stock.sohu.com/hisHq?code=cn_#code&start=20200101&end=#end&stat=1&order=A&period=d&callback=Stock.queryDay&rt=jsonp',
    hrefWeek: 'http://q.stock.sohu.com/hisHq?code=cn_#code&start=20190101&end=#end&stat=1&order=A&period=w&callback=Stock.queryWeek&rt=jsonp',
    hrefMonth: 'http://q.stock.sohu.com/hisHq?code=cn_#code&start=20180101&end=#end&stat=1&order=A&period=m&callback=Stock.queryMonth&rt=jsonp',
    href30Min: 'http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol=#market#code&scale=30&datalen=1023&callback=Stock.query30Min&rt=jsonp',
    href60Min: 'http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol=#market#code&scale=60&datalen=1023&callback=Stock.query60Min&rt=jsonp',
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




let Stock = new __Stock();
function __Stock() {


    this.init = function() {
        this.inner = Elem.get('inner');
        this.outer = Elem.get('outer');
        this.input = Elem.get('input');
        this.tbody = Elem.get('tbody');
        this.thead = Elem.get('thead');
        this.head = document.getElementsByTagName('head')[0];
        this.dateMonth = [];
        this.dateWeek = [];
        this.dateDay = [];
        this.loop = 280;
        this.getCode();
        console.log(this);
    }

    this.getCode = function() {
        let json = JSON.parse(localStorage.getItem('queryCodes'));
        this.json = json;
        if (json.codes.length > json.cur) {
            this.cur = json.cur;
            this.end = json.date;
            this.code = json.codes[json.cur][1];
            this.codeName = json.codes[json.cur][2]; 
            this.initHREF();
        }
        this.showData();
    }

    this.initHREF = function() {
        this.src = [];
        this.script = [];
        this.tbody.innerHTML = '';
        this.market = this.code[0] == '6'?'sh':'sz';
        for (let i in Source.period) {
            this.src[i] = Source[Source.period[i]]
            .replace('#market', this.market)
            .replace('#start', this.start)
            .replace('#code', this.code)
            .replace('#end', this.end);

            if (this.script[i]) 
                this.script[i].parentNode.removeChild(this.script);
            this.script[i] = Elem.creat("script", this.head);  
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
        this.reload();
    }


    this.reload = function() {
        let json = JSON.parse(localStorage.getItem('queryCodes'));
        let curCode = json.codes[json.cur];
        curCode.push(this.curDay[VAL.OPEN]);
        curCode.push(this.curDay[VAL.CLOSE]);
        curCode.push(this.curDay[VAL.DEGREE]);
        curCode.push(this.curWeek[VAL.LINE]);
        curCode.push(this.curWeek[VAL.CROSS]);
        json.codes[json.cur] = curCode;
        json.cur += 1;
        localStorage.setItem('queryCodes',JSON.stringify(json));
        window.location.reload();
    }


    this.showData = function() {
        this.thead.innerHTML = this.toDate(this.json.date) + ' · 涨停分析';
        this.tbody.innerHTML += '<tr><td>' + Source.head.join('</td><td>') + '</td></tr>';
        for (let i in this.json.codes) {
            let tr = Elem.creat('tr', this.tbody, 'tr');
            for (let j in this.json.codes[i]) {
                let td = Elem.creat('td', tr, 'td');
                td.innerHTML = this.json.codes[i][j];
            }
        }
    }

    this.toDate = function(date) {
        return date.substring(0,4) + '年' + date[4]+date[5] + '月' + date[6]+date[7] + '日';
    }


    this.zdf = function(data, i) {
        return data[i][TAL.CLOSE]/data[i-1][TAL.CLOSE];
    }

    this.isYang = function(data) {
    	return data[TAL.CLOSE]>=data[TAL.OPEN];
    }

    this.isZtb = function(data) {
    	return this.zdf > 1.096 && data[TAL.CLOSE]==data[TAL.HIGH];
    }


    this.getMin = function(arr) {
        let min = arr[0];
        for (let i in arr) {
            if (arr[i] < min)
                min = arr[i]
        }
        return min;
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
            data[idx].push(this.to2f(top*1.1));
        if (!data[idx][VAL.LINE] && data[idx-1][VAL.LINE] && top <= data[idx-1][VAL.TOP])
            data[idx].push(data[idx-1][VAL.LINE]);
    }

    this.getLine = function() {

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

}

 //元素
var  Elem = {};

//创建一个元素
Elem.creat = function(type, parent, className, id) {
    var e = document.createElement(type);
    if (parent)
        parent.appendChild(e);
    if (className)
        e.className = className;
    if (id != null)
        e.id = className + '_' + id;
    return e;
}

//获取当个元素
Elem.get = function (e) {
    if (typeof(e) === 'string')
        return Elem.get(document.getElementById(e));
    if (e &&  e.style)
        return e;
    return null;
}

Elem.agent = function() {
    let isPhone = (/Android|webOS|iPhone|iPod|BlackBerry|MIX/i.test(navigator.userAgent));
    if (isPhone)
        document.body.style.fontSize = '24px';
    else
        document.body.style.fontSize = '15px';
}


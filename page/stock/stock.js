window.onload = function() {
    Tools.init();
    Stock.init();
}


let Source = {
    head: ['序号', '代码', '名称', '开盘', '收盘', '涨跌幅', '压力位','类型', '突破'],
    doneTexts: ['自动复盘进行中...', '复盘进行中...', '自动复盘完成', '复盘完成', '缺少数据'],
    periodTexts: ['前一月','前一周','前一日'],
    period: ['hrefName', 'hrefDay', 'hrefWeek', 'hrefMonth', 'href30Min'],
    hrefName: 'http://hq.sinajs.cn/list=#market#code',
    hrefDay: 'http://q.stock.sohu.com/hisHq?code=cn_#code&start=#start&end=#end&stat=1&order=A&period=d&callback=Stock.queryDay&rt=jsonp',
    hrefWeek: 'http://q.stock.sohu.com/hisHq?code=cn_#code&start=#start&end=#end&stat=1&order=A&period=w&callback=Stock.queryWeek&rt=jsonp',
    hrefMonth: 'http://q.stock.sohu.com/hisHq?code=cn_#code&start=#start&end=#end&stat=1&order=A&period=m&callback=Stock.queryMonth&rt=jsonp',
    href30Min: 'http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol=#market#code&scale=30&datalen=1023&ma=no&callback=Stock.query30Min',
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
    PRESS:14,
    PTYPE:15,
    CROSS:16,
}

let TAL = {
    INDEX:0,
    CODE:1,
    NAME:2,
    OPEN:3,
    CLOSE:4,
    DEGREE:5,
    PRESS:6,
    PTYPE:7,
    CROSS:8,
    DATE:9,
    FUT1:10,
    FUT2:11,
    FUT3:12,
    FUT4:13,
    FUT5:14,
}

let Stock = new __Stock();
function __Stock() {

    this.init = function() {
        this.load();
        this.dateMonth = [];
        this.dateWeek = [];
        this.dateDay = [];
        this.getQuery();
        console.log(this);
    }

    this.load = function() {
        this.inner = Tools.getElem('inner');
        this.outer = Tools.getElem('outer');
        this.input = Tools.getElem('input');
        this.tbody = Tools.getElem('tbody');
        this.thead = Tools.getElem('thead');
        this.head = document.getElementsByTagName('head')[0];
    }

    this.getQuery = function() {
        let query = Tools.query;
        if (query.codes.length > query.cur) {
            this.cur = query.cur;
            this.end = query.end;
            this.start = [query.date, query.date-10000, query.date-20000, query.date-30000];
            this.code = query.codes[query.cur][1];
            this.codeName = query.codes[query.cur][2]; 
            this.initHREF();
            Tools.getElem('btn1').innerHTML = Source.doneTexts[Tools.base.auto?0:1] + this.codeName;
        } else {
            Tools.base.lastIdx = query.date;
            Tools.setDaily('cur', query.cur);
            Tools.setDaily('ZT', query.codes);   
            Tools.getElem('btn1').innerHTML = Source.doneTexts[Tools.base.auto?2:3];
            if (Tools.base.auto)
                this.autoNext(1);
        }
        if (!query.codes)
            Tools.getElem('btn1').innerHTML = Source.doneTexts[4];
        this.creatDetail();
    }

    this.autoNext = function(offset, auto) {
        if (auto) {
            Tools.setBase('auto', !Tools.base.auto);
            return;
        }
        let query = Tools.query;
        query.idx += offset;
        if (query.idx > -1 && query.idx < Tools.days.length) {
            Tools.setQuery(query.idx);
        }
    }


    this.initHREF = function() {
        this.src = [];
        this.script = [];
        this.tbody.innerHTML = '';
        this.market = this.code[0] == '6'?'sh':'sz';
        for (let i in Source.period) {
            this.src[i] = Source[Source.period[i]]
            .replace('#market', this.market)
            .replace('#code', this.code)
            .replace('#start', this.start[i])
            .replace('#end', this.end);

            if (this.script[i]) 
                this.script[i].parentNode.removeChild(this.script);
            this.script[i] = Tools.creatElem("script", this.head);  
            this.script[i].type = "text/javascript";
            this.script[i].src = this.src[i];
        }
        setTimeout(function() {
            Stock.judge();
        }, 1000);
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
                this.setLadder(origin,i);
                this.dateWeek = origin;
            }
            if (idx == 3) {
                this.dateMonth = origin;
            }
        }
    }

    this.judge = function() {
        let curDay = [];
        let preDay = [];
        let curWeek = [];
        for (i = this.dateDay.length-1; i>=0; i--) {
            let day = this.dateDay[i];
            if (Tools.compare(day[VAL.DATE], Tools.query.date)) {
                this.dayIdx = i;
                curDay = this.dateDay[i] || curDay;
                preDay = this.dateDay[i-1] || preDay;
                break;
            }
        }
        for (i = this.dateWeek.length-1; i>=0; i--) {
            let week = this.dateWeek[i];
            if (Tools.compare(week[VAL.DATE], Tools.query.date)) {
                this.weekIdx = i;
                curWeek = this.dateWeek[i] || curWeek;
                break;
            }
        }
        if (curWeek[VAL.PRESS] && 
            curDay[VAL.CLOSE] > curWeek[VAL.PRESS] && 
            preDay[VAL.CLOSE] < curWeek[VAL.PRESS]) {
            curWeek[VAL.CROSS] = true;
        }
        this.curDay = curDay;
        this.curWeek = curWeek;
        this.nextCode();
    }

    this.futureDegree = function() {
        this.future = [];
        for (let i=1; i<6; i++) {
            let day = this.dateDay[this.dayIdx+i];
            if (day)
                this.future.push(day[VAL.DEGREE]);
        }
    }


    this.nextCode = function() {
        if (this.curDay[VAL.OPEN]) {
            this.futureDegree();
            let query = Tools.query;
            let curCode = query.codes[query.cur];
            curCode[TAL.OPEN]   = this.curDay[VAL.OPEN];
            curCode[TAL.CLOSE]  = this.curDay[VAL.CLOSE];
            curCode[TAL.DEGREE] = this.curDay[VAL.DEGREE];
            curCode[TAL.PRESS]  = this.curWeek[VAL.PRESS];
            curCode[TAL.PTYPE]  = this.curWeek[VAL.PTYPE];
            curCode[TAL.CROSS]  = this.curWeek[VAL.CROSS];
            curCode[TAL.DATE]   = query.date;
            if (this.isFuture) {
                curCode[TAL.FUT1]  = this.future[0];
                curCode[TAL.FUT2]  = this.future[1];
                curCode[TAL.FUT3]  = this.future[2];
                curCode[TAL.FUT4]  = this.future[3];
                curCode[TAL.FUT5]  = this.future[4];
            }
            query.codes[query.cur] = curCode;
            query.cur += 1;
            Tools.setItem('query', query);
        }
        window.location.reload();
    }


    this.creatDetail = function() {
        if (!Tools.base.isMobile) 
            Source.head.push('日期');
        let codes = Tools.query.codes;
        this.thead.innerHTML = Tools.toDate(Tools.query.date) + ' · 涨停突破';
        this.tbody.innerHTML += '<tr head=1><td>' + Source.head.join('</td><td>') + '</td></tr>';
        for (let i in codes) {
            let tr = Tools.creatElem('tr', this.tbody, 'tr');
            if (codes[i][TAL.CROSS] == true)
                tr.setAttribute('head', 1)
            let upper = codes[i][TAL.CLOSE] / codes[i][TAL.PRESS];
            if (codes[i][TAL.PRESS] && upper >1.1) {
                tr.setAttribute('head', 2)
                codes[i][TAL.CROSS] = 'YES';
            }
            for (let j in codes[i]) {
                if (Tools.base.isMobile && j == TAL.DATE)
                    continue;
                let td = Tools.creatElem('td', tr, 'td');
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
            return Tools.to2f(sum / day);
        }
        return 0;
    }


    this.tDay = 30;
    this.bDay = 30; 
    this.lDay = 30; 
    this.setLadder = function(data, idx) {
        if (idx <= this.lDay)
            return [0,0,0,0];
        data[idx][VAL.MA3] = this.getAVG(data, idx, 3);
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

        let mid = Tools.to2f(top/2 + bot/2);
        data[idx][VAL.TOP] = top;
        data[idx][VAL.MID] = mid;
        data[idx][VAL.BOT] = bot;
        if (high < top*1.15 && data[idx][VAL.TOP] == data[idx-8][VAL.TOP]) {
            data[idx][VAL.PRESS] = Tools.to2f(top*1.1);
            data[idx][VAL.PTYPE] = 1;
        }
        //压力位向后传递
        if (!data[idx][VAL.PRESS] && data[idx-1][VAL.PRESS]) {
            //收盘小于前压力位,压力位向后传递
            if (data[idx][VAL.CLOSE] <= data[idx-1][VAL.PRESS]) {
                data[idx][VAL.PRESS] = (data[idx-1][VAL.PRESS]);
                data[idx][VAL.PTYPE] = 2;
            }
            //顶部小于前顶部,压力位向后传递
            if (data[idx][VAL.TOP] <= data[idx-1][VAL.TOP]) {
                data[idx][VAL.PRESS] = (data[idx-1][VAL.PRESS]);
                data[idx][VAL.PTYPE] = 3;   
            }
        }
        return [top, mid, bot];
    }
}



window.onload = function() {
    Tools.init();
    Stock.init();
}


let Source = {
    head: ['序号','代码','名称','开盘','收盘','涨跌幅','顶部','上影线','超越','高开','板','未来1','未来2','未来3','未来4','未来5'],
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
    TOP:10,
    COUNT:11,
    CROSS:12,
}


let TAL = {
    INDEX:0,
    CODE:1,
    NAME:2,
    OPEN:3,
    CLOSE:4,
    DEGREE:5,
    TOP:6,
    COUNT:7,
    GAP:8,
    CROSS:9,
    BAN:10,
    FUT1:11,
    FUT2:12,
    FUT3:13,
    FUT4:14,
    FUT5:15,
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
            this.inQuery = 1;
            this.cur = query.cur;
            this.end = query.end;
            this.start = [query.date, query.date-10000, query.date-20000, query.date-30000];
            this.code = query.codes[query.cur][1];
            this.codeName = query.codes[query.cur][2]; 
            this.initHREF();
            Tools.getElem('btn-auto').innerHTML = Source.doneTexts[Tools.base.auto?0:1] + this.codeName;
            Tools.getElem('btn-clear').innerHTML = '重新=' + (Tools.base.clear?'是':'否');
            Tools.getElem('btn-order').innerHTML = '未来=' + (Tools.base.order?'是':'否');
        } else {
            this.inQuery = 0;
            Tools.base.lastIdx = query.date;
            Tools.setDaily('cur', query.cur);
            Tools.setDaily('ZT', query.codes);   
            Tools.getElem('btn-auto').innerHTML = Source.doneTexts[Tools.base.auto?2:3];
            if (Tools.base.auto)
                this.autoNext(1);
        }
        if (!query.codes)
            Tools.getElem('btn-auto').innerHTML = Source.doneTexts[4];
        this.creatBody();
    }

    this.autoNext = function(offset) {
        let query = Tools.query;
        query.idx += offset;
        if (query.idx <= 0) 
            query.idx = 0;
        if (query.idx >= Tools.days.length) 
            query.idx = Tools.days.length - 1;
        Tools.setQuery(query.idx);
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
                console.log(Tools.query.week)
                if (Tools.query.week == 5)
                    this.weekIdx = i - 1;
                curWeek = this.dateWeek[this.weekIdx] || curWeek;
                break;
            }
        }
        curDay[VAL.CROSS] = Tools.to2f(preDay[VAL.OPEN]/curWeek[VAL.TOP]*100-100) + '%';
        this.preDay = preDay;
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
            else
                this.future.push('null');
        }
    }

    this.BANount = function() {
        let count = 0;
        for (let i = this.dayIdx; i>=0; i--) {
            let day = this.dateDay[i];
            if (~~(day[VAL.DEGREE].replace('%','')*100)>980 && day[VAL.HIGH] == day[VAL.CLOSE]) {
                count ++;
            } else {
                return count;
            }
        }  
        return count;
    }


    this.nextCode = function() {
        if (this.curDay[VAL.OPEN]) {
            this.futureDegree();
            let query = Tools.query;
            let curCode = query.codes[query.cur];
            curCode[TAL.OPEN]   = this.curDay[VAL.OPEN];
            curCode[TAL.CLOSE]  = this.curDay[VAL.CLOSE];
            curCode[TAL.DEGREE] = this.curDay[VAL.DEGREE];
            curCode[TAL.TOP]  = this.curWeek[VAL.TOP];
            curCode[TAL.COUNT]  = this.curWeek[VAL.COUNT];
            curCode[TAL.CROSS]  = this.curDay[VAL.CROSS];
            curCode[TAL.BAN]   = this.BANount();
            curCode[TAL.FUT1] = this.future[0];
            curCode[TAL.FUT2] = this.future[1];
            curCode[TAL.FUT3] = this.future[2];
            curCode[TAL.FUT4] = this.future[3];
            curCode[TAL.FUT5] = this.future[4];
            query.codes[query.cur] = curCode;
            query.cur += 1;
            console.log(query);
            Tools.setItem('query', query);
        }
        window.location.reload();
    }


    this.creatBody = function() {
        let codes = Tools.query.codes;
        for (let i in codes) {
            if (codes[i][TAL.COUNT]<4)
                codes[i][TAL.GAP] = '0%';
            else
                codes[i][TAL.GAP] = Tools.to2f(codes[i][TAL.CLOSE]/codes[i][TAL.TOP]*100-100) + '%';
        }
        if (!this.inQuery)
            codes = Tools.setOrder();
        this.thead.innerHTML = Tools.toDate(Tools.query.date) + ' · 涨停突破';
        this.tbody.innerHTML = '';
        let tr = Tools.creatElem('tr', this.tbody);
        for (let i in Source.head) {
            if (!Tools.base.future && i >= TAL.FUT1 && i <= TAL.FUT5) 
                continue;
            let td = Tools.creatElem('td', tr, 'td', i);
            let btn = Tools.creatElem('button', td, 'btn');
            btn.innerHTML = Source.head[i];
            btn.idx = i;
            btn.onclick = function() {
                let order = this.idx == Tools.base.orderIdx ? !Tools.base.order : true;
                Tools.setBase('order', order);
                Tools.setBase('orderIdx', this.idx);
                Stock.creatBody();
            }
        }
        this.creatCell(codes);
    }

    this.creatCell = function(codes) {
        for (let i in codes) {
            codes[i][TAL.INDEX] = ~~i+1;
            let tr = Tools.creatElem('tr', this.tbody, 'tr');
            let upper = codes[i][TAL.CLOSE] / codes[i][TAL.TOP];
            for (let j in codes[i]) {
                if (!Tools.base.future && j >= TAL.FUT1 && j <= TAL.FUT5) 
                    continue;
                let td = Tools.creatElem('td', tr, 'td');
                td.innerHTML = codes[i][j];
                if (codes[i][TAL.OPEN] == codes[i][TAL.CLOSE] && (j == TAL.OPEN || j == TAL.CLOSE))
                    td.setAttribute('back', 'blue');
                if (j == TAL.DEGREE || j == TAL.GAP || j == TAL.CROSS || j >= TAL.FUT1 && j <= TAL.FUT5) {
                    let deg = Tools.to2f(codes[i][j].replace('%',''));
                    if (deg == 0)
                        td.setAttribute('back', 'black');
                    else if (deg > 18)
                        td.setAttribute('back', 'red');
                    else if (deg < -18)
                        td.setAttribute('back', 'green');
                    else if (deg > 0)
                        td.setAttribute('back', 'red2');
                    else if (deg < 0)
                        td.setAttribute('back', 'green2');
                } 
                if (j == TAL.SICK || j == TAL.LUCKY) {
                    if (codes[i][j] == true)
                        td.setAttribute('back', 'red')
                    else if (codes[i][j] == false)
                        td.setAttribute('back', 'green')
                }
                if (j == TAL.COUNT && codes[i][j]>3) {
                    td.setAttribute('back', 'red')
                }
                if (j == TAL.BAN) {
                    td.setAttribute('head', 'blue')
                }
            }
        } 
    }



    this.toggleState = function(key, btn) {
        Tools.setBase(key, !Tools.base[key]);
        window.location.reload();
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

    this.lDay = 50; //longDay
    this.setLadder = function(data, idx) {

        if (idx <= this.lDay)
            return [0,0];
        let top = 0;
        for (let i=idx-this.lDay; i<=idx; i++) {
            if (top < data[i][VAL.CLOSE]) {
                top = data[i][VAL.CLOSE];
            }
        }
        let count = 0;
        for (let i=idx-this.lDay; i<=idx; i++) {
            if (top < data[i][VAL.HIGH]) {
                count ++;
            }
        }

        data[idx][VAL.TOP] = top;
        data[idx][VAL.COUNT] = count;
        return [top, count];
    }



}



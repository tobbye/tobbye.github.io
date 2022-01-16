window.onload = function() {
    Tools.init();
    Stock.init();
}


let Source = {
    head: ['序号', '代码', '名称', '开盘', '收盘', '涨跌幅','祝福', '压力位','类', '超越','板','未来1','未来2','未来3','未来4','未来5'],
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

    MA5:10,
    MA10:11,
    MA20:12,
    MA30:13,
    MA60:14,
    HCLOSE:15,
    HIHIGH:16,
    NEXIST:17,
    FEXIST:18,
    EXIST:19,
    LUCKY:20,
}


let TAL = {
    INDEX:0,
    CODE:1,
    NAME:2,
    OPEN:3,
    CLOSE:4,
    DEGREE:5,
    CROSS:6,
    PRESS:7,
    PTYPE:8,
    GAP:9,
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
                this.setBoxer(origin,i);
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
        console.log(curDay[VAL.HHIGH],curDay[VAL.CLOSE]);
        if (curDay[VAL.EXIST] &&
            curDay[VAL.HCLOSE] == curDay[VAL.CLOSE] &&
            curDay[VAL.HHIGH] > curDay[VAL.CLOSE]) {
            curDay[VAL.LUCKY] = true;
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
            curCode[TAL.PRESS]  = this.curWeek[VAL.PRESS];
            curCode[TAL.PTYPE]  = this.curWeek[VAL.PTYPE];
            curCode[TAL.CROSS] = this.curDay[VAL.LUCKY];
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
            codes[i][TAL.GAP] = Tools.to2f(codes[i][TAL.CLOSE]/codes[i][TAL.PRESS]*100-100) + '%';
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
            let upper = codes[i][TAL.CLOSE] / codes[i][TAL.PRESS];
            for (let j in codes[i]) {
                if (!Tools.base.future && j >= TAL.FUT1 && j <= TAL.FUT5) 
                    continue;
                let td = Tools.creatElem('td', tr, 'td');
                td.innerHTML = codes[i][j];
                if (codes[i][TAL.OPEN] == codes[i][TAL.CLOSE] && (j == TAL.OPEN || j == TAL.CLOSE))
                    td.setAttribute('back', 'blue');
                if (j == TAL.DEGREE || j == TAL.GAP || j >= TAL.FUT1 && j <= TAL.FUT5) {
                    let deg = Tools.to2f(codes[i][j].replace('%',''));
                    if (deg == 0)
                        td.setAttribute('back', 'black');
                    else if (deg > 9.7)
                        td.setAttribute('back', 'red');
                    else if (deg < -9.7)
                        td.setAttribute('back', 'green');
                    else if (deg > 0)
                        td.setAttribute('back', 'red2');
                    else if (deg < 0)
                        td.setAttribute('back', 'green2');
                } 
                if (j >= TAL.PRESS && j <= TAL.GAP) {
                    if (codes[i][TAL.PRESS] && upper >1.1)
                        td.setAttribute('head', 'red')
                    else if (codes[i][TAL.PRESS] && upper >1.0)
                        td.setAttribute('head', 'orange')
                }
                if (j == TAL.CROSS || j == TAL.BAN) {
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

    this.tDay = 30; //topDay
    this.bDay = 30; //botDay
    this.lDay = 30; //longDay
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
            data[idx][VAL.PTYPE] = 'A';
        }
        //压力位向后传递
        if (!data[idx][VAL.PRESS] && data[idx-1][VAL.PRESS]) {
            //收盘小于前压力位,压力位向后传递
            if (data[idx][VAL.CLOSE] <= data[idx-1][VAL.PRESS]) {
                data[idx][VAL.PRESS] = (data[idx-1][VAL.PRESS]);
                data[idx][VAL.PTYPE] = 'B';
            }
            //顶部小于前顶部,压力位向后传递
            if (data[idx][VAL.TOP] <= data[idx-1][VAL.TOP]) {
                data[idx][VAL.PRESS] = (data[idx-1][VAL.PRESS]);
                data[idx][VAL.PTYPE] = 'C';   
            }
        }
        return [top, mid, bot];
    }


    this.nDay = 5;    //nearDay
    this.fDay = 15;   //farDay
    this.cDay = 120;  //closeDay
    this.hDay = 200;  //highDay
    this.setBoxer = function(data, idx) {
        if (idx <= this.hDay)
            return [0,0,0,0];
        let ma5  = this.getAVG(data, idx, 5);
        let ma10 = this.getAVG(data, idx, 10);
        let ma20 = this.getAVG(data, idx, 20);
        let ma30 = this.getAVG(data, idx, 30);
        let ma60 = this.getAVG(data, idx, 60);
        let hhigh = 0;
        let hclose = 0;
        for (let i=idx-this.hDay; i<=idx; i++) {
            if (hhigh < data[i][VAL.HIGH]) {
                hhigh = data[i][VAL.HIGH];
            }
        }
        for (let i=idx-this.cDay; i<=idx; i++) {
            if (hclose < data[i][VAL.CLOSE]) {
                hclose = data[i][VAL.CLOSE];
            }
        }
        let nexist = ~~(ma5 > ma10 && ma10 > ma30 && ma30 > ma20);
        let fexist = ~~(ma30 > ma20 && ma20 > ma10 && ma10 > ma5);
        data[idx][VAL.MA5]  = ma5;
        data[idx][VAL.MA10] = ma10;
        data[idx][VAL.MA20] = ma20;
        data[idx][VAL.MA30] = ma30;
        data[idx][VAL.MA60] = ma60;
        data[idx][VAL.HHIGH] = hhigh;
        data[idx][VAL.HCLOSE] = hclose;
        data[idx][VAL.NEXIST] = nexist;
        data[idx][VAL.FEXIST] = fexist;

        for (let i=idx-this.nDay; i<=idx; i++) {
            nexist += data[i][VAL.NEXIST];
        }
        for (let i=idx-this.fDay; i<=idx; i++) {
            fexist += data[i][VAL.FEXIST];
        }
        data[idx][VAL.EXIST] = nexist*fexist > 0;
    }
}



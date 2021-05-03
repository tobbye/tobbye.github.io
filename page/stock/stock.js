window.onload = function() {
    Elem.agent();
    Stock.init();
}


let Source = {
    dargon: {
        code: '600295',
        href:'http://static.tdx.com.cn:7615/site/tdxf10/gg_jyds/#code.html?vertype=1&style=black&gp=#code&ispc=1&8517=5390',
        content: function(code) {
            this.code = code || this.code;
            return this.href
            .replace('#code', this.code)
            .replace('#code', this.code);
        },
    },
    catchtop: {
        preDay: 1,
        aftDay: 1,

    },
    history: {
        rateTemp: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        href: 'http://q.stock.sohu.com/hisHq?code=cn_#code&start=#start&end=#end&stat=1&order=D&period=d&callback=Stock.getHistory&rt=jsonp',
        code: '600295',
        start: 20200501,
        end: 20880808,

        VAL: {
            DATE: 0, 
            OPEN: 1, 
            CLOSE: 2, 
            DEEPTH: 3, 
            DEGREE: 4, 
            LOW: 5, 
            HIGH: 6, 
            VOLUME: 7, 
            FUNDS: 8, 
            SWAP: 9,
            MLOW: 10,
            MHIGH: 11,
            DAY: 12,
            SELL_OPEN: 13,
            SELL_CLOSE: 14,
            SELL_HIGH: 15,
            SELL_LOW: 16,
            BUY: 17,
        },
        headStr: `
            <td>日期</td> 
            <td>开盘</td> 
            <td>收盘</td> 
            <td>涨跌额</td> 
            <td>涨跌幅</td> 
            <td>最低</td> 
            <td>最高</td> 
            <td>成交量</td> 
            <td>成交额</td> 
            <td>换手率</td>`,
        headStrAnd: `
            <td>持股天数</td> 
            <td>开盘卖出</td> 
            <td>收盘卖出</td> 
            <td>最高点卖出</td> 
            <td>最低点卖出</td> 
            <td>买入价格</td> `,

        content: function(code) {
            this.code = code || this.code;
            return this.href
            .replace('#code', this.code)
            .replace('#start', this.start)
            .replace('#end', this.end);
        },
    },

    top10: {},
    upper: {
        VAL: {
            INDEX: 0, 
            DATE: 1, 
            TSCODE: 2, 
            NAME: 3, 
            CLOSE: 4, 
            DEEPTH: 5, 
            DEGREE: 6, 
            FC: 7, 
            FL: 8, 
            FUND: 9, 
            FTIME: 10, 
            LTIME: 11, 
            OTIMES: 12,
            STRTH: 13, 
            LIMIT: 14
        },
        headStr: `
            <td>序号</td> 
            <td>日期</td> 
            <td>代码</td> 
            <td>名称</td> 
            <td>收盘</td> 
            <td>涨跌幅</td> 
            <td>振幅</td> 
            <td title='排队的封板金额/日成交金额'>恐惧贪婪指数</td> 
            <td title='封单手数/流通股本'>流通指数</td> 
            <td>封单金额</td> 
            <td>首次封板时间</td> 
            <td>最后封板时间</td> 
            <td>开板次数</td> 
            <td>封板强度</td> 
            <td>涨跌</td> `,
    },

    code_000: '000001',
    code_002: '002001',
    code_300: '300001',
    code_600: '600001',
    code_601: '601001',
    code_603: '603001',
    code_605: '605001',
}


let VAL, headStr;

let Stock = new __Stock();
function __Stock() {


    this.init = function() {
        this.inner = Elem.get('inner');
        this.outer = Elem.get('outer');
        this.input = Elem.get('input');
    }

    //获取JSON数据
    this.getJson = function(key) {
        let str = this.input.value;
        if (str.length > 100) {
            this.preDay = Source[this.mode].preDay;
            this.aftDay = Source[this.mode].aftDay; 
            this.getHistory(eval(str));
            return;
        }
        str = str.split('&');
        for (let i=0; i<str.length; i++) {
            let kv = str[i].split('=');
            if (kv[0] == 'code')
                this[kv[0]] = kv[1];
            else
                this[kv[0]] = eval(kv[1]);
        }
        let dargon = Elem.get('dargon');
        dargon.href = Source.dargon.content(this.code);
        let src = Source[key].content(this.code);
        this.addScript(src);
    }

    this.addScript = function(src) {
        console.log(src);
        let head = document.getElementsByTagName('head')[0];
        let script = Elem.creat("script", head);  
        script.type = "text/javascript";
        script.src = src;
    }

    //callback历史数据
    this.getHistory = function(res) {
        if (eval(res.status) == 2) 
            return alert('股票代码' + this.code + '不存在!');
        this.setStr('history');
        this.origin = res[0].hq;
        this.origin = this.calcMOVE(this.origin, 'HIGH');
        this.origin = this.calcMOVE(this.origin, 'LOW');
        this.data = this.copy(this.origin);
        this.showData(this.data);
    }



    this.showData = function(data) {
        let tbody = Elem.get('tbody');
        let tr = Elem.creat('tr', tbody, 'tr');
        tr.setAttribute('head', 1);
        tbody.innerHTML= '';
        tr.innerHTML = headStr;
        tbody.appendChild(tr);
        for (let i in data) {
            tr = Elem.creat('tr', tbody, 'tr');
            for (let j in data[i]) {
                if (j == VAL.MHIGH || j == VAL.MLOW)
                    continue;
                let td = Elem.creat('td', tr, 'td');

                if (j == VAL.DAY)
                    td.setAttribute('bg', 'day');
                if (j == VAL.DEEPTH || j == VAL.DEGREE) {
                    if (data[i][VAL.DEEPTH] > 0)
                        td.setAttribute('bg', 'up');
                    if (data[i][VAL.DEEPTH] < 0)
                        td.setAttribute('bg', 'down');
                }

                if (data[i][j]) {
                    td.innerHTML = data[i][j];
                    if (data[i][j].indexOf('col10') > -1)
                        td.colSpan = 10; 
                    if (data[i][j].indexOf('条件') > -1) {
                        td.colSpan = 5; 
                        td.setAttribute('bg', 'times');
                        td.setAttribute('align', 'left');
                    }
                    if (data[i][j].indexOf('次') > -1)
                        td.setAttribute('bg', 'times');
                    if (j == VAL.HIGH)
                        td.setAttribute('title', this.conStr(data[i], 'HIGH'));
                    if (j == VAL.LOW)
                        td.setAttribute('title', this.conStr(data[i], 'LOW'));
                } else {
                    td.innerHTML = '';
                }
            }
        }  
        console.log(this);
    }

    this.conStr = function(data, key) {
        let pos = this.move[key].pos;
        let move = this.move.days.join(', ');
        return key + '[' + move + '] = [' + data[pos].join(', ') + ']';

    }

    this.calcMOVE = function(data, key) {
        let pos = this.move[key].pos;
        for (let i=0; i<data.length;i++) {
            let move = [];
            for (let j in this.move.days) {
                move.push(this.fillMOVE(data, key, i, j));
            }
            data[i][pos] = move;
        }
        return data;
    }

    this.fillMOVE = function(data, key, i, j) {
        let func = this.move[key].func;
        let d = this.move.days[j];
        if (i<data.length - d)
            return this[func](data, i, d);
        else
            return this[func](data, i, data.length-i);
    }

    this.getMA = function(data, i, d) {
        let ma = 0;
        for (k=0; k<d; k++) {
            ma += eval(data[i+k][VAL.CLOSE]);
        }
        return (ma/d).toFixed(2);
    }

    this.getHIGH = function(data, i, d) {
        let high = 0;
        for (k=0; k<d; k++) {
            high = Math.max(data[i+k][VAL.HIGH], high);
        }
        return high.toString();
    }

    this.getLOW = function(data, i, d) {
        let high = 0;
        for (k=0; k<d; k++) {
            high = Math.max(data[i+k][VAL.LOW], high);
        }
        return high.toString();
    }


    this.setStr = function(key, mode) {
        this.count = 1;
        this.inAm = 0;
        this.rate = [];
        this.list = [];
        VAL = Source[key].VAL;
        headStr = Source[key].headStr;
        headStr += Source[key].headStrAnd;
        this.range = this.fillRange(this.range);
        console.log(this.range);
        this.preDay = this.range.length;

        if (mode) {
            this.aftDay = this.aftDay || Source[mode].aftDay;  
        }
        for (let i=0; i<this.aftDay; i++) {
            let rateTemp = this.copy(Source[key].rateTemp)
            this.rate.push(rateTemp);
        }
        this.markIdx = - this.preDay;
        this.move = {
            days: [5,10,15],
            LOW: {func:'getLOW', key:'LOW', find:VAL.LOW, pos:VAL.MLOW},
            HIGH: {func:'getHIGH', key:'HIGH', find:VAL.HIGH, pos:VAL.MHIGH},
        }
    }

    this.calcHistory = function(mode, multi) {
        this.mode = mode;
        this.multi = multi;
        this.setStr('history', mode);
        this.data = this.reverse(this.origin);
        this.ableDay = this.data.length-this.preDay-this.aftDay;
        for (let i=0; i < this.ableDay; i++) {
            //过滤已经选择的，下次操作需间隔preDay+aftDay
            if (i < this.markIdx+this.preDay+this.aftDay) 
                continue;
            if (this.modeSelect(this.data, i)) {
                this.list.push([0]);
                for (let j=0; j < this.preDay; j++) {
                    let startDay = this.data[i+j];
                    this.list.push(startDay);
                }
                for (let k=0; k < this.aftDay; k++) {
                    let endDay = this.data[i+k+this.preDay];
                    endDay = this.calcRate(endDay, i, k, this.cost);
                    this.list.push(endDay);
                }
                this.markIdx = i;
                this.count ++;
            }
        }
        this.avgRate();
        this.showData(this.list);
    }

    //模式选择
    this.modeSelect = function(data, i) {
        if (this.mode == 'sideway') {
            return this.checkSideWay(data, i);
        }
        return false;
    }


    //检查横盘震荡条件
    this.checkSideWay = function(data, i) {
        //过滤当日跌幅过大的
        let startDay = data[i+this.range.length-1];
        for (let j=0; j < this.range.length; j++) {
            let deg = this.toval(data[i+j][VAL.DEGREE]);
            if (deg < this.range[j][0] || deg > this.range[j][1]) {
                return false;
            }

            data[i+j][VAL.DAY] = '第' + this.count + '次';
            data[i+j][VAL.SELL_OPEN] = '查询条件: ' + this.range[j][0] 
            + '% <涨跌幅< ' + this.range[j][1] + '%';
        }
        if (this.inAm) {
            startDay = this.data[i+this.range.length];
            this.cost = startDay[VAL.OPEN];
        } else {
            this.cost = startDay[VAL.CLOSE];
        }
        return true;
    }


    this.calcRate = function(day, i, k, cost) {
        day = this.copy(day);
        let rate = this.rate[k];
        let r1 = this.to2f((day[VAL.OPEN]    - cost) / cost * 100);
        let r2 = this.to2f((day[VAL.CLOSE]  - cost) / cost * 100);
        let r3 = this.to2f((day[VAL.HIGH]  - cost) / cost * 100);
        let r4 = this.to2f((day[VAL.LOW] - cost) / cost * 100);
        day[VAL.DAY] = '第' + (k+1) + '天';
        day[VAL.SELL_OPEN]   =  r1 + '%';
        day[VAL.SELL_CLOSE] =  r2 + '%';
        day[VAL.SELL_HIGH] =  r3 + '%';
        day[VAL.SELL_LOW] =  r4 + '%';
        day[VAL.BUY] =  this.to2f(eval(cost));

        rate[VAL.DAY] = (k+1) + '天平均';
        rate[VAL.SELL_OPEN]    += eval(r1);
        rate[VAL.SELL_CLOSE]  += eval(r2);
        rate[VAL.SELL_HIGH]  += eval(r3);
        rate[VAL.SELL_LOW]  += eval(r4);
        return day;
    }

    this.avgRate = function(dayCount) {
        console.log(this.rate);
        for (let k=0; k<this.rate.length; k++) {
            let rate = this.rate[k];
            rate[VAL.SELL_OPEN]     = this.to2f(rate[VAL.SELL_OPEN]  / this.count / (k+1)) + '%';
            rate[VAL.SELL_CLOSE]   = this.to2f(rate[VAL.SELL_CLOSE] / this.count / (k+1)) + '%';
            rate[VAL.SELL_HIGH]   = this.to2f(rate[VAL.SELL_HIGH]  / this.count / (k+1)) + '%';
            rate[VAL.SELL_LOW]   = this.to2f(rate[VAL.SELL_LOW]   / this.count / (k+1)) + '%';
        }
        this.list = this.reverse(this.list);
        this.rate = this.reverse(this.rate);
        this.list.push.apply(this.list, this.rate);
    }



    this.fillRange = function(range) {
        if (range == 0 || range == [] || range == [0] || range == [0, 0]) 
            return [];
        if (typeof(range[0]) === 'object')
            return range;
        if (range.length == 1) {
            if (range[0] < 0) 
                return this.fillArr('dt', range[0]);
            else
                return this.fillArr(range[0], 'zt');
        }
        return this.fillArr(range[0], range[1]);
    }


    this.fillArr = function(a, b) {
        let arr = [];
        let arr1 = this.fillStr(a);
        let arr2 = this.fillStr(b);
        if (arr1.length == arr2.length) {
            for (let i=0; i<arr1.length; i++) 
                arr.push([arr1[i], arr2[i]]);
        } else if (arr1.length > arr2.length) {
            for (let i=0; i<arr1.length; i++)
                arr.push([arr1[i], arr2[0]]);
        } else {
            for (let i=0; i<arr2.length; i++)
                arr.push([arr1[0], arr2[i]]);
        }
        console.log(arr1, arr2);
        return arr;
    }


    this.fillStr = function(num) {
        let arr = [];
        if (num == 0) return [0];
        if (num == 'zt') return [21];
        if (num == 'dt') return [-21];
        let str = Math.abs(num).toString();
        for (let i=0; i<str.length; i++) {
            if (num > 0)
                arr.push(parseInt(str[i]));
            else
                arr.push(-parseInt(str[i]));
        }
        return arr;
    }



    this.upperList = function() {
        this.setStr('upper');
        this.data = this.bubbleSort(this.origin);
        this.showData(this.data);
    }

    this.toval = function(str) {
        return eval(str.replace('%',''))
    }


    this.toWan = function(str) {
        return ~~(parseInt(str) / 1e4) + 'w';
    }

    this.to2f = function(val) {
        return val.toFixed(2);
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
        for (let i = 0; i < len-1; i++) {
            arr[i].index = i + 1;
            arr[i].fd_amount = this.to2f(arr[i].fd_amount);
            arr[i].fc_ratio = this.to2f(arr[i].fc_ratio);
            arr[i].fl_ratio = this.to2f(arr[i].fl_ratio);
            arr[i].strth = this.to2f(arr[i].strth);
            arr[i].pct_chg += '%';
            arr[i].amp += '%';
            arr[i].limit = arr[i].limit.replace('U', '涨停').replace('D', '跌停');
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


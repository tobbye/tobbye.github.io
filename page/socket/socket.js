window.onload = function() {
    Socket.init();
}


let VAL, headStr;

let Socket = new __Socket();
function __Socket() {


    this.setStr = function(idx) {
        this.rateTemp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        if (idx == 0) {
            VAL = {DATE: 0, OPEN: 1, CLOSE: 2, DEEPTH: 3, DEGREE: 4, LOW: 5, HIGH: 6, VOLUME: 7, FUNDS: 8, SWAP: 9, MA5: 10, MA10: 11, MA20: 12};
            headStr = `<td>日期</td> <td>开盘</td> <td>收盘</td> <td>涨跌额</td> <td>涨跌幅</td> <td>最低</td> <td>最高</td> <td>成交量</td> <td>成交额</td> <td>换手率</td> <td>5日均线</td> <td>10日均线</td> <td>20日均线</td>`;
        } else if (idx == 1) {
            VAL = {DATE: 0, OPEN: 1, CLOSE: 2, DEEPTH: 3, DEGREE: 4, LOW: 5, HIGH: 6, VOLUME: 7, FUNDS: 8, SWAP: 9, MA5: 10, MA10: 11, MA20: 12, SELL_OPEN: 13, SELL_CLOSE: 14, SELL_HIGH: 15, SELL_LOW: 16, BUY: 17, DAY: 18};
            headStr = `<td>日期</td> <td>开盘</td> <td>收盘</td> <td>涨跌额</td> <td>涨跌幅</td> <td>最低</td> <td>最高</td> <td>成交量</td> <td>成交额</td> <td>换手率</td> <td>5日均线</td> <td>10日均线</td> <td>20日均线</td> <td>最高点卖出</td> <td>最低点卖出</td> <td>买入价格</td> <td>持股天数</td> `;
        } else if (idx == 2) {
            VAL = {INDEX: 0, DATE: 1, TSCODE: 2, NAME: 3, CLOSE: 4, DEEPTH: 5, DEGREE: 6, FC: 7, FL: 8, FUND: 9, FTIME: 10, LTIME: 11, OTIMES: 12,STRTH: 13, LIMIT: 14};
            headStr = `<td>序号</td> <td>日期</td> <td>代码</td> <td>名称</td> <td>收盘</td> <td>涨跌幅</td> <td>振幅</td> <td title='排队的封板金额/日成交金额'>恐惧贪婪指数</td> <td title='封单手数/流通股本'>流通指数</td> <td>封单金额</td> <td>首次封板时间</td> <td>最后封板时间</td> <td>开板次数</td> <td>封板强度</td> <td>涨跌</td> `;
        }
    }

    this.init = function() {
        this.inner = Elem.get('inner');
        this.outer = Elem.get('outer');
        this.input = Elem.get('input');
    }

    this.show = function(data) {
        let tbody = Elem.get('tbody');
        let tr = Elem.creat('tr', tbody, 'tr');
        tbody.innerHTML= '';
        tr.innerHTML = headStr;
        tbody.appendChild(tr);
        for (let i in data) {
            tr = Elem.creat('tr', tbody, 'tr');
            for (let j in data[i]) {
                let td = Elem.creat('td', tr, 'td');
                td.innerHTML = data[i][j] ? data[i][j]:'';
            }
        }  
    }



    this.orgin = function() {
        this.setStr(0);
        let data = this.parse();
        this.show(data);
    }

    this.parse = function() {
        let data = eval(this.input.value)[0].hq;
        for (let i=0; i<data.length;i++) {
            if (i<data.length - 5)
                data[i].push(this.getMA(5, data, i));
            else
                data[i].push(this.getMA(data.length-i, data, i));
            if (i<data.length - 10)
                data[i].push(this.getMA(10, data, i));
            else
                data[i].push(this.getMA(data.length-i, data, i));
            if (i<data.length - 20)
                data[i].push(this.getMA(20, data, i));
            else
                data[i].push(this.getMA(data.length-i, data, i));
        }
        return data;
    }


    this.getMA = function(d, data, i) {
        let ma = 0;
        for (k=0; k<d; k++) {
            ma += eval(data[i+k][VAL.CLOSE]);
        }
        return (ma/d).toFixed(2);
    }



    this.catchUpper = function(multi, succeed) {
        this.setStr(1);
        this.count = 0;
        this.list = [];
        this.rate = [];
        let data = this.parse();
        for (let i=0; i<data.length; i++) {
            if (i > 0 && i < data.length - 1) {
                let nextDay = this.copy(data[i-1]);
                let theDay = this.copy(data[i]);
                let preDay = this.copy(data[i+1]);
                let nextDeg = this.toval(nextDay[VAL.DEGREE]);
                let theDeg = this.toval(theDay[VAL.DEGREE]);
                let preDeg = this.toval(preDay[VAL.DEGREE]);
                if ((succeed && theDeg > 9) || (!succeed && theDeg > 6 && theDeg < 9)) {
                // if ((succeed && theDeg < -9) || (!succeed && theDeg < -6 && theDeg > -9)) {
                    let nextOpen = nextDay[VAL.OPEN];
                    let cost = theDay[VAL.CLOSE] - theDay[VAL.DEEPTH] * (1 - multi);
                    nextDay = this.calcRate(nextDay, 0, cost)
                    this.list.push(nextDay);
                    this.list.push(theDay);
                    this.list.push([0]);
                    this.count ++;
                }
            }
        }
        this.avgRate(this.count*2);
        this.show(this.list);
    }

    this.calcRate = function(day, k, cost) {

        let r1 = (day[VAL.OPEN]    - cost) / cost * 100;
        let r2 = (day[VAL.CLOSE]  - cost) / cost * 100;
        let r3 = (day[VAL.HIGH]  - cost) / cost * 100;
        let r4 = (day[VAL.LOW]  - cost) / cost * 100;
        day.push(this.to2f(r1));
        day.push(this.to2f(r2));
        day.push(this.to2f(r3));
        day.push(this.to2f(r4));
        day.push(eval(cost).toFixed(2));
        day.push('第' + (k+1) + '天');
        let rate = this.copy(this.rateTemp);
        rate[VAL.DAY] = (k+1) + '天平均';
        rate[VAL.SELL_OPEN]    += r1;
        rate[VAL.SELL_CLOSE]  += r2;
        rate[VAL.SELL_HIGH]  += r3;
        rate[VAL.SELL_LOW]  += r4;
        this.rate[k] = rate;
        return day;
    }

    this.avgRate = function(dayCount) {
        for (let k=0; k<this.rate.length; k++) {
            let rate = this.copy(this.rate[k]);
            rate[VAL.SELL_OPEN]     = this.to2f(rate[VAL.SELL_OPEN]  / this.count / (k+1));
            rate[VAL.SELL_CLOSE]   = this.to2f(rate[VAL.SELL_CLOSE] / this.count / (k+1));
            rate[VAL.SELL_HIGH]   = this.to2f(rate[VAL.SELL_HIGH]  / this.count / (k+1));
            rate[VAL.SELL_LOW]   = this.to2f(rate[VAL.SELL_LOW]   / this.count / (k+1));
            this.list.push(rate);
        }
    }


    this.action = function(preDay, inBot, aftDay) {
        this.setStr(1);
        this.markIdx = - preDay;
        this.count = 0;
        this.inAm = 0;
        this.list = [];
        this.rate = [];
        let data = this.parse();
        data = this.reverse(data);
        for (let i=0; i < data.length-preDay-aftDay; i++) {
            if (this.check(data, i, preDay, aftDay, inBot)) {
                let startDay =  data[i+preDay-1];
                let cost = startDay[VAL.CLOSE];
                if (this.inAm) {
                    startDay = data[i+preDay];
                    cost = startDay[VAL.OPEN];
                }
                for (let j=0; j < preDay; j++) {
                    this.list.push(data[i+j]);
                }
                for (let k=0; k < aftDay; k++) {
                    let endDay = data[i+k+preDay];
                    this.calcRate(endDay, k, cost);
                    this.list.push(endDay);
                }
                this.list.push([0]);
                this.markIdx = i;
                this.count ++;
            }
        }
        this.avgRate();
        this.show(this.list);
    }

    this.check = function(data, i, preDay, aftDay, inBot) {
        //过滤已经选择的，下次操作需间隔preDay+aftDay
        if (i < this.markIdx + preDay + aftDay) 
            return false;
        //过滤当日跌幅过大的
        let startDay = data[i+preDay-1];
        if (this.toval(startDay[VAL.DEGREE]) < -8) 
            return false;
        //过滤跌破均线的
        // if (this.toval(startDay[VAL.CLOSE]) < this.toval(startDay[VAL.MA5]))
        //     return false;
        //过滤preDay内跌幅较小的
        if (startDay[VAL.CLOSE] / data[i][VAL.OPEN] > 0.96)
            return false;
        for (let j=0; j < preDay; j++) {
            //过滤preDay内有上涨的
            if (this.toval(data[i+j][VAL.DEGREE]) * inBot > inBot) {
                return false;
            }
        }
        return true;
    }


    this.upperList = function() {
        this.setStr(2);
        let data = eval(this.input.value);
        data = this.bubbleSort(data);
        this.show(data);
    }

    this.toval = function(str) {
        return eval(str.replace('%',''))
    }


    this.toWan = function(str) {
        return ~~(parseInt(str) / 1e4) + 'w';
    }

    this.to2f = function(str) {
        return str.toFixed(2) + '%';
    }

    this.copy = function(json) {
        return JSON.parse(JSON.stringify(json));
    }

    this.reverse = function(array){
       let newArr = [];
       for(let i=array.length-1; i>=0; i--){
           newArr[newArr.length] = array[i];
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


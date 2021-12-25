window.onload = function() {
    Elem.agent();
    Stock.init();
}


let Source = {
    head: ['', '', '开盘', '收盘', '最低', '最高', '涨跌幅','九周期', 'N阳', '三阳'],
    periodStr: ['前一月','前一周','前一日'],
    period: ['hrefName', 'hrefDay', 'hrefWeek', 'hrefMonth', 'href30Min', 'href60Min'],
    hrefName: 'http://hq.sinajs.cn/list=#market#code',
    hrefDay: 'http://q.stock.sohu.com/hisHq?code=cn_#code&start=20200101&end=20880808&stat=1&order=A&period=d&callback=Stock.queryDay&rt=jsonp',
    hrefWeek: 'http://q.stock.sohu.com/hisHq?code=cn_#code&start=20190101&end=20880808&stat=1&order=A&period=w&callback=Stock.queryWeek&rt=jsonp',
    hrefMonth: 'http://q.stock.sohu.com/hisHq?code=cn_#code&start=20160101&end=20880808&stat=1&order=A&period=m&callback=Stock.queryMonth&rt=jsonp',
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
}

let TAL = {
    DATE:0,
    OPEN:1,
    CLOSE:2,
    LOW:3,
    HIGH:4,
    DEG:5,    

    MA5:6,
    MA10:7,
    MA20:8,
    MA30:9,
    MA60:10,
    NINESTATE:11,
    NINECOUNT:12,
    CURRSTATE:13,
}



let Stock = new __Stock();
function __Stock() {


    this.init = function() {
        this.inner = Elem.get('inner');
        this.outer = Elem.get('outer');
        this.input = Elem.get('input');
        this.tbody = Elem.get('tbody');
        this.name = Elem.get('name');
        this.dateMonth = [];
        this.dateWeek = [];
        this.dateDay = [];
        this.ninePeriod = [];
        this.loop = 280;
        this.initHREF();
        console.log(this);
    }

    this.initHREF = function() {
        this.src = [];
        this.script = [];
        this.head = document.getElementsByTagName('head')[0];
        this.code = localStorage.getItem('query-code');
        this.input.value = this.code;
        this.tbody.innerHTML = '';
        this.market = this.code[0] == '6'?'sh':'sz';
        this.nameEval = 'hq_str_' + this.market + this.code;
        for (let i in Source.period) {
            this.src[i] = Source[Source.period[i]]
            .replace('#market', this.market)
            .replace('#code', this.code);

            if (this.script[i]) 
                this.script[i].parentNode.removeChild(this.script);
            this.script[i] = Elem.creat("script", this.head);  
            this.script[i].type = "text/javascript";
            this.script[i].src = this.src[i];
        }
        setTimeout(function() {
            Stock.name.innerHTML = eval(Stock.nameEval).split(',')[0];
            Source.head[0] = Stock.code;
            Source.head[1] = Stock.name.innerHTML;
            Stock.tbody.innerHTML += '<tr idx=C6><td>' + Source.head.join('</td><td>') + '</td></tr>';
        }, 500);
        setTimeout(function() {
            Stock.curIdx = Stock.dateDay.length;
            Stock.calcData();
        }, 2000);
    }



    this.reload = function(isAll) {
    	this.isAll = isAll;
        localStorage.setItem('query-code',this.input.value);
        window.location.reload();
    }

    this.queryDay = function(res) {
        this.queryData(res[0].hq, 1);
    }

    this.queryWeek= function(res) {
        this.queryData(res[0].hq, 2);
    }

    this.queryMonth = function(res) {
        if (eval(res.status) == 2) 
            return alert('股票代码' + this.code + '不存在!');
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
        	let zdf = this.zdf(origin,i);
            let temp = [
                origin[i][VAL.DATE],
                eval(origin[i][VAL.OPEN]),
                eval(origin[i][VAL.CLOSE]),
                eval(origin[i][VAL.LOW]),
                eval(origin[i][VAL.HIGH]),
                ~~(10000*zdf-10000)/100 + '%',
                this.getMA(origin, i, 5),
                this.getMA(origin, i, 10),
                this.getMA(origin, i, 20),
                this.getMA(origin, i, 30),
                this.getMA(origin, i, 60),
            ];
            if (idx == 1) {
                this.dateDay.push(temp);
            }
            if (idx == 2) {
                this.dateWeek.push(temp);
            }
            if (idx == 3) {
                this.dateMonth.push(temp);
            }
        }
    }

    this.getMA = function(data, i, day) {
	    if (i >= day-1) {
	    	let sum = 0;
	    	for (let j=0; j<day; j++) {
	    		sum += eval(data[i-j][VAL.CLOSE]);
	    	}
	    	return ~~(100*sum / day)/100;
	    }
	    return 0;
    }

    this.Qtds = function(data,i) {
    	let ha = Math.max(data[i][TAL.MA20],data[i][TAL.MA30])<data[i][TAL.MA60];
    	let hb = data[i-1][TAL.CLOSE]<data[i-1][TAL.MA60];
    	let hc = data[i][TAL.CLOSE]>data[i][TAL.MA60] && this.zdf(data,i)>1.12;
    }

    this.zdf = function(data, i) {
    	return data[i][TAL.CLOSE]/data[i-1][TAL.CLOSE];
    }

    this.everyLess = function(data, i, a, b, day) {
    	for (let j=0; j<day; j++) {
    		if (Math.max(data[i-j][TAL.MA5],data[i][TAL.MA10])>data[i][TAL.MA60])
    			return 0;
    	}
    	return 1;
    }


    this.calcData = function() {
        this.curIdx += -1;
        this.curDay = this.curIdx;
        for (let i in this.dateWeek) {
            if (this.compary(this.dateDay[this.curIdx][VAL.DATE], this.dateWeek[i][VAL.DATE])) {
                this.curWeek = ~~i;
                break;
            }
        }
        for (let i in this.dateMonth) {
            if (this.compary(this.dateDay[this.curIdx][VAL.DATE], this.dateMonth[i][VAL.DATE])) {
                this.curMonth = ~~i;
                break;
            }
        }

        this.nineState = [];
        this.nineCount = [];
        this.currState = [];
        this.conString = [];
        if (!this.isAll && !this.isZtb(this.dateDay[this.curDay]))
        	return this.calcNext();
        this.getCount(this.dateMonth, this.curMonth,0);
        if (this.nineCount[0] < 6 || this.currState[0] == 0)
            return this.calcNext();
        this.getCount(this.dateWeek, this.curWeek, 1);
        if (this.nineCount[1] < 6 || this.currState[1] == 0)
            return this.calcNext();
        this.getCount(this.dateDay, this.curDay, 2);
        if (this.nineCount[2] < 6 || this.currState[2] == 0)
            return this.calcNext();

        this.content = '<tr><td></td></tr><tr><td></td><td>';
        this.content += this.dateDay[this.curDay].slice(0,6).join('</td><td>');
        if (!this.isZtb(this.dateDay[this.curDay-1]))
        	this.content += '</td><td>FIRST</td></tr>';
        else
        	this.content += '</td><td>SECOND</td></tr>';
        this.content += this.reverse(this.conString).join('');
        if (this.getMin(this.nineCount) <= 6)
            this.content = this.content.replace(/<tr/g, '<tr idx=C6');
        if (this.getMin(this.nineCount) == 7)
            this.content = this.content.replace(/<tr/g, '<tr idx=C7');
        if (this.getMin(this.nineCount) == 8) 
            this.content = this.content.replace(/<tr/g, '<tr idx=C8');
        this.tbody.innerHTML += this.content;
        this.tbody.lastChild.scrollIntoView();

        setTimeout(function() {
            Stock.calcNext();
        },20);  
    }

    this.calcNext = function() {
        if (this.dateDay.length - this.curIdx < 200) {
            this.calcData();
        } else {
            this.tbody.innerHTML += '<tr idx=C6><td>' + Source.head.join('</td><td>') + '</td></tr>';
        }
    }

    this.getMin = function(arr) {
        let min = arr[0];
        for (let i in arr) {
            if (arr[i] < min)
                min = arr[i]
        }
        return min;
    }


    this.getCount = function(data, idx, k) {
        this.nineState[k] = '';
        this.nineCount[k] = 0;
        for (i=idx-9;i<idx;i++) {
            this.nineState[k] += ~~this.isYang(data[i]);
            if (this.isYang(data[i]))
                this.nineCount[k] ++;
        }
        this.currState[k] = this.isYang(this.dateDay[this.curDay]);
        let temp = data[idx-1].slice(0,6);
        temp.push(this.nineState[k]);
        temp.push(this.nineCount[k]);
        temp.push(this.currState[k]);
        this.conString[k] = '<tr><td>' + Source.periodStr[k] + '</td><td>';
        this.conString[k] += temp.join('</td><td>') + '</td></tr>';
    }



    this.isYang = function(data) {
    	return data[TAL.CLOSE]>=data[TAL.OPEN];
    }

    this.isZtb = function(data) {
    	return data[TAL.CLOSE]==data[TAL.HIGH];
    }


    this.getHAL = function(data, idx) {
        let h = 0;
        for (let i=idx-20; i<idx; i++) {
            if (data[i][VAL.HIGH] > h)
                h = dat[i][VAL.HIGH];
        }
        let l = h;
        for (let i=idx-20; i<idx; i++) {
            if (data[i][VAL.LOW] < l)
                l = dat[i][VAL.LOW];
        }
        return [h, l];
    }



    this.compary = function(a, b) {
        a = ~~a.replace(/-/g, '');
        b = ~~b.replace(/-/g, '');
        return a<= b;
    }







    this.to2f = function(val) {
        return ~~(val * 100) / 100;
    }

    this.topct = function(val, cost) {

        return ~~((val - cost) / cost * 10000) / 100;
    }

    this.toval = function(str) {
        return eval(str.replace('%',''))
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


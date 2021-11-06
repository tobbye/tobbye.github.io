window.onload = function() {
    Elem.agent();
    Stock.init();
}


let Source = {
    period: ['hrefName', 'hrefDay', 'hrefWeek', 'hrefMonth'],
    href: 'http://q.stock.sohu.com/hisHq?code=cn_#code&',
    hrefName: 'http://hq.sinajs.cn/list=#code',
    hrefDay: 'start=20200101&end=20880808&stat=1&order=A&period=d&callback=Stock.queryDay&rt=jsonp',
    hrefWeek: 'start=20190101&end=20880808&stat=1&order=A&period=w&callback=Stock.queryWeek&rt=jsonp',
    hrefMonth: 'start=20190101&end=20880808&stat=1&order=A&period=m&callback=Stock.queryMonth&rt=jsonp',
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

let dateDay = []; 
let dateWeek = []; 
let dateMonth = []; 
let Stock = new __Stock();
function __Stock() {


    this.init = function() {
        this.inner = Elem.get('inner');
        this.outer = Elem.get('outer');
        this.input = Elem.get('input');
        this.name = Elem.get('name');
        this.log = Elem.get('log');
        this.initHREF();
        console.log(this);
    }


    this.reload = function(isAuto) {
        localStorage.setItem('query-code',this.input.value);
        window.location.reload();
    }

    this.initHREF = function() {
        this.src = [];
        this.script = [];
        this.head = document.getElementsByTagName('head')[0];
        this.code = localStorage.getItem('query-code');
        this.input.value = this.code;
        this.log.innerHTML = '';
        this.market = this.code[0] == '6'?'sh':'sz';
        this.nameEval = 'hq_str_' + this.market + this.code;
        for (let i in Source.period) {
            if (i == 0)
                this.src[i] = Source.hrefName.replace('#code', this.market + this.code);
            else
                this.src[i] = Source.href.replace('#code', this.code) + Source[Source.period[i]];
            if (this.script[i]) 
                this.script[i].parentNode.removeChild(this.script);
            this.script[i] = Elem.creat("script", this.head);  
            this.script[i].type = "text/javascript";
            this.script[i].src = this.src[i];
        }
        setTimeout(function() {
            Stock.name.innerHTML = eval(Stock.nameEval).split(',')[0];
        }, 200);
        setTimeout(function() {
            Stock.curIdx = dateDay.length;
            Stock.calcData();
        }, 2000);
    }


    this.queryDay = function(res) {
        this.orgDay = res[0].hq;
        this.queryData(res[0].hq, 1);
    }

    this.queryWeek= function(res) {
        this.orgWeek = res[0].hq;
        this.queryData(res[0].hq, 2);
    }

    this.queryMonth = function(res) {
        if (eval(res.status) == 2) 
            return alert('股票代码' + this.code + '不存在!');
        this.orgMonth = res[0].hq;
        this.queryData(res[0].hq, 3);
    }

    this.queryData = function(res, idx) {
        this.origin = this.copy(res); 
        for (let i in this.origin) {
            let temp = [
            this.origin[i][VAL.DATE],
            parseFloat(this.origin[i][VAL.OPEN]),
            parseFloat(this.origin[i][VAL.CLOSE]),
            parseFloat(this.origin[i][VAL.LOW]),
            parseFloat(this.origin[i][VAL.HIGH])];
            temp.push(temp[2]>=temp[1]);
            if (idx == 1) {
                dateDay.push(temp);
            }
            if (idx == 2) {
                dateWeek.push(temp);
            }
            if (idx == 3) {
                dateMonth.push(temp);
            }
        }
    }

    this.arrow = [-1, -10, 1, 10];
    this.periodStr = ['前一日','前一周','前一月'];
    this.preSum =[];
    this.curPeriod =[];

    this.calcAuto = function() {

    }

    this.calcData = function() {
        this.curIdx += -1;
        this.curIdx = Math.max(10, Math.min(dateDay.length-1, this.curIdx));
        this.curDay = this.curIdx;
        for (let i in dateWeek) {
            if (this.compary(dateDay[this.curIdx][VAL.DATE], dateWeek[i][VAL.DATE])) {
                this.curWeek = ~~i;
                break;
            }
        }
        for (let i in dateMonth) {
            if (this.compary(dateDay[this.curIdx][VAL.DATE], dateMonth[i][VAL.DATE])) {
                this.curMonth = ~~i;
                break;
            }
        }
        this.curDate = dateDay[this.curDay][VAL.DATE];
        this.content = '<br/>----------------' + this.curDate + '----------------<br/>';
        this.countYang(dateDay, this.curDay, 0);
        this.countYang(dateWeek, this.curWeek, 1);
        this.countYang(dateMonth, this.curMonth,2);
        if (this.getMin(this.curPeriod) == 1) {
            if (this.getMin(this.preSum) >= 6) {
                let node = Elem.creat('div', this.log);
                node.className = 'six';
                node.innerHTML = this.content +'<br/>';
                node.scrollIntoView();
                if (this.getMin(this.preSum) == 7) {
                    node.className = 'seven';
                }
                if (this.getMin(this.preSum) == 8) {
                    node.className = 'eight';
                }
            }
        }


        setTimeout(function() {
            if (dateDay.length - Stock.curIdx < 200)
                Stock.calcData();
        },20);
    }

    this.getMin = function(arr) {
        let min = arr[0];
        for (let i in arr) {
            if (arr[i] < min)
                min = arr[i]
        }
        return min;
    }


    this.countYang = function(data, idx, p) {
        this.content += this.periodStr[p] + ': ' + data[idx-1].join(', ') + ' || ';
        this.preSum[p] = 0;
        for (i=idx-9;i<idx;i++) {
            this.content += ~~data[i][5];
            if (data[i][5])
                this.preSum[p]++;
        }
        this.curPeriod[p] = dateDay[this.curDay][VAL.CLOSE]>=data[idx][VAL.OPEN];
        this.content += ' || ' + this.curPeriod[p] + ' || ' + this.preSum[p] + '<br/>';
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


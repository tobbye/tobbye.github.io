var daily, dailybase, dailyquery, dailydays, dailyconfig;
var daily2019, daily2020, daily2021, daily2022;

var Tools = new __Tools();
function __Tools() {

    this.monthCount = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.init = function() {
        this.load();
        this.zoom();
        this.year = this.base.year || 2021;
        this.month = this.base.month || 8;
        daily = this.getItem(this.year) || {};
        console.log(this);
    }

    this.load = function() {
        this.base = this.getItem('base') || {};
        this.days = this.getItem('days') || {};
        this.query = this.getItem('query') || {};
        this.config = this.getItem('config') || wordCfg;
    }

    this.compare = function(a, b) {
        a = a.replace(/-/g, '');
        b = b.replace(/-/g, '');
        return ~~a<= ~~b;
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
       return this.copy(newArr);
   }

    this.bubbleSort = function(arr, key, order) {
        let len = arr.length;
        let copy = this.copy(arr);
        for (let i = 0; i < len-1; i++) {
            for (let j = 0; j < len-1-i; j++) {
                let than;
                if (typeof(arr[j][key]) === 'string')
                    than = parseFloat(arr[j][key]) > parseFloat(arr[j+1][key]);
                else
                    than = eval(arr[j][key]) > eval(arr[j+1][key]);
                if (than) { 
                    let temp = this.copy(arr[j+1]);       
                    arr[j+1] = this.copy(arr[j]);
                    arr[j] = temp;
                }
            }
        }
        return order?this.reverse(arr) : this.copy(arr);
    }

    this.earlyTime = function(t1, t2) {
        let s1 = parseInt(t1.replace(/:/g, ''));
        let s2 = parseInt(t2.replace(/:/g, ''));
        return s1 > s2;
    }

    this.setOrder = function(codes, order) {
        return this.bubbleSort(this.query.codes, this.base.orderIdx, this.base.order);
    }

    this.setQuery = function(idx) {
        let date = this.toIdx(this.days[idx].date);
        let end = this.toIdx(this.days[idx].nextMonth);
        let query = {
            idx: idx,
            end: end,
            date: date,
            week: this.days[idx].week,
            cur: this.base.clear ? 0:~~this.getDaily(date, 'cur'),
            codes: this.getDaily(date, 'ZT'),
        }
        this.setItem('query', query);
        setTimeout(function(){
            window.location.href = "stock.html";
        },this.base.auto?500:0);
    }

    this.toArray = function(str) {
        if (str.length<=10) return str;
        str = str.replace(/ (\d{1,2}) /g, ',$1 ');

        let array = str.split(',');
        for (let i in array) {
            array[i] = array[i].split(' ');
            if (this.base.isMobile) {
                let code = array[i][2].replace('.SH','').replace('.SZ', '').replace('.BJ','');
                array[i][2] = array[i][1];
                array[i][1] = code;
            }
        }

        return array;
    }

    this.toDate = function(idx, month, day) {
        if (month && day)
            return '#1年#2月#3日'.replace('#1',idx).replace('#2',month).replace('#3',day);
        return idx.toString().
        replace(/(\d{4})(\d{2})(\d{2})/, '$1年$2月$3日').replace('年0','年').replace('月0', '月');
    }

    this.toIdx = function(date) {
        return date.
        replace(/(\d{4})年(\d{2})月(\d{2})日/, '$1$2$3').
        replace(/(\d{4})年(\d{2})月(\d{1})日/, '$1$20$3').
        replace(/(\d{4})年(\d{1})月(\d{2})日/, '$10$2$3').
        replace(/(\d{4})年(\d{1})月(\d{1})日/, '$10$20$3');
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
        if (!idx) 
            return null;
        daily[idx] = daily[idx] || {date: this.toDate(idx)};
        if (!key) 
            return daily[idx];
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
        return JSON.parse(eval(key) || localStorage.getItem(key));
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
        this.base.isMobile = (/Android|webOS|iPhone|iPod|BlackBerry|Mobile|MIX/i.test(navigator.userAgent));
        if (z) {
            this.setBase('zoom', z);
            document.body.style.zoom = z;
        } else {
            document.body.style.zoom = this.base.zoom;
        }
    }
}

let wordCfg = [{
    "key": "RJSW",
    "name": "热景生物",
    "show": [0],
    "text": "当前季度预告净利润/季度末总市值排名前20"
},
{
    "key": "JCGF",
    "name": "京城股份",
    "show": [0],
    "text": "本月末至今涨跌幅，本月的20月均线小于30月均线小于10月均线，本月的10月均线小于60月均线小于5月均线"
},
{
    "key": "DJZG",
    "name": "大金重工",
    "show": [0],
    "text": "本月涨跌幅>15,主板非st,本月末的10月均线大于5月均线大于20月均线,本月末的20月均线大于30月均线"
},
0, {
    "key": "ZT",
    "name": "涨停",
    "show": [1, 2, 3, 4, 5],
    "text": "今天涨停,涨跌幅小于11,主板非st"
},
{
    "key": "ZS",
    "name": "指数",
    "date": 20210115,
    "show": [0],
    "text": "今天涨跌幅>4,今天涨跌幅前10,指数"
},
{
    "key": "TYKG",
    "name": "死亡",
    "date": 20210115,
    "show": [1, 2, 3, 4, 5],
    "text": "今天涨跌幅,后1天涨跌幅，后2天涨跌幅，后3天涨跌幅，后4天涨跌幅，后5天涨跌幅，今天的20日均线大于30日均线大于10日均线，今天的10日均线大于60日均线大于5日均线"
},
{
    "key": "FJJS",
    "name": "新生",
    "date": 20210520,
    "show": [1, 2, 3, 4, 5],
    "text": "今天涨跌幅，后1天涨跌幅，后2天涨跌幅，后3天涨跌幅，今天的20日均线小于30日均线小于10日均线，今天的10日均线小于60日均线小于5日均线"
},
{
    "key": "SHDL",
    "name": "上海电力",
    "date": 20210917,
    "show": [0],
    "text": "今天涨停,涨跌幅小于11,主板非st,昨天的开盘价大于5日均线大于收盘价,昨天的开盘价大于10日均线大于收盘价,昨天的收盘价大于20日均线大于30日均线大于60日均线"
},
{
    "key": "ZZMD",
    "name": "郑州煤电",
    "date": 20201207,
    "show": [0],
    "text": "今天至今涨跌幅，今天的20周均线大于30周均线大于10周均线，今天的10周均线大于60周均线大于5周均线"
},
{
    "key": "CWGF",
    "name": "翠微股份",
    "date": 20211122,
    "show": [5],
    "text": "今天至今涨跌幅，今天的20周均线小于30周均线小于10周均线，今天的10周均线小于60周均线小于5周均线"
},
{
    "key": "SKW",
    "name": "病发",
    "show": [0],
    "text": "今天的20周均线大于10周均线大于30周均线,今天的30周均线大于5周均线大于60周均线,今天至今涨跌幅,主板非st"
}];
var daily, dailybase, dailyquery, dailydays;
var daily2019, daily2020, daily2021, daily2022;

var Tools = new __Tools();
function __Tools() {

    this.monthCount = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.init = function() {
        this.load();
        this.zoom();
        this.year = this.base.year || 2021;
        this.month = this.base.month || 8;
        daily = this.getItem(this.year);
        console.log(this);
    }

    this.load = function() {
        this.base = this.getItem('base');
        this.days = this.getItem('days');
        this.query = this.getItem('query');
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


    this.setQuery = function(idx) {
        let date = this.toIdx(this.days[idx].date);
        let end = this.toIdx(this.days[idx].nextMonth);
        let query = {
            idx: idx,
            end: end,
            date: date,
            cur: ~~this.getDaily(date, 'cur'),
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
        }
        if (this.base.isMobile) {
            let code = array[2].replace('SH','').replace('SZ', '').replace('BJ','');
            array[2] = array[1];
            array[1] = code;
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
        return JSON.parse(eval(key) || localStorage.getItem(key)) || {};
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
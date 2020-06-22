
var values = {};

// 0 1 2 3 4 5 
// 0 9 8 7 6 5
// 0 1 2 3 4 5 6 7 8
// 0 f e d c b a 9 8

var Line = {};
var Parse = {}; 

Parse.addSplit = function addSplit(num) {
    var str = num.toString();
    return str.replace(/(\d)(?=(\d{3})+(\.|$))/g, '$1,');
}

Parse.sub4Num = function(num) {
    var length = num.toString().length;
    if (num < 1e4)
        return num;
    if (num < 1e8) 
        return (num / 1e4).toFixed(8 - length) + '万';
    if (num < 1e12) 
        return (num / 1e8).toFixed(12 - length) + '亿';
}

Parse.cut4Num = function(num) {
    var str = num.toString();
    var len = str.length - 1;
    var list = ['', '万<br/>', '亿<br/>', '万亿<br/>'];
    var index = Math.floor(len / 4);
    var start = (len + 1) % 4;
    console.log('str: ' + str);
    var ans = '';
    for (var i = index;i >= 0;i--) {
        if (i == index)
          ans += str.substr(0, len % 4 + 1) + list[i];
      else
          ans += str.substr((index - i)*4-start, 4) + list[i];
  }
  console.log('ans: ' + ans);
  return ans;
}

Parse.fillZero = function (num, count) {
    count = count || 2;
    var str = num.toString();
    if (str.length < count) {
       str = '0' + str;
       return Parse.fillZero(str, count);
   } else {
      return str;
  }
}

Parse.cutZero = function(text) {
    if (text[0] == '0')
        return Parse.cutZero(text.substring(1));
    else
        return text;
}

Parse.titleCase = function(text) {
    return text[0].toUpperCase() + text.substring(1).toLowerCase();
}

Parse.limitText = function (str, len) {
    var str = str.toString();
	var regexp = /[^\x00-\xff]/g;// 正在表达式匹配中文
	// 当字符串字节长度小于指定的字节长度时
	if (str.replace(regexp, 'aa').length <= len) {
		return str;
	}
	// 假设指定长度内都是中文
	var m = Math.floor(len/2);
	for (var i = m, j = str.length; i < j; i++) {
		// 当截取字符串字节长度满足指定的字节长度
		if (str.substring(0, i).replace(regexp, 'aa').length >= len - 1) {
			return str.substring(0, i) + '...';
		}
	}
	return str + '...';
}

Parse.mixText = function(str) {
    var arr = str.split(' ');
    var result = '';
    for(var i=0;i<arr.length;i++) {
        result += Parse.mix(arr[i]) + ' ';
    }
    return result;
}

Parse.mix = function(str) {
    var len = str.length;
    var rand, cur;
    var arr = [];
    for(var i=0;i<len;i++)
        arr[i] = str[i];
    for(var i=0;i<len;i++) {
    rand = Math.floor(Math.random()*len);//随机数的产生范围每次都变化
    if (arr[i] == ' ' || arr[rand] == ' ' || arr[i] == '/' || arr[rand] == '/') 
        continue;
    cur = arr[rand];
    arr[rand] = arr[i];
    arr[i] = cur;
    }
    if (str instanceof Object)
        return arr;
    else
        return arr.join('');
}

Parse.pick = function(arr) {
    return arr[~~(arr.length*Math.random())];
}

Parse.swape = function(str, a, b){
    return str.replace(a, '#0').replace(b, a).replace('#0', b);
}

Parse.reverse = function(arr){
       var newArr = [];
       for(var i=arr.length-1;i>=0;i--){
           newArr[newArr.length] = arr[i];
       }
       return newArr;
   }


Parse.getStamp = function(stamp) {
    return stamp || new Date().getTime();
}


Parse.formatTime = function(stamp) {
    stamp = Parse.getStamp(stamp);
    var time = new Date(stamp);
    var str = time.getFullYear() + '-';
    str += Parse.fillZero(time.getMonth()+1) + '-';
    str += Parse.fillZero(time.getDate()) + ' ';
    str += Parse.fillZero(time.getHours()) + ':';
    str += Parse.fillZero(time.getMinutes()) + ':';
    str += Parse.fillZero(time.getSeconds());
    return str;
}

Parse.getDate = function(stamp, str) {
    stamp = Parse.getStamp(stamp);
    var time = new Date(stamp);
    var year = time.getFullYear();
    var month = Parse.fillZero(time.getMonth()+1);
    var day = Parse.fillZero(time.getDate());
    if (str == '')
        return year + '' + month + '' + day + '';
    if (str == '/')
        return year + '/' + month + '/' + day + '';
    if (str == '-')
        return year + '-' + month  + '-' + day + '';
    else
        return year + '年' + month + '月' + day + '日';
}


Parse.getTime = function(stamp, str) {
    stamp = Parse.getStamp(stamp);
    var time = new Date(stamp);
    var hour = time.getHours();
    var minute = time.getMinutes();
    if (str == '')
        return hour + '' + minute + '';
    if (str == ':')
        return hour + ':' + minute + '';
    else
        return hour + '时' + minute + '分';
}

Parse.remove = function(lines, line) {
    for (let x in lines) {
        if (lines[x] == line)
            lines.splice(x, 1);
    }
}


//元素
var  Elem = {};

//创建一个元素
Elem.creat = function(type, parent, className, key) {
	var e = document.createElement(type);
	if (parent)
		parent.appendChild(e);
	if (className)
		e.className = className;
	if (key != null)
		e.setAttribute('key', key);
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

Elem.getClass = function (cls) {
    return document.getElementsByClassName(cls); 
}

Elem.remove = function (e) {
    if(e) e.parentNode.removeChild(e); 
}

Elem.empty = function (e) {
    while(e.hasChildNodes()) 
        e.removeChild(e.firstChild); 
}

Elem.removeClass = function(e, cls) {
    var str =  e.className; 
    if(index = str.indexOf(cls) > -1) {
        e.className = str.replace(cls,''); 
    } 
}

Elem.addClass = function(e, cls) {
    e.className += cls; 
}

Elem.text = function(e, text) {
    e.innerHTML = text; 
}

Elem.align = function(e, a) {
    Elem.css(e, 'textAlign', a); 
}

Elem.color = function(e, c, bg) {
    Elem.css(e, 'color', c); 
    Elem.css(e, 'backgroundColor', bg); 
}

Elem.flex = function(e, a, f) {
    Elem.css(e, 'textAlign', a); 
    Elem.css(e, 'flex', f); 
}

Elem.width = function(e, w) {
    Elem.css(e, 'width', w); 
}

Elem.height = function(e, height) {
    Elem.css(e, 'height', height+'px'); 
}

Elem.maxheight = function(e, height) {
    Elem.css(e, 'maxHeight', height+'px'); 
}

Elem.show = function(e, attr) {
    Elem.css(e, 'display', attr || 'block'); 
}

Elem.hide = function(e) {
    Elem.css(e, 'display', 'none'); 
}

Elem.css = function(e, k, v) {
    if (e && e.style && k && v) {
        e.style[k] = v; 
    } 
}

Elem.attr = function(e, k, v) {
    if (e && e.style && k && v) {
        e.setAttribute(k, v); 
    } 
}

Elem.state = function(e, v) {
    Elem.attr(e, 'state', v);
}

Elem.setKey = function(e, key) {
    e.setAttribute('key', key);
}

Elem.btnPermit = function(k) {Elem.attr(Alert.buttons[k], 'state', 'permit'); } 
Elem.btnConst = function(k) {Elem.attr(Alert.buttons[k], 'state', 'defult'); }
Elem.btnDanger = function(k) {Elem.attr(Alert.buttons[k], 'state', 'danger'); }
//克隆元素
Elem.clone = function(e, parent){
    var copy = Object.assign({}, e);
    parent.appendChild(copy);
    return copy;
}


//设置元素高度自适应
Elem.autosize = function(e, off) {
    var windWidth = Config.page.windWidth;
    var windHeight = Config.page.windHeight;
    var box = Elem.get('alert-box');
    var agent = Config.page.isMobile ? 'mobile' : 'computer';
    Elem.attr(box, 'agent', agent);
    e = e || Elem.get('outer-center');
    e.style.height = windHeight - off + 'px';
    e.style.maxHeight = windHeight - off + 'px';
    //alert(windHeight);
}

Elem.togState = function(e, state) {
    if (!e || !e.style) return;
    var attr = e.getAttribute('state') || 'default';
    state = state || Parse.swape(attr, 'permit', 'danger');
    e.setAttribute('state', state);
}

Elem.release = function() {
    let refs = document.querySelectorAll('form');
    for (let i=0; i< refs.length; i++) {
        let last = refs[i].parentNode.lastChild;
        while (last != refs[i]) {
            refs[i].appendChild(last);
        }
    }
}


//数据存储
var Storage = {};

Storage.get = function (name) {
    var value = localStorage.getItem(name) || null;
    var data = JSON.parse(value);
    // console.log('Storage.get(' + name + ':' + value + ')');
    return data;
}

Storage.set = function (name, val) {
    var value = JSON.stringify(val);
    localStorage.setItem(name, value);
    // console.log('Storage.set(' + name + ':' + value + ')');
}

Storage.add = function (name, arr) { 
    let data = Storage.get(name) || [];
    Storage.set(name, data.concat(arr));
}

Storage.update = function(name, key, val) {
    var data = Storage.get(name) || {};
    data[key] = val;
    Storage.set(name, data);
}


Storage.clear = function () {
  localStorage.clear();
}

//本地数据
var localData = {};

//保存本地数据
localData.save = function() {
    Storage.set('Values', values);
    Storage.set('Config', Config);
    // window.location.reload();
}

//初始化本地数据
localData.init = function(state) {

    if (state == 'clear') {
        Storage.clear();
        var dict = 'HIJKLMNOPQRSTUV';
        for (let idx in dict)
            values[dict[idx]] = 0;
        values.h = 50000;
        Storage.set('Values', values);
        console.log(Parse.contentText('CLEAR values succeed!'));
        console.log(values);
        return values;
    }

    if (state == 'init') {
        values = Storage.get('Values') || localData.init('clear');
        console.log(Parse.contentText('INIT values succeed!'));
        console.log(values);
        return values;
    }
}

Parse.contentText = function(str) {
    var line = ' —————————— ';
    return line + ' ' + str + ' ' + line; 
}












var setFullScreen = function() {
    if (Config.page.isMobile) {
        var body = document.body;
        if (body.requestFullScreen) body.requestFullScreen(); //W3C
        if (body.msRequestFullScreen) body.msRequestFullScreen();  //IE11
        if (body.mozRequestFullScreen) body.mozRequestFullScreen(); //FireFox
        if (body.webkitRequestFullScreen) body.webkitRequestFullScreen(); //Chrome
    }
}



//显示提醒信息
function Fade() {
    var that = this;
    Config.getConst(this, 'fade');
    
    this.getElem = function(e) {
        e = e || Elem.get('log');
        if (!e) {
            e = Elem.creat('div', document.body, 'log');
            e.setAttribute('fade', 'over');
            e.id = 'log';
        } 
        if (Config.sett.colorType == 'page')
            Elem.color(e, getColorBgd(), getColorType());
        else
            Elem.color(e, 'white', 'dodgerblue');
        return e;
    }

    this.setAnim = function(text, e, timeOn) {
        this.text = text;
        this.elem = this.getElem(e);
        this.timeOn = timeOn || this.timeOn;
        if (this.elem.getAttribute('fade') != 'over') {
            window.clearTimeout(this.fadeIn);
            window.clearTimeout(this.fadeOn);
            window.clearTimeout(this.fadeOut);
            window.clearTimeout(this.fadeTog);
            this.elem.setAttribute('fade', 'on');
            this.animTog();
        } else {
            this.animIn();
        }
    }

    this.animIn = function() {
        if (this.text)
            this.elem.innerHTML = this.text;
        this.elem.setAttribute('fade', 'in');
        this.fadeIn = setTimeout(function() {
            that.fadeIn = null;
            that.animOn();
        }, this.timeIn);  
    }

    this.animOn = function() {
        this.elem.setAttribute('fade', 'on');
        this.fadeOn = setTimeout(function() {
            that.fadeOn = null;    
            that.animOut();
        }, this.timeOn); 
    }

    this.animTog = function() {
        if (this.text)
            this.elem.innerHTML = this.text;
        this.elem.setAttribute('fade', 'tog');
        this.fadeTog = setTimeout(function() {
            that.fadeTog = null;
            that.animOn();
        }, this.timeTog);  
    }

    this.animOut = function() {
        this.elem.setAttribute('fade', 'out');
        this.fadeOut = setTimeout(function() {
            that.fadeOut = null;
            that.animOver();
        }, this.timeOut);  
    }

    this.animOver = function() {
        this.elem.setAttribute('fade', 'over');
    }  
}





var addScript = function(src) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    document.head.appendChild(script);
}





var jsonToAlert = function(data) {
    alert(JSON.stringify(data));
}


var jsonToTable = function(Item) {
    if (Config.name == 'home') return;
    console.log(Item);
    Storage.set('Item', Item);
    Storage.set('Config', Config);
    Storage.set('Constant', Constant);
    Storage.set('Instances', Instances);
    Storage.set('Constrtctors', Constrtctors);
    window.location.href = '../view/view.html';
}








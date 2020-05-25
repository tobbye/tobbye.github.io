
var values = {};

// 0 1 2 3 4 5 
// 0 9 8 7 6 5
// 0 1 2 3 4 5 6 7 8
// 0 f e d c b a 9 8

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
Elem.creat = function(type, parent, className, id) {
	var elem = document.createElement(type);
	if (parent)
		parent.appendChild(elem);
	if (className)
		elem.className = className;
	if (id != null)
		elem.id = className + '_' + id;
	return elem;
}

//获取当个元素
Elem.get = function (e) {
    if (typeof(e) === 'string')
        return Elem.get(document.getElementById(e));
    if (e &&  e.style)
        return e;
    return null;
}

//获取类的所有元素
Elem.getClass = function (className) {
    return document.getElementsByClassName(className);
}

//删除元素
Elem.remove = function (elem) {
    if(elem)
        elem.parentNode.removeChild(elem);
}

//清空元素子节点
Elem.empty = function (elem) {
    while(elem.hasChildNodes())
        elem.removeChild(elem.firstChild);
}

Elem.removeClass = function(elem,text){
    var str =  elem.className,
        index = str.indexOf(text);
    if(index > -1) {
        elem.className = str.replace(text,'');
    }
}

Elem.addClass = function(elem,text){
    elem.className += text;
}


//设置元素对齐方式
Elem.align = function(elem, align) {
    Elem.style(elem, 'textAlign', align);
}

//设置元素字体颜色和背景颜色
Elem.color = function(elem, color, bgcolor) {
    Elem.style(elem, 'color', color);
    Elem.style(elem, 'backgroundColor', bgcolor);
}

//设置元素flex权重
Elem.flex = function(elem, align, flex) {
    Elem.style(elem, 'textAlign', align);
    Elem.style(elem, 'flex', flex);
}

//设置元素宽度
Elem.width = function(elem, align, width) {
    Elem.style(elem, 'textAlign', align);
    Elem.style(elem, 'width', width);
}

//设置元素高度
Elem.height = function(elem, height) {
    Elem.style(elem, 'height', height);
    Elem.style(elem, 'maxHeight', height);
}

//设置元素显示
Elem.display = function(elem, display) {
    Elem.style(elem, 'display', display);
}


//设置元素样式
Elem.style = function(elem, key, value) {
    if (elem && elem.style && key && value) {
        elem.style[key] = value;
    }
}

Elem.attr = function(elem, key, value) {
    if (elem && elem.style && key && value) {
        elem.setAttribute(key, value);
    }
}

//设置元素高度自适应
Elem.autosize = function(elem, offset) {
    var windWidth = Config.page.windWidth;
    var windHeight = Config.page.windHeight;
    var box = Elem.get('alert-box');
    var agent = Config.page.isMobile ? 'mobile' : 'computer';
    Elem.attr(box, 'agent', agent);
    elem = elem || Elem.get('outer-center');
    elem.style.height = windHeight - offset + 'px';
    elem.style.maxHeight = windHeight - offset + 'px';
    //alert(windHeight);
}

//克隆元素
Elem.clone = function(elem, parent){
    var copy = Object.assign({}, elem);
    console.log(copy);
    parent.appendChild(copy);
    return copy;
}

Elem.togState = function(elem, state) {
    if (!elem || !elem.style) return;
    var attr = elem.getAttribute('state') || 'default';
    state = state || Parse.swape(attr, 'permit', 'danger');
    elem.setAttribute('state', state);
}

//样式
var Style = {};

Style.color = function(id, color, bgcolor) {
    var elem = Elem.get(id);
    Elem.color(elem, color, bgcolor);
}

Style.display = function(id, display) {
    var elem = Elem.get(id);
    Elem.display(elem, display);
}

Style.toggle = function(id, display) {
    var elem = Elem.get(id);
    Elem.toggle(elem, display);
}

//数据存储
var Storage = {};

Storage.get = function (name) {
    var value = localStorage.getItem(name);
    var data = JSON.parse(value);
    // console.log('Storage.get(' + name + ':' + value + ')');
    return data;
}

Storage.set = function (name, val) {
    var value = JSON.stringify(val);
    localStorage.setItem(name, value);
    // console.log('Storage.set(' + name + ':' + value + ')');
}

Storage.add = function (name, addVal) { 
    let oldVal = Storage.get(name) || [];
    let newVal = oldVal.concat(addVal);
    Storage.set(name, newVal);
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
    Storage.set('values', values);
    // window.location.reload();
}

//初始化本地数据
localData.init = function(state) {
    var setting = Storage.get('setting') || {};

    if (state == 'clear') {
        Storage.clear();
        var dict = 'HIJKLMNOPQRSTUV';
        for (let idx in dict)
            values[dict[idx]] = 0;
        values.h = 50000;
        Storage.set('values', values);
        console.log(contentText('CLEAR values succeed!'));
        console.log(values);
        return values;
    }

    if (state == 'init') {
        values = Storage.get('values') || localData.init('clear');
        console.log(contentText('INIT values succeed!'));
        console.log(values);
        return values;
    }
}

var contentText = function(str) {
    var line = ' —————————— ';
    return line + ' ' + str + ' ' + line; 
}



var getColorBgd = function() {
    return Config.color.bgd;
}

var getColorType = function() {
    return Config.color.font;
}

var getColorLight = function() {
    return Config.color.light;
}


var Page = function() {
    var that = this;

    getDefult(this, 'page');
    this.isMobile = (/Android|webOS|iPhone|iPod|BlackBerry|MIX/i.test(navigator.userAgent));
    this.isWechat = (/micromessenger|MicroMessenger/i.test(navigator.userAgent));
    this.zoom = this.isMobile ? this.zoomMobile : this.zoomComput;
    this.zoom = this.isWechat ? this.zoomWechat : this.zoom;
    this.windWidth = Math.floor(window.innerWidth / this.zoom);
    this.windHeight = Math.floor(window.innerHeight / this.zoom);
    this.alertHeight = this.windHeight - this.alertOffset;
    this.outerHeight = this.windHeight - this.outerOffset;
    this.innerHeight = this.windHeight - this.innerOffset;
    this.flowHeight = Math.max(this.innerHeight, this.minHeight);
    this.alertMargin = this.windWidth - this.alertMaxWidth;
    this.alertMargin = Math.max(this.alertMargin / 2, this.alertMinMargin);
    this.alertWidth = this.windWidth - this.alertMargin * 2 - 36;
    this.isWidth = this.windWidth > this.windHeight;
    this.isFlow = this.innerHeight > this.minHeight;
    var box = Elem.get('alert-box');
    if (box) {
        box.style.left = this.alertMargin + 'px';
        box.style.right = this.alertMargin + 'px';
    }

    document.body.style.zoom = this.zoom;
    var center = Elem.get('outer-center');
    center.style.height = this.outerHeight + 'px';
    center.style.maxHeight = this.outerHeight + 'px';
}

window.onresize = function() {
    if (Config.sett.isAlert) {
        Style.display('alert', 'none');
        Config.page = new Page();
        Style.display('alert', 'block'); 
    } else {
        Config.page = new Page();
    }
}

var setAction = function(act, idx) {
    var uid = 'i';
    var action = Config.action;
    var ref = action.ref.replace('#uid', uid).replace('#act', act).replace('#idx', idx);
    action.router = ref.replace('#host', '');
    console.log(Config);
    ref = ref.replace('#host', action.host);
    return ref;
}

//获取浏览器是否是移动端
var getAgent = function() {
    Config.cfg = cfg;
    Config.name = cfg.name;
    Config.fade = new Fade();

    var temp = Storage.get('Config') || {};
    if (Config.name == 'sett')
        temp = {};
    if (Config.name == temp.name && temp.sett.isInto)
        Config.innerIdx = temp.innerIdx || 0;
    else
        Config.innerIdx = 0;
    setDefult(temp, 'sett');
    setDefult(temp, 'color');
    setDefult(temp, 'clock');
    getHost();
    window.onresize();
}

var setDefult = function(temp, key) {
    Config[key] = temp[key] || Config.constant[key];
    if (typeof(Config[key]) === 'object')
        Config[key] = JSON.parse(JSON.stringify(Config[key]));
}

var getDefult = function(that, key) {
    var defult = Config.constant[key];
    for (let x in defult) {
        that[x] = defult[x];
    }
}

var getHost = function() {
    var action = Config.action;
    var path = window.document.location.href;
    var page = window.document.location.pathname;
    var pos = path.indexOf(page);
    var host = path.substring(0, pos);
    action.host = host;
    action.page = page;
    getHostType(host);
}

var getHostType = function(host) {
    for (let key in Config.constant.host) {
        if (Config.constant.host[key] == host) {
            Config.sett.hostType = key;
            console.log(key);
            return;
        }
    }
}

//设置浏览器
var setAgent = function() {
    hideAlert();
    btnClick('btn-quit', hideAlert);
    btnClick('btn-abon', hideAlert);
    btnClick('btn-close', hideAlert);
    window.onresize();
}



var setFullScreen = function() {
    if (Config.isMobile) {
        var body = document.body;
        if (body.requestFullScreen) body.requestFullScreen(); //W3C
        if (body.msRequestFullScreen) body.msRequestFullScreen();  //IE11
        if (body.mozRequestFullScreen) body.mozRequestFullScreen(); //FireFox
        if (body.webkitRequestFullScreen) body.webkitRequestFullScreen(); //Chrome
    }
}


var showLog = function(text) {
    Config.fade.setAnim(text);
}

//显示提醒信息
function Fade() {
    var that = this;
    getDefult(this, 'fade');
    
    this.getElem = function(elem) {
        elem = elem || Elem.get('log');
        if (!elem) {
            elem = Elem.creat('div', document.body, 'log');
            elem.setAttribute('fade', 'over');
            elem.id = 'log';
        } 
        if (Config.sett.colorType == 'page')
            Elem.color(elem, getColorBgd(), getColorType());
        else
            Elem.color(elem, 'white', 'dodgerblue');
        return elem;
    }

    this.setAnim = function(text, elem, timeOn) {
        this.text = text;
        this.elem = this.getElem(elem);
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




var btnClick = function(name, func) {
    if (Elem.get(name)) {
        Elem.get(name).onclick = function() {
            func();
        }
    }
}

var btnState = function(name, state) {
    if (Elem.get(name)) {
        Elem.get(name).setAttribute('state', state);
    }
}


var addScript = function(src) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    document.head.appendChild(script);
}


//显示弹窗
var showAlert = function(name) {
    Style.display('alert', 'block');
    Config.sett.isAlert = true;
    if (name) {
        Style.display(name, 'block');
    }
}


//隐藏弹窗
var hideAlert = function(name) {
    Style.display('alert', 'none');
    Config.sett.isAlert = false;
    if (name) {
        Style.display(name, 'none');
        return;
    }
    var bgs = Elem.getClass('alert-bg');
    for (let x in bgs) {
        Elem.display(bgs[x], 'none');
    }
}


var jsonToAlert = function(data) {
    alert(JSON.stringify(data));
}


var jsonToTable = function(item) {
    if (Config.name == 'home') return;
    Storage.set('item', item);
    Storage.set('Config', Config);
    window.location.href = '../view/view.html';
}








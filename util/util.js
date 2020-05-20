
var fade = {};
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
Elem.get = function (name) {
    return document.getElementById(name);
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

//切换元素显示
Elem.toggle = function(elem, display) {
    if (!elem || !elem.style) return;
    var attr = elem.getAttribute('display') || 'block';
    display = display || Parse.swape(attr, 'attr', 'none');
    Elem.attr(elem, 'display', display);
}

Elem.togType = function(elem, btype) {
    if (!elem || !elem.style) return;
    var attr = elem.getAttribute('btype') || 'default';
    btype = btype || Parse.swape(attr, 'permit', 'danger');
    elem.setAttribute('btype', btype);
}


//设置元素样式
Elem.style = function(elem, key, value) {
    if (!elem || !elem.style) return;
    if (key && value) {
        elem.style[key] = value;
    }
}

Elem.attr = function(elem, key, value) {
    if (!elem || !elem.style) return;
    if (key && value) {
        elem.setAttribute(key, value);
    }
}

//设置元素高度自适应
Elem.autosize = function(elem, offset) {
    var windWidth = config.page.windWidth;
    var windHeight = config.page.windHeight;
    var box = Elem.get('alert-box');
    var agent = config.page.isMobile ? 'mobile' : 'computer';
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
    return config.color.bgd;
}

var getColorType = function() {
    return config.color.font;
}

var getColorLight = function() {
    return config.color.light;
}

var addScript = function(src) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    document.head.appendChild(script);
}

var setPage = function() {
    var page = setDefult([], 'page');
    var sett = config.sett;
    sett.isMobile = (/Android|webOS|iPhone|iPod|BlackBerry|MIX/i.test(navigator.userAgent));
    sett.isWechat = (/micromessenger|MicroMessenger/i.test(navigator.userAgent));
    page.zoom = sett.isMobile ? page.zoomMobile : page.zoomComput;
    page.zoom = sett.isWechat ? page.zoomWechat : page.zoom;
    page.windWidth = Math.floor(window.innerWidth / page.zoom);
    page.windHeight = Math.floor(window.innerHeight / page.zoom);
    page.alertHeight = page.windHeight - page.alertOffset;
    page.outerHeight = page.windHeight - page.outerOffset;
    page.innerHeight = page.windHeight - page.innerOffset;
    page.flowHeight = Math.max(page.innerHeight, page.minHeight);
    sett.isWidth = page.windWidth > page.windHeight;
    sett.isFlow = page.innerHeight > page.minHeight;
    document.body.style.zoom = page.zoom;
    var box = Elem.get('alert-box');
    var agent = sett.isMobile ? 'mobile' : 'computer';
    Elem.attr(box, 'agent', agent);
    var center = Elem.get('outer-center');
    center.style.height = page.outerHeight + 'px';
    center.style.maxHeight = page.outerHeight + 'px';
    config.page = page;
}

window.onresize = function() {
    setPage();
}

var setAction = function(act, idx) {
    var uid = 'i';
    var action = config.action;
    var ref = action.ref.replace('#uid', uid).replace('#act', act).replace('#idx', idx);
    action.router = ref.replace('#host', '');
    console.log(config);
    ref = ref.replace('#host', action.host);
    return ref;
}

//获取浏览器是否是移动端
var getAgent = function() {
    config.cfg = cfg;
    config.name = cfg.name;

    var temp = Storage.get('config') || {};
    if (config.name == 'sett')
        temp = {};
    if (config.name == temp.name && temp.sett.isInto)
        config.innerIdx = temp.innerIdx || 0;
    else
        config.innerIdx = 0;
    setDefult(temp, 'sett');
    setDefult(temp, 'fade');
    setDefult(temp, 'page');
    setDefult(temp, 'color');
    setDefult(temp, 'clock');
    getHost();
    window.onresize();
}

var setDefult = function(temp, key) {
    config[key] = temp[key] || config.constant[key];
    if (typeof(config[key]) === 'object')
        config[key] = JSON.parse(JSON.stringify(config[key]));
    return config[key];
}

var getHost = function() {
    var action = config.action;
    var path = window.document.location.href;
    var page = window.document.location.pathname;
    var pos = path.indexOf(page);
    var host = path.substring(0, pos);
    action.host = host;
    action.page = page;
    getHostType(host);
}

var getHostType = function(host) {
    for (let key in config.constant.host) {
        if (config.constant.host[key] == host) {
            config.sett.hostType = key;
            console.log(key);
            return;
        }
    }
}

//设置浏览器
var setAgent = function() {
    hideAlert();
    setClick('btn-quit', hideAlert);
    setClick('btn-abon', hideAlert);
    setClick('btn-close', hideAlert);
    setWhite('user-top');
    setWhite('user-flex');
    setWhite('user-line');
    setWhite('user-body');
    setWhite('user-block');
    window.onresize();
}


var setClick = function(name, func) {
    if (Elem.get(name)) {
        Elem.get(name).onclick = function() {
            func();
        }
    }
}

var setWhite = function(cls) {
    return;
    var childs = document.getElementsByClassName(cls);
    for (var i=0; i<childs.length; i++) {
        Elem.color(childs[i], '', getColorBgd());
    }
}

var setFullScreen = function() {
    if (config.isMobile) {
        var body = document.body;
        if (body.requestFullScreen) body.requestFullScreen(); //W3C
        if (body.msRequestFullScreen) body.msRequestFullScreen();  //IE11
        if (body.mozRequestFullScreen) body.mozRequestFullScreen(); //FireFox
        if (body.webkitRequestFullScreen) body.webkitRequestFullScreen(); //Chrome
    }
}



var setNotLine = function(content, data) {
    if (data.lines) 
        return;
    var block = Elem.creat('div', content, 'block');
    var hide = Elem.creat('div', block, 'hide');
    hide.innerHTML = '此处为空';
}


var showLog = function(text) {
    fadeAnim(text);
}

//显示提醒信息
var fade = {};

var getFadeElem = function(elem) {
    fade = config.fade;
    if (!elem) {
        elem = Elem.get('log');
        if (!elem) {
            elem = Elem.creat('div', document.body, 'log');
            elem.id = 'log';
            elem.setAttribute('fade', 'over');
        }
        if (config.sett.colorType == 'page')
            Elem.color(elem, getColorBgd(), getColorType());
        else
            Elem.color(elem, 'white', 'dodgerblue');
    }
    return elem;
}

var fadeAnim = function(text, elem, timeOn) {
    fade = config.fade;
    fade.elem = getFadeElem(elem);
    fade.text = text;
    fade.timeOn = timeOn || fade.timeOn;
    if (fade.elem.getAttribute('fade') != 'over') {
        window.clearTimeout(fade.fadeIn);
        window.clearTimeout(fade.fadeOn);
        window.clearTimeout(fade.fadeOut);
        window.clearTimeout(fade.fadeTog);
        fade.elem.setAttribute('fade', 'on');
        setFadeTog();
    } else {
        setFadeIn();
    }
}

var setFadeIn = function() {
    if (fade.text)
        fade.elem.innerHTML = fade.text;
    fade.elem.setAttribute('fade', 'in');
    fade.fadeIn = setTimeout(function() {
        fade.fadeIn = null;
        setFadeOn();
    }, fade.timeIn);  
}

var setFadeOn = function() {
    fade.elem.setAttribute('fade', 'on');
    fade.fadeOn = setTimeout(function() {
        fade.fadeOn = null;    
        setFadeOut();
    }, fade.timeOn); 
}

var setFadeTog = function() {
    if (fade.text)
        fade.elem.innerHTML = fade.text;
    fade.elem.setAttribute('fade', 'tog');
    fade.fadeTog = setTimeout(function() {
        fade.fadeTog = null;
        setFadeOn();
    }, fade.timeTog);  
}

var setFadeOut = function() {
    fade.elem.setAttribute('fade', 'out');
    fade.fadeOut = setTimeout(function() {
        fade.fadeOut = null;
        setFadeOver();
    }, fade.timeOut);  
}

var setFadeOver = function() {
    fade.elem.setAttribute('fade', 'over');
}




//显示弹窗
var showAlert = function(name) {
    Style.display('alert', 'block');
    if (name) {
        Style.display(name, 'block');
    }
}


//隐藏弹窗
var hideAlert = function(name) {
    Style.display('alert', 'none');
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
    if (config.name == 'home') return;
    Storage.set('item', item);
    Storage.set('config', config);
    window.location.href = '../view/view.html';
}






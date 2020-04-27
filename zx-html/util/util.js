
var elems = {};
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
    var windHeight = config.windHeight;
    if (!elem) elem = Elem.get('outer-center');
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
    var dataIdx = setting.dataIdx || 'values';
    dataIdx = dataIdx.replace('default', 'values');

    if (state == 'set') {
        values = Storage.get('values');
        Storage.set(dataIdx, values);
        console.log(contentText('SET', dataIdx, 'succeed!'));
        console.log(values);
        return values;
    }

    if (state == 'get') {
        if (Storage.get(dataIdx)) {
            values = Storage.get(dataIdx);
            Storage.set('values', values);
            console.log(contentText('GET', dataIdx, 'succeed!'));
            console.log(values);
        } else {
            console.log(contentText('GET', dataIdx, 'fail!!!'));
            return 'no data';
        }
        return values;
    }

    if (state == 'clear') {
        Storage.clear();
        var dict = 'HIJKLMNOPQRSTUV';
        for (let idx in dict)
            values[dict[idx]] = 0;
        values.h = 50000;
        Storage.set(dataIdx, values);
        Storage.set('values', values);
        console.log(contentText('CLEAR', dataIdx, 'succeed!'));
        console.log(values);
        return values;
    }

    if (state == 'init') {
        values = Storage.get('values') || localData.init('clear');
        console.log(contentText('INIT', dataIdx, 'succeed!'));
        console.log(values);
        return values;
    }
}

var contentText = function(a, b, c) {
    var line = ' —————————— ';
    return line + ' ' + a + ' ' + b + ' ' + c + ' ' + line; 
}

//显示内页
var setInner = function(innerIdx) {
    var page = Storage.get('page');
    var idx = config.isInto ? config.innerIdx : innerIdx || 0;
    var outerTop = Elem.get('outer-top').children;
    var outerCenter = Elem.get('outer-center').children;
    var isText = config.colorType == 'text';
    var isPage = config.colorType == 'page';
    for (var i = 0; i < outerTop.length; i++) {
        var childTop = outerTop[i];
        var childCenter = outerCenter[i];
        if (childTop.className != 'button-top')
            break;
        if (i == idx) {
            if (isPage)
                Elem.color(childTop, getColorBgd(), getColorType());
            else
                Elem.togType(childTop, 'live');
            Elem.display(childCenter, 'block');
        } else {
            if (isPage)
                Elem.color(childTop, getColorType(), getColorBgd());
            else
                Elem.togType(childTop, 'dead');
            Elem.display(childCenter, 'none');
        }
    }
    if (isText)
        Elem.color(document.body, getColorType(), '');
    else
        Elem.color(document.body, getColorType(), getColorBgd());
    config.innerIdx = idx;
    if (config.isInto || innerIdx == null || config.debugType == 'close') {
        config.isInto = false;
        Storage.set('config', config);
        console.log(config);
    } else if (config.debugType == 'open') {
        config.isInto = true;
        Storage.set('config', config);
        jsonToTable(items[idx]); 
    }

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

var addScript = function() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '../../util/temp.js';
    document.head.appendChild(script);
}

window.onresize = function() {
    var constant = config.constant;
    if (!constant) return;
    config.isMobile = (/Android|webOS|iPhone|iPod|BlackBerry|MIX/i.test(navigator.userAgent));
    config.isWechat = (/micromessenger|MicroMessenger/i.test(navigator.userAgent));
    config.zoom = config.isMobile ? constant.zoomMobile : constant.zoomComput;
    config.zoom = config.isWechat ? constant.zoomWechat : config.zoom;
    config.windWidth = Math.floor(window.innerWidth / config.zoom);
    config.windHeight = Math.floor(window.innerHeight / config.zoom);
    config.alertHeight = config.windHeight - constant.alertOffset;
    config.maxHeight = config.windHeight - config.innerOffset;
    config.isWidth = config.windWidth > config.windHeight;
    config.isHeight = config.maxHeight > config.minHeight;
    config.theHeight = Math.max(config.maxHeight, config.minHeight);
    document.body.style.zoom = config.zoom;
    Elem.autosize(null, constant.outerOffset);
}


//获取浏览器是否是移动端
var getAgent = function() {
    // addScript();
    config.constant = {
        color: {
            font: '#333',
            light: '#ccc',
            bgd: '#eee',
            text: '深黑',
            type: 'black',
            style: 'dark',
        },
        isInto: false,
        isOnline: false,
        dataIdx: 'default',
        initType: 'get',
        modeType: 'digger',
        colorType: 'text',
        debugType: 'close',
        outerOffset: 230,
        alertOffset: 716,
        zoomMobile: 1.00,
        zoomWechat: 0.90,
        zoomComput: 0.40,
    };


    var cfg = Storage.get('config') || {};
    // if (config.name == 'sett')
    //     cfg = {};
    if (config.name == cfg.name && cfg.isInto)
        config.innerIdx = cfg.innerIdx || 0;
    else
        config.innerIdx = 0;
    setDefult(cfg, 'isInto');
    setDefult(cfg, 'isOnline');
    setDefult(cfg, 'dataIdx');
    setDefult(cfg, 'initType');
    setDefult(cfg, 'modeType');
    setDefult(cfg, 'color');
    setDefult(cfg, 'colorType');
    setDefult(cfg, 'debugType');

    console.log(config);
    window.onresize();
}

var setDefult = function(cfg, key) {
    config[key] = cfg[key] || config.constant[key];
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

//显示提醒信息
var showLog = function(str) {
    var log = Elem.get('log') || Elem.creat('div', document.body, 'log');
    log.id = 'log';
    config.fadeText = str;
    if (config.fadeOut) {
        window.clearTimeout(config.fadeOut);
        log.setAttribute('fade', 'out');
        setFadeIn(1000);
        setFadeOut(5000);
        setFadeOver(6000);
    } else {
        setFadeIn(0);
        setFadeOut(4000);
        setFadeOver(5000);
    }
    log.style.color = getColorBgd();
    log.style.backgroundColor = getColorType();
}

var setFadeIn = function(gap) {
    config.fadeIn = setTimeout(function() {
        var log = Elem.get('log') || Elem.creat('div', document.body, 'log');
        log.innerHTML = config.fadeText;
        log.setAttribute('fade', 'in');
        config.showLog = true;
        config.fadeIn = null;
    }, gap);  
}

var setFadeOut = function(gap) {
    config.fadeOut = setTimeout(function() {
        var log = Elem.get('log') || Elem.creat('div', document.body, 'log');
        log.setAttribute('fade', 'out');
        config.showLog = false;
        config.fadeOut = null;
    }, gap);  
}

var setFadeOver = function(gap) {
    config.fadeOver = setTimeout(function() {
        config.fadeOver = null;
    }, gap); 
}


//显示弹窗
var showAlert = function(name) {
    Style.display('alert', 'block');
    if (name) {
        setWhite('user-top');
        setWhite('user-flex');
        setWhite('user-line');
        setWhite('user-body');
        setWhite('user-block');
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






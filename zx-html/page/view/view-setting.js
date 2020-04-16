
var data, title;
var gap = 0.2;
var leng = 100;
var name = 'item';
var mode = 'initSplit';
var zoomMobile = 2.00;
var zoomComputer = 0.60;
window.onload = function() {

    data = getJson('json-' + name);
    initSplit();
    setButton();
}

function initText() {
    var list = cloneJson(data);
    var outer = Elem.get('outer');
    outer.innerHTML = JSON.stringify(list).replace(/,/g, ', ');
    window.onresize();
}

function initJoin() {
    var list = cloneJson(data);
    var outer = Elem.get('outer');
    outer.innerHTML = '';
    jsonToTable(outer, list, name);
    window.onresize();
}

function initSplit() {
    var list = cloneJson(data);
    var outer = Elem.get('outer');
    outer.innerHTML = '';
    loopSplit(outer, list, name, 0);
    for (let x in outer.childNodes) {
        var child = outer.childNodes[x];
        if (child && child.style) {
            child.id = child.className + x;
            var node = child.childNodes[1];
            if (node && node.style) {
                node.className = 'view';
            }
        }
    }
	window.onresize();
}


function loopSplit(outer, list, path, layer) {
    var dict;
    var lines = {};
    for (let y in list) {
        if (list[y] == null) continue;
        var length = JSON.stringify(list[y]).length;
        if (typeof (list[y]).constructor === Array) {
            lines[y] = cloneJson(list[y]);
            list[y] = [y];
        } else if (typeof (list[y]) == 'object' && (length > leng*(1-gap))) {
            lines[y] = cloneJson(list[y]);
            list[y] = [y];
        }
        console.log('--------------------------------');
        console.log('path: ' + path);
        console.log(list[y]);
        console.log('obj.length: ' + list[y].length);
        console.log('str.length: ' + length);
    }
    layer ++;
    jsonToTable(outer, list, path, layer);
    for (let y in lines) {
        if (/^\d+$/.test(y))
            dict = path + '[' + y + ']';
        else
            dict = path + '.' + y;
        loopSplit(outer, lines[y], dict, layer);
    }
}



function jsonToTable(outer, data, title, layer) {
    console.log(data);
    var str = JSON.stringify(data);
    // title = title.replace(/]./g, ']');
    str = str[0] == '{' ? '[' + str + ']' : str;
	str = str.replace(/\\n/g, '<br/>').replace(/\\/g, '');
	str = str.replace(/\[{/g, '<table><tr><td><h1>').replace(/}]/g, ']').replace(/},/g, '}');
	str = str.replace(/\[/g, '<table><tr><td>').replace(/]/g, '</td></tr></table>');
	str = str.replace(/{/g, '<tr><td><h1>').replace(/}/g, '</td></tr>');
	str = str.replace(/,/g, '</td><td><h1>').replace(/,/g, '</td><td>');
	str = str.replace(/":/g, '</h1>').replace(/"/g, '');
	var inner = Elem.creat('div', outer, 'inner');
    inner.setAttribute('layer', layer);
	inner.innerHTML = '<h2>' + title + '</h2>' + str;
}


function cloneJson(obj) {
    obj = obj || [];
    return JSON.parse(JSON.stringify(obj));
}

function getJson(name) {
    var json = localStorage.getItem(name);
    json = JSON.parse(json);
    json = JSON.parse(json.toString());
    return json;
}

function setButton() {
    var buttons = document.getElementsByClassName('button');
    for (var i=0;i<buttons.length;i++) {
        var btn = buttons[i];
        togButton(btn);  
        btn.onclick = function() {
            tapButton(this);
        }
    }
}

function tapButton(btn) {
    var modeVal = btn.getAttribute('val-mode');
    var lengVal = btn.getAttribute('val-leng');
    var nameVal = btn.getAttribute('val-name');
    //run action
    if (modeVal && typeof(eval(modeVal)) == 'function') {
        mode = modeVal;
        eval(mode+'();');
    }
    //split length
    if (lengVal) {
        leng = lengVal;
        eval(mode+'();');
    }
    //data name
    if (nameVal) {
        name = nameVal;
        if (name == 'testdata') 
            data = cloneJson(testData);
        else
            data = getJson('json-' + name);
        eval(mode+'();');
    }
    var nodes = btn.parentNode.childNodes;
    for (let x in nodes) {
        togButton(nodes[x]);            
    }
}

function togButton(btn) {
    if (!btn || !btn.style) return;
    if (btn.getAttribute('val-mode') == mode || 
        btn.getAttribute('val-leng') == leng || 
        btn.getAttribute('val-name') == name) {
        Elem.color(btn, '#fff', 'dodgerblue');
    } else {
        Elem.color(btn, 'dodgerblue', '#fff');
    }     
}


function back() {
    var page = JSON.parse(localStorage.getItem('json-page'));
    window.location.href = page;
}

window.onresize = function() {
    var isMobile = (/Android|webOS|iPhone|iPod|BlackBerry|MIX/i.test(navigator.userAgent));
    var zoom = isMobile ? zoomMobile : zoomComputer;
    //20 = outer.paddingTop + outer.paddingBot;
    var height = window.innerHeight / zoom - 20;
    document.body.style.zoom = zoom;
    var outer = Elem.get('outer');
    outer.style.height = (height - 90) + 'px';
    if (isMobile) return;
    var outerBot = Elem.get('outer-bot');
    outerBot.style.display = 'flex';
    outerBot.style.marginTop = "-4px";
    outerBot.style.marginLeft = "-4px";
    var blocks = document.getElementsByClassName('block');
    for (var i=0;i<blocks.length;i++) {
        blocks[i].style.fontSize = '1.2em';
        blocks[i].style.borderTop = 'solid 4px #aaa';
        blocks[i].style.borderLeft = 'solid 4px #aaa';
    }
}


var Elem = {
    get: function (name) {
        return document.getElementById(name);
    },
    creat: function (type, parent, className, idx) {
        var data = document.createElement(type);
        if (className)
            data.className = className;
        if (parent)
            parent.appendChild(data);
        if (idx && className)
            data.id = className + '_' + idx;
        return data;
    },
    color: function(elem, color, bgcolor) {
        if (elem && elem.style) {
            elem.style.color = color;
            elem.style.backgroundColor = bgcolor;
        }
    },
    align: function(elem, align, width) {
        if (elem) {
            elem.style.textAlign = align;
            elem.style.width = width + '%';
        }
    },
    remove: function (elem) {
        if(elem)
            elem.parentNode.removeChild(elem);
        return !!elem;
    }
}

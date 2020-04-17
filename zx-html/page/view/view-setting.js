
var data, title;
var mix = 0.9;
var leng = 100;
var name = 'item';
var mode = 'initSplit';

var isMobile;
var isHide = false;
var isCenter = false;
var zoom = 1.00;
var zoomMobile = 2.10;
var zoomComputer = 0.70;
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
    resetOuter(outer);
    window.onresize();
}

function initSplit() {
    var list = cloneJson(data);
    var outer = Elem.get('outer');
    outer.innerHTML = '';
    loopSplit(outer, list, name, 0);
    resetOuter(outer);
	window.onresize();
}


function resetOuter(outer) {
    if (!isCenter) {
        for (var i=0;i<outer.children.length;i++) {
            var inner = outer.children[i];
            inner.id = inner.className + i;

            var title = inner.children[0];
            var table = inner.children[1];
            table.className = 'view';
            title.style.textAlign = "left";
        } 
    } 

    for (var i=0;i<outer.children.length;i++) {
        var inner = outer.children[i];
        resetInner(inner);
    } 
}

String.prototype.endWith=function(str){  
    return new RegExp(str+"$").test(this);     
} 

function resetInner(inner) {
    var next = inner.nextSibling;
    if (!next || !next.style) 
        return;
    if (next.getAttribute("layer") == inner.getAttribute("layer")) {
        var titleThis = inner.children[0];
        if (!titleThis.innerHTML.endWith("]"))
            return;
        var tbodyThis = inner.children[1].children[0];
        var tbodyNext = next.children[1].children[0];
        // if (tbodyThis.children[0].children.length < 6)
        if (tbodyThis.innerHTML.length < 4*titleThis.innerHTML.length)
            return;
        var title = Elem.creat("tr", tbodyThis);
        var align = isCenter ? "center" : "left";
        var tdstr = "<tr><td class='title' colspan='100' style='text-align:" + align + "';>";
        title.innerHTML = tdstr + next.children[0].innerHTML + "</td></tr>";

        while (tbodyNext.hasChildNodes())
            tbodyThis.appendChild(tbodyNext.firstChild);
        next.parentNode.removeChild(next);
        resetInner(inner);
    }

}


function loopSplit(outer, list, path, layer) {
    layer ++;
    var dict = "";
    var lines = {};
    for (let y in list) {
        if (list[y] == null) continue;
        var length = JSON.stringify(list[y]).length;
        if (typeof (list[y]) == 'object' && (length > leng * mix)) {
            lines[y] = cloneJson(list[y]);
            list[y] = [y];
        }
    }
    console.log('--------------------------------');
    console.log(path);
    console.log(list);
    console.log('obj.length: ' + list.length);
    console.log('str.length: ' + JSON.stringify(list).length);
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
    // console.log(data);
    var str = JSON.stringify(data);
    str = str[0] == '{' ? '[' + str + ']' : str;
	str = str.replace(/\\n/g, '<br/>').replace(/\\/g, '');
	str = str.replace(/\[{/g, '<table><tr><td><h1>').replace(/}]/g, ']').replace(/},/g, '}');
	str = str.replace(/\[/g, '<table><tr><td>').replace(/]/g, '</td></tr></table>');
	str = str.replace(/{/g, '<tr><td><h1>').replace(/}/g, '</td></tr>');
	str = str.replace(/,/g, '</td><td><h1>').replace(/,/g, '</td><td>');
	str = str.replace(/":/g, '</h1>').replace(/"/g, '');
    str = "<div class='title'>" + title + "</div>" + str;
	var inner = Elem.creat('div', outer, 'inner');
    inner.setAttribute('layer', layer);
	inner.innerHTML = str;
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
    if (modeVal == "initCenter") {
        isCenter = !isCenter;
        eval(mode+'();');
    } else
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
        Elem.color(btn, 'dodgerblue', '#eee');
    }     
}


function back() {
    var page = JSON.parse(localStorage.getItem('json-page'));
    window.location.href = page;
}

window.onresize = function() {
    var isMobile = (/Android|webOS|iPhone|iPod|BlackBerry|MIX/i.test(navigator.userAgent));
    zoom = isMobile ? zoomMobile : zoomComputer;
    //20 = outer.paddingTop + outer.paddingBot;
    var height = window.innerHeight / zoom - 20;
    document.body.style.zoom = zoom;
    var outer = Elem.get('outer');
    var child = Elem.get("flex1").children[2];
    //outer.scrollWidth超出body.inner,隐藏居中按钮
    isHide = outer.scrollWidth * zoom > window.innerWidth;
    outer.style.height = (height - 90) + 'px';
    child.style.display = isHide ? "none" : "inline";
    if (isMobile) 
        return;
    //改变outerBot的布局，使3个flex排成一排
    var outerBot = Elem.get('outer-bot');
    outerBot.style.display = 'flex';
    outerBot.style.marginTop = "-2px";
    outerBot.style.marginLeft = "-2px";
    var blocks = document.getElementsByClassName('block');
    for (var i=0;i<blocks.length;i++) {
        blocks[i].style.fontSize = '1.2em';
        blocks[i].style.borderTop = 'solid 2px #888';
        blocks[i].style.borderLeft = 'solid 2px #888';
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
    remove: function (elem) {
        if(elem && elem.style)
            elem.parentNode.removeChild(elem);
    }
}

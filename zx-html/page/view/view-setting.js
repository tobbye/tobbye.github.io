
var data, num, mode, name, title;
window.onload = function() {
    num = 50;
    name = "item";
    mode = "Array";
    data = getJson("json-" + name);
    initJoin();
    // setButton();
}

function initText() {
    var list = cloneJson(data);
    var outer = Elem.get('outer');
    outer.innerHTML = JSON.stringify(list);
    window.onresize();
}

function initJoin() {
    var list = cloneJson(data);
    var outer = Elem.get('outer');
    outer.innerHTML = "";
    jsonToTable(outer, list, name);
    window.onresize();
}

function initSplit() {
    var list = cloneJson(data);
    var outer = Elem.get('outer');
    outer.innerHTML = "";
    loopSplit(outer, list, name);
    for (let x in outer.childNodes) {
        var child = outer.childNodes[x];
        if (child && child.style) {
            child.id = child.className + x;
            var node = child.childNodes[1];
            if (node && node.style) {
                node.className = "view";
            }
        }
    }
	window.onresize();
}


function loopSplit(outer, list, key) {
    var dict;
    var lines = {};
    for (let y in list) {
        // if (list[y] !=  null)
        //     continue;
        var length = JSON.stringify(list[y]).length;
        if (list[y] != null && mode == "Object") {
            //流下object, 以及str.len>50 || list.len>=3
            if (typeof (list[y]) !== "object")
                continue;
            if (length < num && list[y].length < 3)
                continue;
        } 
        if (list[y] != null && mode == "Array") {
            //忽略Array和长的，留下短的
            if (typeof (list[y]).constructor === Array)
                continue;
            if (length < num)
                continue;
        }


        lines[y] = cloneJson(list[y]);
        list[y] = [y];
    }
    // if (list.length > 0)
        jsonToTable(outer, list, key);
    for (let y in lines) {
        if (/^\d+$/.test(y))
            dict = key + "[" + y + "]";
        else
            dict = key + "." + y;
        loopSplit(outer, lines[y], dict);
    }
}



function jsonToTable(outer, data, title) {
    console.log(mode);
    console.log(data);
    var str = JSON.stringify(data);
    // title = title.replace(/]./g, "]");
    str = str[0] == "{" ? "[" + str + "]" : str;
	str = str.replace(/\\n/g, '<br/>').replace(/\\/g, '');
	str = str.replace(/\[{/g, '<table><tr><td><h1>').replace(/}]/g, ']').replace(/},/g, '}');
	str = str.replace(/\[/g, '<table><tr><td>').replace(/]/g, '</td></tr></table>');
	str = str.replace(/{/g, '<tr><td><h1>').replace(/}/g, '</td></tr>');
	str = str.replace(/,/g, '</td><td><h1>').replace(/,/g, '</td><td>');
	str = str.replace(/":/g, '</h1>').replace(/"/g, '');
	var inner = Elem.creat("div", outer, 'inner');
	inner.innerHTML = "<h2>" + title + "</h2>" + str;
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

function initData(str) {
    name = str;
    data = getJson("json-" + name);
    initJoin();
}

function initMode(str) {
    mode = str;
}

function initBreak(str) {
    num = str;
}

function setButton() {
    var buttons = document.getElementsByClassName("button");
    for (var i=0;i<buttons.length;i++) {
        buttons[i].onclick = function() {
            var nodes = this.parentNode.childNodes;
            for (let idx in nodes) {
                if (this.innerHTML == nodes[idx].innerHTML)  {
                    Elem.color(nodes[idx], "#fff", "dodgerblue");
                } else {
                    Elem.color(nodes[idx], "dodgerblue", "#fff");
                }               
            }
        }
    }
}



function back() {
    var page = JSON.parse(localStorage.getItem('json-page'));
    window.location.href = page;
}

window.onresize = function() {
    var outer = Elem.get('outer');
    if (/Android|webOS|iPhone|iPod|BlackBerry|MIX/i.test(navigator.userAgent)) {
        document.body.style.zoom =  2;
        document.body.style.height = window.innerHeight * 0.5 + "px";
        outer.style.height = (window.innerHeight * 0.5 - 80) + 'px';
    } else {
        outer.style.height = (window.innerHeight - 80) + 'px';
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
            data.id = className + "_" + idx;
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
            elem.style.width = width + "%";
        }
    },
    remove: function (elem) {
        if(elem)
            elem.parentNode.removeChild(elem);
        return !!elem;
    }
}

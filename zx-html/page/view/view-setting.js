
var data, name;

var setting = {
    mix: 0.9,
    leng: 100,
    name: "item",
    mode: "initSplit",
    view: "isFlex",
    orgText: ["堆叠", "平铺", "直流", "分流", "居中", "居左", "对齐", "分散"],
    tgtText: ["平铺", "堆叠", "分流", "直流", "居左", "居中", "分散", "对齐"],

    isPile: true,
    isFlex: true,
    isFlow: true,
    isAlign: true,
    isCenter: true,
    isHide: false,
    isSplit: true,
    isMobile: false,
    isElement: false,
    zoom: 1.00,
    zoomMobile: 2.00,
    zoomComputer: 0.70,
};


window.onload = function() {
    if (localStorage.getItem("item")) {
        name = "item";
        data = getJson(name);  
    } else {
        name = "setting";
        data = setting;
    }

    initSplit();
    setButton();
}

function initText() {
    var list = copyJson(data);
    var outer = Elem.get('outer');
    outer.innerHTML = JSON.stringify(list).replace(/,/g, ', ');
    window.onresize();
}


// initJoin: toReplace
// initJoin: toElement - loopElement

// initSplit: loopSplit - toReplace
// initSplit: loopSplit - toElement - loopElement

function initJoin() {
    var list = copyJson(data);
    var outer = Elem.get('outer');
    outer.innerHTML = '';
    jsonToView(outer, list, name, 0);
    resetOuter(outer);
    window.onresize();
}

function initSplit() {
    var list = copyJson(data);
    var outer = Elem.get('outer');
    outer.innerHTML = '';
    loopSplit(outer, list, name, 0);
    resetOuter(outer);
	window.onresize();
}


function loopSplit(outer, list, path, layer) {
    layer ++;
    var dict = "";
    var lines = {};
    for (let y in list) {
        if (list[y] == null) continue;
        var length = JSON.stringify(list[y]).length;
        if (typeof (list[y]) == 'object' && (length > setting.leng * setting.mix)) {
            lines[y] = copyJson(list[y]);
            list[y] = [y];
        }
    }
    // console.log('--------------------------------');
    // console.log(path);
    // console.log(list);
    // console.log('obj.length: ' + list.length);
    // console.log('str.length: ' + JSON.stringify(list).length);
    jsonToView(outer, list, path, layer);
    for (let y in lines) {
        if (/^\d+$/.test(y))
            dict = path + '[' + y + ']';
        else
            dict = path + '.' + y;
        loopSplit(outer, lines[y], dict, layer);
    }
}


function jsonToView(outer, data, title, layer) {
    if (setting.isElement)
        toElement(outer, data, title, layer);
    else
        toReplace(outer, data, title, layer);
}


const objStr = '<table><tr><td><h1>';
const arrStr = '<table><tr><td>';

function toReplace(outer, data, title, layer) {
    // console.log(data);
    var str = JSON.stringify(data);
	str = str.replace(/\\n/g, '<br/>').replace(/\\/g, '');

    if (setting.isSplit) {
        if (setting.isFlex) 
            str = str.replace(/\[{/g, '{').replace(/}]/g, '}');
        
        str = str.replace(/{/g, '<table><tr><td><h1>').replace(/}/g, '</td></tr></table>');
    } else {
        str = str[0] == '{' ? '[' + str + ']' : str;
        str = str.replace(/\[{/g, '<table><tr><td><h1>').replace(/}]/g, ']').replace(/},/g, '}');
        str = str.replace(/{/g, '<tr><td><h1>').replace(/}/g, '</td></tr>');
    }
    // str = str.replace(/,\[/g, '</td><td>[').replace(/,{/g, '</td><td>{');
    str = str.replace(/\[/g, '<table><tr><td>').replace(/]/g, '</td></tr></table>');
    if (setting.isPile) {
        //平铺 && 堆叠
        str = str.replace(/,/g, '</td><td><h1>');
        if (setting.isFlex) 
            str = str.replace(/":/g, '</h1>');
        else
            str = str.replace(/":/g, '</h1>'); 
        str = str.replace(/"/g, '');
        str = "<h2 float='left'>" + title + "</h2>" + str;
    } else {
        //直流 && 分流
        str = str.replace(/,/g, '</td></tr><tr><td><h1>');
        if (setting.isFlow)
            str = str.replace(/":/g, '</h1>');
        else 
            str = str.replace(/":/g, '</h1></td><td>'); 
        str = str.replace(/"/g, '');
        str = "<h2 float='top'>" + title + "</h2>" + str;
    }

	var inner = Elem.creat('div', outer, 'inner');
    inner.setAttribute('layer', layer);
	inner.innerHTML = str;
}



function toElement(outer, data, title, layer) {
    var inner = Elem.creat('div', outer, 'inner');
    inner.setAttribute('layer', layer);
    var child = Elem.creat("div", inner, "title");
    child.innerHTML = title;
    loopElement(inner, data, 0);
}

function loopElement(inner, data, idx) {
    if (data == null) 
        return;
    inner.innerHTML += toHead(idx);
    var table = Elem.creat("table", inner, "table");
    var tr = Elem.creat("tr", table, "row");
    for (let y in data) {
        var td = Elem.creat("td", tr, "col");
        if (typeof (data[y]) == "object")
            loopElement(td, data[y], y);
        else
            td.innerHTML = toHead(y) + data[y];
    }
}

function toHead(idx) {
    return !isNaN(idx)? "":"<h1>" + idx + "</h1>";
}



function resetOuter(outer) {
    for (var i=0;i<outer.children.length;i++) {
        var inner = outer.children[i];
        inner.id = inner.className + i;
        var title = inner.children[0];
        var table = inner.children[1];

        //居中
        if (!setting.isCenter) {

            table.className = 'align-left';
            title.style.textAlign = "left";
        } 
        //堆叠
        while (setting.isFlex && inner.children.length > 2) {
            var tableNext = inner.children[2];
            var trNext = tableNext.children[0].children[0];
            table.appendChild(trNext);
            inner.removeChild(tableNext);
        }
    } 

    for (var i=0;i<outer.children.length;i++) {
        var inner = outer.children[i];
        //对齐
        if (setting.isAlign) {
            setAlign(inner);
        }
    } 
}


function setAlign(inner) {
    var next = inner.nextSibling;
    if (!next || !next.hasChildNodes()) 
        return;
    if (next.getAttribute("layer") == inner.getAttribute("layer")) {
        var thisTitle = inner.children[0];
        if (!thisTitle.innerHTML.endWith("]"))
            return;
        var thisTbody = inner.children[1].children[0];
        var nextTbody = next.children[1].children[0];
        var thisLength = thisTbody.children[0].children.length;
        var nextLength = nextTbody.children[0].children.length;
        var count = (thisTbody.children.length + 1) / 2;
        var between = thisTbody.innerHTML.length / nextTbody.innerHTML.length / count;
        if (thisTbody.innerHTML.length < 4*thisTitle.innerHTML.length)
            return;
        if (nextLength < 10 && (between < 0.707 || between > 1.414))
            return;
        if (thisLength != nextLength)
            return;

        var title = Elem.creat("tr", thisTbody);
        var align = setting.isCenter ? "center" : "left";
        var tdstr = "<tr><td class='title' colspan='100'><h2 style='text-align:" + align + "';>";
        title.innerHTML = tdstr + next.children[0].innerHTML + "</h2></td></tr>";

        while (nextTbody.hasChildNodes())
            thisTbody.appendChild(nextTbody.firstChild);
        next.parentNode.removeChild(next);
        setAlign(inner);
    }

}


function copyJson(json) {
    return JSON.parse(JSON.stringify(json || []));
}

function getJson(name) {
    return JSON.parse(localStorage.getItem(name));
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
    var viewVal = btn.getAttribute('val-view');
    var lengVal = btn.getAttribute('val-leng');
    var nameVal = btn.getAttribute('val-name');
    //run action
    if (modeVal && typeof(eval(modeVal)) == 'function') {
        setting.isSplit = modeVal == "initSplit";
        setting.mode = modeVal;
    }
    if (viewVal) {
        togButtonText(btn, viewVal, "isFlex");
        togButtonText(btn, viewVal, "isFlow");
        togButtonText(btn, viewVal, "isAlign");
        togButtonText(btn, viewVal, "isCenter"); 
        setting.view = viewVal;
    }

    //split length
    if (lengVal) {
        setting.leng = lengVal;
    }
    //data name
    if (nameVal) {
        name = nameVal;
        setting.name = nameVal;
        if (nameVal == 'testdata') 
            data = copyJson(testData);
        else
            data = getJson(nameVal);
    }

    if (name == 'setting') 
        data = copyJson(setting);
    eval(setting.mode+'();');
    var nodes = btn.parentNode.childNodes;
    for (let x in nodes) {
        togButton(nodes[x]);            
    }
}


function togButton(btn) {
    if (!btn || !btn.style) return;
    if (btn.getAttribute('val-mode') == setting.mode || 
        btn.getAttribute('val-view') == setting.view || 
        btn.getAttribute('val-leng') == setting.leng || 
        btn.getAttribute('val-name') == setting.name) {
        Elem.color(btn, '#fff', 'dodgerblue');
    } else {
        Elem.color(btn, 'dodgerblue', '#eee');
    }     
}

function togButtonText(btn, viewVal, key) {
    if (viewVal == key) {
        console.log(viewVal + "=" + key);
        if (viewVal == "isFlex") 
            setting.isPile = true;
        if (viewVal == "isFlow") 
            setting.isPile = false;
        setting[key] = !setting[key];
        for (let x in setting.orgText) {
            if (btn.innerHTML == setting.orgText[x]) {
                btn.innerHTML = setting.tgtText[x];
                return;
            }
        }
    }
}

function back() {
    window.location.href = getJson('page') || "../home/home.html";
}

window.onresize = function() {
    setting.isMobile = (/Android|webOS|iPhone|iPod|BlackBerry|MIX/i.test(navigator.userAgent));
    setting.zoom = setting.isMobile ? setting.zoomMobile : setting.zoomComputer;
    //20 = outer.paddingTop + outer.paddingBot;
    var height = window.innerHeight / setting.zoom - 20;
    document.body.style.zoom = setting.zoom;
    var outer = Elem.get('outer');
    var child = Elem.get("flex2").children[1];
    //outer.scrollWidth超出body.inner,隐藏居中按钮
    setting.isHide = outer.scrollWidth * setting.zoom > window.innerWidth;
    outer.style.height = (height - 90) + 'px';
    // child.style.display = setting.isHide ? "none" : "inline";
    var agent = setting.isMobile ? "mobile" : "computer";
    var outerBot = Elem.get('outer-bot');
    outerBot.setAttribute("agent", agent);
    var blocks = document.getElementsByClassName('block');
    for (var i=0;i<blocks.length;i++) {
        blocks[i].setAttribute("agent", agent);
    }
}


String.prototype.endWith=function(str){  
    return new RegExp(str+"$").test(this);     
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

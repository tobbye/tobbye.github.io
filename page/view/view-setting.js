
var data, name;

var setting = {
    mix: 0.9,
    leng: 100,
    name: "item",
    mode: "initSplit",
    view: "isFlex",
    btnKey: ["isFlex", "isFlow", "isCenter", "isAlign"],
    btnDefault: ["平铺", "直流", "居中", "对齐"],
    btnOpposite: ["堆叠", "分流", "居左", "分散"],

    isPile: true,
    isFlex: false,
    isFlow: true,
    isAlign: true,
    isCenter: false,
    isHide: false,
    isOver: false,
    isEdit: false,
    isText: false,
    isSplit: true,
    isMobile: false,
    isElement: false,
    zoom: 1.00,
    zoomMobile: 2.00,
    zoomComputer: 0.70,

    desc: {
        mix: "混合系数",
        leng: "拆分长度",
        name: "数据名称",
        mode: "操作模式",
        view: "视图类型",

        isPile: "堆叠吗",
        isFlex: "堆叠还是平铺",
        isFlow: "直流还是分流",
        isAlign: "对齐吗",
        isCenter: "居中吗",
        isHide: "页面超出宽度时隐藏居中按钮吗",
        isOver: "页面超出宽度了吗",
        isEdit: "是编辑模式吗",
        isText: "是文本模式吗",
        isSplit: "是拆分模式吗",
        isMobile: "是手机端吗",
        isElement: "采用DOM节点的方式生成吗",
        zoom: "当前页面缩放比例",
        zoomMobile: "手机端缩放比例",
        zoomComputer: "电脑端缩放比例",
    }
};


window.onload = function() {
    if (localStorage.getItem("item")) {
        name = "item";
        data = getJson(name);  
    } else {
        name = "setting";
        data = setting;
    }

    setButton();
    initSplit();
}

function initText() {
    var list = copyJson(data);
    var outer = Elem.get("outer");
    outer.innerHTML = JSON.stringify(list).replace(/,/g, ", ");
    window.onresize();
}

function initEdit() {
    var outer = Elem.get("outer");
    outer.innerHTML = "";
    var textarea = Elem.creat("textarea", outer);
    textarea.id = "textarea";
    textarea.innerHTML = JSON.stringify(data).replace(/,/g, ", ");
}

function initSave() {
    setting.mode = "initText";
    var textarea = Elem.get("textarea");
    var str = "var custom = #0;"
    var val = textarea ? textarea.value : JSON.stringify(data);
    console.log(val);
    str = str.replace("#0", val).replace(/[\t\n\s]/g, "");
    data = eval(str);
    if (name == "custom")
        localStorage.setItem(name, JSON.stringify(data));
    initText();
}


// initJoin: toReplace
// initJoin: toElement - loopElement

// initSplit: loopSplit - toReplace
// initSplit: loopSplit - toElement - loopElement

function initJoin() {
    var list = copyJson(data);
    var outer = Elem.get("outer");
    outer.innerHTML = "";
    jsonToView(outer, list, name, 0);
    window.onresize();
    resetOuter(outer);
}

function initSplit() {
    var list = copyJson(data);
    var outer = Elem.get("outer");
    outer.innerHTML = "";
    loopSplit(outer, list, name, 0);
    window.onresize();
    resetOuter(outer);
}


function loopSplit(outer, list, path, layer) {
    layer ++;
    var dict = "";
    var lines = {};
    for (let y in list) {
        if (list[y] == null) continue;
        var length = JSON.stringify(list[y]).length;
        if (typeof (list[y]) == "object" && (length > setting.leng * setting.mix)) {
            lines[y] = copyJson(list[y]);
            list[y] = [y];
        }
    }
    console.log("--------------------------------");
    console.log(path);
    console.log(list);
    console.log("obj.length: " + list.length);
    console.log("str.length: " + JSON.stringify(list).length);
    jsonToView(outer, list, path, layer);
    for (let y in lines) {
        if (/^\d+$/.test(y))
            dict = path + "[" + y + "]";
        else
            dict = path + "." + y;
        loopSplit(outer, lines[y], dict, layer);
    }
}


function jsonToView(outer, data, title, layer) {
    if (setting.isElement)
        toElement(outer, data, title, layer);
    else
        toReplace(outer, data, title, layer);
}


function toReplace(outer, data, title, layer) {
    // console.log(data);
    var str = JSON.stringify(data);
    str = str.replace(/\\n/g, "<br/>").replace(/\\/g, "");
    str = str.replace(/{"originalStyleAttribute":"[^"]*"}/g, `["originalStyleAttribute"]`);
    //[,,]转换成[;;]
	str = str.replace(/(\[[^\[\]\{\}]*\])/g, function($1) {return $1.replace(/,/g, ";")});
    //拆分 && 合并
    if (setting.isSplit) {
        if (!setting.isFlex) 
            str = str.replace(/\[{/g, "{").replace(/}]/g, "}");
        str = str.replace(/\{/g, "[<h1>").replace(/}/g, "]");
    } else {
        str = str[0] == "{" ? "[" + str + "]" : str;
        //{{},{}}转换成{[],[]}
        str = str.replace(/:{/g, ":[<h1>").replace(/(},"[^\W]*":)/g, function($1) {return $1.replace("}", "]")});
        str = str.replace(/\[{/g, "[<h1>").replace(/}]/g, "]").replace(/},/g, "}");
    }
    // {}转换成tr, []转换成table
    str = str.replace(/\{/g, "<tr><td><h1>").replace(/}/g, "</td></tr>");
    str = str.replace(/\[/g, "<table><tr><td>").replace(/]/g, "</td></tr></table>");
    if (setting.isPile) {
        //平铺 && 堆叠
        str = str.replace(/,/g, "</td><td><h1>");
        str = str.replace(/;/g, "</td><td>");
        if (setting.isFlex) 
            str = str.replace(/":/g, "</h1>");
        else
            str = str.replace(/":/g, "</h1>"); 
        str = str.replace(/"/g, "");
        str = "<h2 float='left'>" + title + "</h2>" + str;
    } else {
        //直流 && 分流
        str = str.replace(/,/g, "</td></tr><tr><td><h1>");
        str = str.replace(/;/g, "</td></tr><tr><td>");
        if (setting.isFlow)
            str = str.replace(/":/g, "</h1>");
        else 
            str = str.replace(/":/g, "</h1></td><td>"); 
        str = str.replace(/"/g, "");
        str = "<h2 float='top'>" + title + "</h2>" + str;
    }

	var inner = Elem.creat("div", outer, "inner");
    inner.setAttribute("layer", layer);
	inner.innerHTML = str;
}



function toElement(outer, data, title, layer) {
    var inner = Elem.creat("div", outer, "inner");
    inner.setAttribute("layer", layer);
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

            table.className = "align-left";
            title.style.textAlign = "left";
        } 
        //堆叠
        while (!setting.isFlex && inner.children.length > 2) {
            var tableNext = inner.children[2];
            var trNext = tableNext.children[0].children[0];
            table.appendChild(trNext);
            inner.removeChild(tableNext);
        }
    } 

    for (var i=0;i<outer.children.length;i++) {
        var inner = outer.children[i];
        if (setting.isAlign) {
            resetAlign(inner);
        }
    } 
}

//对齐
function resetAlign(inner) {
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
        var tdstr = `<tr><td class='title' colspan='100'><h2 style='text-align:` + align + `';>`;
        title.innerHTML = tdstr + next.children[0].innerHTML + "</h2></td></tr>";

        while (nextTbody.hasChildNodes())
            thisTbody.appendChild(nextTbody.firstChild);
        next.parentNode.removeChild(next);
        resetAlign(inner);
    }
}


function copyJson(json) {
    return JSON.parse(JSON.stringify(json || []));
}

function getJson(name) {
    return JSON.parse(localStorage.getItem(name));
}

function setButton() {
    var buttons = document.getElementsByClassName("button");
    for (var i=0;i<buttons.length;i++) {
        var btn = buttons[i];
        setButtonId(btn);
        togButton(btn);  
        btn.onclick = function() {
            tapButton(this);
        }
    }
}

function setButtonId(btn) {
    var modeVal = btn.getAttribute("val-mode");
    var viewVal = btn.getAttribute("val-view");
    var lengVal = btn.getAttribute("val-leng");
    var nameVal = btn.getAttribute("val-name");
    btn.id = modeVal || viewVal || lengVal || nameVal;
}


function tapButton(btn) {
    var modeVal = btn.getAttribute("val-mode");
    var viewVal = btn.getAttribute("val-view");
    var lengVal = btn.getAttribute("val-leng");
    var nameVal = btn.getAttribute("val-name");
    //run action
    if (modeVal) {
        setting.mode = modeVal;
        setting.isSplit = modeVal == "initSplit";
        setting.isEdit = /initText|initEdit/i.test(modeVal);
        setting.isText = /initText|initEdit|initSave/i.test(modeVal);
        var block2 = Elem.get("flex2").parentNode;
        var block3 = Elem.get("flex3").parentNode;
        togButtonHide(block2, setting.isText, "block");
        togButtonHide(block3, setting.isText, "block");
        togButtonHide(block3, !setting.isSplit, "block");
    }
    if (viewVal) {
        togButtonView(btn, viewVal, "isFlex");
        togButtonView(btn, viewVal, "isFlow");
        togButtonView(btn, viewVal, "isAlign");
        togButtonView(btn, viewVal, "isCenter"); 
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
        data = getJson(nameVal);
    }

    if (name == "setting") 
        data = copyJson(setting);
    // if (typeof(setting.mode) == "function")
        eval(setting.mode+"();");
    var nodes = btn.parentNode.childNodes;
    for (let x in nodes) {
        togButton(nodes[x]);            
    }
}


function togButton(btn) {
    if (!btn || !btn.style) return;
    if (btn.getAttribute("val-mode") == setting.mode || 
        btn.getAttribute("val-view") == setting.view || 
        btn.getAttribute("val-leng") == setting.leng || 
        btn.getAttribute("val-name") == setting.name) {
        btn.setAttribute("btype", "live");
    } else {
        btn.setAttribute("btype", "dead");
    }     
}

function togButtonView(btn, viewVal, key) {
    if (viewVal == key) {
        if (viewVal == "isFlex") 
            setting.isPile = true;
        if (viewVal == "isFlow") 
            setting.isPile = false;
        setting[key] = !setting[key];
        togButtonText(btn, key);
    }
}


function togButtonText(btn, key) {
    for (let x in setting.btnKey) {
        if (key == setting.btnKey[x]) {
            if (setting[key])
                btn.innerHTML = setting.btnDefault[x];
            else
                btn.innerHTML = setting.btnOpposite[x];
        }
    }
}

function togButtonHide(btn, hide, display) {
    if (btn && btn.style)
        btn.style.display = hide ? "none" : display;
}


function back() {
    var config = getJson("config");
    var href = config ? config.name : "home";
    window.location.href = "../#1/#1.html".replace(/#1/g, href);
}

window.onresize = function() {
    setAgent();
    setCenter();
    setCustom();
}

function setAgent() {
    setting.isMobile = (/Android|webOS|iPhone|iPod|BlackBerry|MIX/i.test(navigator.userAgent));
    setting.zoom = setting.isMobile ? setting.zoomMobile : setting.zoomComputer;
    document.body.style.zoom = setting.zoom;
    var agent = setting.isMobile ? "mobile" : "computer";
    var outerBot = Elem.get("outer-bot");
    outerBot.setAttribute("agent", agent);
    var blocks = document.getElementsByClassName("block");
    for (var i=0;i<blocks.length;i++) {
        blocks[i].setAttribute("agent", agent);
    }
}

function setCenter() {
    //20 = outer.paddingTop + outer.paddingBot;
    var height = window.innerHeight / setting.zoom - 20;
    var outer = Elem.get("outer");
    var btnCenter = Elem.get("flex2").children[2];
    var btnAlign = Elem.get("flex2").children[3];
    //outer.scrollWidth超出body.inner,隐藏居中按钮
    setting.isOver = outer.scrollWidth * setting.zoom > window.innerWidth;
    setting.isHide = setting.isOver || !setting.isPile;
    outer.style.height = (height - 90) + "px";
    togButtonHide(btnCenter, setting.isHide, "inline");
    togButtonText(btnCenter, "isCenter");
    if (!setting.isPile) 
        setting.isCenter = true;
    if (setting.isOver) 
        setting.isCenter = false;
}

function setCustom() {
    var btnJoin = Elem.get("initJoin");
    var btnSplit = Elem.get("initSplit");
    togButtonHide(btnJoin, setting.isEdit, "inline");
    togButtonHide(btnSplit, setting.isEdit, "inline");

    var btnEdit = Elem.get("initEdit");
    var btnSave = Elem.get("initSave");
    togButtonHide(btnEdit, !setting.isEdit, "inline");
    togButtonHide(btnSave, !setting.isEdit, "inline");
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
            data.id = className + "_" + idx;
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

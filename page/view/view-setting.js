
let data, name;

let Setting = {
    mix: 0.9,
    leng: 100,
    name: "Item",
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
    isPhone: false,
    isElement: !true,
    zoom: 1.00,
    zoomPhone: 2.00,
    zoomPad: 1.00,
    zoomPc: 0.70,

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
        isPhone: "是手机端吗",
        isElement: "采用DOM节点的方式生成吗",
        zoom: "当前页面缩放比例",
        zoomPhone: "手机端缩放比例",
        zoomPc: "电脑端缩放比例",
    }
};


window.onload = function() {
    if (localStorage.getItem("Item")) {
        name = "Item";
        data = getJson(name);  
    } else {
        name = "Setting";
        data = Setting;
    }

    setButton();
    initSplit();
}

function initText() {
    let list = copyJson(data);
    let outer = Elem.get("outer");
    outer.innerHTML = JSON.stringify(list).replace(/,/g, ", ");
    window.onresize();
}

function initEdit() {
    let outer = Elem.get("outer");
    outer.innerHTML = "";
    let textarea = Elem.creat("textarea", outer);
    textarea.id = "textarea";
    textarea.innerHTML = JSON.stringify(data).replace(/,/g, ", ");
}

function initSave() {
    Setting.mode = "initText";
    let textarea = Elem.get("textarea");
    let str = "let Custom = #0;"
    let val = textarea ? textarea.value : JSON.stringify(data);
    console.log(val);
    str = str.replace("#0", val).replace(/[\t\n\s]/g, "");
    data = eval(str);
    if (name == "Custom")
        localStorage.setItem(name, JSON.stringify(data));
    initText();
}


// initJoin: toReplace
// initJoin: toElement - loopElement

// initSplit: loopSplit - toReplace
// initSplit: loopSplit - toElement - loopElement

function initJoin() {
    let list = copyJson(data);
    let outer = Elem.get("outer");
    outer.innerHTML = "";
    jsonToView(outer, list, name, 0);
    window.onresize();
    resetOuter(outer);
}

function initSplit() {
    let list = copyJson(data);
    let outer = Elem.get("outer");
    outer.innerHTML = "";
    loopSplit(outer, list, name, 0);
    window.onresize();
    resetOuter(outer);
}


function loopSplit(outer, list, path, layer) {
    layer ++;
    let dict = "";
    let lines = {};
    for (let y in list) {
        if (list[y] == null) continue;
        let length = JSON.stringify(list[y]).length;
        if (typeof (list[y]) == "object" && (length > Setting.leng * Setting.mix)) {
            lines[y] = copyJson(list[y]);
            list[y] = [y];
        }
    }
    // console.log("--------------------------------");
    console.log(path);
    // console.log(list);
    // console.log("obj.length: " + list.length);
    // console.log("str.length: " + JSON.stringify(list).length);
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
    if (Setting.isElement)
        toElement(outer, data, title, layer);
    else
        toReplace(outer, data, title, layer);
}


function toReplace(outer, data, title, layer) {
    // console.log(data);
    let str = JSON.stringify(data);
    str = str.replace(/\\n/g, "<br/>").replace(/\\/g, "");
    str = str.replace(/{"originalStyleAttribute":"[^"]*"}/g, `["originalStyleAttribute"]`);
    //[,,]转换成[;;]
	str = str.replace(/(\[[^\[\]\{\}]*\])/g, function($1) {return $1.replace(/,/g, ";")});
    //拆分 && 合并
    if (Setting.isSplit) {
        if (!Setting.isFlex) 
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
    if (Setting.isPile) {
        //平铺 && 堆叠
        str = str.replace(/,/g, "</td><td><h1>");
        str = str.replace(/;/g, "</td><td>");
        if (Setting.isFlex) 
            str = str.replace(/":/g, "</h1>");
        else
            str = str.replace(/":/g, "</h1>"); 
        str = str.replace(/"/g, "");
        str = "<h2 float='left'>" + title + "</h2>" + str;
    } else {
        //直流 && 分流
        str = str.replace(/,/g, "</td></tr><tr><td><h1>");
        str = str.replace(/;/g, "</td></tr><tr><td>");
        if (Setting.isFlow)
            str = str.replace(/":/g, "</h1>");
        else 
            str = str.replace(/":/g, "</h1></td><td>"); 
        str = str.replace(/"/g, "");
        str = "<h2 float='top'>" + title + "</h2>" + str;
    }

	let inner = Elem.creat("div", outer, "inner");
    inner.setAttribute("layer", layer);
	inner.innerHTML = str;
}



function toElement(outer, data, title, layer) {
    let inner = Elem.creat("div", outer, "inner");
    inner.setAttribute("layer", layer);
    let child = Elem.creat("div", inner, "title");
    child.innerHTML = '<h2>' + title + '</h2>';
    loopElement(inner, data, 0);
}

function loopElement(inner, data, idx) {
    if (data == null) 
        return;
    inner.innerHTML += toHead(idx);
    let table = Elem.creat("table", inner, "table");
    let tr = Elem.creat("tr", table, "row");
    for (let y in data) {
        let td = Elem.creat("td", tr, "col");
        if (typeof (data[y]) === "object")
            loopElement(td, data[y], y);
        else
            td.innerHTML = toHead(y) + toText(data[y]);
    }
}

function toHead(idx) {
    return !isNaN(idx)? "":"<h1>" + idx + "</h1>";
}

function toText(data) {
    return data || data.replace(/\r\n/g,'<br/>');
}



function resetOuter(outer) {
    for (let i=0;i<outer.children.length;i++) {
        let inner = outer.children[i];
        inner.id = inner.className + i;
        let title = inner.children[0];
        let table = inner.children[1];

        //居中
        if (!Setting.isCenter) {

            table.className = "align-left";
            title.style.textAlign = "left";
        } 
        //堆叠
        while (!Setting.isFlex && inner.children.length > 2) {
            let tableNext = inner.children[2];
            let trNext = tableNext.children[0].children[0];
            table.appendChild(trNext);
            inner.removeChild(tableNext);
        }
    } 

    for (let i=0;i<outer.children.length;i++) {
        let inner = outer.children[i];
        if (Setting.isAlign) {
            resetAlign(inner);
        }
    } 
}

//对齐
function resetAlign(inner) {
    let next = inner.nextSibling;
    if (!next || !next.hasChildNodes()) 
        return;
    if (next.getAttribute("layer") == inner.getAttribute("layer")) {
        let thisTitle = inner.children[0];
        if (!thisTitle.innerHTML.endWith("]"))
            return;
        let thisTbody = inner.children[1].children[0];
        let nextTbody = next.children[1].children[0];
        let thisLength = thisTbody.children[0].children.length;
        let nextLength = nextTbody.children[0].children.length;
        let count = (thisTbody.children.length + 1) / 2;
        let between = thisTbody.innerHTML.length / nextTbody.innerHTML.length / count;
        if (thisTbody.innerHTML.length < 4*thisTitle.innerHTML.length)
            return;
        if (nextLength < 10 && (between < 0.707 || between > 1.414))
            return;
        if (thisLength != nextLength)
            return;

        let title = Elem.creat("tr", thisTbody);
        let align = Setting.isCenter ? "center" : "left";
        let tdstr = `<tr><td class='title' colspan='100'><h2 style='text-align:` + align + `';>`;
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
    let buttons = document.getElementsByClassName("button");
    for (let i=0;i<buttons.length;i++) {
        let btn = buttons[i];
        setButtonId(btn);
        togButton(btn);  
        btn.onclick = function() {
            tapButton(this);
        }
    }
}

function setButtonId(btn) {
    let modeVal = btn.getAttribute("val-mode");
    let viewVal = btn.getAttribute("val-view");
    let lengVal = btn.getAttribute("val-leng");
    let nameVal = btn.getAttribute("val-name");
    btn.id = modeVal || viewVal || lengVal || nameVal;
}


function tapButton(btn) {
    let modeVal = btn.getAttribute("val-mode");
    let viewVal = btn.getAttribute("val-view");
    let lengVal = btn.getAttribute("val-leng");
    let nameVal = btn.getAttribute("val-name");
    //run action
    if (modeVal) {
        Setting.mode = modeVal;
        Setting.isSplit = modeVal == "initSplit";
        Setting.isEdit = /initText|initEdit/i.test(modeVal);
        Setting.isText = /initText|initEdit|initSave/i.test(modeVal);
        let block2 = Elem.get("flex2").parentNode;
        let block3 = Elem.get("flex3").parentNode;
        togButtonHide(block2, Setting.isText, "block");
        togButtonHide(block3, Setting.isText, "block");
        togButtonHide(block3, !Setting.isSplit, "block");
    }
    if (viewVal) {
        togButtonView(btn, viewVal, "isFlex");
        togButtonView(btn, viewVal, "isFlow");
        togButtonView(btn, viewVal, "isAlign");
        togButtonView(btn, viewVal, "isCenter"); 
        Setting.view = viewVal;
    }

    //split length
    if (lengVal) {
        Setting.leng = lengVal;
    }
    //data name
    if (nameVal) {
        name = nameVal;
        Setting.name = nameVal;
        data = getJson(nameVal);
    }

    if (name == "Setting") 
        data = copyJson(Setting);
    Setting.isElement = name == "CONSTRUCTORS";
    // if (typeof(Setting.mode) == "function")
        eval(Setting.mode+"();");
    let nodes = btn.parentNode.childNodes;
    for (let x in nodes) {
        togButton(nodes[x]);            
    }
}


function togButton(btn) {
    if (!btn || !btn.style) return;
    if (btn.getAttribute("val-mode") == Setting.mode || 
        btn.getAttribute("val-view") == Setting.view || 
        btn.getAttribute("val-leng") == Setting.leng || 
        btn.getAttribute("val-name") == Setting.name) {
        btn.setAttribute("btype", "live");
    } else {
        btn.setAttribute("btype", "dead");
    }     
}

function togButtonView(btn, viewVal, key) {
    if (viewVal == key) {
        if (viewVal == "isFlex") 
            Setting.isPile = true;
        if (viewVal == "isFlow") 
            Setting.isPile = false;
        Setting[key] = !Setting[key];
        togButtonText(btn, key);
    }
}


function togButtonText(btn, key) {
    for (let x in Setting.btnKey) {
        if (key == Setting.btnKey[x]) {
            if (Setting[key])
                btn.innerHTML = Setting.btnDefault[x];
            else
                btn.innerHTML = Setting.btnOpposite[x];
        }
    }
}

function togButtonHide(btn, hide, display) {
    if (btn && btn.style)
        btn.style.display = hide ? "none" : display;
}


function back() {
    let Config = getJson("Config");
    let href = Config ? Config.cfg.name : "home";
    window.location.href = "../#1/#1.html".replace(/#1/g, 'zzdz');
}

window.onresize = function() {
    setAgent();
    setCenter();
    setCustom();
}

function setAgent() {
    Setting.isPhone = (/Android|webOS|iPhone|iPod|BlackBerry|MIX/i.test(navigator.userAgent));
    Setting.isPad = (/Pad/i.test(navigator.userAgent));
    Setting.zoom = Setting.isPhone ? Setting.zoomPhone : Setting.zoomPc;
    Setting.zoom = Setting.isPad ? Setting.zoomPad : Setting.zoom;
    document.body.style.zoom = Setting.zoom;
    let agent = Setting.isPhone ? "mobile" : "computer";
    let outerBot = Elem.get("outer-bot");
    outerBot.setAttribute("agent", agent);
    let blocks = document.getElementsByClassName("block");
    for (let i=0;i<blocks.length;i++) {
        blocks[i].setAttribute("agent", agent);
    }
}

function setCenter() {
    //20 = outer.paddingTop + outer.paddingBot;
    let height = window.innerHeight / Setting.zoom - 20;
    let outer = Elem.get("outer");
    let btnCenter = Elem.get("flex2").children[2];
    let btnAlign = Elem.get("flex2").children[3];
    //outer.scrollWidth超出body.inner,隐藏居中按钮
    Setting.isOver = outer.scrollWidth * Setting.zoom > window.innerWidth;
    Setting.isHide = Setting.isOver || !Setting.isPile;
    outer.style.height = (height - 90) + "px";
    togButtonHide(btnCenter, Setting.isHide, "inline");
    togButtonText(btnCenter, "isCenter");
    if (!Setting.isPile) 
        Setting.isCenter = true;
    if (Setting.isOver) 
        Setting.isCenter = false;
}

function setCustom() {
    let btnJoin = Elem.get("initJoin");
    let btnSplit = Elem.get("initSplit");
    togButtonHide(btnJoin, Setting.isEdit, "inline");
    togButtonHide(btnSplit, Setting.isEdit, "inline");

    let btnEdit = Elem.get("initEdit");
    let btnSave = Elem.get("initSave");
    togButtonHide(btnEdit, !Setting.isEdit, "inline");
    togButtonHide(btnSave, !Setting.isEdit, "inline");
}


String.prototype.endWith=function(str){  
    return new RegExp(str+"$").test(this);     
} 


let Elem = {
    get: function (name) {
        return document.getElementById(name);
    },
    creat: function (type, parent, className, idx) {
        let data = document.createElement(type);
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

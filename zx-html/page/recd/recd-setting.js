function setElems() {
    setOuterTop();
    setOuterCenter();
}


function setOuterTop() {
    var outerTop = Elem.get("outer-top");
    for (let x in items) {
        var btn = Elem.set("div", outerTop, "button-top");
        btn.innerHTML = items[x].title;
        btn.idx = x;
        elems[x].btntop = btn;
        btn.onclick = function() {
            values.innerIdx = this.idx;
            setInner();
        }
    }
}

function setOuterCenter() {
    var outerCenter = Elem.get("outer-center");
    for (let x in items) {
        var inner = Elem.set("div", outerCenter, "inner", x);
        elems[x].inner = inner;
        setContent(inner, x);
    }
}

function setContent(inner, x) {
    var list = items[x].list;
    for (let y in list) {
        var content = Elem.set("div", inner, "content", x+y);
        var data = list[y];
        setTitle(content, data, x);
        setLine(content, data.lines, x, y);
    }
}


function setTitle(content, data, x) {
    //TITLE
    if (data.title) {
        var title = Elem.set("div", content, "title");
        title.innerHTML = data.title;
        title.x = x;
    }

    //VICE
    if (data.vice) {
        var vice = Elem.set("div", content, "vice");
        vice.innerHTML = data.vice;
        vice.x = x;
    }
}


function setLine(content, lines, x, y) {
    if (!lines) return;
    var list = items[x].list[y];
    var block = Elem.set("table", content, "block", x);
    for (let z in lines) {
        var data = lines[z];
        data.color = items[x].color;

        //BLOCK
        var flex = Elem.set("tr", block, "flex", z);	
        var left = Elem.set("td", flex, "left");
        var stamp = Elem.set("td", flex, "stamp");
        var right = Elem.set("td", flex, "right");

        if (z == 0) {
            left.innerHTML = data.left;
            stamp.innerHTML = data.stamp;
            right.innerHTML = data.right;
        } else {
            left.innerHTML = data.left ? list.left.replace("{0}", Parse.sub4Num(data.left)) : "";
            stamp.innerHTML = data.stamp;
            right.innerHTML = data.right ?  list.right.replace("{0}", Parse.sub4Num(data.right)) : "";
        }
    }
}





function getjson() {
    var sort = config.sort;
    var json = Storage.get("recd-json") || [];
    json = json.reverse();
    for (let x in json) {
        for (let y in sort) {
            if (json[x].type == sort[y].type) {
                pushdata(json[x], sort, y);
                break;
            }
        }
    }
    console.log(items);
}

function pushdata(json, sort, y) {
    var data = {
        stamp: "<h4>" + json.date.split('年')[1] + "</h4>" + json.time,
        left: json.value * sort[y].left,
        right: json.value * sort[y].right
    };
    var idx = sort[y].idx;
    var list = items[idx].list[0];
    if (items[idx].list.length == 1)
        sort[idx].list = list;
    if (!sort[idx].day || sort[idx].day == json.date) {
        sort[idx].list.vice = json.date;
        sort[idx].list.lines.push(data);
    } else {
        var newlist = {
            vice: json.date,
            left: list.left,
            right:list.right,
            lines:[list.lines[0]]
        }
        items[idx].list.push(newlist);
        sort[idx].list = newlist;
        sort[idx].list.lines.push(data);
    }
    sort[idx].day = json.date;
}




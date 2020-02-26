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
        if (data.title)
            setTitle(content, data, x);
        if (!data.lines)
            setNotLine(content, x);
        if (data.lines) {
            setLine(content, data.lines, x, y);
        }
    }
}


function setTitle(content, data, x) {
    //TITLE
    var title = Elem.set("div", content, "title");
    title.innerHTML = data.title;
    title.x = x;
    //VICE
    var vice = Elem.set("div", content, "vice");
    vice.innerHTML = data.vice;
    vice.x = x;
}


function setLine(content, lines, x, y) {
    var list = items[x].list[y];
    var block = Elem.set("div", content, "block", x);
    for (let z in lines) {
        var data = lines[z];
        data.color = items[x].color;

        //BLOCK
        var flex = Elem.set("div", block, "flex", z);	
        var left = Elem.set("text", flex, "left");
        var stamp = Elem.set("text", flex, "stamp");
        var right = Elem.set("text", flex, "right");

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





function setButton(inner, x) {

}




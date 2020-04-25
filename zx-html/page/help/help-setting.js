function setElems() {
    setOuterTop();
    setOuterCenter();
    setInner();
}


function setOuterTop() {
    var outerTop = Elem.get('outer-top');
    for (let x in items) {
        var btn = Elem.creat('div', outerTop, 'button-top');
        btn.innerHTML = items[x].title;
        btn.idx = x;
        btn.onclick = function() {
            setInner(this.idx);
        }
    }
}

function setOuterCenter() {
    var outerCenter = Elem.get('outer-center');
    for (let x in items) {
        var inner = Elem.creat('div', outerCenter, 'inner', x);
        setContent(inner, x);
    }
}


function setContent(inner, x) {
    var list = items[x].list;
    for (let y in list) {
        var content = Elem.creat('div', inner, 'content', y);
        var data = list[y];
        setTitle(content, data);
        setHelp(content, data);
        setFeed(content, data);
    }
}

function setTitle(content, data) {
    if (data.title) {
        var title = Elem.creat('div', content, 'title');
        title.innerHTML = data.title;
    }
    if (data.vice) {
        var vice = Elem.creat('div', content, 'vice');
        vice.innerHTML = data.vice;
    }
}

function setHelp(content, data) {
    if (!data.text) return; 
    var block = Elem.creat('div', content, 'block');
	var text = Elem.creat('div', block, 'text');
	text.innerHTML = data.text;
}

function setSlect() {

}

function setFeed(content, data) {
    if (!data.stype) return; 
    var block = Elem.creat('div', content, 'block');
    var select = Elem.creat('div', block, 'alert-flex');
    for (let x in data.stype) {
        var option = Elem.creat('div', select, 'option');
        // button.value = data.stype[x];
        option.innerHTML = data.stype[x];
        option.onclick = function() {
            var childs = this.parentNode.children;
            for (var i=0; i<childs.length; i++) {
                if (this.innerHTML == childs[i].innerHTML)  {
                    childs[i].setAttribute('btype', 'live');
                } else {
                    childs[i].setAttribute('btype', 'dead');
                }               
            }
        }
    }
    select.children[0].onclick();
    var textarea = Elem.creat('textarea', block, 'textarea');
    textarea.innerHTML = data.tips;
    var button = Elem.creat('div', block, 'button');
    button.innerHTML = data.btnText;
    button.setAttribute('btype', 'permit');
}
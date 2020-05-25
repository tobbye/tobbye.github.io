function setElems() {
    setOuterTop();
    setOuterCenter();
    setOuterBot();
    setInner();
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
    if (!data.summary) return; 
    var details = Elem.creat('details', content);
    var summary = Elem.creat('summary', details);
    var detail = Elem.creat('div', details);
    summary.innerHTML = data.summary;
    detail.innerHTML = data.detail;
}

function setSlect() {

}

function setFeed(content, data) {
    if (!data.opts) return; 
    var block = Elem.creat('div', content, 'block');
    var select = Elem.creat('div', block, 'alert-flex');
    for (let x in data.opts) {
        var option = Elem.creat('div', select, 'option');
        // button.value = data.opts[x];
        option.innerHTML = data.opts[x];
        option.onclick = function() {
            var childs = this.parentNode.children;
            for (var i=0; i<childs.length; i++) {
                if (this.innerHTML == childs[i].innerHTML)  {
                    childs[i].setAttribute('state', 'live');
                } else {
                    childs[i].setAttribute('state', 'dead');
                }               
            }
        }
    }
    select.children[0].onclick();
    var form = Elem.creat('form', block, 'feedback');
    form.action = setAction('feedback', data.type);
    form.method = "POST";
    var textarea = Elem.creat('textarea', form, 'textarea');
    textarea.name = 'feed';
    textarea.placeholder = data.remind;
    textarea.style.color = getColorType();

    var flex = Elem.creat('div', form, 'flex');
    var button = Elem.creat('input', flex, 'button');
    button.data = data;
    button.type = 'submit';
    button.textarea = textarea;
    button.value = data.btnText;
    button.innerHTML = data.btnText;
    button.setAttribute('state', 'permit');
    button.onclick = function() {
        var value = this.textarea.value;
        if (value == 'fun' || value == 'funny') {
            config.sett.isFun = true;
            Storage.set('config', config);
            showLog('<h4>特别提醒</h4>隐藏模式开启！');
        } else if (value == 'ghost') {
            config.sett.modeType = 'ghost';
            Storage.set('config', config);
            showLog('<h4>特别提醒</h4>修仙模式开启！');
        } else if (!value || value == this.data.remind) {
            showLog('<h4>反馈失败</h4>' + this.data.remind);
        } else {
            showLog('<h4>反馈成功</h4>' + this.data.vice);
        }
    }
}
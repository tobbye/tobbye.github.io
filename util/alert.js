
window.onresize = function() {
    if (this.isAlert) {
        Style.display('alert', 'none');
        Config.page = new Page();
        Style.display('alert'); 
    } else {
        Config.page = new Page();
    }
}


var Panel = function() {
    this.init = function(panel, name) {
        this.name  = name;
        this.panel = panel;
        this.title = panel.querySelector('.alert-title');
        this.block = panel.querySelector('.alert-block');
        this.buttons = panel.querySelectorAll('.button');
        if (!this.title || !this.block) 
            return;
        if (name == 'edit') {
            this.input = panel.querySelector('.alert-input');
            this.limit = panel.querySelector('.alert-limit');
        }
        if (name == 'chat') {
            this.input = panel.querySelector('textarea');
        }
        Alert.panels[name] = this;
    }
}

var Alert = new __Alert();

// this.page = {
//     nexu: Nexu,
//     tran: Tran,
//     fund: Fund,
// }

function __Alert() {
//初始化Alert
    this.init = function() {
        this.name = Config.cfg.name;
        this.initAlert();
        this.btnClick('btn-quit', this.hidePanel);
        this.btnClick('btn-abon', this.hidePanel);
        this.btnClick('btn-close', this.hidePanel);
        this.hidePanel();
        console.log(Alert);
    }


    this.creatTitle = function(content, data) {
        if (data.title) {
            let title = Elem.creat('div', content, 'title');
            title.innerHTML = data.title;
        }

        if (data.vice) {
            let vice = Elem.creat('div', content, 'vice');
            vice.innerHTML = data.viceStr || data.vice;
        }
    }

    this.creatLink = function(outer, href) {
        for (let x in href) {
            let data = href[x];
            let link = Elem.creat('a', outer, 'button-bot');
            link.innerHTML = data.text;
            link.href = data.href;
            if (Config.name == data.name) 
                link.setAttribute('state', 'live');
            else
                link.setAttribute('state', 'dead');
        }
    }


    this.creatOuterTop = function(that) {
        let outerTop = Elem.get('outer-top');
        if (items.length == 1) {
            this.creatLink(outerTop, Constant.hrefTop);
            return;
        }
        for (let x in items) {
            let btn = Elem.creat('div', outerTop, 'button-top');
            btn.innerHTML = items[x].title;
            btn.idx = x;
            btn.onclick = function() {
                Alert.showInner(this.idx);
            }
        }
    }

    this.creatOuterCenter = function(that) {
        window.onresize();
        let outerCenter = Elem.get('outer-center');
        outerCenter.innerHTML = '';
        for (let x in items) {
            let inner = Elem.creat('div', outerCenter, 'inner', x);
            that.setContent(inner, x);
        }
    }

    this.creatOuterBot = function(that) {
        let outerBot = Elem.get('outer-bot');
        this.creatLink(outerBot, Constant.hrefBot);
    }

    //显示内页
    this.showInner = function(innerIdx) {
        let idx = Config.sett.isInto ? Config.innerIdx : innerIdx || 0;
        let outerTop = Elem.get('outer-top').children;
        let outerCenter = Elem.get('outer-center').children;
        let isPage = Config.sett.colorType == 'page';
        for (let i = 0; i < outerTop.length; i++) {
            let childTop = outerTop[i];
            let childCenter = outerCenter[i];
            if (childTop.className != 'button-top')
                break;
            if (i == idx) {
                if (isPage)
                    Elem.color(childTop, getColorBgd(), getColorType());
                else
                    Elem.attr(childTop, 'state', 'live');
                Elem.show(childCenter);
            } else {
                if (isPage)
                    Elem.color(childTop, getColorType(), getColorBgd());
                else
                    Elem.attr(childTop, 'state', 'dead');
                Elem.show(childCenter, 'none');
            }
        }
        Config.innerIdx = idx;
        this.setInner(innerIdx, idx);
    }

    this.setInner = function(innerIdx, idx) {
        let isText = Config.sett.colorType == 'text';
        if (isText)
            Elem.color(document.body, getColorType(), '');
        else
            Elem.color(document.body, getColorType(), getColorBgd());
        Config.sett.isInto = Config.innerIdx != innerIdx;
        if (Config.sett.isInto || innerIdx == null || Config.sett.debugType == 'close') {
            Config.sett.isInto = false;
            Storage.set('Config', Config);
        } else if (Config.sett.debugType != 'close') {
            Config.sett.isInto = true;
            Storage.set('Config', Config);
            jsonToTable(items[idx]); 
        }
    }


    this.initAlert = function() {
        this.panels = {};
        this.buttons = {};
        this.self = document.querySelector('#alert');
        this.box = document.querySelector('#alert-box');
        if (!this.self || !this.box) return;
        let panels = this.box.querySelectorAll('.alert-panel');
        for (var i=0; i<panels.length; i++) {
            let name = panels[i].getAttribute('name');
            let panel = new Panel();
            panel.init(panels[i], name);
        }
        let buttons = this.box.querySelectorAll('.button');
            for (var i=0; i<buttons.length; i++) {
            let name = buttons[i].getAttribute('name');
            this.buttons[name] = buttons[i];
        }
    }



    this.showButton = function(data) {
        let buttons = this.curPanel.buttons;
        if (data.buttonIdx) {
            for (var i=0;i<buttons.length;i++) {
                let name = buttons[i].getAttribute('name');
                if (data.buttonIdx.indexOf(i) > -1)
                    Elem.show(buttons[i]);
                else
                    Elem.hide(buttons[i]);
            } 
        }
        if (data.btnName) {

        }
    }


    //显示弹窗
    this.showPanel = function(name, save) {
        this.hidePanel();
        this.setBox();
        this.isAlert = true;
        this.curPanel = this.panels[name];
        console.log(this.curPanel);
        if (!this.curPanel) return;
        Elem.show(this.self);
        Elem.show(this.curPanel.panel);
        if (!save)
            Elem.text(this.curPanel.block, '');
    }


    //隐藏弹窗
    this.hidePanel = function(name) {
        this.isAlert = false;
        Elem.hide(this.self);
        if (!this.self || !this.box) return;
        for (var i=0; i<this.box.children.length; i++) {
            let panel = this.box.children[i];
            Elem.hide(panel);
        }
    }


    this.log = function(text) {
        Config.fade.setAnim(text);
    }

    this.setBox = function() {
        Elem.color(this.box, '', getColorLight());
    }


    this.btnClick = function(name, func) {
        if (Elem.get(name)) {
            Elem.get(name).onclick = function() {
                func();
            }
        }
    }

    this.btnState = function(name, state) {
        if (Elem.get(name)) {
            Elem.get(name).setAttribute('state', state);
        }
    }

    this.User = function() {

    }

    this.setUserFlex = function(user, line, isNext) {
        if (cfg.isRank || isNext) {
            let top = Elem.creat('div', user, 'user-top');
            let order = Elem.creat('div', top, 'user-order');
            let value = Elem.creat('div', top, 'user-value');

            order.innerHTML = line.order;
            value.innerHTML = line.value;  
        }

        let flex = Elem.creat('div', user, 'user-flex');
        let head = Elem.creat('img', flex, 'user-head');
        let left = Elem.creat('div', flex, 'user-left');
        let right = Elem.creat('div', flex, 'user-right');
        let name = Elem.creat('div', left, 'user-name');
        let marks = Elem.creat('div', left, 'user-flex');
        let ladd = Elem.creat('div', right, 'user-ladd');
        let group = Elem.creat('div', right, 'user-group');
        line.mark = line.mark || ["身份标签1", "身份标签2"];
        for (let i in line.mark) {
            let mark = Elem.creat('div', marks, 'user-mark');
            mark.innerHTML = line.mark[i];
            mark.style.borderColor = getColorType();
        }
        Elem.color(head, '', getColorLight());
        Elem.color(group, 'white', getColorType());
        Elem.css(group, 'borderColor', getColorType());

        name.innerHTML = line.name || line.inver;
        ladd.innerHTML = line.ladd + '阶' || '??阶';
        group.innerHTML = line.group || '未知';
        return flex;
    }


    this.showUser = function(user) {

        this.hidePanel();
        this.showPanel('detail');
        user = user || document.body.user;
        let x = user.x;
        let data = user.data;
        let line = user.line;
        let title = this.curPanel.title;
        let block = this.curPanel.block;
        let body = Elem.creat('div', block, 'user-body');
        let flex = this.setUserFlex(body, line, x);
        let tags = Elem.creat('div', body, 'user-tags');
        let desc = Elem.creat('div', body, 'user-desc');
        if (line.tag) {
            for (let i in line.tag) {
                let tag = Elem.creat('div',tags, 'user-tag');
                tag.innerHTML = line.tag[i];
                tag.onclick = function() {
                    Alert.showSearch(this);
                }
            }
        }
        desc.innerHTML = line.desc.replace(/\n/g, '<br/>');
        this.showButton(data);
    }

    this.showSearch = function(button) {
        this.hidePanel();
        this.showPanel("search");
        let title = this.curPanel.title;
        let block = this.curPanel.block;
        block.innerHTML = "";
        block.style.maxHeight = Config.page.alertHeight + "px";
        title.innerHTML = cfg.titleStr.replace("#0", button.innerHTML);
        for (let z in tempData.searchData) {

            let user = Elem.creat("div", block, "user-block", z);
            let line = tempData.searchData[z];
            let order = line.order + "th";
            if (order.length == 3)
                line.order = order.replace("1th", "1st").replace("2th", "2nd").replace("3th", "3rd");
            line.group = line.uid[0].replace('s','赞助商').replace('d','淘金者');
            line.value = "权值: " + Parse.sub4Num(line.val);
            this.setUserFlex(user, line, true);
        }
        this.log('搜索成功!');
    }

    this.showNexu = function() {
        this.hidePanel();
        Elem.remove(document.body.user);
        Parse.remove(document.body.lines, document.body.line);  
    }


    this.showChat = function() {
        this.hidePanel();
        this.showPanel("chat");
        let title = this.curPanel.title;
        let block = this.curPanel.block;
        let input = this.curPanel.input;
        Elem.color(input, getColorLight(), "");
        input.placeholder = "输入内容";
        title.innerHTML = document.body.line.name;
        this.box.style.maxHeight = (Config.page.windHeight - 440) + "px";
        block.style.maxHeight = (Config.page.windHeight - 703) + "px";
        block.innerHTML = "";
        for (let i in tempData.chatData) {
            let data = tempData.chatData[i];
            let ctype = data.isMine ? "right" : "left";
            this.setChatText(block, ctype, data.text);
        }
        let send = Elem.get("btn-send");
        send.block = block;
        send.onclick = function() {
            Alert.setChatSend();
        }
        
        block.lastChild.scrollIntoView();
    }

    this.setChatSend = function(send){
        let input = this.curPanel.input;
        this.setChatText(send.block, "right", input.value);
        if (input.value != "")
            tempData.chatData.push({
                text: input.value,
                date: Parse.getDate(),
                time: Parse.getTime(),
                isMine: 1,
            });
        Elem.color(input, getColorLight(), "");
        input.placeholder = "输入内容";
        input.value = "";
    }


    this.setChatText = function(block, ctype, value) {
        if (value == "") {
            this.hidePanel();
            return;
        }
        let flex = Elem.creat("div", block, "chat-flex");
        let text = Elem.creat("div", flex, "chat-text");
        Elem.attr(flex, "ctype", ctype);
        Elem.attr(text, "ctype", ctype);
        text.innerHTML = value.replace(/\n/g, "<br/>");
        if (this.getChatLength(value) < 17)
            text.style.wordBreak = "keep-all";
        text.scrollIntoView();
    }

    this.getChatLength = function(value) {
        let len = 0;
        let list = value.split('\n');
        for (let idx in list) {
            if (list[idx].length > len)
                len = list[idx].length;
        }
        return len;
    }


    this.onChatFocus = function() {
        let block = this.curPanel.block;
        let input = this.curPanel.input;
        block.lastChild.scrollIntoView();
        Elem.color(input, getColorType(), "");
        input.value = "";

        // Style.height("detail-block", "550px");
    }

}













window.onresize = function() {
    Config.page = new Page();
}



var Panel = function() {
    this.init = function(panel, name) {
        this.name  = name;
        this.panel = panel;
        this.offset = panel.getAttribute('offset') || 0;
        this.title = panel.querySelector('.alert-title');
        this.block = panel.querySelector('.alert-block');
        this.buttons = panel.querySelectorAll('.button');
        if (!this.title || !this.block) 
            return;
        if (name == 'edit') {
            this.input = panel.querySelector('.alert-input');
            this.limit = panel.querySelector('.alert-limit');
        }
        if (/chat|task/i.test(name)) {
            this.input = panel.querySelector('textarea');
        }
        Alert.panels[name] = this;
    }
}


var Alert = new __Alert();

function __Alert() {
//初始化Alert
    this.init = function() {
        this.name = 'Alert';
        this.initAlert();
        this.btnClick('btn-quit', this.hidePanel);
        this.btnClick('btn-abon', this.hidePanel);
        this.btnClick('btn-close', this.hidePanel);
        this.hidePanel();
        Container(this);
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
            if (cfg.name == data.name) 
                link.setAttribute('state', 'liveLink');
            else
                link.setAttribute('state', 'deadLink');
        }
    }


    this.creatOuterTop = function(that) {
        let outerTop = Elem.get('outer-top');
        if (items.length < 2) {
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
            let inner = Elem.creat('div', outerCenter, 'inner', 'items['+x+'].');
            let list = items[x].list;
            for (let y in list) {
                let content = Elem.creat('div', inner, 'content', 'list['+y+'].');
                let data = list[y];
                if (that.setTitle)
                    that.setTitle(content, data);
                this.creatTitle(content, data);
                that.creatBlock(content, data, x, y);
            }
        }
    }

    this.creatOuterBot = function(that) {
        let outerBot = Elem.get('outer-bot');
        this.creatLink(outerBot, Constant.hrefBot);
    }

    //显示内页
    this.showInner = function(clickIdx) {
        let idx = Config.sett.isInto ? Config.innerIdx : clickIdx || 0;
        let outerTop = document.querySelectorAll('.button-top');
        let outerCenter = document.querySelectorAll('.inner');
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
        Config.sett.isInto = Config.innerIdx != clickIdx;
        Config.innerIdx = idx;
        Alert.setInner(clickIdx, idx);
    }

    this.setInner = function(clickIdx, idx) {
        let isText = Config.sett.colorType == 'text';
        if (isText)
            Elem.color(document.body, getColorType(), '');
        else
            Elem.color(document.body, getColorType(), getColorBgd());
        if (Config.sett.isInto || clickIdx == null || Config.sett.debugType == 'close') {
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
        this.alert = document.querySelector('#alert');
        this.box = document.querySelector('#alert-box');
        let buttons = document.querySelectorAll('.button');
            for (let i=0; i<buttons.length; i++) {
            let name = buttons[i].getAttribute('name');
            this.buttons[name] = buttons[i];
        }
        if (!this.alert || !this.box) return;
        let panels = this.box.querySelectorAll('.alert-panel');
        for (let i=0; i<panels.length; i++) {
            let name = panels[i].getAttribute('name');
            let panel = new Panel();
            panel.init(panels[i], name);
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
        this.curPanel = this.panels[name];
        if (!this.curPanel) return;
        this.hidePanel();
        this.setBox();
        this.isAlert = true;
        // console.log(this.curPanel);

        Elem.show(this.alert);
        Elem.show(this.curPanel.panel);
        if (!save)
            Elem.text(this.curPanel.block, '');
    }


    //隐藏弹窗
    this.hidePanel = function(name) {
        this.isAlert = false;
        Elem.hide(this.alert);
        if (!this.alert || !this.box) return;
        for (var i=0; i<this.box.children.length; i++) {
            let panel = this.box.children[i];
            Elem.hide(panel);
        }
        if (cfg.name == 'tran')
            Task.clear();
    }


    this.log = function(text) {
        Config.fade.setAnim(text);
    }

    this.setBox = function() {
        Elem.color(this.box, '', getColorLight());
        Elem.maxheight(this.curPanel.block, Config.page.alertHeight-this.curPanel.offset);
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


    this.UserData = function() {

        this.init = function(line) {
            Config.getObject(this, line);
        }
    }

    this.UserFlex = function() {

        this.init = function(user, line, isNext) {
            this.body = user;
            if (cfg.isRank || isNext) {
                this.top = Elem.creat('div', this.body, 'user-top');
                this.order = Elem.creat('div', this.top, 'user-order');
                this.value = Elem.creat('div', this.top, 'user-value');

                this.order.innerHTML = line.order;
                this.value.innerHTML = line.value;  
            }
            this.marks = [];
            this.flex = Elem.creat('div', this.body, 'user-flex');
            this.head = Elem.creat('img',  this.flex, 'user-head');
            this.left = Elem.creat('div',  this.flex, 'user-left');
            this.right = Elem.creat('div',  this.flex, 'user-right');
            this.name = Elem.creat('div',  this.left, 'user-name');
            this.mark = Elem.creat('div',  this.left, 'user-flex');
            this.ladd = Elem.creat('div',  this.right, 'user-ladd');
            this.group = Elem.creat('div',  this.right, 'user-group');
            line.mark = line.mark || ["身份标签1", "身份标签2"];
            for (let i in line.mark) {
                let mark = Elem.creat('div', this.mark, 'user-mark');
                mark.innerHTML = line.mark[i];
                mark.style.borderColor = getColorType();
                this.marks[i] = mark;
            }
            Elem.color(this.head, '', getColorLight());
            Elem.color(this.group, 'white', getColorType());
            Elem.css(this.group, 'borderColor', getColorType());

            this.name.innerHTML = line.name || line.inver;
            this.ladd.innerHTML = (line.ladder || line.ladd || '??') + '阶';
            this.group.innerHTML = line.group || '未知';
            this.flex.setAttribute('margin', 'T5');
        }
    }

    this.UserBody = function() {

        this.init = function(block, line) {
            this.tags = [];
            this.body = Elem.creat('div', block, 'user-body');
            this.flex = new Alert.UserFlex();
            this.flex.init(this.body, line);
            this.tag = Elem.creat('div', this.body, 'user-tags');
            this.desc = Elem.creat('div', this.body, 'user-desc');
            if (line.tag) {
                for (let i in line.tag) {
                    let tag = Elem.creat('div', this.tag, 'user-tag');
                    tag.innerHTML = line.tag[i];
                    tag.onclick = function() {
                        Alert.showSearch(this);
                    }
                    this.tags[i] = tag;
                }
            }
            this.desc.innerHTML = line.desc.replace(/\n/g, '<br/>');
        }
    }


    this.showUser = function(user) {

        this.hidePanel();
        this.showPanel('detail');
        user = user || document.body.user;
        let x = user.x;
        let data = Config.__list(user);
        let line = Config.__line(user);
        let title = this.curPanel.title;
        let block = this.curPanel.block;
        console.log(line);
        line.body = new this.UserBody();
        line.body.init(block, line);
        this.showButton(data);
    }

    this.showSearch = function(button) {
        this.hidePanel();
        this.showPanel("search");
        let title = this.curPanel.title;
        let block = this.curPanel.block;
        block.innerHTML = "";
        title.innerHTML = cfg.titleStr.replace("#0", button.innerHTML);
        for (let z in tempData.searchData) {

            let body = Elem.creat("div", block, "user-block", 'lines['+z+']');
            let line = tempData.searchData[z];
            let order = line.order + "th";
            if (order.length == 3)
                line.order = order.replace("1th", "1st").replace("2th", "2nd").replace("3th", "3rd");
            line.group = line.uid[0].replace('s','赞助商').replace('d','淘金者');
            line.value = "权值: " + Parse.sub4Num(line.val);
            this.flex = new Alert.UserFlex();
            this.flex.init(body, line, true);
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












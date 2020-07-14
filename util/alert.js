
window.onresize = function() {
    Config.page = new Page();
}

var Page = function() {

    Config.getConst(this, 'page');
    this.isPhone = (/Android|webOS|iPhone|iPod|BlackBerry|MIX/i.test(navigator.userAgent));
    this.isPad = (/Pad/i.test(navigator.userAgent));
    this.isPage = Config.sett.colorType == 'page';
    this.isText = Config.sett.colorType == 'text';
    this.zoom = this.isPhone ? this.zoomPhone : this.zoomPc;
    this.zoom = this.isPad ? this.zoomPad : this.zoom;
    this.windWidth = ~~(window.innerWidth / this.zoom);
    this.windHeight = ~~(window.innerHeight / this.zoom);
    if (this.alertType == 'bot') {
        this.alertMinMargin = 0;
        this.alertBord = 0;
    } else {
        this.alertOffset += 180;
    }
    this.alertHeight = this.windHeight - this.alertOffset;
    this.outerHeight = this.windHeight - this.outerOffset;
    this.innerHeight = this.windHeight - this.innerOffset;
    this.flowHeight = Math.max(this.innerHeight, this.minHeight);
    this.alertMargin = this.windWidth - this.alertMaxWidth;
    this.alertMargin = Math.max(this.alertMargin / 2, this.alertMinMargin);
    this.alertFillWidth = this.windWidth - this.alertMargin * 2;
    this.alertFullWidth = this.windWidth - this.alertMinMargin * 2;
    this.alertWidth =  this.alertFillWidth - this.alertPadding - this.alertBord;
    this.isWidth = this.windWidth > this.windHeight;
    this.isFlow = this.innerHeight > this.minHeight;
    var  box = Elem.get('alert-box');
    if (box) {
        box.setAttribute('pos', this.alertType);
        box.style.left = this.alertMargin + 'px';
        box.style.right = this.alertMargin + 'px';
    }
    document.body.style.zoom = this.zoom;
    var  center = Elem.get('outer-center');
    Elem.height(center, this.outerHeight);
}


//显示提醒信息
var Fade = function() {
    let that = this;
    Config.getConst(this, 'fade');
    
    this.getElem = function(e) {
        e = e || Elem.get('log');
        if (!e) {
            e = Elem.creat('div', document.body, 'log');
            e.setAttribute('fade', 'over');
            e.id = 'log';
        } 
        if (Config.page.isPage)
            Elem.color(e, 'white', Alert.colorFont());
        else
            Elem.color(e, 'white', 'dodgerblue');
        return e;
    }

    this.setAnim = function(text, e, timeOn) {
        this.text = text;
        this.elem = this.getElem(e);
        this.timeOn = timeOn || this.timeOn;
        if (this.elem.getAttribute('fade') != 'over') {
            window.clearTimeout(this.fadeIn);
            window.clearTimeout(this.fadeOn);
            window.clearTimeout(this.fadeOut);
            window.clearTimeout(this.fadeTog);
            this.elem.setAttribute('fade', 'on');
            this.animTog();
        } else {
            this.animIn();
        }
    }

    this.animIn = function() {
        if (this.text)
            this.elem.innerHTML = this.text;
        this.elem.setAttribute('fade', 'in');
        this.fadeIn = setTimeout(function() {
            that.fadeIn = null;
            that.animOn();
        }, this.timeIn);  
    }

    this.animOn = function() {
        this.elem.setAttribute('fade', 'on');
        this.fadeOn = setTimeout(function() {
            that.fadeOn = null;    
            that.animOut();
        }, this.timeOn); 
    }

    this.animTog = function() {
        if (this.text)
            this.elem.innerHTML = this.text;
        this.elem.setAttribute('fade', 'tog');
        this.fadeTog = setTimeout(function() {
            that.fadeTog = null;
            that.animOn();
        }, this.timeTog);  
    }

    this.animOut = function() {
        this.elem.setAttribute('fade', 'out');
        this.fadeOut = setTimeout(function() {
            that.fadeOut = null;
            that.animOver();
        }, this.timeOut);  
    }

    this.animOver = function() {
        this.elem.setAttribute('fade', 'over');
    }  
}


let Panel = function() {
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


let Alert = new __Alert();

function __Alert() {
    this.init = function() {
        this.name = 'Alert';
        this.curList = [];
        this.curWord = [];
        this.initAlert();
        this.btnClick('btn-quit', this.hidePanel);
        this.btnClick('btn-abon', this.hidePanel);
        this.btnClick('btn-close', this.hidePanel);
        this.hidePanel();
        Container(this);
    }

    this.toPage = function(name) {
        window.location.href = "../#0/#0.html".replace(/#0/g, name);
    }


    this.creatTitle = function(content, data, len, y) {
        var  flex   = Elem.creat('div', content, 'flex');
        var  left   = Elem.creat('div', flex, 'guide', 'L');
        var  center = Elem.creat('div', flex, 'guide', 'C');
        var  right  = Elem.creat('div', flex, 'guide', 'R');
        if (data.title) {
            var  title = Elem.creat('div', center, 'title');
            title.innerHTML = data.title;
        }

        if (data.vice) {
            var  vice = Elem.creat('div', center, 'vice');
            vice.innerHTML = data.viceStr || data.vice;
            if (data.lines)
                vice.innerHTML = vice.innerHTML.replace('#len', data.lines.length)
        }

        if (len > 1 && cfg.name == 'nexu' || cfg.name == 'rank') {
            if (y > 0) {
                var  guide = Elem.creat('div', left, 'button-min');
                Elem.text(guide, '↑');
                Elem.color(guide, Alert.colorFont());
                Elem.border(guide, 'solid 6px ' + Alert.colorFont());
                guide.onclick = function() {
                    var  tgt = this.parentNode.parentNode.parentNode.previousSibling;
                    console.log(tgt);
                    tgt.scrollIntoView();
                }
            }
            if (y < len-1) {
                var  guide = Elem.creat('div', right, 'button-min');
                Elem.text(guide, '↓');
                Elem.color(guide, Alert.colorFont());
                Elem.border(guide, 'solid 6px ' + Alert.colorFont());
                guide.onclick = function() {
                    var  tgt = this.parentNode.parentNode.parentNode.nextSibling;
                    console.log(tgt);
                    tgt.scrollIntoView();
                }
            }
        }
    }

    this.creatLink = function(outer, href) {
        for (var  x in href) {
            var  data = href[x];
            var  link = Elem.creat('a', outer, 'button-bot');
            link.innerHTML = data.text;
            link.href = data.href;
            if (cfg.name == data.name) 
                link.setAttribute('state', 'liveLink');
            else
                link.setAttribute('state', 'deadLink');
        }
    }


    this.creatOuterTop = function(that) {
        var  outer = Elem.get('outer-top');
        if (items.length < 2) {
            this.creatLink(outer, Constant.hrefTop);
            return;
        }
        for (var  x in items) {
            var  btn = Elem.creat('div', outer, 'button-top');
            btn.innerHTML = items[x].title;
            btn.idx = x;
            btn.onclick = function() {
                Alert.showInner(this.idx);
            }
        }
    }

    this.creatOuterCenter = function(that) {
        window.onresize();
        var  outer = Elem.get('outer-center');
        if (items.length > 0)
            outer.innerHTML = '';
        for (var  x in items) {
            var  inner = Elem.creat('div', outer, 'inner', 'items['+x+'].');
            var  list = items[x].list;
            for (var  y in list) {
                var  content = Elem.creat('div', inner, 'content', 'list['+y+'].');
                var  data = list[y];
                if (that.setTitle)
                    that.setTitle(content, data);
                this.creatTitle(content, data, list.length, y);
                that.creatBlock(content, data, x, y);
            }
        }
    }

    this.creatOuterBot = function(that) {
        var  outer = Elem.get('outer-bot');
        this.creatLink(outer, Constant.hrefBot);
    }

    this.creatContent = function(that, x, y) {
        var  outer = Elem.get('outer-center');
        var  inner = outer.children[x];
        var  content = inner.children[y];
        var  data = items[x].list[y];
        content.innerHTML = '';
        if (that.setTitle)
            that.setTitle(content, data);
        this.creatTitle(content, data, 3, y);
        that.creatBlock(content, data, x, y);
    }

    //显示内页
    this.showInner = function(clickIdx) {
        var  idx = Config.sett.isInto ? Config.innerIdx : clickIdx || 0;
        var  outerTop = document.querySelectorAll('.button-top');
        var  outerCenter = document.querySelectorAll('.inner');
        for (var  i = 0; i < outerTop.length; i++) {
            this.setChild(outerTop[i], outerCenter[i], i == idx);
        }
        Config.sett.isInto = Config.innerIdx != clickIdx;
        Config.innerIdx = idx;
        if (Config.page.isText)
            Elem.color(document.body, Alert.colorFont());
        else
            Elem.color(document.body, Alert.colorFont(), Alert.colorBgd());
        if (Config.sett.isInto || clickIdx == null || Config.sett.debugType == 'close') {
            Config.sett.isInto = false;
            Storage.set('Config', Config);
        } else if (Config.sett.debugType != 'close') {
            Config.sett.isInto = true;
            Storage.set('Config', Config);
            this.jsonToTable(items[idx]); 
        }
    }

    this.setChild = function(top, center, isClick) {
        if (top.className != 'button-top')
            return;
        if (isClick) {
            Elem.show(center);
            if (Config.page.isPage)
                Elem.color(top, Alert.colorBgd(), Alert.colorFont());
            else 
                Elem.state(top, 'live');
        } else {
            Elem.hide(center);
            if (Config.page.isPage)  
                Elem.color(top, Alert.colorFont(), Alert.colorBgd());
            else 
                Elem.state(top, 'dead');
        }
    }

    this.fullScreen = function() {
        if (Config.page.isMobile) {
            let body = document.body;
            if (body.requestFullScreen) body.requestFullScreen(); //W3C
            if (body.msRequestFullScreen) body.msRequestFullScreen();  //IE11
            if (body.mozRequestFullScreen) body.mozRequestFullScreen(); //FireFox
            if (body.webkitRequestFullScreen) body.webkitRequestFullScreen(); //Chrome
        }
    }


    this.jsonToAlert = function(data) {
        alert(JSON.stringify(data));
    }

    this.jsonToTable = function(Item) {
        if (Config.name == 'home') return;
        console.log(Item);
        Storage.set('Item', Item);
        Storage.set('Config', Config);
        Storage.set('Constant', Constant);
        Storage.set('Instances', Instances);
        Storage.set('Constrtctors', Constrtctors);
        window.location.href = '../view/view.html';
    }

    this.initAlert = function() {
        this.panels = {};
        this.buttons = {};
        this.alert = document.querySelector('#alert');
        this.box = document.querySelector('#alert-box');
        var  buttons = document.querySelectorAll('.button');
            for (var  i=0; i<buttons.length; i++) {
            var  name = buttons[i].getAttribute('name');
            this.buttons[name] = buttons[i];
        }
        if (!this.alert || !this.box) return;
        var  panels = this.box.querySelectorAll('.alert-panel');
        for (var  i=0; i<panels.length; i++) {
            var  name = panels[i].getAttribute('name');
            var  panel = new Panel();
            panel.init(panels[i], name);
        }
    }



    this.showButton = function(nexu) {
        var  nexus = [[4,5], [0,1,3], [0,2,3], [0,3]][nexu];
        var  buttons = this.curPanel.buttons;
        if (nexus) {
            for (var  i=0;i<buttons.length;i++) {
                var  name = buttons[i].getAttribute('name');
                if (nexus.indexOf(i) > -1)
                    Elem.show(buttons[i]);
                else
                    Elem.hide(buttons[i]);
            } 
        }
    }


    //显示弹窗
    this.showPanel = function(name, save) {
        if (this.isAlert) {
            Elem.hide(this.curPanel.panel);
        }
        this.curList.push(name);
        this.curPanel = this.panels[name];
        if (!this.curPanel) return;
        this.setBox();
        // console.log(this.curPanel);

        Elem.show(this.alert);
        Elem.show(this.curPanel.panel);
        if (!save)
            Elem.text(this.curPanel.block, '');
        this.isAlert = true;
    }


    //隐藏弹窗

    this.hidePanel = function() {
        Elem.hide(this.alert);
        this.curList = [];
        this.curWord = [];
        if (!this.alert || !this.box) return;
        for (var  i=0; i<this.box.children.length; i++) {
            var  panel = this.box.children[i];
            Elem.hide(panel);
        }
        if (cfg.name == 'tran')
            Task.clear(); 
        this.isAlert = false;
    }

    this.backPanel = function() {
        Elem.hide(this.curPanel.panel);
        var  len = this.curList.length;
        if (len > 1) {
            this.curWord.pop();
            this.curList.pop();
            this.showPanel(this.curList.pop(), 1);
        } else {
            this.hidePanel();
        }
        if (this.curFlex != this.curSelect)
            this.curFlex.scrollIntoView();
    }

    this.inSearch = function() {
        return this.curList.indexOf('search') > -1;
    }


    this.prefix = ' ------------------------------- ';
    this.suffix = ' ------------------------------- ';

    this.log = function(text) {
        Config.fade.setAnim(text);
    }

    this.copy = function(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    this.print = function(text) {
        console.log(text);
    }

    this.prinName = function(name) {
        console.log(this.prefix + name + this.suffix);
    }


    this.setBox = function() {
        Elem.color(this.box, '', Alert.colorLight());
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
            this.uid = line.uid || line.sid;
            Config.getObject(this, line);
            Config.getObject(this, Config.__user(this.uid));
            this.initTemp(line);
        }



        this.initTemp = function(line) {
            this.group = Config.getGroup(this);
            this.order = Config.getOrder(this);
            this.value = Config.getValue(this);
            this.desc = '<div align="center"><h3>' + this.name + '的描述</h3></div>';
        }
    }

    this.UserFlex = function() {

        this.init = function(body, line, isHead) {
            cfg.isHead = cfg.isRank || isHead;
            this.body = body;
            this.initHead(line);
            this.initFlex(line);
        }

        this.initHead = function(line) {
            if (cfg.isHead) {
                this.top = Elem.creat('div', this.body, 'user-top');
                this.order = Elem.creat('div', this.top, 'user-order');
                this.value = Elem.creat('div', this.top, 'user-value');
                Elem.text(this.order, line.order);
                Elem.text(this.value, line.value);
                Elem.page(this.order, Alert.colorFont());
            } 
        }

        this.initFlex = function(line) {
            this.marks = [];
            this.flex = Elem.creat('div', this.body, 'user-flex');
            this.icon = Elem.creat('div',  this.flex, 'user-icon');

            this.left = Elem.creat('div',  this.flex, 'user-left');
            this.right = Elem.creat('div',  this.flex, 'user-right');
            this.name = Elem.creat('div',  this.left, 'user-name');
            this.mark = Elem.creat('div',  this.left, 'user-flex');
            this.ladd = Elem.creat('div',  this.right, 'user-ladd');
            this.group = Elem.creat('div',  this.right, 'user-group');
            for (var  i in line.mark) {
                var  mark = Elem.creat('div', this.mark, 'user-mark');
                Elem.text(mark, line.mark[i]);
                Elem.border(mark, Alert.colorFont());
                this.marks[i] = mark;
            }
            if (line.isSponer) 
                Elem.color(this.group, 'white', Alert.colorFont());
            Elem.border(this.group, Alert.colorFont());
            if (Config.page.isPage)
                Elem.text(this.icon, line.name[0]);
            else
                Elem.text(this.icon, line.icon);
            Elem.color(this.icon, Alert.colorFont());
            Elem.border(this.icon, Alert.colorFont());
            Elem.text(this.group, line.group || '未知');
            Elem.text(this.name, line.name || line.inver);
            Elem.text(this.ladd, (line.ladder || line.ladd || '??') + '阶');
            Elem.attr(this.flex, 'margin', 'T5');
            if (Alert.isAlert && Alert.curPanel.name == 'info')
                return;
            this.body.onclick = function() {
                Alert.bodySelect(this);
                Alert.showUser();
            } 
        }
    }

    this.UserBody = function() {

        this.init = function(block, line) {
            this.body = Elem.creat('div', block, 'user-body');
            this.flex = new Alert.UserFlex(); 
            this.flex.init(this.body, line, Alert.inSearch());
            this.initBody(line);
        }

        this.initBody = function(line) {
            this.tags = [];
            this.tag = Elem.creat('div', this.body, 'user-tags');
            this.desc = Elem.creat('div', this.body, 'user-desc');
            if (line.tag) {
                for (var  i in line.tag) {
                    var  tag = Elem.creat('div', this.tag, 'user-tag');
                    tag.onclick = function() {
                        Alert.showSearch(this);
                    }
                    Elem.text(tag, line.tag[i]);
                    Elem.page(tag, Alert.colorFont());
                    this.tags[i] = tag;
                }
            }
            this.desc.innerHTML = line.desc.replace(/\n/g, '<br/>');

            for (var  i=0; i<9; i++) {
                this.desc.innerHTML += line.name + '的描述。<br/>';
            }
            this.desc.innerHTML += '</center>';
        }
    }



    this.bodySelect = function(flex) { 
        if (!Alert.isAlert) {
            var  oldSelect = this.curSelect;
            if (oldSelect) {
                oldSelect.setAttribute('select', 'not');
            }
            if (flex) {
                this.curSelect = flex; 
                flex.setAttribute('select', 'yes');
            }
        };
        this.curFlex = flex; 
    }



    this.showUser = function(isDigger) {
        var  flex, user;
        if (isDigger == null) {
            flex = this.curFlex;
        } else {
            flex = this.curSelect;
        }
        var  data = Config.__list(flex);
        var  line = Config.__line(flex);  

        user = new this.UserData();
        user.init(line);
        if (this.curUid) {
            user = Config.__user(this.curUid);
        } else {
            user = (isDigger ? line.__digger : line.__sponer) || user;
            // this.curUid = user.uid;
        }
        this.curWord.push(user.uid);
        this.curUser = user;
        this.showPanel('info');

        var  title = this.curPanel.title;
        var  block = this.curPanel.block;
        var  body = new this.UserBody();
        body.init(block, user);
        title.innerHTML = user.group + '资料';
        this.showButton(Config.isMine(user) ? 0:user.nexu);
        console.log([
            this.curPanel.name,
            user.uid, user.name, 
            this.copy(this.curList), 
            this.copy(this.curWord), 
            user, 
            body,
        ]);
    }

    this.showSearch = function(button) {
        this.curWord.push(button.innerHTML);
        this.showPanel("search");
        var  title = this.curPanel.title;
        var  block = this.curPanel.block;
        title.innerHTML = Constant.string.titleSearch.replace("#0", button.innerHTML);
        var  searchData = [];

        for (var  z in tempData.userData) {
            var  line = tempData.userData[z];
            line.uid = z;
            if (line.name)
                searchData.push(line);
        }
        var  rnd = Math.max(1, ~~(Math.random()*searchData.length+1));
        var  ans = rnd > 999 ? '999+' : rnd;
        searchData = Parse.mix(searchData);
        tempData.searchData = searchData;
        for (var  z in searchData) {
            if (z > rnd-1) break;
            var  line = searchData[z];
            line.ord = z;
            line.valStr = '权值';
            line.val = Math.floor((Math.random()+rnd+5-z) * 2e3);
            line.nexu = 1;
            var  body = Elem.creat("div", block, "user-block", 'tempData.searchData['+z+']');
            var  user = new Alert.UserData();
            user.init(line);
            var  flex = new Alert.UserFlex();
            flex.init(body, user, true);
        }
        block.firstChild.scrollIntoView();

        this.log(`搜索: ${button.innerHTML}<h5>${ans}条结果按照标签分配的权重排序</h5>`);
        console.log([
            this.curPanel.name,
            button.innerHTML, 
            this.copy(this.curList), 
            this.copy(this.curWord), 
        ]);
    }

    this.showNexu = function(isFollow) {
        var  select = this.curSelect;
        var  childs = select.parentNode.children;
        var  line = Config.__line(select);
        var  lines = Config.__list(select).lines;
        if (isFollow) {
            line.nexu = 2;
            var  idx = line.isSponer ? 1 : 2;
            items[1].list[idx].lines.unshift(line);
            var  outer = Elem.get('outer-center');
            var  content = outer.children[1].children[idx].children[1];
            content.insertBefore(select, content.firstChild);
        } else {
            Elem.remove(select);
        }
        Parse.remove(lines, line);  
        for (var  i=0; i<childs.length; i++) {
            childs[i].setAttribute('key', 'lines['+i+']');
        }
        this.hidePanel();
    }


    this.showChat = function() {
        this.showPanel("chat");
        var  select = this.curSelect;
        var  line = Config.__line(select);
        var  title = this.curPanel.title;
        var  block = this.curPanel.block;
        var  input = this.curPanel.input;
        Elem.color(input, Alert.colorLight());
        input.placeholder = "输入内容";
        title.innerHTML = line.name;
        // this.box.style.maxHeight = (Config.page.windHeight - 440) + "px";
        // block.style.maxHeight = (Config.page.windHeight - 703) + "px";
        block.innerHTML = "";
        for (var  i in tempData.chatData) {
            var  data = tempData.chatData[i];
            var  ctype = data.isMine ? "right" : "left";
            this.setChatText(block, ctype, data.text);
        }
        var  send = Elem.get("btn-send");
        send.block = block;
        send.onclick = function() {
            Alert.setChatSend();
        }
        
        block.lastChild.scrollIntoView();
    }

    this.setChatSend = function(send){
        var  input = this.curPanel.input;
        this.setChatText(send.block, "right", input.value);
        if (input.value != "")
            tempData.chatData.push({
                text: input.value,
                date: Parse.getDate(),
                time: Parse.getTime(),
                isMine: 1,
            });
        Elem.color(input, Alert.colorLight());
        input.placeholder = "输入内容";
        input.value = "";
    }


    this.setChatText = function(block, ctype, value) {
        if (value == "") {
            this.hidePanel();
            return;
        }
        var  flex = Elem.creat("div", block, "chat-flex");
        var  text = Elem.creat("div", flex, "chat-text");
        Elem.attr(flex, "ctype", ctype);
        Elem.attr(text, "ctype", ctype);
        text.innerHTML = value.replace(/\n/g, "<br/>");
        if (this.getChatLength(value) < 17)
            text.style.wordBreak = "keep-all";
        text.scrollIntoView();
    }

    this.getChatLength = function(value) {
        var  len = 0;
        var  list = value.split('\n');
        for (var  idx in list) {
            if (list[idx].length > len)
                len = list[idx].length;
        }
        return len;
    }


    this.onChatFocus = function() {
        var  block = this.curPanel.block;
        var  input = this.curPanel.input;
        block.lastChild.scrollIntoView();
        Elem.text(input, '');
        Elem.color(input, Alert.colorFont());

        // Style.height("detail-block", "550px");
    }



    this.colorBgd = function() {
        return Config.color.bgd;
    }

    this.colorFont = function() {
        return Config.color.font;
    }

    this.colorLight = function() {
        return Config.color.light;
    }

}













var Tran = new __Tran();

function __Tran() {

    this.init = function() {
        this.setUsers();
        this.creatElems();
        console.log(this);
    }

    this.creatElems = function() {
        Alert.creatOuterTop(this);
        Alert.creatOuterCenter(this);
        Alert.creatOuterBot(this);
        Alert.showInner();
    }

    this.setContent = function(inner, x) {
        let list = items[x].list
        for (let y in list) {
            let data = list[y];
            let content = Elem.creat('div', inner, 'content', y);
            Alert.creatTitle(content, data);
            if (data.type == 'inve')
                this.creatInveBody(content, data, x);
            else
                this.creatGrabBody(content, data, x);
        }
    }


    this.InveData = function() {
        let grab = new Tran.GrabData();
        this.initTemp = grab.initTemp;
        this.initData = grab.initData;
    }

    this.GrabData = function() {

        this.initTemp = function(data, list, idx) {
            this.idx = idx;
            this.inver = list[idx].name;
            this.group = data.group;
            this.ladder = Math.floor(20 * Math.random() * Math.random()) + 6;
            this.ladd = this.ladder - Math.floor(5 * Math.random());
            this.multi = Math.floor(100 * Math.pow(Math.random(),8)) + 1;
            this.mark = ['身份标签1', '身份标签2'];
            this.index = Math.floor((1547 + Math.random()) * 1e9);
            this.stamp = Parse.formatTime(this.index).replace(' ', '<h3>');
            this.word = list[idx].word;
            this.src = list[idx].pic[0];
        };

        this.initData = function(dot, type) {
            this.row = parseInt(this.ladd / 5 - 0.2);
            this.priceAll = 0;
            this.pieceAll = 0;
            this.timesAll = 0;
            this.priceAllList = [];    
            this.pieceAllList = [];
            this.timesAllList = [];
            for (let z = 0; z < this.ladd; z++) {
                this.priceAllList[z] = Math.pow(2, z);
                this.pieceAllList[z] = Math.pow(2, this.ladd - z - 1) * this.multi;
                this.timesAllList[z] =  this.pieceAllList[z] * dot;
            }

            this.priceAll = Math.pow(2, this.ladd - 1) * this.ladd * this.multi;
            this.pieceAll = Math.pow(2, this.ladd) * this.multi - this.multi;
            this.timesAll = this.pieceAll * dot;

            this.laddStr = '阶梯<br/><h3>' +  this.ladd + '阶</h3>';
            this.pieceStr = '总份数<br/><h3>' +  Parse.sub4Num(this.pieceAll) + '份</h3>';
            this.priceStr = '总金额<br/><h3>' +  Parse.sub4Num(this.priceAll) + '元</h3>';
            this.timesStr = '可传播<br/><h3>' +  Parse.sub4Num(this.timesAll) + '次</h3>';
            this.pieceEach = (this.priceAll / this.pieceAll).toFixed(2) + '元/份';
            if (dot == 1) {
                this.timesEach = (this.priceAll / this.timesAll).toFixed(2) + '元/次';
            } else {
                this.timesEach = (this.priceAll / this.timesAll * 1000).toFixed(2) + '元/千次';
            }
            if (type == 'inve') 
                return this;
            
            this.priceCur = 0;
            this.pieceCur = 0;
            this.timesCur = 0;
            this.priceCurList = [];
            this.pieceCurList = [];
            this.timesCurList = [];
            let rand;
            for (let z = 0; z < this.ladd; z++) {
                rand = Math.random() / 4 + 0.25;
                this.priceCurList[z] = this.priceAllList[z];
                this.pieceCurList[z] = Math.floor(this.pieceAllList[z] * rand);
                rand = Math.random() / 4 + 0.50;
                if (dot == 1) rand = 1;
                this.timesCurList[z] = this.pieceAllList[z] - this.pieceCurList[z];
                this.timesCurList[z] = Math.floor(this.timesCurList[z] * rand * dot);
                this.pieceCur += this.pieceCurList[z];
                this.priceCur += this.priceCurList[z] * this.pieceCurList[z];
                this.timesCur += this.timesCurList[z];
            }
            this.laddStr = this.laddStr.replace('h3', 'h5');
            this.pieceStr = this.pieceStr.replace('h3', 'h5');
            this.priceStr = this.priceStr.replace('h3', 'h5');
            this.timesStr = this.timesStr.replace('h3', 'h5');
            this.laddStr += '倍数<br/><h3>' +  this.multi + '倍';
            this.pieceStr += '剩余份数<br/><h3>' +  Parse.sub4Num(this.pieceCur) + '份';
            this.priceStr += '剩余金额<br/><h3>' +  Parse.sub4Num(this.priceCur) + '元';
            this.timesStr += '已传播<br/><h3>' +  Parse.sub4Num(this.timesCur) + '次';
            this.pieceEach = (this.priceCur / this.pieceCur).toFixed(2) + '元/份';
        }

    }


    this.initTemp = function(data) {
        let lines = data.lines;
        if (lines.length > 0)
            return lines;
        let list = Parse.mix(instance[data.type]);
        for (let idx in list) {
            if (idx >= cfg.inveCount) break;
            lines[idx] = new this.GrabData();
            lines[idx].initTemp(data, list, idx);
        }
        return lines;
    }


    this.creatGrabBody = function(content, data, x) {
        let lines = this.initTemp(data);
        let block = Elem.creat('div', content, 'block');
        for (let z in lines) {
            let body = new this.GrabBody();
            body.init(block, data, lines[z]);
        }
        data.lines = lines;
    }

    this.GrabBody = function() {
        let that = this;

        this.init = function(block, data, line) {
            if (!line.ladd) return;
            line.initData = line.initData || new this.GrabData().initData;
            line.initData(data.dot, data.type);
            line.body = this;
            this.line = line;
            this.body = Elem.creat('div', block, 'user-block');
            this.body.data = data;
            this.body.line = line;
            this.body.onclick = function() {
                console.log(this.line);
                Tran.bodySelect(this);
                Tran.showDetail(this);
            }
            this.flex = Elem.creat('div', this.body, 'user-flex');
            this.index = Elem.creat('div', this.flex, 'user-index');
            this.stamp = Elem.creat('div', this.flex, 'user-stamp');
            this.index.innerHTML = '编号: ' + line.index;
            this.index.innerHTML += '<br/>' + data.inverStr;
            this.stamp.innerHTML = '时间: ' + line.stamp;

            Alert.setUserFlex(this.body, line);

            this.flex = Elem.creat('div', this.body, 'user-flex');
            this.flex.style.marginTop = '0px';
            this.flex.style.marginBottom = '10px';
            this.ladd = Tran.creatText(this.flex, 'A', line.laddStr);
            this.piece = Tran.creatText(this.flex, 'B', line.pieceStr);
            this.price = Tran.creatText(this.flex, 'B', line.priceStr);
            this.times = Tran.creatText(this.flex, 'B', line.timesStr);
        }
    }




    this.creatInveBody = function(content, data, x) {
        if (!data.lines) return;
        let lines = data.lines;
        let block = Elem.creat('div', content, 'block');
        for (let z = 0; z < cfg.laddCount; z++) {
            lines[z] = {ladd: z+1, multi: 1}; 
            let body = new this.InveBody();
            body.init(block, data, lines[z], z);
        }
        data.lines = lines;
    }

    this.InveBody = function() {
        let that = this;

        this.init = function(block, data, line, z) {
            if (!line.ladd) return;
            line.initData = line.initData || new Tran.InveData().initData;
            line.initData(data.dot, data.type);
            line.row = Math.floor(line.ladd / 5 - 0.2);
            line.body = this;
            this.line = line;
            this.body = Elem.creat('div', block, 'user-flex');
            //Elem.color(body, line.color.deep, 'white');
            this.body.data = data;
            this.body.line = line;
            this.body.onclick = function() {
                console.log(this.line);
                this.bodySelect(this);
                this.setAlertDetail(this);
            }
            this.ladd = Tran.creatText(this.body, 'A', line.laddStr);
            this.piece = Tran.creatText(this.body, 'B', line.pieceStr);
            this.price = Tran.creatText(this.body, 'B', line.priceStr);
            this.times = Tran.creatText(this.body, 'B', line.timesStr);
            if (z == 0) {
                Tran.bodySelect(this.body);
            }
        }
    }



    this.creatText = function(flex, attr, text) {
        let elem = Elem.creat('text', flex, 'line');
        elem.setAttribute('state', attr);
        elem.innerHTML = text;
        return elem;
    }



    this.bodySelect = function(flex) { 
        let old = document.body.flex;
        if (old) {
            old.style.border = 'solid 0px transparent';
            old.style.marginBottom = '5px';
        }
        if (flex) {
            flex.style.border =  'solid 12px dodgerblue';
            flex.style.marginBottom =  '10px';
            document.body.flex = flex; 
        }
    }


    this.showDetail = function(body) {
        Alert.hidePanel();
        Alert.showPanel('detail');
        let data = body.data;
        let line = body.line;
        document.body.line = line;
        document.body.data = data;
        let title = Alert.curPanel.title;
        let block = Alert.curPanel.block;
        title.innerHTML = data.flexStr.replace('#0',line.inver);
        block.style.maxHeight = Config.page.alertHeight + 'px';
        block.innerHTML = '';


        let ladd = line.ladd - 1;
        //alert(JSON.stringify(line));
        let priceKey = 'priceAllList';
        let pieceKey = data.type != 'inve' ? 'pieceCurList' : 'pieceAllList';
        let timesKey = data.type != 'inve' ? 'timesCurList' : 'timesAllList';

        for (let i = 0; i < line.ladd; i++) {
            let idx = line.ladd - i - 1;
            let flex = Elem.creat('div', block, 'user-flex', idx);
            let laddStr = data.laddStr.replace('#0', (line.ladd - i));
            let pieceStr = data.pieceStr.replace('#0', Parse.sub4Num(line[pieceKey][idx]));
            let priceStr = data.priceStr.replace('#0', Parse.sub4Num(line[priceKey][idx]));
            let timesStr = data.timesStr.replace('#0', Parse.sub4Num(line[timesKey][idx]));
            let ladd = this.creatText(flex, 'A', laddStr);
            let piece = this.creatText(flex, 'B', pieceStr);
            let price = this.creatText(flex, 'B', priceStr);
            let times = this.creatText(flex, 'B', timesStr);
        }

        if(block.firstChild)
            block.firstChild.scrollIntoView();

        Alert.showButton(data);
    }

    this.showPack = function() {
        Alert.hidePanel();
        Alert.showPanel('pack');
        let title, block, data;
        data = document.body.data;
        title = Alert.curPanel.title;
        block = Alert.curPanel.block;
        title.innerHTML = data.packTitle;

        for (let idx in data.taskTypes) {
            let line, flex;
            flex = Elem.creat('div', block, 'user-flex');
            line = Elem.creat('div', flex, 'line');
            line.setAttribute('state', 'A');
            line.innerHTML = '<h3>任务' + (parseInt(idx)+1);
            line = Elem.creat('div', flex, 'line');
            line.setAttribute('state', 'B');
            line.innerHTML = '<h3>' + data.taskTypes[idx] + ' Task';
        }
    }


    this.showTask = function() {
        Alert.hidePanel();
        Alert.showPanel('task');
        let redo, title, block;
        redo = Alert.buttons.redo;
        title = Alert.curPanel.title;
        block = Alert.curPanel.block;
        redo.setAttribute('state', 'danger');
        Task.creatTask(block);
    }




    this.showResult = function() {
        Alert.hidePanel();
        Alert.showPanel('result');
        let line = document.body.line;
        let data = document.body.data;
        let redo, title, block;
        block = Alert.curPanel.block;
        Task.initRoll(line);
        Task.ladd = Math.min(line.ladd, Task.ladd);

        let ladd = Elem.creat('div', block, 'line');
        ladd.innerHTML = line.inver + '的' + Task.ladd + '阶' + Task.pack;
        let pic = Elem.creat('img', block, 'img');
        pic.src = cfg.laddSrc + Task.ladd + '.png';
        let price = Elem.creat('div', block, 'line');
        price.innerHTML = '<h2>￥' +  Parse.addSplit(line.priceAllList[Task.ladd - 1]);
        Alert.log('<h4>恭喜您获得了</h4>' + ladd.innerText);
    }


    this.setUsers = function() {
        if (Config.sett.modeType == 'sponer') {
            items = items_sponer;
        } else if (Config.sett.modeType == 'ghost') {
            items = items_ghost;
        }
    }

}






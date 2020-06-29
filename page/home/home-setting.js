let Home = new __Home();
let Depot = new __Depot();

function __Home() {

    this.init = function() {
        this.creatElems(); 
        Container(this);
    }

    this.creatElems = function() {
        Alert.creatOuterTop(this);
        Alert.creatOuterCenter(this);
        Alert.creatOuterBot(this);
        Alert.showInner();
    }

    this.creatBlock = function(content, data) {
        let block = Elem.creat('div', content, 'block');
        if (data.isDepot) {
            Depot.init(block, data); 
        }
        if (data.isResult) {
            data.viceStr = data.vice.replace('#1', data.lines.length);
            this.creatLine(block, data); 
        }
    }

    this.creatLine = function(block, data) {
        let lines = data.lines;
        for (let z in lines) {
            let temp = lines[z];
            let pos = Parse.cutZero(Depot.tgtPos) || 'home';
            temp.val = Math.floor((Math.random()+40-2*z) * 20);
            temp.val = ~~(temp.val / 24) + '天' + temp.val % 24 + '时';
            temp.order = temp.pos || pos + '-' + z;
            temp.valStr = '已占领';
            let line = new Alert.UserData();
            line.init(lines[z]);
            line.pos = temp.pos;
            let body = Elem.creat('div', block, 'user-block', 'lines['+z+']');
            let flex = new Alert.UserFlex(body, line);
            flex.init(body, line);
            data.lines[z] = line;
        }
    }

}



function __Depot() {

    let table;
    this.cap = 8888;
    this.col = 6;
    this.row = 6;
    this.orgPos = '000000';
    this.tgtPos = '000000';
    this.tgtList = [];
    this.tgtCell = [];
    this.posCell = [];
    this.lvlDict = {};
    this.lvlStr = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    this.init = function(block, data) {
        this.block = block;
        this.data = data;
        this.initBody();
        console.log(Depot);
    }

    this.initBody = function() {
        // let cap = Math.pow(25,5);
        // let idx = getScale(cap, []);
        // Config.mapScale = Parse.reverse(idx);
        // Config.mapTgt = Parse.reverse(idx);
        // idx = Parse.reverse(idx);
        // console.log(idx);
        let flex = Elem.creat('div', this.block, 'flex');
        table = Elem.creat('table', this.block, 'table');
        let button = Elem.creat('div', this.block);
        button.innerHTML = this.data.btnStr;

        for (let i=0;i<this.col;i++) {
            let pos = Elem.creat('div', flex, 'user-pos', i);
            Elem.page(pos, Alert.colorFont());
            this.posCell.push(pos);
        }
        this.creatPos(this.orgPos);
    }


    this.creatPos = function(tgt) {
        table.innerHTML = '';
        for (let x=0; x<this.row; x++) {
            let tr = Elem.creat('tr', table, 'row', x);
            for (let y=0; y<this.col; y++) {
                let td = Elem.creat('td', tr, 'col', y);
                let pos = this.lvlStr[x*this.row+y];
                this.lvlDict[pos] = [x, y];
                this.setText(td, pos);
                td.onclick = function() {
                    Depot.setCell(this);
                }
            }
        }
        this.tgtCell = [];
        this.tgtPos = tgt || this.orgPos;
        this.tgtList = this.tgtPos.split('');
        for (let x in this.posCell) {
            this.setText(this.posCell[x], this.orgPos[x]);
        }
        for (let x in this.tgtList) {
            let pos = this.tgtList[x];
            let i = this.lvlDict[pos][0];
            let j = this.lvlDict[pos][1];
            let td = table.children[i].children[j];
            this.tgtCell.push(td);
        }
        for (let x in this.tgtCell) {
            let tgtTd = this.tgtCell[x];
            tgtTd.innerHTML = tgtTd.center + x;
            this.posCell[x].innerHTML = tgtTd.innerHTML;
            Elem.color(tgtTd, 'white', Alert.colorFont());
        }
    }



    this.setCell = function(td) {
        this.tgtCell.push(td);
        this.tgtList.push(td.pos);
        if (this.tgtCell.length > this.col) {
            let oldTd = this.tgtCell[0];
            oldTd.innerHTML = oldTd.center + '-';
            Elem.color(oldTd, Alert.colorFont(), 'white'); 
            this.tgtCell.shift();
        }
        if (this.tgtList.length > this.col) {
            this.tgtList.shift();
        }
        this.tgtPos = this.tgtList.join('');

        for (let x in this.tgtCell) {
            let tgtTd = this.tgtCell[x];
            tgtTd.innerHTML = tgtTd.center + x;
            this.posCell[x].innerHTML = tgtTd.innerHTML;
            Elem.color(tgtTd, 'white', Alert.colorFont());
        }
    }



    this.setText = function(td, pos) {

        td.top = '<h3>' + top + '</h3>';
        td.center = '<h2>' + pos + '</h2>';
        td.pos = pos;
        td.innerHTML = td.center + '-';
    }

    this.toLand = function(e) {
        Alert.hidePanel();
        let flex = document.body.flex;
        let line = Config.__line(flex);
        let pos = Parse.fillZero(line.pos.split('-')[0], 6);
        this.creatPos(pos);
        this.toExplore();
    }


    this.toExplore = function() {
        Alert.creatContent(Home, 0, 2);
        let content = document.body.querySelector('.content');
        content.nextSibling.nextSibling.scrollIntoView();
    }

    this.toHome = function() {
        this.creatPos();
        Alert.creatContent(Home, 0, 2);
        let content = document.body.querySelector('.content');
        content.nextSibling.scrollIntoView();
    }

    this.toOccupt = function() {
        let pos = Parse.cutZero(this.tgtPos);
        let flex = document.body.flex;
        let lines = items[0].list[0].lines;
        for (let x in lines) {
            if (lines[x].pos.split('-')[0] == pos) {
                Alert.log(`占领地块失败!<h5>不可重复占领,请选择其他地块占领哦</h5>`);
                return;
            }
        }
        if (lines.length < lines[0].ladd) {
            let line = JSON.parse(JSON.stringify(lines[0]));
            line.pos = pos + '-1';
            lines.unshift(line);
            Alert.creatContent(Home, 0, 0);
            Alert.log(`占领地块成功!<h5>您成功占领了地块 ${line.pos}</h5>`);
            let content = document.body.querySelector('.content');
            content.scrollIntoView();
        } else {
            Alert.log(`可占领地块不足!<h5>解除已占领地块或提升阶梯后再次尝试哦</h5>`);
        }
    }


    this.getScale = function(cap, scale) {
        if (this.cap <= 0)
            return [1, col];

        if (this.cap <= this.row * this.col) {
            this.cap = Math.floor((cap-1)/this.col) + 1;
            this.scale.push([cap, this.col]);
            return this.scale;
        }

        if (this.cap > this.row * this.col) {
            this.scale.push([this.row, col]);
            this.cap = Math.floor((cap-1)/this.row/this.col) + 1;
            return getScale(this.cap, this.scale);
        }
    }

}
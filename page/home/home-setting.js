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
        if (!data.lines) 
            return;
        let lines = data.lines;
        for (let z in lines) {
            let temp = lines[z];
            let line = new Alert.UserData();
            line.init(lines[z]);
            line.pos = temp.pos;
            this.initTemp(line, z);
            let body = Elem.creat('div', block, 'user-block', 'lines['+z+']');
            let flex = new Alert.UserFlex(body, line);
            flex.init(body, line);
            body.onclick = function() {
                document.body.user = this;
                Alert.bodySelect(this);
                Alert.showUser(this);
            }
            data.lines[z] = line;
        }
    }

    this.initTemp = function(line, z) {
        let pos = Parse.cutZero(Depot.tgtPos.join('')) || 'home';
        line.order = line.pos || pos + '-' + z;
        let rand = ~~(12*Math.random()*Math.random()+150-10*z);
        line.value = '已占领: ' + rand + 'h';
        line.group = line.uid[0].replace('s','赞助商').replace('d','淘金者');
        line.desc = '<div desc="center">' + line.name + '的描述</div>';
        line.desc += 'THE DESCRIBE OF ' + line.name + '<br/>';
        line.desc += 'THE DESCRIBE OF ' + line.name + '<br/>';
        line.desc += 'THE DESCRIBE OF ' + line.name + '<br/>';
    }

}



function __Depot() {

    let table;
    this.cap = 8888;
    this.col = 6;
    this.row = 6;
    this.orgPos = '000000';
    this.tgtPos = [];
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
        // block.appendChild(data.btnStr);
        let button = Elem.creat('div', this.block);
        button.innerHTML = this.data.btnStr;
        // button.innerHTML = '<h3>DISCOVER</h3>';
        // Elem.state(button, 'permit');


        for (let i=0;i<this.col;i++) {
            let pos = Elem.creat('div', flex, 'user-pos', i);
            Elem.color(pos, 'white', Alert.colorFont());
            this.posCell.push(pos);
        }
        this.setPos();
    }




    this.setText = function(td, pos) {

        td.top = '<h3>' + top + '</h3>';
        td.center = '<h2>' + pos + '</h2>';
        // td.center = '<h2>' +rowStr[pos[0]] + colStr[pos[1]] + '</h2>';
        td.pos = pos;
        td.innerHTML = td.center + '-';
    }



    this.setPos = function() {
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
        this.tgtPos = this.orgPos.split('');
        for (let x in this.posCell) {
            this.setText(this.posCell[x], this.orgPos[x]);
        }
        for (let x in this.tgtPos) {
            let pos = this.tgtPos[x];
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
        this.tgtPos.push(td.pos);
        if (this.tgtCell.length > this.col) {
            let oldTd = this.tgtCell[0];
            oldTd.innerHTML = oldTd.center + '-';
            Elem.color(oldTd, Alert.colorFont(), 'white'); 
            this.tgtCell.shift();
        }
        if (this.tgtPos.length > this.col) {
            this.tgtPos.shift();
        }

        for (let x in this.tgtCell) {
            let tgtTd = this.tgtCell[x];
            tgtTd.innerHTML = tgtTd.center + x;
            this.posCell[x].innerHTML = tgtTd.innerHTML;
            Elem.color(tgtTd, 'white', Alert.colorFont());
        }
    }


    this.toHome = function() {
        this.setPos();
        Alert.creatContent(Home, 0, 2);
    }

    this.toEnter = function() {
        Alert.creatContent(Home, 0, 2);
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
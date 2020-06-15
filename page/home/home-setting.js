var Home = new __Home();

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
        document.block = block;
        if (data.isDepot) {
            creatRect();
            // Depot(block, data);
        }
    }
}


function Depot(block, data) {
    let cap = 8888;
    let abbr = [];
    let size = [5,5];
    let scale = [[5,5],[5,5],[5,5],[5,5],[5,5]];
    let target = [[0,0],[0,0],[0,0],[0,0],[0,0]];
    let degree = [];
    let oldCell = [];
    let tgtCell = [];
    let lvlDict = '金木水火土';
    let rowDict = 'ABCDEFGHI';
    let colDict = '123456789';
    init(block, data);

    function init(block, data) {
        // let cap = Math.pow(25,5);
        // let idx = getScale(cap, []);
        // Config.mapScale = Parse.reverse(idx);
        // Config.mapTgt = Parse.reverse(idx);
        // idx = Parse.reverse(idx);
        // console.log(idx);
        let flex = Elem.creat('div', block, 'flex');
        let table = Elem.creat('table', block, 'table');
        let button = Elem.creat('div', block, 'button-depot');
        Elem.state(button, 'permit');

        for (let i=0;i<scale.length;i++) {
            setDegree(i, 0);
        }
        console.log(degree);
        for (let i=0;i<scale.length;i++) {
            let tag = Elem.creat('div', flex, 'button-depot', i);
            tag.i = i;
            tag.onclick = function() {
                setTag(table, this);
            }
            if (i==0)
                setTag(table, tag);
            setText(tag, i, target[i]);
        }
    }


    function setDegree(i, val) {
        let deg = [];
        let rand = Math.random()*10 + 5;
        for (let j=0;j<25;j++) {
            if (val == -1 || val == 0 && j > rand) {
                deg[j] = 0;

            } else {
                deg[j] = Math.floor(Math.random()*25)*4 + 4;
            }
        }

        degree[i] = deg;
        return deg;
    }


    function setTag(table, tag) {
        let i = tag.i;
        table.innerHTML = '';
        for (let x=0; x<size[0]; x++) {
            let tr = Elem.creat('tr', table, 'row', x);
            for (let y=0; y<size[1]; y++) {
                let td = Elem.creat('td', tr, 'col', y);
                td.tag = tag;
                setText(td, i, [x, y]);
                td.onclick = function() {
                    setCell(this);
                }
                if (x == target[i][0] && y == target[i][1])
                    setCell(td);
            }
        }
    }

    function setText(td, i, tgt) {
        let idx = size[0]*tgt[0]+tgt[1];
        let deg = degree[i][idx];
        let pos = idx < 9 ? '0' + (idx+1) : (idx+1);

        td.top = '<h3>' + lvlDict[i] + '</h3>';
        td.center = '<h2>' + pos + '</h2>';
        // td.center = '<h2>' +rowDict[tgt[0]] + colDict[tgt[1]] + '</h2>';
        td.bot = deg == 0 ? '-' : deg + '%';
        td.idx = idx;
        td.tgt = tgt;
        td.deg = deg;
        td.innerHTML = td.top + td.center + td.bot;
    }


    function setCell(td) {
        let i = td.tag.i;
        console.log(td.innerHTML)
        td.tag.innerHTML = td.innerHTML;
        target[i] = td.tgt;
        abbr[i] = td.abbr;
        for (let j=0;j<degree.length;j++) {
            if (j > i && td.deg == 0) 
                setDegree(j, -1);
            if (j > i && td.deg > 0) 
                setDegree(j, 0);
        }
        let oldTd = oldCell[i] || td;

        let tgtTd = tgtCell[i] || td;
        Elem.color(oldTd, Alert.colorFont(), 'white');
        if (td.tag.i - tgtTd.tag.i > 1) {
            resetTag(tgtTd.tag, 1);
        } else {
            resetTag(td.tag, 1);
            tgtCell[i] = td;
        }
        oldCell[i] = td;
        Elem.color(td, 'white', Alert.colorFont());
        let button = td.tag.parentNode.parentNode.lastChild;
        button.innerHTML = '<h2>DISCOVER</h2>';
    }

    function resetTag(tag, val) {
        console.log(tag);
        let next = tag.nextSibling;
        if (next && next.style) {
            console.log(next);
            let tgt = target[next.i];
            let idx = size[0]*tgt[0]+tgt[1];
            let deg = degree[next.i][idx];
            let pos = idx < 9 ? '0' + (idx+1) : (idx+1);
            if (val == 0) deg = 0;
            next.innerHTML = '<h3>' + lvlDict[next.i] + '</h3>';
            next.innerHTML += '<h2>-</h2>-';
            // next.innerHTML += '<h2>' + pos + '</h2>';
            // next.innerHTML += deg == 0 ? '-' : deg + '%';
            resetTag(next, deg);
        }
    }


    function getScale(cap, scale) {
    	let row = size[0];
    	let col = size[1];
        if (cap <= 0)
            return [1, col];

        if (cap <= row * col) {
            cap = Math.floor((cap-1)/col) + 1;
            scale.push([cap, col]);
            return scale;
        }

        if (cap > row * col) {
            scale.push([row, col]);
            cap = Math.floor((cap-1)/row/col) + 1;
            return getScale(cap, scale);
        }
    }

}
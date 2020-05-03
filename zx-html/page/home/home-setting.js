function setElems() {
	setOuterTop();
	setOuterCenter();
    setInner();
}


function setOuterTop() {
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
		if (config.modeType == 'ghost' && data.isDepot)
			Depot(content, data);
        if (config.modeType == 'digger')
            Jigsaw(content, data);
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

function Jigsaw(content, data) {
    var flex, clock;
    var blockWidth, cellWidth;
    var cellLen = 3;
    var cells = [];
    var light = [4];
    var border = 10;
    var loop = 10;
    creatCell(content, data);

    function creatCell(content, data) {
        var block = Elem.creat('div', content, 'block');
        blockWidth = block.clientWidth * config.zoom;
        block.style.width = blockWidth + 'px';
        block.style.margin = '0px auto';
        cellWidth = Math.floor((blockWidth - cellLen*border*2) / cellLen);
        for (var i=0;i<cellLen;i++) {
            for (var j=0;j<cellLen;j++) {
                var idx = i*cellLen + j;
                var posY = -cellWidth * i;
                var posX = -cellWidth * j;
                cells[idx] = {
                    idx: idx,
                    posX: posX,
                    posY: posY,
                }
            }
        }
        console.log(cells);
        clock = setInterval(function() {
            if (loop > 0) {
                cells = Parse.mix(cells);
                mixCell(block, cells);
                loop--;
            } else {
                clearInterval(clock);
            }
        }, 100);
    }

    function mixCell(block, cells) {
        block.innerHTML = '';
        flex = Elem.creat('div', block, 'flex');
        flex.style.flexWrap = 'wrap';
        for (var i=0;i<cellLen;i++) {
            for (var j=0;j<cellLen;j++) {
                var idx = i*cellLen + j;
                var cell = Elem.creat('div', flex, 'cell', idx);
                cell.idx = cells[idx].idx;
                cell.style.width = cellWidth + 'px';
                cell.style.height = cellWidth + 'px';
                cell.style.backgroundSize = blockWidth + 'px ' + blockWidth + 'px';
                cell.style.backgroundPosition = cells[idx].posX + 'px ' + cells[idx].posY + 'px';
                cell.addEventListener('click', function(event) {
                    clickCell(event);
                });
                cells[idx].cell = cell;
            }
        }
        setHighLight();
    }

    function clickCell(event) {
        console.log(event);
        var org = flex.children[4];
        var tgt = event.target;
        if (org === tgt) return;
        var orgNext = org.nextSibling;
        var tgtNext = tgt.nextSibling;
        org.parentNode.insertBefore(tgt, orgNext);
        tgt.parentNode.insertBefore(org, tgtNext);
        setHighLight();
    }

    function setHighLight() {
        for (var i=0;i<cells.length;i++) {
            var cell = cells[i].cell;
            cell.style.borderWidth = border + 'px';
            cell.style.borderColor = getColorLight();
        }
        var org = flex.children[4];
        org.style.borderColor = getColorType();
    }
}

function Depot(content, data) {
    var cap = 8888;
    var abbr = [];
    var size = [5,5];
    var scale = [[5,5],[5,5],[5,5],[5,5],[5,5]];
    var target = [[0,0],[0,0],[0,0],[0,0],[0,0]];
    var degree = [];
    var oldCell = [];
    var tgtCell = [];
    var lvlDict = '金木水火土';
    var rowDict = 'ABCDEFGHI';
    var colDict = '123456789';
    init(content, data);

    function init(content, data) {
        // var cap = Math.pow(25,5);
        // var idx = getScale(cap, []);
        // config.mapScale = Parse.reverse(idx);
        // config.mapTgt = Parse.reverse(idx);
        // idx = Parse.reverse(idx);
        // console.log(idx);
        var flex = Elem.creat('div', content, 'flex');
        var table = Elem.creat('table', content, 'table');
        var button = Elem.creat('div', content, 'button-depot');
        Elem.togType(button, 'permit');

        for (var i=0;i<scale.length;i++) {
            setDegree(i, 0);
        }
        console.log(degree);
        for (var i=0;i<scale.length;i++) {
            var tag = Elem.creat('div', flex, 'button-depot', i);
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
        var deg = [];
        var rand = Math.random()*10 + 5;
        for (var j=0;j<25;j++) {
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
        var i = tag.i;
        table.innerHTML = '';
        for (var x=0; x<size[0]; x++) {
            var tr = Elem.creat('tr', table, 'row', x);
            for (var y=0; y<size[1]; y++) {
                var td = Elem.creat('td', tr, 'col', y);
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
        var idx = size[0]*tgt[0]+tgt[1];
        var deg = degree[i][idx];
        var pos = idx < 9 ? '0' + (idx+1) : (idx+1);

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
        var i = td.tag.i;
        console.log(td.innerHTML)
        td.tag.innerHTML = td.innerHTML;
        target[i] = td.tgt;
        abbr[i] = td.abbr;
        for (var j=0;j<degree.length;j++) {
            if (j > i && td.deg == 0) 
                setDegree(j, -1);
            if (j > i && td.deg > 0) 
                setDegree(j, 0);
        }
        var oldTd = oldCell[i] || td;

        var tgtTd = tgtCell[i] || td;
        Elem.color(oldTd, getColorType(), 'white');
        if (td.tag.i - tgtTd.tag.i > 1) {
            resetTag(tgtTd.tag, 1);
        } else {
            resetTag(td.tag, 1);
            tgtCell[i] = td;
        }
        oldCell[i] = td;
        Elem.color(td, 'white', getColorType(0));
        var button = td.tag.parentNode.parentNode.lastChild;
        button.innerHTML = '<h2>DISCOVER</h2>';
    }

    function resetTag(tag, val) {
        console.log(tag);
        var next = tag.nextSibling;
        if (next && next.style) {
            console.log(next);
            var tgt = target[next.i];
            var idx = size[0]*tgt[0]+tgt[1];
            var deg = degree[next.i][idx];
            var pos = idx < 9 ? '0' + (idx+1) : (idx+1);
            if (val == 0) deg = 0;
            next.innerHTML = '<h3>' + lvlDict[next.i] + '</h3>';
            next.innerHTML += '<h2>-</h2>-';
            // next.innerHTML += '<h2>' + pos + '</h2>';
            // next.innerHTML += deg == 0 ? '-' : deg + '%';
            resetTag(next, deg);
        }
    }


    function getScale(cap, scale) {
    	var row = size[0];
    	var col = size[1];
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

window.onload = function() {
    Setting.start();
}

const cellType = {WALL:0, PATH:1, PAST:2, COLL:3, START:4, END:5, MARK: 6, EXPLOR:7, AUTO:8};
const cellColor = ['#111', 'white', 'green', 'red', 'green', 'green', 'green', 'dodgerblue', 'dodgerblue'];
const arrowType = ['left', 'up', 'right', 'down'];





let Setting = new __Setting();
function __Setting() {

    this.hide = 0;
    this.isLine = 1;        //是否线条边框
    this.isBack = 0;        //是否回头
    this.isColl = 0;        //是否碰撞
    this.isMark = 0;        //是否标记
    this.isPack = 1;        //是否加密

    this.round = 0;
    this.scaleIdx = 1;          //尺寸大小
    this.explorIdx = 1;         //寻路模式
    this.batCount = 1;       
    this.labyConfig = [
        {},
        {col: 20, row: 10, size: 32, wallWidth: 15, spc: 40},
        {col: 32, row: 16, size: 20, wallWidth: 9, spc: 25},
        {col: 40, row: 20, size: 16, wallWidth: 7, spc: 20},
        {col: 64, row: 32, size: 10, wallWidth: 4, spc: 12.5},
        {col: 80, row: 40, size:  8, wallWidth: 3, spc: 10},
    ];
    this.batConfig = {
        X: {flex: 2, block: 2, col: 17, row: 24, size: 10, wallWidth: 4},
        Y: {flex: 2, block: 1, col: 35, row: 24, size: 10, wallWidth: 4},
        Z: {flex: 1, block: 1, col: 35, row: 50, size: 10, wallWidth: 4},
        U: {flex: 1, block: 1, col: 50, row: 70, size: 10, wallWidth: 4},

    };
    this.btnKey = [
        {key: 'isLine', val: 1, ableText:'线条边框', unableText:'方块边框'},
        {key: 'isBack', val: 0, ableText:'回头YES', unableText:'回头NO'},
        {key: 'isColl', val: 0, ableText:'碰撞YES', unableText:'碰撞NO'},
        {key: 'isMark', val: 0, ableText:'标记YES', unableText:'标记NO'},
        {key: 'isPack', val: 1, ableText:'加密', unableText:'解密'},
    ];

    this.start = function() {
        this.phone = Elem.get('phone');
        this.alert = Elem.get('alert');
        this.outer = Elem.get('outer');
        this.page1 = Elem.get('page1');
        this.page2 = Elem.get('page2');
        this.outerTop = Elem.get('outer-top');
        this.outerBot = Elem.get('outer-bot');
        this.isPhone = (/Android|webOS|iPhone|iPod|BlackBerry|MIX/i.test(navigator.userAgent));
        this.isPad = (/Pad/i.test(navigator.userAgent));
        if (this.isPhone || this.isPad) {
            window.location.href = '../../labyrinth.html';
        } else {
            this.resize();
            this.init();
        }
    }

    this.resize = function() {
        this.outerHeight = ~~(window.innerHeight - 1 - 63);
        this.canvasMargin = ~~(this.outerHeight / 2 - 321);
        this.outer.style.height = this.outerHeight + 'px';
    }

    this.init = function() {
        this.bat_toggle();
        this.set_scale();
        for (let i = 0; i < this.btnKey.length; i++) {
            this.tog_child(i, this.btnKey[i], !this.btnKey[i].val);
        }
        console.log(this);
    };

    this.back = function() {
        window.location.href = '../home/home.html';
    }

    this.refresh = function() {
        let data = this.labyConfig[this.scaleIdx];
        let margin = this.canvasMargin - data.wallWidth;
        this.wallWidth = !this.isLine ? 0 : data.wallWidth;
        this.inBat = 0;
        this.isPack = 0;
        this.tog_child(4, this.btnKey[4], false);

        this.round = 0;
        this.labyData = [];
        this.pathData = {};
        this.outer.innerHTML = '';
        Laby = new __Labyrinth();
        Laby.init(this.outer, 'Z00'); 
        Laby.canvas.style.margin = margin + 'px 0px';
    }

    this.download = function() {
        Laby.download();
    }


    this.bat_ready = function(idx) {
        this.outer.innerHTML = '';
        Elem.get('tips').style.display = idx ? 'block' : 'none';
        if (idx == 0) {
            let page1 = Elem.get('page1');
            this.htmlStr = this.htmlStr || page1.innerHTML;
            page1.innerHTML = this.htmlStr
            .replace(/#0/g, this.batCount * 3)
            .replace(/#1/g, this.batCount * 1)
            .replace(/#2/g, fill_zero(this.batCount, 3));
        }
        this.isPack = 0;
        this.tog_child(4, this.btnKey[4], false);
    }

    this.bat = function(btn, count) {
        this.inBat = 1;
        this.round = 0;
        this.labyData = [];
        this.pathData = {};
        this.batCount = count;
        this.bat_ready(0);
        this.init_bat('X');
        this.init_bat('Y');
        this.init_bat('Z');
    }

    this.bat_toggle = function() {
        if (this.hide) {
            this.hide = 0;
            this.outerTop.style.display = 'block';
            this.outerBot.style.display = 'none';
            this.outer.style.height = 'auto';
        } else {
            this.hide = 1;
            this.outerTop.style.display = 'none';
            this.outerBot.style.display = 'flex';
            this.outer.style.height = this.outerHeight + 'px';
        }
        if (this.inBat)
            this.outer.scrollIntoView(true);
    }

    this.set_scale = function(btn, idx) {
        btn = btn || Elem.get('flex2').children[0];
        this.set_child(btn);
        this.scaleIdx = idx || this.scaleIdx;
        let data = this.labyConfig[this.scaleIdx];
        if (this.isPhone) {
            this.col = data.row;
            this.row = data.col;
            this.size = data.spc;
        } else {
            this.col = data.col;
            this.row = data.row;
            this.size = data.size;
        }

        this.refresh();
    }

    this.set_select = function(btn, idx) {
        for (let i = 0; i < this.btnKey.length; i++) {
            if (idx == i)
                this.tog_child(i, this.btnKey[i], this[this.btnKey[i].key]);
        }
        if (idx == 0) {
            this.refresh();
        }
        if (idx == 4) {
            btn = btn || Elem.get('flex3').children[0];
            this.set_explor(btn, idx);
        }
    }

    this.set_explor = function(btn, idx) {
        if (this.inBat) {
            this.alert.style.display = 'block';
            this.explor_bat();
        } else {
            Laby.auto_explor();
            Laby.draw_path(); 
        }
    }

    this.tog_child = function(i, obj, val) {
        let elem = Elem.get('flex3').children[i];
        if (val) {
            this[obj.key] = 0;
            elem.innerHTML = obj.unableText;
            elem.setAttribute('btype', 'dead');
        } else {
            this[obj.key] = 1;
            elem.innerHTML = obj.ableText;
            elem.setAttribute('btype', 'live');
        } 
    }

    this.set_child = function(btn) {
        let childs = btn.parentNode.children;
        for (let i=0;i<childs.length;i++) {
            if (childs[i].innerText == btn.innerText)
                childs[i].setAttribute('btype', 'live');
            else
                childs[i].setAttribute('btype', 'dead');
        }
    }


    // 批量生成
    this.init_bat = function(labyIdx) {
        let data = this.batConfig[labyIdx];
        this.labyIdx = labyIdx;
        this.col = data.col;
        this.row = data.row;;
        this.size = data.size;
        if (this.isPhone)
            this.size = ~~(data.size * 1.25);
        this.part = data.flex*data.block;
        this.count = data.flex*data.block*this.batCount;
        this.wallWidth = !this.isLine ? 0 : data.wallWidth;
        this.creat_bat(data);
    }


    this.creat_bat = function(data) {

        for (let i=1; i<=this.batCount; i++) {
            let index = this.labyIdx + fill_zero(i, 3);
            let inner = Elem.creat('div', outer, 'inner');
            let head = Elem.creat('div', inner, 'head');
            head.innerHTML = `index=${index} | size=${this.col}x${this.row}x${this.part}`;
            for (let x=0; x<data.flex; x++) {
                let flex = Elem.creat('div', inner, 'title-flex');

                for (let y=0; y<data.block; y++) {
                let block = Elem.creat('div', flex, 'title-block');
                let labyIdx = this.labyIdx + x + '' + y;
                    let laby = new __Labyrinth();
                    laby.init(block, labyIdx);
                    laby.index = index + '_' +  x + '' + y;
                    this.labyData.push(laby);
                }
            }
            let foot = Elem.creat('div', inner, 'foot');
            foot.innerHTML = `http://tobbye.github.io/labyrinth.html`;
        }
    }


    this.explor_bat = function() {

        if (this.round < this.labyData.length) {
            this.round ++;
            let laby = this.labyData[this.round -1];
            laby.auto_explor();
            laby.map = null;  
            laby.canvas.scrollIntoView(1);
            this.pathData[laby.index] = laby.autoPath;
            this.alert.innerHTML = `正在解密中...<br/>当前: ${laby.index} | 进度: ${this.round} | 总数: ${this.labyData.length}`;
            setTimeout(function() {
                Setting.explor_bat(Setting.alert);
            }, 100);
        } else {
            let str = this.isPack ? '加密' : '解密';
            this.draw_bat();
            this.alert.innerHTML = `正在${str}中...<br/>进度: ${this.round} | 总数: ${this.labyData.length}`;
            setTimeout(function() {
                Setting.alert.innerHTML = `${str}完成！`;
            }, 3000);
            setTimeout(function() {
                Setting.alert.style.display = 'none';
            }, 5000);
        }
    }

    this.draw_bat = function() {
        for (let i=0; i<this.labyData.length; i++) {
            let laby = this.labyData[i];
            laby.draw_path();
        } 
    }
}



// 生成迷宫相关
let Laby = new __Labyrinth();
function __Labyrinth() {
    let that = this;

    this.init = function(inner, labyIdx) {
        this.labyIdx = labyIdx;
        this.col = Setting.col;
        this.row = Setting.row;
        this.size = Setting.size;
        this.map = [];
        this.cur = [0, 1];
        this.next = [];
        this.arrow = [];
        this.accessed = [];
        this.notAccessed = [];
        this.autoPath = [];
        this.distance = 0;
        this.wallWidth = 0;
        this.nextList = [[0, -1], [-1, 0], [0, 1], [1, 0]];
        this.tranList = [-1, -this.col, 1, this.col];
        this.word = 'from:浙江Z金华J兰溪L to:浙江Z温州W文成W';

        this.init_canvas(inner);
        this.init_map();
        this.fill_map();
        this.draw_map(); 
    };


    this.init_canvas = function(inner) {
        this.canvas = document.createElement('canvas');
        inner.appendChild(this.canvas);
        this.width = 2*this.col+1;
        this.height = 2*this.row+1;
        this.canvas.width = this.width*this.size;
        this.canvas.height = this.height*this.size;
        this.canvas.onclick = function(e){
            if (Setting.inBat)
                that.download();
            else
                that.mark_path(e);
        }
        this.canvas.onmousemove = function(e) {
            if (Setting.isFollow)
                Laby.mark_path(e);
        }
        this.ctx = this.canvas.getContext('2d');
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.font = this.size - 2 + 'px bold Arial'; 
        this.ctx.fillStyle = cellColor[0];
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); 
    };


    this.init_map = function() {
        let w = this.width;
        let h = this.height;
        for(let i = 0; i < h; ++i) {
            this.map[i] = [];
            for(let j = 0; j < w; ++j) {
                if((j ^ (j - 1)) === 1 && (i ^ (i - 1)) === 1) {
                    this.map[i][j] = cellType.PATH;                   // 1 表示路
                    this.notAccessed.push(0);
                }else {
                    this.map[i][j] = cellType.WALL;                   // 0 表示墙
                }
            }
        }
        this.dict = {
            'X00':[[0, w-2],[h-1, 1]],
            'X01':[[0, 1],[h-1, w-2]],
            'X10':[[0, 1],[h-2, w-1]],
            'X11':[[0, w-2],[h-2, 0]],
            'Y00':[[0, 1],[h-1, w-2]],
            'Y10':[[0, w-2],[h-1, 1]],
            'Z00':[[0, 1],[h-1, w-2]],
            'U00':[[0, 1],[h-1, w-2]],
        };
        this.labyIdx =  this.labyIdx || 'Z00';
        this.start = this.dict[this.labyIdx][0];
        this.end = this.dict[this.labyIdx][1];
        this.cur = [this.start[0], this.start[1]];
        this.mark = [this.start[0], this.start[1]];
        this.map[this.start[0]][this.start[1]] = cellType.PATH;
        this.map[this.end[0]][this.end[1]] = cellType.PATH;
    };

    this.fill_map = function() {
        let count = this.row * this.col;
        let cur = Math.floor(Math.random()*count);
        this.accessed.push(cur);
        this.notAccessed[cur] = 1;

        while(this.accessed.length < count) {
            let rowIdx = Math.floor(cur / this.col),
                colIdx = cur % this.col;
            let num = 0,
                tgt = -1,
                rowNum, colNum;

            // 遍历上下左右顶点
            while(++num < 5) {
                let org = Math.floor(Math.random()*4);
                rowNum = rowIdx + this.nextList[org][0];
                colNum = colIdx + this.nextList[org][1];
                if(rowNum >= 0 && colNum >= 0 && rowNum < this.row && colNum < this.col && this.notAccessed[cur + this.tranList[org]] === 0) {
                    tgt = org;
                    break;
                }
            }
            // 四周顶点均被访问，则从已访问的顶点中随机抽取一个为cur
            if(tgt < 0) {
                cur = this.accessed[Math.floor(Math.random()*this.accessed.length)];
            }else {
                rowIdx = 2 * rowIdx + 1;
                colIdx = 2 * colIdx + 1;
                rowNum = rowIdx + this.nextList[tgt][0];
                colNum = colIdx + this.nextList[tgt][1];
                this.map[rowNum][colNum] = 1;
                cur = cur + this.tranList[tgt];
                this.notAccessed[cur] = 1;
                this.accessed.push(cur);
            }
        }
        this.accessed = null;
        this.notAccessed = null;
    };

    this.draw_map = function() {
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[0].length; j++) {
                if (this.map[i][j]) {
                    this.fill_cell([i,j], this.map[i][j], 1); 
                } else {
                    // this.fill_text('o', [i,j]); 
                }
            }
        }
        if (Setting.inBat) {
            this.set_value(this.start, cellType.START); 
            this.set_value(this.end, cellType.END);  
        } else {
            this.fill_value(this.start, cellType.START); 
            this.fill_value(this.end, cellType.END); 
        }

    };


    this.is_value = function(pos, val) {
        return this.map[pos[0]][pos[1]] == val;
    }

    this.set_value = function(pos, val) {
        this.map[pos[0]][pos[1]] = val;
    }


    this.fill_value = function(pos, val) {
        this.set_value(pos, val);
        this.fill_cell(pos, val);
    }


    this.fill_cell = function(pos, val, cover) {
        this.ctx.fillStyle = cellColor[val];
        if (cover)
            this.ctx.fillRect(
                pos[1] * this.size-Setting.wallWidth, 
                pos[0] * this.size-Setting.wallWidth, 
                this.size+Setting.wallWidth*2, 
                this.size+Setting.wallWidth*2); 
        else
            this.ctx.fillRect(pos[1] * this.size, pos[0] * this.size, this.size, this.size); 
    };


    this.fill_text = function(word, pos) {
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(word, (pos[1]+0.5)*this.size, (pos[0]+0.5)*this.size+1); 
    };


    this.fill_word = function(i, j) {
        let word = this.word[this.distance % this.word.length];
        this.fill_value(this.cur, cellType.PAST);
        if (Setting.scaleIdx <= 3)
            this.fill_text(word, [i,j]); 
    };

    //标记
    this.mark_path = function(e) {
        let y = ~~(e.offsetX / Setting.size);
        let x = ~~(e.offsetY / Setting.size);
        let val = this.map[x][y];
        if (val == cellType.PATH || val == cellType.EXPLOR || 
            val == cellType.AUTO || val == cellType.MARK) {
            if (Setting.isMark)
                this.fill_value([x, y], cellType.MARK);
            else
                this.fill_value([x, y], cellType.PATH);
        }
    };

    //解密寻路
    this.find_path = function(idx) {
        this.next = this.nextList[idx];
        this.arrow = arrowType[idx];
        let i = this.cur[0] + this.next[0];
        let j = this.cur[1] + this.next[1];
        let val = this.map[i][j];
        if (val == cellType.END) {
            this.distance ++;
            this.cur = [i, j];
            this.fill_word(i, j);
            return this.alert('而今迈步从头越!')
        }
        if (val == cellType.PAST) {
            if (Setting.isBack) {
                this.fill_value(this.cur, cellType.PATH);
                this.cur = [i, j];
                this.distance --;
            }
            return;
        } 
        if (val == cellType.WALL) {
            if (Setting.isColl) {
                this.fill_value([i,j], cellType.COLL);
                this.fill_text('!', [i,j]);    
            }
            this.check();
            return;
        }
        if (val == cellType.PATH || val == cellType.MARK || 
            val == cellType.EXPLOR || val == cellType.AUTO) {
            this.distance ++;
            this.cur = [i, j];
            this.fill_word(i, j);
        } 
    };


    //检查状态
    this.check = function() {
        this.wall = [];
        for (let idx in this.nextList) {
            let i = this.cur[0] + this.nextList[idx][0];
            let j = this.cur[1] + this.nextList[idx][1];
            if (i < 0 || i >= this.height || j < 0 || j >= this.width)
                this.wall.push(arrowType[idx]);
            let val = this.map[i][j];
            if (val == cellType.PAST || val == cellType.WALL || val == cellType.COLL)
                this.wall.push(arrowType[idx]);
        }
        if (this.wall.length == 4) {
            return this.alert('雄关漫道真如铁!')
        }
    };



    this.alert = function(msg) {
        setTimeout(function() {alert(msg)}, 200);
    };

    this.download = function (){
        var oA = document.createElement('a');
        oA.download = 'labyrinth_' + new Date().getTime();
        oA.href = this.canvas.toDataURL('image/png');;
        document.body.appendChild(oA);
        oA.click();
        oA.remove(); // 下载之后把创建的元素删除
    };



    this.auto_explor = function() {
        this.state = 'auto';
        this.explor_path(this.start);
        this.draw_path();
    }


    this.explor_path = function(pos, path) {
        if (this.state == 'ending') 
            return;
        path = JSON.parse(JSON.stringify(path || [this.cur]));
        this.explor_cell(pos, path, -1, 0);
        this.explor_cell(pos, path,  1, 0);
        this.explor_cell(pos, path,  0, 1);
        this.explor_cell(pos, path,  0,-1);
    }; 

    this.explor_cell = function(pos, path, dx, dy) {
        path = JSON.parse(JSON.stringify(path || [this.cur]));
        let px = pos[0] + dx;
        let py = pos[1] + dy;
        if (px < 0 || px > this.map.length - 1 || 
            py < 0 || py > this.map[0].length - 1)
            return;
        let val = this.map[px][py];
        if (val == cellType.END) {
            path.push(pos);
            path.push([px, py]);
            this.state = 'ending';
            this.autoPath = path;
            // console.log(path);
            return;
        }
        if (val == cellType.PATH || val == cellType.PAST || val == cellType.MARK) {
            path.push(pos);
            this.map[px][py] = cellType.EXPLOR;
            this.explor_path([px, py], path);
        }
    };



    this.draw_path = function() {
        this.explorIdx = Setting.isPack ? cellType.PATH : cellType.EXPLOR;
        this.autoTimes = 0;
        this.draw_cell(); 
    };

    this.draw_cell = function() {
        if (this.autoTimes == this.autoPath.length - 1)
            return;
        this.autoTimes ++;
        let pos = this.autoPath[this.autoTimes];
        let word = this.word[(this.autoTimes-1) % this.word.length];
        // this.map[arr[0]][arr[1]] = cellType.AUTO;
        this.fill_cell(pos, this.explorIdx);
        setTimeout(function() {
            that.draw_cell(); 
        }, 5);
    };
};

window.onresize = function() {
    Setting.resize();
}


document.onkeydown = function(e) { 
    if (e.keyCode == 27)
        Setting.bat_toggle();
    Setting.isFollow = e.keyCode == 70 ? 1 : 0;
    if (e.keyCode < 37 || e.keyCode > 40) return;
    Laby.find_path(e.keyCode-37);
};

function fill_zero (num, count) {
    count = count || 2;
    let str = num.toString();
    if (str.length < count) {
        str = '0' + str;
        return this.fill_zero(str, count);
    } else {
        return str;
    }
}

let Elem = {
    get: function (name) {
        return document.getElementById(name);
    },
    creat: function (type, parent, className, idx) {
        let data = document.createElement(type);
        if (className)
            data.className = className;
        if (parent)
            parent.appendChild(data);
        if (idx && className)
            data.id = className + '_' + idx;
        return data;
    },
    color: function(elem, color, bgcolor) {
        if (elem && elem.style) {
            elem.style.color = color;
            elem.style.backgroundColor = bgcolor;
        }
    },
    remove: function (elem) {
        if(elem && elem.style)
            elem.parentNode.removeChild(elem);
    }
}
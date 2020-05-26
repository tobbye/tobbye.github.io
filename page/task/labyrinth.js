
Task.creatLabyrinth = function(block, word) {
    Task.game = new Task.Labyrinth();
    Task.game.init(block, word);
}

Task.Labyrinth = function() {
    var that = this;
    var canvas, ctx;

    this.init = function(block, word) {
        this.title = '任务#idx-迷宫';
        this.orgTips = '口令'; 
        this.tgtTips = '探索迷宫打开#pack';
        this.logText = '<h4>滑动屏幕控制方向</h4>吃掉文字输入口令';
        this.state = 'going';
        this.isArrow = true;
        this.isLoop = false;
        this.col = 8;
        this.row = 8;
        this.map = [];
        this.cur = [0, 1];
        this.next = [0, 0];
        this.arrow = [];
        this.distance = -1;
        this.accessed = [];
        this.notAccessed = [];
        this.nextList = [[0, -1], [-1, 0], [0, 1], [1, 0]];
        this.tranList = [-1, -this.col, 1, this.col];
        this.arrowList = ['left', 'up', 'right', 'down'];
        this.colorList = ['white', 'black', 'dodgerblue', 'red', 'green', 'green'];
        this.roadType = {ROAD:0, WALL:1, PAST:2, COLL:3, START:4, END:5};
        this.scale = ~~(Config.page.alertWidth / (2*this.col+1));
        this.word = word.replace(/\//g,'');
        this.initCanvas(block, word);
        this.initMap();
        this.fillMap();
        this.drawMap(); 

    };

    this.initCanvas = function(block, word) {
        let tips = Elem.creat('div', block, 'cell-tips');
        tips.innerHTML = word;
        let body = Elem.creat('div', block, 'cell-tips');
        canvas = Elem.creat('canvas', body);
        canvas.width = (2*this.col+1)*this.scale;
        canvas.height = (2*this.row+1)*this.scale;
        canvas.onclick = function (){
            if (!Config.sett.isMobile)
                that.downLoad();
        }
        ctx = canvas.getContext('2d');
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = this.scale - 8 + "px bold Arial"; 
        ctx.fillStyle = this.colorList[0];
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };



    this.initMap = function() {
        for(let i = 0; i < 2 * this.row + 1; ++i) {
            this.map[i] = [];
            for(let j = 0; j < 2 * this.col + 1; ++j) {
                if((j ^ (j - 1)) === 1 && (i ^ (i - 1)) === 1) {
                    this.map[i][j] = this.roadType.ROAD;                   // 0 表示路
                    this.notAccessed.push(0);
                }else {
                    this.map[i][j] = this.roadType.WALL;                   // 1 表示墙
                }
            }
        }
    };

    this.fillMap = function() {
        let count = this.row * this.col;
        let cur = ~~(Math.random()*count);
        this.accessed.push(cur);
        this.notAccessed[cur] = 1;

        while(this.accessed.length < count) {
            let rowIdx = ~~(cur / this.col),
                colIdx = cur % this.col;
            let num = 0,
                tgt = -1,
                rowNum, colNum;

            // 遍历上下左右顶点
            while(++num < 5) {
                let org = ~~(Math.random()*4);
                rowNum = rowIdx + this.nextList[org][0];
                colNum = colIdx + this.nextList[org][1];
                if(rowNum >= 0 && colNum >= 0 && rowNum < this.row && colNum < this.col && this.notAccessed[cur + this.tranList[org]] === 0) {
                    tgt = org;
                    break;
                }
            }
            // 四周顶点均被访问，则从已访问的顶点中随机抽取一个为cur
            if(tgt < 0) {
                cur = this.accessed[~~(Math.random()*this.accessed.length)];
            }else {
                rowIdx = 2 * rowIdx + 1;
                colIdx = 2 * colIdx + 1;
                rowNum = rowIdx + this.nextList[tgt][0];
                colNum = colIdx + this.nextList[tgt][1];
                this.map[rowNum][colNum] = this.roadType.ROAD;
                cur = cur + this.tranList[tgt];
                this.notAccessed[cur] = 1;
                this.accessed.push(cur);
            }
        }
        this.accessed = null;
        this.notAccessed = null;
    };


    this.drawMap = function() {
        this.map[0][1] = this.roadType.START;
        this.map[2*this.row][2*this.col-1] = this.roadType.END;
        for (let i = 0; i < this.map.length; i++) {
            for (let j = 0; j < this.map[0].length; j++) {
                if (this.map[i][j]) {
                    this.fillRect(this.map[i][j], i, j); 
                }
            }
        }
        ctx.fillStyle = 'red';
        this.fillText('起', 0, 1);
        this.fillText('终', 2*this.row, 2*this.col-1);
    };


    this.fillRect = function(idx, i, j) {
        ctx.fillStyle = this.colorList[idx];
        ctx.fillRect(j * this.scale, i * this.scale, this.scale, this.scale); 
    };

    this.fillText = function(word, i, j) {
        ctx.fillStyle = 'white';
        ctx.fillText(word, (j+0.5)*this.scale, (i+0.5)*this.scale); 
    };


    this.check = function() {
        this.wall = [];
        for (let idx in this.nextList) {
            let i = this.cur[0] + this.nextList[idx][0];
            let j = this.cur[1] + this.nextList[idx][1];
            if (i < 0 || i > this.row || j < 0 || j > this.col)
                this.wall.push(this.arrowList[idx]);
            if (this.map[i][j] > 0 && this.map[i][j] < 4)
                this.wall.push(this.arrowList[idx]);
        }
        if (this.wall.length == 4)
            Task.checkState('stop');
    };


    this.control = function(idx) {
        if (idx < 0 || idx > 3) return;
        this.next = this.nextList[idx];
        this.arrow = this.arrowList[idx];
        let i = this.cur[0] + this.next[0];
        let j = this.cur[1] + this.next[1];
        if (this.map[i][j] == this.roadType.ROAD) {
            this.map[i][j] = this.roadType.PAST;
            this.distance ++;
            this.cur = [i, j];
            let word = this.word[this.distance % this.word.length];
            this.fillRect(this.roadType.PAST, i, j); 
            this.fillText(word, i, j); 
        } else if (this.map[i][j] == this.roadType.WALL) {
            ctx.fillStyle = this.colorList[this.roadType.COLL];
            this.fillRect(this.roadType.COLL, i, j);
            this.fillText('墙', i, j); 
            this.check();
        } else if (this.map[i][j] == this.roadType.END) {
            if (Task.state != 'succeed');
                Task.checkState('succeed');
        }
    };



    this.downLoad = function (){
        var oA = document.createElement("a");
        oA.download = 'labyrinth_' + new Date().getTime();
        oA.href = canvas.toDataURL("image/png");;
        document.body.appendChild(oA);
        oA.click();
        oA.remove(); // 下载之后把创建的元素删除
    };
};


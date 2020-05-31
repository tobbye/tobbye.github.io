Task.creatTetris = function(line) {
    Task.game = new Task.Tetris();
    Task.game.init(line.word);
}


Task.Tetris = function() {
    let tips, flex, table;

    this.init = function(word) {
        this.word = word.replace(/\//g,'');
        this.initCfg();
        this.initBody();
        this.creatBlk();
    }


    this.initCfg = function() {
        this.title = '任务#idx-俄罗斯方块';
        this.orgTips = '消除'; 
        this.tgtTips = '消除#remain行方块打开#pack';
        this.logTips = '<h5>点击按钮控制方向</h5>消除#remain行打开#pack';
        this.arrowList = ['left', 'up', 'right', 'down'];
        this.color = ['white', 'dodgerblue', 'darkorange']; 
        this.gap = 1000;
        this.col = 10;
        this.row = 10; 
        this.state = 'going'; 
        this.isBottom = false;
        this.size = ~~(Config.page.alertWidth / this.col);
        this.blkCfg = [
            [{x:0, y:4}, {x:1, y:4}, {x:0, y:5}, {x:1, y:5}],
            [{x:0, y:3}, {x:0, y:4}, {x:0, y:5}, {x:0, y:6}],
            [{x:0, y:5}, {x:1, y:4}, {x:1, y:5}, {x:2, y:4}],
            [{x:0, y:4}, {x:1, y:4}, {x:1, y:5}, {x:2, y:5}],
            [{x:0, y:4}, {x:1, y:4}, {x:1, y:5}, {x:1, y:6}],
            [{x:0, y:4}, {x:1, y:4}, {x:2, y:4}, {x:2, y:5}],
            [{x:0, y:5}, {x:1, y:4}, {x:1, y:5}, {x:1, y:6}],
        ];
    }


    this.initBody = function() {
        Task.remain = ~~(this.word.length / 2); 
        let body = Elem.creat('div', Task.block, 'cell-body');
        tips = Elem.creat('div', body, 'cell-tips');
        flex = Elem.creat('div', body, 'cell-flex');
        table = Elem.creat('table', flex);
        tips.innerHTML = Task.text(this.tgtTips);
        table.style.color = this.color[0];
        this.map = new Array(this.row); 
        for(let i=0; i<this.row; i++){ 
            this.map[i] = new Array(this.col); 
            let tr = Elem.creat('tr', table);
            tr.style.height = this.size + 'px';
            for(let j=0; j<this.col; j++){ 
                this.map[i][j] = 0; 
                let td = Elem.creat('td', tr);
                let idx = i*this.col+j - (this.col*this.row) % this.word.length;
                td.innerHTML = this.word[(idx+this.word.length) % this.word.length];
            } 
        } 
    }

    //生产方块形状, 有7种基本形状。 
    //检查刚生产的四个小方格是否可以放在初始化的位置. 
    this.creatBlk = function(redo){ 
        if (Task.remain <= 0) {
            Task.remain = 0;
            tips.innerHTML = Task.text(this.tgtTips);
            Task.checkState('succeed');
            return; 
        }

        let rand = (~~(Math.random()*20)+1)%7; 
        this.blk = JSON.parse(JSON.stringify(this.blkCfg[rand]));
        for(let i=0; i<4; i++){ 
            if(!this.isExist(this.blk[i].x, this.blk[i].y)){
                clearInterval(this.timer);
                Task.checkState('ending');
                return; 
            } 
        } 

        this.paintBlk(1); 
        clearInterval(this.timer);
        this.timer = setInterval(function() {
            Task.game.moveAuto();
        },this.gap);

    } 

    //自动向下移动 
    this.moveAuto = function(redo) {
        //无法下移 
        if(!this.moveDown()){ 
            let lines = this.toDelect(); 
            //如果有消行, 则 
            if(lines!=0){ 
                Task.remain -= lines; 
                this.paintMap(); 
                tips.innerHTML = Task.text(this.tgtTips);
            } 
            clearInterval(this.timer);
            this.creatBlk();
        }  

    }


    //向下移动 
    this.moveDown = function(){ 
        //检查底边界. 
        if(this.toBottomCheck()){
            //没有触底, 则擦除当前图形, 
            this.paintBlk(0); 
            //更新当前图形坐标 
            for(let i=0; i<4; i++){ 
                this.blk[i].x = this.blk[i].x + 1; 
            } 
            //重画当前图形 
            this.paintBlk(1); 
            return true;
        } else {
            //更新map占位
            this.updateMap(); 
            //触底, 变色, 
            this.paintBlk(2); 
            return false;
        }
    } 

    //左移动 
    this.moveLeft = function(){ 
        if(this.toLeftCheck()){ 
            this.paintBlk(0); 
            for(let i=0; i<4; i++){ 
                this.blk[i].y = this.blk[i].y - 1; 
            } 
            this.paintBlk(1); 
        } 
    } 

    //右移动 
    this.moveRight = function(){ 
        if(this.toRightCheck()){ 
            this.paintBlk(0); 
            for(let i=0; i<4; i++){ 
                this.blk[i].y = this.blk[i].y + 1; 
            } 
            this.paintBlk(1); 
        } 
    } 

    //旋转, 因为旋转之后可能会有方格覆盖已有的方格. 
    //先用一个temp,把blk的内容都拷贝到temp, 
    //对temp尝试旋转, 如果旋转后检测发现没有方格产生冲突,则 
    //把旋转后的temp的值给blk. 
    this.rotate = function(){ 
        let temp = new Array(4); 
        for(let i=0; i<4; i++){ 
            temp[i] = {x:0, y:0}; 
        } 
        for(let i=0; i<4; i++){ 
            temp[i].x = this.blk[i].x; 
            temp[i].y = this.blk[i].y; 
        } 
        //先算四个点的中心点，则这四个点围绕中心旋转90度。 
        let cx = Math.round((temp[0].x + temp[1].x + temp[2].x + temp[3].x)/4); 
        let cy = Math.round((temp[0].y + temp[1].y + temp[2].y + temp[3].y)/4); 
        //旋转的主要算法. 可以这样分解来理解。 
        //先假设围绕源点旋转。然后再加上中心点的坐标。 
     
        for(let i=0; i<4; i++){ 
            temp[i].x = cx+cy-this.blk[i].y; 
            temp[i].y = cy-cx+this.blk[i].x; 
        } 
        //检查旋转后方格是否合法. 
        for(let i=0; i<4; i++){ 
            if(!this.isExist(temp[i].x,temp[i].y)){ 
                return; 
            } 
        } 
        //如果合法, 擦除 
        this.paintBlk(0); 
        //对this.blk重新赋值. 
        for(let i=0; i<4; i++){ 
            this.blk[i].x = temp[i].x; 
            this.blk[i].y = temp[i].y; 
        } 
        //重画. 
        this.paintBlk(1); 
    } 

    //检查左边界,尝试着朝左边移动一个,看是否合法。
    this.toLeftCheck = function(){ 
        for(let i=0; i<this.blk.length; i++){ 
            if(this.blk[i].y==0){ 
                return false; 
            } 
            let x = this.blk[i].x;
            let y = this.blk[i].y;
            if(!this.isExist(x, y-1)){ 
                return false; 
            } 
        } 
        return true; 
    } 

    //检查右边界,尝试着朝右边移动一个,看是否合法。
    this.toRightCheck = function(){ 
        for(let i=0; i<this.blk.length; i++){ 
            if(this.blk[i].y == this.col-1){ 
                return false; 
            } 
            let x = this.blk[i].x;
            let y = this.blk[i].y;
            if(!this.isExist(x, y+1)){ 
                return false; 
            } 
        } 
        return true; 
    } 

    //检查底边界,尝试着朝下边移动一个,看是否合法。
    this.toBottomCheck = function(){ 
        for(let i=0; i<this.blk.length; i++){ 
            if(this.blk[i].x == this.row-1){ 
                return false; 
            } 
            let x = this.blk[i].x;
            let y = this.blk[i].y;
            if(!this.isExist(x+1, y)){ 
                return false; 
            } 
        } 
        return true; 
    } 

    //检查坐标为(x,y)的是否在map中已经存在, 存在说明这个方格不可占用。
    this.isExist = function(x, y){ 
        if(x>this.row-1 || x<0 || y>this.col-1 || y<0){ 
            return false; 
        } 
        if(this.map[x][y]==1){ 
            return false; 
        } 
        return true; 
    } 



    //更新map数组 
    this.updateMap = function(){ 
        for(let i=0; i<4; i++){ 
            let x = this.blk[i].x;
            let y = this.blk[i].y;
            this.map[x][y] = 1;
        } 
    } 


    //重绘整个面板 
    this.paintMap = function(key){ 
        for(let i=0;i<this.row;i++){ 
            for(let j=0; j<this.col; j++){ 
                let cell = table.rows[i].cells[j];
                if(this.map[i][j]==1){ 
                    cell.style.backgroundColor = this.color[2]; 
                } else {
                    cell.style.backgroundColor = this.color[0]; 
                }
            } 
        } 
    } 


    //绘活动图形 
    this.paintBlk = function(idx){ 
        for(let i=0; i<4; i++){ 
            let x = this.blk[i].x;
            let y = this.blk[i].y;
            let cell = table.rows[x].cells[y];
            cell.style.backgroundColor = this.color[idx]; 
        } 
    } 

    //消行 
    this.toDelect = function(){ 
        let lines = 0; 
        for(let i=0; i<this.row; i++){ 
            let full = true;
            for(let j=0; j<this.col; j++){ 
                if(this.map[i][j]==0) {
                    full = false;
                    break; 
                }
            } 
            if (full) {
                lines ++
                if(i!=0){ 
                    for(let k=i-1; k>=0; k--){ 
                        this.map[k+1] = this.map[k]; 
                    } 
                    this.map[0] = this.creatBlankLine(); 
                } 
            }
        } 
        return lines; 
    } 


    //产生一个空白行. 
    this.creatBlankLine = function(){ 
        let line = new Array(this.col); 
        for(let i=0; i<this.col; i++){ 
            line[i] = 0; 
        } 
        return line; 
    } 

    this.control = function(idx) {
        if(this.state != 'going') return; 
        if (idx < 0 || idx > 3) return;
        this.arrow = this.arrowList[idx];
        eval('Task.game.' + ['moveLeft', 'rotate', 'moveRight', 'moveDown'][idx] + '();');
    };


    this.mixAnim = function() {
        this.initBody();
        this.creatBlk();
    }
}



Task.htmlMob = `<div class="cell-body">
    <canvas id="canvas1"></canvas>
    <div class="flex">
        <button class='button-min' state='defult' onclick="Task.drawAction(1, 11, 'self')">原始坐标</button>
        <button class='button-min' state='defult' onclick="Task.drawAction(1, 10, 'translate')">旋转</button>
        <button class='button-min' state='defult' onclick="Task.drawAction(1, 11, 'translate')">变换</button>
        <button class='button-min' state='defult' onclick="Task.drawAction(1, 1, 'translate')">拉伸</button>
        <button class='button-min' state='defult' onclick="Task.drawAction(1, 11, 'result')">结果坐标</button>
    </div>
</div>`;

Task.htmlPc = `<div class="flex">
    <div class="block">
        <canvas id="canvas1"></canvas>
        <div class="flex">
            <button class='button-min' state='defult' onclick="Task.drawAction(1, 11, 'self')">原始坐标</button>
            <button class='button-min' state='defult' onclick="Task.drawAction(1, 10, 'translate')">旋转</button>
            <button class='button-min' state='defult' onclick="Task.drawAction(1, 11, 'translate')">旋转+拉伸</button>
            <button class='button-min' state='defult' onclick="Task.drawAction(1, 1, 'translate')">拉伸</button>
            <button class='button-min' state='defult' onclick="Task.drawAction(1, 11, 'result')">结果坐标</button>
        </div>
    </div>
    <div class="block">
        <canvas id="canvas2"></canvas>
        <div class="flex">
            <button class='button-min' state='defult' onclick="Task.drawAction(2, 11, 'self')">原始坐标</button>
            <button class='button-min' state='defult' onclick="Task.drawAction(2, 10, 'translate')">旋转</button>
            <button class='button-min' state='defult' onclick="Task.drawAction(2, 11, 'translate')">旋转+拉伸</button>
            <button class='button-min' state='defult' onclick="Task.drawAction(2, 1, 'translate')">拉伸</button>
            <button class='button-min' state='defult' onclick="Task.drawAction(2, 11, 'result')">结果坐标</button>
        </div>
    </div>
</div>`;

Task.creatEuler = function() {
    Task.game = new Task.Euler();
    Task.game.init();
    Task.game.initCanvas();
}



Task.drawAction = function(idx, modle, action) {
    if (Task.game.state == 'going') {
        clearInterval(Task.game.timer);
        Task.cfg.gap = Math.max(10, Task.game.gap / 2);
    }
    Task.game.init(); 
    Task.game.drawReady(idx, modle, action);  
}



Task.Euler = function() {
    let That = this;

    this.init = function() {
        this.title = '任务#idx-欧拉';
        this.orgTips = '无'; 
        this.tgtTips = '欧拉公式';
        this.logTips = '<h5>动态展示复平面运算</h5>计算出欧拉公式完成任务';
        this.triangleList = [];
        this.idxList = [];
        this.idx = 0;
        this.mix = 0;
        this.gap = Task.cfg.gap || 100;
        this.power = Task.cfg.power || 1;
        this.count = Task.cfg.count || 10;
        this.margin = 30;  
        this.zoom = 150;   
        this.modle = 11;
        this.state = 'ready';
        this.action = 'self';
        this.posWord = Task.cfg.word || '(2+i)(-1-2i)';
        this.posList = this.copyPos(Task.cfg.posList) || [[2, 1], [-1, -2]];
        this.posResult = [[1, 0]];
        this.axis = {left:[-1, 0], right:[1,0], top:[0,1], bot:[0, -1]};
    }


    this.setList = function() {
        for (let i=0; i <this.power; i++) {
            this.posList.push([1, this.fixed(Math.PI/this.count)]);
        }
    }

    //初始化画布
    this.initCanvas = function() {
        if (!Config.page.isMobile) {
            Task.block.innerHTML = Task.htmlPc;
            Task.alertWidth = Config.page.alertFullWidth - 20;
            this.fullSize =  ~~(Task.alertWidth / 2 -40);
            this.setCanvas('canvas2');
            this.initAxis();  
        } else {
            Task.block.innerHTML = Task.htmlMob;
            Task.alertWidth = Config.page.alertFillWidth;
            this.fullSize =  ~~Task.alertWidth;  
        }
        this.setCanvas('canvas1');
        this.initAxis();
    }


    this.setCanvas = function(name){ 

        this.ableSize = this.fullSize - this.margin *2; 
        this.canvas = document.getElementById(name);
        this.canvas.width = this.fullSize;
        this.canvas.height = this.fullSize;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.font = "36px bold Arial"; 
    } 

    this.getCanvas = function(name) {
        this.canvas = document.getElementById(name);
        this.ctx = this.canvas.getContext('2d');
    }

    //初始化坐标系
    this.initAxis = function() {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#333';
        this.ctx.beginPath();
        this.drawAxis(this.axis.left, 1);
        this.drawAxis(this.axis.right, 0);
        this.drawAxis(this.axis.top, 1);
        this.drawAxis(this.axis.bot, 0);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    //绘制坐标系
    this.drawAxis = function(pos, move) {
        let x = pos[0] * this.ableSize / this.zoom / 2;
        let y = pos[1] * this.ableSize / this.zoom / 2;
        this.drawPos([x, y], move);
    }



    //------------------------------------------------

    //绘制准备
    this.drawReady = function(idx, modle, action) {
        this.setList();
        this.getCanvas('canvas'+idx);
        this.mix = 0;
        this.idx = 0;
        this.idxList = [];
        this.modle = modle || this.modle;
        this.action = action || this.action;
        console.log('---------- ' + this.action + ' ------------')
        console.log(this);
        this.timer = setInterval(function() {That.drawGoing();}, this.gap);
    }



    //绘制进行
    this.drawGoing = function() {
        this.state = 'going';
        if (this.action == 'translate')
            this.mix += 0.05;
        else
            this.mix += 0.8*(this.mix || 0.1);
        this.mix = this.mix > 1 ? 1 : this.fixed(this.mix);
        this.triangleList = [];
        this.initAxis();
        for (let i=0; i<this.posList.length; i++) {
            let triangle = new this.Triangle();
            triangle.init(i);
            this.triangleList.push(triangle);
        }
        if (this.mix >= 1) {
            if (this.action == 'translate') {
                this.idxList.push(this.idx);
                this.idx ++;
                if (this.idx > this.posList.length)
                    this.drawEnding();
            } else {
                this.drawEnding();
            }
            this.mix = 0;
        }
    }

    this.drawEnding = function() {
        clearInterval(this.timer);
        this.state = 'ending';
    }

    this.calcColor = function(idx, rgb, a) {
        let code = [
            ['#468', '#648', '#486', '#684', '#846', '#864'],
            ['#ACE', '#CAE', '#AEC', '#CEA', '#EAC', '#ECA'],
        ][rgb][idx%6||0];
        let r, g, b;
        r = parseInt(Number('0x'+code[1]+code[1]), 10);
        g = parseInt(Number('0x'+code[2]+code[2]), 10);
        b = parseInt(Number('0x'+code[3]+code[3]), 10);
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }



    //构造三角形
    this.Triangle = function() {
        this.idx = 0;

        this.init = function(idx) {
            this.idx = idx;
            this.colorLine = That.calcColor(idx, 0, 1);
            this.colorFill = That.calcColor(idx, 1, 0.5);
            this.colorText = That.calcColor(idx, 1, 1);
            this.selfPos = That.posList[idx];
            this.selfAng = That.calcAng(this.selfPos);
            this.selfLen = That.calcLen(this.selfPos);
            this.orgPos = That.posResult[idx];
            this.orgAng = That.calcAng(this.orgPos);
            this.orgLen = That.calcLen(this.orgPos);
            this.tgtPos = That.calcPos(this, this.orgPos, this.selfPos);
            this.tgtAng = That.calcAng(this.tgtPos);
            this.tgtLen = That.calcLen(this.tgtPos);
            this.curPos = [0, 0];
            this.zeroPos = [0, 0];
            this.onePos = [1, 0];
            this.oneAng = 0;
            this.oneLen = 1;
            this.action();
        }

        //操作
        this.action = function() {
            if (That.action == 'self') {
                this.curPos = That.copyPos(this.selfPos);
                this.curPos[1] = That.fixed(this.curPos[1]*That.mix);
            }

            if (That.action == 'result') {
                this.curPos = That.copyPos(this.tgtPos);
                this.curPos[1] = That.fixed(this.tgtPos[1]*That.mix);
            }
            if (That.action == 'translate') {
                this.curPos = That.copyPos(this.selfPos);
                this.curAng = this.selfAng;
                this.curLen = this.selfLen;
                if (That.idx == this.idx) {
                    this.isAng = ~~(That.modle / 10) == 1;
                    this.isLen = That.modle % 10 == 1;
                    this.mix = That.mix;
                    this.translate('curAng', 'curLen', 'curPos');
                    this.translate('oneAng', 'oneLen', 'onePos');  
                } else if (That.idxList.indexOf(this.idx) > -1) {
                    this.curPos = That.copyPos(this.tgtPos);
                    this.onePos = That.copyPos(this.orgPos);
                }
            }
            That.autosize(That.posResult);
            That.draw(this);
            That.fillText(this, That.format(this.curPos), this.curPos);
        }



        //旋转三角形
        this.translate = function(ang, len, pos) {
            if (this.isAng)
                this[ang] = this[ang]+this.orgAng*this.mix;
            if (this.isLen)
                this[len] = this[len]*(1+(this.orgLen-1)*this.mix);
            this[pos][0] = That.fixed(Math.cos(this[ang]*Math.PI/180)*this[len]);
            this[pos][1] = That.fixed(Math.sin(this[ang]*Math.PI/180)*this[len]);
        }
    }


    //获取复数集合的最长边
    this.getLengthAxis = function(list) {
        let lenAxis = 1;
        this.lenAxis = 1;
        for (let i=0; i<list.length; i++) {
            lenAxis = Math.max(Math.abs(list[i][0]), Math.abs(list[i][1]));
            this.lenAxis = this.fixed(Math.max(this.lenAxis, lenAxis));
        }
    }

    //缩放自适应
    this.autosize = function(list) {
        this.getLengthAxis(list);
        this.zoom = this.fixed(this.ableSize / this.lenAxis / 2);
    }

    //绘制三角形
    this.draw = function(triangle) {
        this.ctx.strokeStyle = triangle.colorLine;
        this.ctx.fillStyle = triangle.colorFill;
        this.ctx.beginPath();
        this.drawPos(triangle.zeroPos, 1);
        this.drawPos(triangle.onePos, 0);
        this.drawPos(triangle.curPos, 0);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.fill();  
    }

    //复制点
    this.copyPos = function(pos) {
        return JSON.parse(JSON.stringify(pos));
    }


    //计算点
    this.calcPos = function(triangle, a, b) {
        let x = this.fixed(a[0]*b[0] - a[1]*b[1]);
        let y = this.fixed(a[0]*b[1] + a[1]*b[0]);
        triangle.resultStr = this.connect(a, b, [x, y]);
        if (this.posResult.length <= this.posList.length)
            this.posResult.push([x, y]);
        // console.log(triangle.idx + '  '+ this.posResult);
        return [x, y];
    }

    //计算角度
    this.calcAng = function(pos) {
        let ang = this.fixed(Math.atan(pos[1] / pos[0]||Infinity) * 180 / Math.PI);
        if (pos[0] == 0 && pos[1] > 0)
            return 90;
        if (pos[0] == 0 && pos[1] < 0)
            return 270;
        if (pos[0] > 0 && pos[1] > 0)
            return ang + 0;
        if (pos[0] < 0 && pos[1] > 0)
            return ang + 180;
        if (pos[0] < 0 && pos[1] < 0)
            return ang + 180;
        if (pos[0] > 0 && pos[1] < 0)
            return ang + 360;
    }

    //计算模长度
    this.calcLen = function(pos) {
        return this.fixed(Math.sqrt(pos[0]*pos[0] + pos[1]*pos[1]));
    }


    //绘制文本
    this.fillText = function(triangle, text, pos) {
        text = 'p' + (triangle.idx+1) + '.' + text;
        this.ctx.fillStyle = triangle.colorText;
        let x = pos[0] == 0 ? 0 : pos[0]>0 ? 20 : -20;
        let y = pos[1] == 0 ? 0 : pos[1]<0 ? 20 : -20;
        pos = this.tran_zoom(pos);
        this.ctx.fillText(text, pos[0]+x, pos[1]+y);
        this.ctx.fillStyle = triangle.colorFill;
    }

    //字符连接
    this.connect = function(a, b, r) {
        return  this.format(a) + ' * ' + this.format(b) + ' = ' + this.format(r);
    }

    //字符拼接
    this.format = function(pos) {
        return `(${pos[0]}+${pos[1]}i)`
        .replace(/\(0\+/g, '(')
        .replace(/\+0i/g, '')
        .replace(/1i/g, 'i')
        .replace(/\+-/g, '-');
    }

    this.fixed = function(num) {
        return Math.round(num*1e2)/1e2;
    }



    //绘制点
    this.drawPos = function(pos, move) {
        if (move)
            this.tran_moveTo(pos);
        else
            this.tran_lineTo(pos);
    }


    this.tran_moveTo = function(pos) {
        pos = this.tran_zoom(pos);
        this.ctx.moveTo(pos[0], pos[1]);
    }

    this.tran_lineTo = function(pos) {
        pos = this.tran_zoom(pos);
        this.ctx.lineTo(pos[0], pos[1]);
    }


    this.tran_zoom = function(pos) {
        let x = 0 + pos[0] * this.zoom + this.fullSize / 2;
        let y = 0 - pos[1] * this.zoom + this.fullSize / 2 ;
        return [x, y];
    }

    //复数变换到画布上
    this.tran = function(pos) {
        let x = 0 + pos[0] + this.fullSize / 2;
        let y = 0 - pos[1] + this.fullSize / 2 ;
        return [x, y];  
    }

}


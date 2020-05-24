Task.creatSnake = function(block, word) {
    Task.game = new Task.Snake();
    Task.game.init(block, word);
    Task.setTouch();
}

Task.Snake = function() {
    var that = this;
    var canvas, ctx;

    this.init = function(block, word) {
        this.title = '任务#idx-贪吃蛇';
        this.orgTips = '口令'; 
        this.tgtTips = '正确输入口令打开#pack';
        this.logText = '<h4>滑动屏幕控制方向</h4>吃掉文字输入口令';
        this.arrowList = ['left', 'up', 'right', 'down'];
        this.state = 'going';
        this.isArrow = true;
        this.isLoop = true;
        this.gap = 300;
        this.col = 10;
        this.row = 10;
        this.food = 45;
        this.next = 1;
        this.direction = 1;
        this.body = [41, 40];  
        this.size = ~~(config.page.alertWidth / this.col);
        this.word = word.replace(/\//g,'');
        this.nextList = [-1, -this.col, 1, this.col];
        this.initCanvas(block, word);
        this.refresh(true);
        this.drawFood();
    };

    this.initCanvas = function(block, word) {
        var tips = Elem.creat('div', block, 'cell-tips');
        tips.innerHTML = word;
        var body = Elem.creat('div', block, 'cell-tips');
        canvas = Elem.creat('canvas', body);
        canvas.width = this.col*this.size;
        canvas.height = this.row*this.size;
        ctx = canvas.getContext('2d');
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = this.size - 20 + "px bold sans-serif";
    };

    this.draw = function(pos, color, idx) {
        var x = pos % this.col *this.size + 1;
        var y = ~~(pos / this.col) * this.size + 1;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, this.size-2, this.size-2);
        if (idx != null) {
            ctx.fillStyle = 'white';
            ctx.fillText(this.word[idx], x+this.size/2, y+this.size/2);
        }
    };
    
    this.refresh = function(loop) {
        this.body.unshift(this.next = this.body[0] + this.direction);
        if (this.body.indexOf(this.next, 1) > 0) {
            return Task.checkState('stop');
        }
        if (this.next < 0 || this.next> this.col*this.row-1 || this.direction == 1 && this.next % this.col == 0 || this.direction == -1 && this.next % this.col == this.col-1) {
            return Task.checkState('stop');
        }
        if (this.next == this.food) {
            if (this.body.length == this.word.length) {
                this.state = 'succeed';
                return Task.checkState('next');
            } else {
                this.drawFood();
            }
        } else {    
            this.draw(this.body.pop(), "white");
        }

        for (let x in this.body) {
            this.draw(this.body[x], "darkgreen", this.body.length-1-x);
        }

        if (this.state == 'going' && this.isLoop)
            setTimeout(function() {that.refresh(true)}, this.gap);  
    };

    this.drawFood = function() {
        while (this.body.indexOf(this.food = ~~(Math.random() * this.col*this.row)) > 0);
            this.draw(this.food, "darkred", this.body.length);
    };


    this.control = function(idx) {
        if (idx < 0 || idx > 3) return;
        this.next = this.nextList[idx];
        this.arrow = this.arrowList[idx];
        if (this.body[1] - this.body[0] != this.next)
            this.direction =  this.next;
    };
}


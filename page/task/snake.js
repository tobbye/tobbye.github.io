Task.creatSnake = function(line) {
    Task.game = new Task.Snake();
    Task.game.init(line.word);
}

Task.Snake = function() {
    let tips, flex, canvas, ctx;

    this.init = function(word) {

        this.word = word.replace(/\//g,'');
        this.initCfg();
        this.initBody();

    };

    this.initCfg = function() {
        this.title = '任务#idx-贪吃蛇';
        this.orgTips = '口令'; 
        this.tgtTips = '吃掉文字完成任务';
        this.logTips = '<h5>点击按钮控制方向</h5>吃掉文字完成任务';
        this.arrowList = ['left', 'up', 'right', 'down'];
        this.color = {bgd:'white', body:'darkgreen', food:'darkred'};
        this.state = 'going';
        this.isArrow = true;
        this.isLoop = true;
        this.gap = Task.gap || 300;
        this.col = Task.col || 10;
        this.row = Task.row || 10;
        this.size = Task.size || ~~(Task.alertWidth / this.col);
        this.food = 4*this.col+5;
        this.next = 1;
        this.direction = 1;
        this.body = [4*this.col+1, 4*this.col]; 
        this.nextList = [-1, -this.col, 1, this.col]; 
    }

    this.initBody = function() {
        this.initCanvas();
        this.drawFood();
    }

    this.initCanvas = function() {
        let body = Elem.creat('div', Task.block, 'cell-body');
        tips = Elem.creat('div', body, 'cell-tips');
        flex = Elem.creat('div', body, 'cell-flex');
        tips.innerHTML = this.word;
        canvas = Elem.creat('canvas', flex);
        canvas.width = this.col*this.size;
        canvas.height = this.row*this.size;
        ctx = canvas.getContext('2d');
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = this.color.bgd;
        ctx.font = this.size - 20 + "px bold sans-serif";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (this.state == 'going') {
            this.timer = setInterval(function() {
                Task.game.eatFood(true)
            }, this.gap);
        } else {
            clearInterval(this.timer);
        }
    };

    
    this.eatFood = function(loop) {
        this.body.unshift(this.next = this.body[0] + this.direction);
        if (this.body.indexOf(this.next, 1) > 0) {
            return Task.checkState('ending');
        }
        if (this.next < 0 || this.next> this.col*this.row-1 || this.direction == 1 && this.next % this.col == 0 || this.direction == -1 && this.next % this.col == this.col-1) {
            return Task.checkState('ending');
        }
        if (this.next == this.food) {
            if (this.body.length == this.word.length) {
                return Task.checkState('succeed');
            } else {
                this.drawFood();
            }
        } else {    
            this.draw(this.body.pop(), this.color.bgd);
        }

        for (let x in this.body) {
            this.draw(this.body[x], this.color.body, this.body.length-1-x);
        }
 
    };

    this.drawFood = function() {
        while (this.body.indexOf(this.food = ~~(Math.random() * this.col*this.row)) > 0);
            this.draw(this.food, this.color.food, this.body.length);
    };


    this.draw = function(pos, color, idx) {
        let x = pos % this.col *this.size + 1;
        let y = ~~(pos / this.col) * this.size + 1;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, this.size-2, this.size-2);
        if (idx != null) {
            ctx.fillStyle = 'white';
            ctx.fillText(this.word[idx], x+this.size/2, y+this.size/2);
        }
    };


    this.control = function(idx) {
        if (idx < 0 || idx > 3) return;
        this.next = this.nextList[idx];
        this.arrow = this.arrowList[idx];
        if (this.body[1] - this.body[0] != this.next)
            this.direction =  this.next;
    };

}


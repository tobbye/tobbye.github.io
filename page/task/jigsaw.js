Task.creatJigsaw = function(line) {
    Task.game = new Task.Jigsaw();
    Task.game.init(line.src, line.idx);
}

Task.Jigsaw = function() {

    let img, tips, flex;

    this.init = function(src, idx) {
        this.src = src;
        this.imgSrc = src;
        this.funIdx = idx;
        this.initCfg();
        this.initBody();
    }

    this.initCfg = function() {
        this.title = '任务#idx-拼图';
        this.orgTips = '目标图片'; 
        this.tgtTips = '拼出目标图片完成任务';
        this.logTips = '<h5>点击周围格子与中心格子交换</h5>拼出目标图片完成任务';
        this.imgNone = 'http://pic134.nipic.com/file/20170701/8399529_123819889000_2.jpg';
        this.isArrow = false;
        this.hpw = 1;
        this.col = Task.col || 3;
        this.row = Task.row || 3;
        this.border = 10;
        this.cells = [];
    }

    this.initBody = function() {
        this.fullPath = this.imgSrc ? this.imgSrc : this.imgNone;
        this.center = ~~((this.col*this.row-1) / 2);
        img = new Image();
        img.src = this.fullPath;
        img.onload = function() {
            Task.game.loadImg(this);
        }
    }


    this.loadImg = function() {
        this.hpw = ~~(img.height / img.width * 100) / 100;
        this.blkWidth = ~~(Task.alertWidth);
        this.blkHeight = ~~(this.blkWidth * this.hpw);
        img.style.width = this.blkWidth + 'px';
        img.style.height = this.blkHeight + 'px';
        this.cellWidth = ~~((this.blkWidth - this.col*this.border*2) / this.col);
        this.cellHeight = ~~((this.blkHeight - this.row*this.border*2) / this.row);
        for (let i=0;i<this.row;i++) {
            for (let j=0;j<this.col;j++) {
                let idx = i*this.col + j;
                let posY = (-2*this.border-this.cellHeight) * i;
                let posX = (-2*this.border-this.cellWidth) * j;
                this.cells[idx] = {
                    idx: idx,
                    posX: posX,
                    posY: posY,
                }
            }
        }
        this.creatBody('ready', this.orgTips);
    };


    this.creatBody = function(state, text) {
        Task.checkState(state)
        let body = Elem.creat('div', Task.block, 'cell-body');
        tips = Elem.creat('div', body, 'cell-tips');
        flex = Elem.creat('div', body, 'cell-flex');
        tips.innerHTML =  Task.text(text);
        flex.style.flexWrap = 'wrap';

        for (let i=0;i<this.row;i++) {
            for (let j=0;j<this.col;j++) {
                idx = i*this.col + j;
                let cell = Elem.creat('div', flex, 'cell-jigsaw', idx);
                cell.idx = this.cells[idx].idx;
                cell.style.width = this.cellWidth + 'px';
                cell.style.height = this.cellHeight + 'px';
                cell.style.backgroundSize = this.blkWidth + 'px ' + this.blkHeight + 'px';
                cell.style.backgroundPosition = this.cells[idx].posX + 'px ' + this.cells[idx].posY + 'px';
                cell.style.backgroundImage = `url(${this.fullPath})`
                cell.addEventListener('click', function(event) {
                    if (Task.game.state == 'going')
                        Task.game.click(event);
                });
                this.cells[idx].cellId = cell.id;
            }
        }
        this.check();
    }

    this.click = function(event) {
        let org = flex.children[this.center];
        let tgt = event.target;
        if (org === tgt) return;
        let orgNext = org.nextSibling;
        let tgtNext = tgt.nextSibling;
        org.parentNode.insertBefore(tgt, orgNext);
        tgt.parentNode.insertBefore(org, tgtNext);
        this.check(1);
    }

    this.check = function() {
        if (this.state == 'going')
            this.state = 'succeed';
        for (let i=0; i<flex.children.length; i++) {
            let child = flex.children[i];
            child.style.border = `solid ${this.border}px white`;
            if (child.idx == i) {
                // child.style.border = `solid ${this.border}px ${getColorBgd()}`;
            } else {
                this.state = 'going';
            }
        }

        let org = flex.children[this.center];
        org.style.border = `solid ${this.border}px ${getColorType()}`;

        if (this.state == 'ready' || this.state == 'succeed' ) {
            img = Elem.creat('img', Task.block, 'image');
            img.style.width = this.blkWidth - 2*this.border + 'px';
            img.style.height = this.blkHeight - 2*this.border + 'px';
            img.style.border = `solid ${this.border}px white`;
            img.src = this.fullPath;
            if (this.state == 'succeed') {
                Task.checkState('succeed');
                Elem.show(flex, 'flex');
                Elem.show(img, 'none');
                setTimeout(function() {
                    Elem.show(Task.game.flex, 'none');
                    Elem.show(Task.game.img, 'inline');
                },1000);
            } else {
                Elem.show(flex, 'none');
                Elem.show(img, 'inline');
                setTimeout(function() {
                    Elem.show(flex, 'flex');
                    Elem.show(img, 'none');
                    setTimeout(function() {
                        Task.mixAnim();
                    },2000);
                },1000);
            }
        }
    };

    this.mixAnim = function() {
        this.cells = Parse.mix(this.cells);
        this.creatBody('going', this.tgtTips);
    }
}


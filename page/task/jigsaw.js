Task.creatJigsaw = function(block, src, idx) {
    Task.game = new Task.Jigsaw();
    Task.game.init(block, src, idx);
}

Task.Jigsaw = function() {
    var that = this;
    var img, tips, flex, blockOrg, blockTgt;

    this.init = function(block, src, idx) {
        this.title = '任务#idx-拼图';
        this.orgTips = '目标图片'; 
        this.tgtTips = '拼出目标图片打开#pack';
        this.logText = '<h4>点击周围格子与中心格子交换</h4>拼出目标图片打开#pack';
        this.imgNone = '../../picture/head/3.jpeg';
        this.imgPath = '../../picture/mo/';
        this.funPath = '../../picture/mikao/';
        this.isArrow = false;
        this.hpw = 1;
        this.col = 3;
        this.row = 3;
        this.border = 10;
        this.cells = [];
        this.src = src;
        this.imgSrc = src;
        this.funIdx = idx;
        this.fullPath = this.imgSrc ? this.imgSrc : this.imgNone;
        this.center = ~~((this.col*this.row-1) / 2);
        if (config.sett.isFun)
            this.fullPath = this.funPath + Parse.fillZero(this.funIdx, 3);
        img = new Image();
        img.src = this.fullPath;
        img.onload = function() {
            that.load(block, this);
        }
    }


    this.load = function(block, img) {
        this.hpw = ~~(img.height / img.width * 100) / 100;
        var clientWidth = block.clientWidth;
        this.blockWidth = ~~(clientWidth);
        this.blockHeight = ~~(this.blockWidth * this.hpw);
        img.style.width = this.blockWidth + 'px';
        img.style.height = this.blockHeight + 'px';
        block.style.width = this.blockWidth + 'px';
        // block.style.margin = '0px auto';
        this.cellWidth = ~~((this.blockWidth - this.col*this.border*2) / this.col);
        this.cellHeight = ~~((this.blockHeight - this.row*this.border*2) / this.row);
        for (var i=0;i<this.row;i++) {
            for (var j=0;j<this.col;j++) {
                var idx = i*this.col + j;
                var posY = (-2*this.border-this.cellHeight) * i;
                var posX = (-2*this.border-this.cellWidth) * j;
                this.cells[idx] = {
                    idx: idx,
                    posX: posX,
                    posY: posY,
                }
            }
        }
        blockOrg = Elem.creat('div', block, 'cell-block');
        this.creat(blockOrg, 'ready');
    };


    this.creat = function(block, state) {
        this.state = state;
        block.innerHTML = '';
        tips = Elem.creat('div', block, 'cell-tips');
        flex = Elem.creat('div', block, 'cell-flex');
        flex.style.flexWrap = 'wrap';
        if (state == 'going') {
            this.cells = Parse.mix(this.cells);
            tips.innerHTML =  Task.cfg.tgtTips;
        } else {
            tips.innerHTML =  Task.cfg.orgTips;
        }

        for (var i=0;i<this.row;i++) {
            for (var j=0;j<this.col;j++) {
                var idx = i*this.col + j;
                var cell = Elem.creat('div', flex, 'cell-jigsaw', idx);
                cell.idx = this.cells[idx].idx;
                cell.style.width = this.cellWidth + 'px';
                cell.style.height = this.cellHeight + 'px';
                cell.style.backgroundSize = this.blockWidth + 'px ' + this.blockHeight + 'px';
                cell.style.backgroundPosition = this.cells[idx].posX + 'px ' + this.cells[idx].posY + 'px';
                cell.style.backgroundImage = `url(${this.fullPath})`
                cell.addEventListener('click', function(event) {
                    if (that.state == 'going')
                        that.click(event);
                });
                this.cells[idx].cellId = cell.id;
            }
        }
        this.check();
    }

    this.click = function(event) {
        var org = flex.children[this.center];
        var tgt = event.target;
        if (org === tgt) return;
        var orgNext = org.nextSibling;
        var tgtNext = tgt.nextSibling;
        org.parentNode.insertBefore(tgt, orgNext);
        tgt.parentNode.insertBefore(org, tgtNext);
        this.check(1);
    }

    this.check = function() {
        if (this.state == 'going')
            this.state = 'succeed';
        for (var i=0;i<flex.children.length;i++) {
            var child = flex.children[i];
            child.style.border = `solid ${this.border}px white`;
            if (child.idx == i) {
                // child.style.border = `solid ${this.border}px ${getColorBgd()}`;
            } else {
                this.state = 'going';
            }
        }

        var org = flex.children[this.center];
        org.style.border = `solid ${this.border}px ${getColorType()}`;

        if (this.state == 'ready' || this.state == 'succeed' ) {
            img = Elem.creat('img', blockOrg, 'image');
            img.style.width = this.blockWidth - 2*this.border + 'px';
            img.style.height = this.blockHeight - 2*this.border + 'px';
            img.style.border = `solid ${this.border}px white`;
            img.src = this.fullPath;
            if (this.state == 'succeed') {
                Task.checkState('next');
                Elem.display(flex, 'flex');
                Elem.display(img, 'none');
                setTimeout(function() {
                    Elem.display(flex, 'none');
                    Elem.display(img, 'inline');
                },1000);
            } else {
                Elem.display(flex, 'none');
                Elem.display(img, 'inline');
                setTimeout(function() {
                    Elem.display(flex, 'flex');
                    Elem.display(img, 'none');
                    setTimeout(function() {
                        Task.mixAnim();
                    },2000);
                },1000);
            }
        }
    };

    this.mixAnim = function() {
        this.creat(blockOrg, 'going');
    }
}


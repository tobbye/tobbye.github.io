Task.creatPuzzle = function(line) {
    Task.game = new Task.Puzzle();
    Task.game.init(line.word);
}

Task.Puzzle = function() {
    var that = this;
    var blockOrg, blockTgt;

    this.init = function(word) {
        this.word = word;
        this.wordOrg = word.replace(/ /g, '/');
        this.wordTgt = word.replace(/[\/ ]/g, '');
        this.initCfg();
        this.initBody();
    }

    this.initCfg = function() {
        this.title = '任务#idx-拼字';
        this.orgTips = '口令'; 
        this.tgtTips = '正确输入口令打开#pack';
        this.logTips = '<h4>点击格子输入口令</h4>正确输入口令打开#pack';
        this.isArrow = false;
    }


    this.initBody = function() {
        blockOrg = Elem.creat('div', Task.block, 'cell-block');
        this.creatBody(blockOrg, 'ready');

        blockTgt = Elem.creat('div', Task.block, 'cell-block');
        this.creatBody(blockTgt, 'going');
    }


    //解密字块
    this.creatBody = function(block, state) {
        this.state = state;
        this.wordCur = '';
        this.wordMix = Parse.mix(this.wordOrg);
        this.wordMix = state == 'going' ? this.wordMix : this.wordOrg;

        block.innerHTML = '';
        var tips = Elem.creat('div', block, 'cell-tips');
        if (state == 'going')
            this.tgtTips
        tips.innerHTML = state == 'going' ? Task.text(this.tgtTips) : Task.text(this.orgTips);
        Elem.creat('div', block, 'space20');
        var flex = Elem.creat('div', block, 'cell-flex');
        for(let idx in this.wordOrg) {
            if (this.wordOrg[idx] == '/') 
                flex = Elem.creat('div', block, 'cell-flex');

            if (this.wordMix[idx] == '/') 
                continue;
            var cell = Elem.creat('div', flex, 'cell-text');
            cell.able = true;
            cell.state = state;
            cell.innerHTML = this.wordMix[idx];
            cell.style.borderColor = getColorType();
            cell.style.backgroundColor = state == 'going' ? 'white' : getColorLight();
            cell.onclick = function() {
                that.click(this);
            }
        }
        Elem.creat('div', block, 'space20');
    }

    this.click = function(cell) {
        if (cell.able && cell.state) {
            this.wordCur += cell.innerHTML;
            console.log('tgt:' + this.wordTgt + ' cur:' + this.wordCur);
            var redo = Elem.get('btn-redo');
            if (this.wordTgt.replace(this.wordCur, '') == this.wordTgt || this.wordTgt[0] != this.wordCur[0]) {
                cell.style.color = 'white';
                cell.style.backgroundColor = cfg.wrongColor;
                cell.style.borderColor = cfg.wrongColor;
                Elem.btnPermit('redo');
            } else {
                cell.style.color = 'white';
                cell.style.backgroundColor = cfg.rightColor;
                cell.style.borderColor = cfg.rightColor;
                Elem.btnDanger('redo');
            }
            if (this.wordTgt == this.wordCur) {
                Task.checkState('succeed');
            }
            cell.able = false;
        }
    }
}
Task.creatPuzzle = function(line) {
    Task.game = new Task.Puzzle();
    Task.game.init(line.word);
}

Task.Puzzle = function() {
    let tips, flex;

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
        this.tgtTips = '正确输入口令完成任务';
        this.logTips = '<h5>点击格子输入口令</h5>正确输入口令完成任务';
        this.isArrow = false;
        this.rightColor = 'green';
        this.wrongColor = 'red';
    }


    this.initBody = function() {
        this.wordColor = getColorLight();
        this.wordMix = this.wordOrg;
        this.creatBody('ready', this.orgTips);

        this.wordColor = 'white';
        this.wordMix = Parse.mix(this.wordOrg);
        this.creatBody('going', this.tgtTips);
    }


    //解密字块
    this.creatBody = function(state, text) {
        this.wordCur = '';
        let body = Elem.creat('div', Task.block, 'cell-body');
        tips = Elem.creat('div', body, 'cell-tips');
        flex = Elem.creat('div', body, 'cell-flex');
        flex.style.paddingTop = '20px';
        tips.innerHTML = Task.text(text);
        for(let idx in this.wordOrg) {
            if (this.wordOrg[idx] == '/') 
                flex = Elem.creat('div', body, 'cell-flex');

            if (this.wordMix[idx] == '/') 
                continue;
            let cell = Elem.creat('div', flex, 'cell-text');
            cell.able = true;
            cell.state = state;
            cell.innerHTML = this.wordMix[idx];
            cell.style.borderColor = getColorType();
            cell.onclick = function() {
                Task.game.click(this);
            }
        }
        flex.style.paddingBottom = '20px';
    }

    this.click = function(cell) {
        if (cell.able && cell.state) {
            this.wordCur += cell.innerHTML;
            console.log('tgt:' + this.wordTgt + ' cur:' + this.wordCur);
            if (this.wordTgt.indexOf(this.wordCur) < 0 || this.wordTgt[0] != this.wordCur[0]) {
                cell.style.color = 'white';
                cell.style.backgroundColor = this.wrongColor;
                cell.style.borderColor = this.wrongColor;
            } else {
                cell.style.color = 'white';
                cell.style.backgroundColor = this.rightColor;
                cell.style.borderColor = this.rightColor;
            }
            if (this.wordTgt == this.wordCur) {
                Task.checkState('succeed');
            }
            cell.able = false;
        }
    }
}
Task.creatCode2d = function() {
    Task.game = new Task.Code2d();
    Task.game.init();
}

Task.Code2d = function() {
    let canvas, ctx;

    this.init = function() {
        this.gap = 500;
        this.col = 10;
        this.row = 10;
        this.size = ~~(Config.page.alertFullWidth / this.col);
        this.initCfg();
        this.initData();
        console.log(this);
    }

    this.initCfg = function() {
        this.word = 'code2d';
        this.title = '任务#idx-点阵二维码';
        this.orgTips = '字符'; 
        this.tgtTips = '输入字符生成二维码';
        this.logTips = '<h5>输入字符生成二维码</h5>就是这么简单！';
    }

    this.initData = function() {
        let dict = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let x in this.word) {
            let w = dict.indexOf(this.word[x]);
            if (w >= 0) {
                let m = w.toString(2);
                console.log(m.toString());
            }
        }
    }


}
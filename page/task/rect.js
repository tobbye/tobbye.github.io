function creatRect() {
    let Rect = new __Rect();
    Rect.init();
}

function __Rect() {
    let canvas, ctx;

    this.init = function() {
        this.gap = 500;
        this.col = 10;
        this.row = 10;
        this.size = ~~(Config.page.alertFullWidth / this.col);
        this.rnd = 20;
        this.margin = 5;
        this.isRect = true;
        this.initMap();
        this.initCanvas();
        this.creatBody();
        console.log(this);
    }

    this.initMap = function() {
        this.map = new Array(this.row+1); 
        this.offx = new Array(this.row+1); 
        this.offy = new Array(this.row+1); 
        for(let i=0; i<this.row+1; i++){ 
            this.map[i] = new Array(this.col+1); 
            this.offx[i] = new Array(this.col+1); 
            this.offy[i] = new Array(this.col+1); 
            for(let j=0; j<this.col+1; j++){
                this.map[i][j] = parseInt(Math.random()*6);
                this.offx[i][j] = parseInt((Math.random()*2-1)*this.rnd) / 100;
	            this.offy[i][j] = parseInt((Math.random()*2-1)*this.rnd) / 100;
                if (this.isRect && (i==0 || j==0 || i==this.row || j==this.col)) {
                	this.offx[i][j] = 0;
                	this.offy[i][j] = 0;
                }
            } 
        } 
    }

    this.initCanvas = function(){ 
        let block = document.block;
        canvas = Elem.creat('canvas', block);
        canvas.width = this.col*this.size+this.margin*2;
        canvas.height = this.row*this.size+this.margin*2;
        ctx = canvas.getContext('2d');
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "30px bold Arial"; 
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } 

    this.creatBody = function() {
        ctx.lineWidth = this.margin;
        for(let i=0; i<this.row; i++){ 
            for(let j=0; j<this.col; j++){
                let rnd = ~~(Math.random()*6);
                ctx.fillStyle = ['#ace', '#cae', '#aec', '#cea', '#eac', '#eca'][rnd];
                ctx.strokeStyle = ['#468', '#648', '#486', '#684', '#846', '#864'][rnd];
                ctx.beginPath();
                this.moveTo(i+0, j+0);
                this.lineTo(i+0, j+1);
                this.lineTo(i+1, j+1);
                this.lineTo(i+1, j+0);
                this.lineTo(i+0, j+0);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
            }
        }

    }

    this.moveTo = function(i, j) {
        let x = ~~((j + this.offx[i][j])*this.size+this.margin);
        let y = ~~((i + this.offy[i][j])*this.size+this.margin);
        ctx.moveTo(x, y);
    }


    this.lineTo = function(i, j) {
        let x = ~~((j + this.offx[i][j])*this.size+this.margin);
        let y = ~~((i + this.offy[i][j])*this.size+this.margin);
        ctx.lineTo(x, y);
    }
}
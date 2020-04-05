// <!DOCTYPE html>
// <html>
// <head lang="en">
//     <meta charset="UTF-8">
//     <title></title>
//     <style>

//         body {
//             margin: 0px;
//             padding: 0px;
//         }

//         .chart {
//             margin: 50px;
//             width: 1000px;
//             height: 360px;
//         }

//         .layer {
//             position: absolute;
//             top:50px;
//             left:50px;
//             width: 1000px;
//             height: 360px;
//         }

//         .layer-block {
//             display: flex;
//             margin: 0px;
//             margin-left: 70px;
//         }

//         .layer-line {
//             flex: 10;
//             height: 360px;
//             text-align: center;
//         }

//     </style>
// </head>
// <body>
//     <div id="outer"></div>
//     <script type="text/javascript">
function goChart(outer, _cfg, _arr){

    var cfg = _cfg;
    var arr = _arr;
    // 声明所需变量
    var canvas,ctx;
    // 图表属性
    var mapWidth, mapHeight;
    var mapSpace = cfg.mapSpace || 80;
    var mapMargin = cfg.mapMargin || 60;
    var orgX, orgY;
    // 折线图属性
    var xCount, xSpace;
    var minValue, maxValue, lngValue;
    // 运动相关变量
    var idx = 300;
    var index = 300;
    var speed = 6;
    //绘制相关
    var yCount = cfg.yCount || 10;
    var drawValue = cfg.drawValue || 0;
    var drawStyle = cfg.drawStyle || 1;
    var drawLineX = cfg.drawLineX || 1;
    var drawLineY = cfg.drawLineY || 1;
    initCanvas(outer);



    function initCanvas(outer) {
        canvas = document.createElement("canvas");
        outer.appendChild(canvas);
        canvas.className = "chart";
        canvas.id = "chart_" + cfg.name;
        canvas.width = cfg.canvasWidth || 1280;
        canvas.height = cfg.canvasHeight || 720;
        if(canvas && canvas.getContext){
            ctx = canvas.getContext("2d");
        }
        mapWidth = canvas.width - mapMargin - mapSpace;
        mapHeight = canvas.height - mapMargin - mapSpace;
        orgX = mapMargin + mapSpace;
        orgY = mapMargin + mapHeight;
        drawReady();
        drawAgain();
        setInterval(function(){
            dataArr.shift();
            var time = getTime(null, ":");
            var inve = Math.floor(3e3 + 1e4* (Math.random() * 0.33 + 0.33));
            var grab = Math.floor(2e3 + 1e4* (Math.random() * 0.22 + 0.22));
            var data = {time: time, inve: inve, grab: grab}
            dataArr.push(data);
            console.log(data);
            drawAgain();
        }, 1000);
    };

    function drawReady() {
        for (var x=0;x<cfg.key.length;x++) {
            var key = cfg.key[x];
            if (x == 0) {
                initChart(key); // 图表初始化
                initLayer(key, outer);
            }
        }
    }

    function drawAgain() {
        arr = dataArr;
        ctx.clearRect(0,0,canvas.width, canvas.height);
        for (var x=0;x<cfg.key.length;x++) {
            var key = cfg.key[x];
            if (x == 0) {
                drawChartAxis(key); // 绘制图表轴、标签和标记
            } else {
                drawChartAnim(key); // 绘制折线图的动画  
            }
        }
        document.body.lastLine.onmouseover();
    }


    // 图表初始化
    function initChart(key){
        // 折线图信息
        minValue = cfg.minValue;
        maxValue = cfg.maxValue;
        lngValue = cfg.maxValue - cfg.minValue;
        yCount = cfg.yCount;
        xCount = arr.length;
        xSpace = parseInt(mapWidth/xCount);
        ctx.translate(0.5,0.5);  // 当只绘制1像素的线的时候，坐标点需要偏移，这样才能画出1像素实线
    }

    //选择层初始化
    function initLayer(key, outer) {
        var layer = document.createElement("div");
        layer.className = "layer";
        outer.appendChild(layer);
        var block = document.createElement("div");
        block.className = "layer-block";
        layer.appendChild(block);
        block.style.transform = "translate(" + parseInt(-0.25 * xSpace) + "px, -25px)";
        for(var i=0; i<xCount; i++){
            var line = document.createElement("div");
            block.appendChild(line);
            line.className = "layer-line";
            line.id = "line_" + i;
            line.idx = i;
            line.onmouseover = function() {
                document.body.line.innerHTML = "";
                this.innerHTML = "";
                var idx = this.idx;
                for (let x in cfg.key) {
                        var key = cfg.key[x];
                        var str = "<div style='margin:0px -30px;color:#0'>#1#2</div>";
                        str = str.replace("#0", cfg.color[key]);
                        str = str.replace("#1", cfg.text[key]);
                        str = str.replace("#2", arr[idx][key]);
                        this.innerHTML += str;
                }
            }
            line.onclick = function() {
                document.body.line = this;
                this.onmouseover();
            }
            line.onmouseout = function() {
                if (document.body.line != this)
                    this.innerHTML = "";
            }
            document.body.line = line;
            document.body.lastLine = line;
        }
    }

    // 绘制图表轴、标签和标记
    function drawChartAxis(key){
        ctx.font = "26px Arial";
        ctx.lineWidth = 2;
        ctx.fillStyle = cfg.color[key];
        ctx.strokeStyle = cfg.color[key];
        // y轴
        drawLine(orgX, orgY, orgX, mapMargin);
        // x轴
        drawLine(orgX, orgY, orgX+mapWidth-xSpace, orgY);

        // 绘制标记
        drawMarkers(key);
    }

    // 画线的方法
    function drawLine(a, b, x, y){
        ctx.beginPath();
        ctx.moveTo(a, b);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();
    }

    // 绘制标记
    function drawMarkers(key){
        ctx.strokeStyle = "#E0E0E0";

        // 绘制 x 轴 及中间竖线
        ctx.textAlign = "center";
        for(var i=0; i<xCount; i++){
            var markerVal = arr[i][key];
            var xMarker = orgX+i*xSpace;
            var yMarker = orgY+30;
            ctx.fillText(markerVal, xMarker, yMarker, 2*mapSpace); // 文字

            if(i>0 && drawLineX){
                drawLine(xMarker, orgY-2, xMarker, mapMargin);
            }
        }


        // 绘制 y 轴 及中间横线
        var oneVal = parseInt(lngValue/yCount);
        ctx.textAlign = "right";
        for(var i=0; i<=yCount; i++){
            var markerVal =  i*oneVal + minValue;
            var xMarker = orgX-5;
            var yMarker = parseInt(mapHeight*(1-i/yCount)) + mapMargin;
            ctx.fillText(markerVal, xMarker, yMarker+3, mapSpace); // 文字
            if(i>0 && drawLineY){
                drawLine(orgX+2, yMarker, orgX+mapWidth-xSpace, yMarker);
            }
        }
        ctx.save();


        // 绘制标题 x
        ctx.font = "30px Arial";
        ctx.fillText(cfg.timeText, orgX+(mapWidth-xSpace+60)/2, orgY+mapSpace/2+30);
        // 绘制标题 y
        ctx.rotate(-Math.PI/2);
        ctx.fillText(cfg.valueText, -canvas.height/2+120, mapSpace-20);
        ctx.restore();

    };

    //绘制折线图
    function drawChartAnim(key){
        ctx.strokeStyle = cfg.color[key];  //"#49FE79";

        //连线
        ctx.beginPath();
        for(var i=0; i<xCount; i++){
            var dotVal = arr[i][key];
            var dotLng = (dotVal-minValue)/lngValue;
            var barH = parseInt(mapHeight*dotLng* idx/index);
            var y = orgY - barH;
            var x = orgX + xSpace*i;
            if(i==0){
                ctx.moveTo(x, y);
            }else{
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();

        //背景
        ctx.lineTo(orgX+xSpace*(xCount-1), orgY);
        ctx.lineTo(orgX, orgY);
        //背景渐变色
        if (drawStyle) {
            var gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, cfg.color[key] + "B");
            gradient.addColorStop(1, cfg.color[key] + "2");
            ctx.fillStyle = gradient;
            ctx.fill(); 
        }
        ctx.closePath();
        ctx.fillStyle = cfg.color[key];

        //绘制点
        for(var i=0; i<xCount; i++){
            var dotVal = arr[i][key];
            var dotLng = (dotVal-minValue)/lngValue;
            var barH = parseInt(mapHeight*dotLng * idx/index);
            var y = orgY - barH;
            var x = orgX + xSpace*i;
            drawArc(x, y);  //绘制点
            if (drawValue)
                ctx.fillText(parseInt(dotVal*idx/index), x+15, y-8); // 文字
        }

        if(idx<index){
            idx++;
            setTimeout(function(){
                drawAgain();
            }, speed);
        }
    }


    //绘制圆点
    function drawArc(a, b, x, y){
        ctx.beginPath();
        ctx.arc(a, b, 5, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
    }

}

    function getTime(stamp, str) {
        var time = stamp ? new Date(stamp) : new Date();
        var h = time.getHours();
        var m = time.getMinutes();
        var s = time.getSeconds();
        var hh = h < 10 ? "0" + h : h;
        var mm = m < 10 ? "0" + m : m;
        var ss = s < 10 ? "0" + s : s;
        if (str == "")
            return hh + "" + mm + "" + ss + "";
        if (str == ":")
            return hh + ":" + mm + ":" + ss + "";
        else
            return hh + "时" + mm + "分" + ss + "秒";
    }

    function initData() {
        var arr = [];
        var stamp = new Date().getTime();
        stamp = Math.floor(stamp/1000) - 10;
        for (var i=0;i<10;i++) {
            var cur = (stamp + i)*1000;
            var time = getTime(cur, ":");
            var inve = Math.floor(3e3 + 1e4* (Math.random() * 0.33 + 0.33));
            var grab = Math.floor(2e3 + 1e4* (Math.random() * 0.22 + 0.22));
            var data = {time: time, inve: inve, grab: grab}
            arr.push(data);
        }
        return arr;
    }

        
        var dataCfg = {
            name: "fund",
            drawValue: false,
            drawStyle: true,
            drawLineX: true,
            drawLineY: true,
            canvasWidth: 2000,
            canvasHeight: 720,
            minValue:4e3, maxValue:1e4, yCount: 6, 
            key:["time", "inve", "grab"],
            timeText: "TIME", valueText:"INVE & GRAB",
            text: {time:"", inve: "投入=", grab:"抢夺=", gain: "收益="},
            color: {time:"#666", inve: "#a68", grab:"#68a", gain: "6a8"}
        };
        var dataArr = initData();
        var outer = document.getElementById("outer");
        goChart(outer, dataCfg, dataArr);


//     </script>
// </body>
// </html>
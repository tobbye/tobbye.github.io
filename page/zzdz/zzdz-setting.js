
window.onload = function() {
    WORLD.init();
}

window.onresize = function() {
    WORLD.resize();
}

let WORLD = new __WORLD();
function __WORLD() {

    this.init = function() {
        this.scene = new THREE.Scene();
        this.canvasWidth = window.innerWidth;
        this.canvasHeight = window.innerHeight-4;
        this.aspectRatio = this.canvasWidth / this.canvasHeight;
        this.fieldOfView = 25;
        this.nearPlane = 0.1;
        this.farPlane = 1000;
        this.camPos = [0, 0, 0];
        this.camScale = 1.0;
        this.worldScale = 60;
        this.isLarge = 0;
        this.isBattle = 1;
        this.isFront = 0;
        this.degree = 0;
        this.initScene();
        // this.rotate();
    }

    this.resize = function() {
        this.canvasWidth = window.innerWidth;
        this.canvasHeight = window.innerHeight-4;
        this.renderer.setSize(this.canvasWidth, this.canvasHeight);
        this.render();
    }

    this.rotate = function() {
        this.degree = (this.degree + 5) % 360;
        this.camPos[0] = this.camRad * Math.cos(this.degree/180*Math.PI);
        this.camPos[1] = this.camRad * Math.sin(this.degree/180*Math.PI);
        this.camera.lookAt(new THREE.Vector3(0,0,0));
        this.setCameraPos();
        this.render();
        setTimeout(function() {
            WORLD.rotate();
        }, 10);
    }



    this.initScene = function(key) {
        this.initCfg(key);
        this.canvas = document.getElementById('canvas');
        this.camera = new THREE.PerspectiveCamera(
            this.fieldOfView,
            this.aspectRatio,
            this.nearPlane,
            this.farPlane);
        this.renderer = new THREE.WebGLRenderer({
            alpha: true, 
            antialias: true,
            canvas: this.canvas, 
        });
        this.renderer.setSize(this.canvasWidth, this.canvasHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);
        this.scene.scale.set(this.scale, this.scale, this.scale);
        this.scene.position.set(this.offset, 0, this.offset);
        this.camera.lookAt(new THREE.Vector3(0,0,0));
        this.creatLight();
        this.setZoom(1);
        this.initMap();
        this.render();
        console.log(this);
    }

    this.initCfg = function(name) {
        if (!localStorage.getItem('scene'))
            localStorage.setItem('scene', '0@0');
        let list = localStorage.getItem('scene').split('@');
        let time = new Date().getTime();
        if (parseInt(time) - parseInt(list[1]) > 1000) {
            name = 'smallDevelop';
        } else {
            name = list[0];
        }
        this.isBattle = name.indexOf('Battle') > -1;
        this.cfg = cfg[name];
        this.scale = this.cfg.scale;
        this.offset = this.cfg.offset;
        this.camPos = this.cfg.camPos;
        this.camRad = Util.radius(this.camPos[0], this.camPos[1]);
        if (this.isFront) {
            this.camPos[0] = 0;
            // this.camPos[1] = 0;
        }
        this.camSize = this.cfg.camSize;
        this.camMinScale = this.cfg.camMinScale;
        this.camMaxScale = this.cfg.camMaxScale;
        this.mapKey = this.cfg.map;
        document.title = this.cfg.name;
    }


    this.toScene = function(name) {
        if (name == 'back') {
            window.location.href = '../home/home.html';
            return;
        }
        localStorage.setItem('scene', name + '@' + new Date().getTime());
        window.location.reload();
    }

    this.initMap = function() {
        let lines = eval(this.mapKey).split('\n');
        for (let x in lines) {
            let line = lines[x].split(',');
            mapArr.push(line);
        }
        for (let i=0; i<mapArr[0].length; i++) {
            for (let j=0; j<mapArr.length; j++) {
                let v = mapArr[j][i];
                if (v) {
                    let arr = v.split('|');
                    for (let k in arr) {
                        if (mapCfg[arr[k]])
                            this.creatCell(i, j, mapCfg[arr[k]]);
                    }
                }
            }
        }
    }

    this.setPosition = function(obj, P3) {
        obj.position.set(P3[0], P3[2], P3[1]);
    }


    this.creatGeometry = function(obj) {
        let geometry;
        switch(obj.shape) {
            //方块
            case 1:
                geometry = new THREE.BoxGeometry(
                    obj.size[0], 
                    obj.size[2], 
                    obj.size[1]);
                break;
            //球
            case 2:
                geometry = new THREE.SphereGeometry(
                    obj.size[0], 
                    obj.size[1], 
                    obj.size[2]);
                break;
            //圆柱
            case 3:
                geometry = new THREE.CylinderGeometry(
                    obj.size[0], 
                    obj.size[1], 
                    obj.size[2]);
                break;
            //圆锥
            case 4:
                geometry = new THREE.ConeGeometry(
                    obj.size[0], 
                    obj.size[1], 
                    obj.size[2]);
                break;
            //圆环
            case 5:
                geometry = new THREE.TorusGeometry(
                    obj.size[0], 
                    obj.size[1], 
                    obj.size[2], 
                    obj.size[3]);
                break;
        }
        
        return geometry;
    }

    this.creatMesh = function(obj, group) {
        let geometry = this.creatGeometry(obj);
        let material = new THREE.MeshLambertMaterial({color: obj.mater[0]});
        let mesh = new THREE.Mesh(geometry, material);

        if (obj.rotate && obj.rotate.length == 3) {
            mesh.rotateX(Math.PI/180*obj.rotate[0]);
            mesh.rotateY(Math.PI/180*obj.rotate[2]);
            mesh.rotateZ(Math.PI/180*obj.rotate[1]);
        };
        mesh.position.set(
            obj.pos[0], 
            obj.pos[2], 
            obj.pos[1]);
        mesh.name = obj.name;
        mesh.castShadow = obj.mater[2];
        mesh.receiveShadow = obj.mater[3];
        group.add(mesh);

        let __material = new THREE.ShadowMaterial({opacity: obj.mater[1]});
        let __mesh = new THREE.Mesh(mesh.geometry, __material);
        __mesh.position.set(
            mesh.position.x, 
            mesh.position.y, 
            mesh.position.z);
        __mesh.name = obj.name + '_';
        __mesh.receiveShadow = true;
        group.add(__mesh);
        return mesh;
    }

    this.creatCell = function(x, y, cfg) {
        let s = cfg.scale;
        let A = {
            shape: 1,
            name: cfg.mod,
            pos: [x, y, cfg.z],
            size: [s[0], s[1], s[2]],
            rotate: cfg.rotate || 0,
            color: colorRes[cfg.cid] || [],
            model: modelRes[cfg.mod],
        }
        let group = new THREE.Group();
        group.name = A.name;
        for (let y in A.model) {
                            
            let B = this.getModel(A.model[y]);
            if (A.rotate) {
                B.pos = Util.v3tran(B.pos, A.rotate);
                B.size = Util.v3tran(B.size, A.rotate);
            }
            B.pos = Util.v3cross(B.pos, A.size);
            B.pos = Util.v3plus(B.pos, A.pos);
            B.size = Util.v3cross(B.size, A.size);

            B.name =  A.name;
            B.mater[0] = A.color[0] || B.mater[0];
            this.creatMesh(B, group);
        }
        this.scene.add(group);
    }


    this.creatLight = function() {
        this.light = new THREE.AmbientLight(0xFFFFFF,.5);

        this.shadowLight = new THREE.DirectionalLight(0xFFFFFF, .5);
        this.shadowLight.position.set(200, 200, 200);
        this.shadowLight.castShadow = true;

        this.backLight = new THREE.DirectionalLight(0xFFFFFF, .5);
        this.backLight.position.set(-100, 200, 50);
        this.backLight.castShadow = true;
        this.scene.add(this.backLight);
        this.scene.add(this.light);
        this.scene.add(this.shadowLight);
    }


    this.getMap = function(A, name) {
        let B = {
            modelId:  A[0][0] || 1,
            materId:  A[0][1] || 0,
            colorId:  A[0][2] || 0,
            name:   A[0][3] || name,
            count:  A[0][4] || 1,
            offset: A[1] || [0, 0, 0],
            pos:    A[2] || [0, 0, 0],
            size:   A[3] || [1, 1, 1],
            rotate: A[4] || 0,
        } 
        B.modelId = name + B.modelId;
        B.materId = name + B.materId;
        B.colorId = name + B.colorId;
        B.model = modelRes[B.modelId];
        B.color = colorRes[B.colorId] || colorRes['team'+A[0][2]] || [];
        return B;
    }

    this.getModel = function(A) {
        return {
            shape:  A[0][0] || 0,
            pos:    A[1] || [0, 0, 0],
            size:   A[2] || [1, 1, 1],
            rotate: A[3] || 0,
            mater:  A[4] || [0x888888,.00,0,0],
        }   
    }


    this.render = function() {
        this.renderer.render(this.scene, this.camera);
    }


    this.setCameraPos = function(x, y, z) {
        this.camera.position.set(
            this.camPos[0]*this.camScale + (x || 0), 
            this.camPos[2]*this.camScale + (y || 0), 
            this.camPos[1]*this.camScale + (z || 0)
        ); 
    }

    this.setZoom = function(scale) {
        this.camScale *= scale;
        if (this.camScale < this.camMinScale) {
            this.camScale = this.camMinScale;
            return;
        }
        if (this.camScale > this.camMaxScale) {
            this.camScale = this.camMaxScale;
            return;
        }
        
        this.setCameraPos();
        if (this.isBattle)
            this.camera.lookAt(new THREE.Vector3(0,0,0));
        else
            this.camera.lookAt(new THREE.Vector3(
                this.camPos[0] * (this.camScale - 1),
                this.camSize,
                this.camPos[1] * (this.camScale - 1)
            ));
        this.render();
    }


    this.setDrag = function(x, y) {
        this.startX = this.startX || this.clientX;
        this.startY = this.startY || this.clientY;
        x = (x-this.startX)/20;
        y = (y-this.startY)/20;
        let dx = this.isFront ? x : .707*(y+x);
        let dy = this.isFront ? y : .707*(y-x);
        this.setCameraPos(-dx, 0, -dy);
        this.render();
    }
}


document.onmousewheel = function(e) {
    e = e || window.event;
    e.wheelDelta = e.wheelDelta || 0;
    if (e.wheelDelta != 0)
        WORLD.setZoom(e.wheelDelta < 0 ? 1.1:0.9);
}



document.ontouchstart = function(e) {
    e = e || window.event;
    e = e.touches ? e.touches[0] : e;
    WORLD.startX = e.clientX;
    WORLD.startY = e.clientY;
}



document.ontouchmove = function(e) {
    e = e || window.event;
    e = e.touches ? e.touches[0] : e;
    WORLD.setDrag(e.clientX, e.clientY);
    WORLD.clientX = e.clientX;
    WORLD.clientY = e.clientY;
}

document.ontouchend = function(e) {
    e = e || window.event;
    e = e.touches ? e.touches[0] : e;  
    // WORLD.setCameraPos();
    // WORLD.render();
}

document.onmousedown = function(e) {
    e = e || window.event;
    e = e.touches ? e.touches[0] : e;
    WORLD.startX = e.clientX;
    WORLD.startY = e.clientY;
    WORLD.onMove = 1;
}

document.onmouseup = function(e) {
    WORLD.onMove = 0;
    console.log(e);
}

document.onmousemove = function(e) {
    if (!WORLD.onMove) return;
    e = e || window.event;
    e = e.touches ? e.touches[0] : e;
    if (e.button > 0) return;
    WORLD.setDrag(e.clientX, e.clientY);
    WORLD.clientX = e.clientX;
    WORLD.clientY = e.clientY;
}


const canvas = document.getElementById("GolfCanvas");
const BlocksX = 750;
const BlocksY = 300;
canvas.width = document.getElementById("CanvasContainer").offsetWidth - 60;
canvas.height = canvas.width * (BlocksY/BlocksX);
const PixelsPerBlock = canvas.width/BlocksX;
const CenterX = Math.ceil(canvas.width / 2);
const CenterY = Math.ceil(canvas.height / 2);

let GolfBall = {
    x: CenterX,
    y: CenterY,
    velocityX: 0,
    velocityY: 0
}

let ScoreHole = {
    x: 50,
    y: 240
}

let walls = [];

let won = false;
let mouseDown = false
let mouseInitPos = {x:0, y:0}
let mouseStopPos = {x:0, y:0}
let shots = 0;
let level = 0; 

function get_level(level){
    switch(level){
        case 1: 
            ScoreHole = {x: 50, y: 240}
            walls = [
                {x: 200, y: 100, width: 250, height: 100, angle: 0}
            ]
            GolfBall.x = CenterX;
            GolfBall.y = CenterY;
            GolfBall.velocityX = 0;
            GolfBall.velocityY = 0;
            break;
        case 2:
            ScoreHole = {x: 700, y: 50};
            walls = [
                {x: 200, y: 150, width: 100, height: 200, angle: 0},
                {x: 500, y: 150, width: 100, height: 200, angle: 0}
            ];
            GolfBall.x = CenterX;
            GolfBall.y = CenterY;
            GolfBall.velocityX = 0;
            GolfBall.velocityY = 0;
            break;
        case 3:
            ScoreHole = {x: 50, y: 50};
            walls = [
                {x: 350, y: 150, width: 50, height: 200, angle: 0.5},
                {x: 450, y: 150, width: 50, height: 200, angle: -0.5}
            ]
            GolfBall.x = 700;
            GolfBall.y = 250;
            GolfBall.velocityX = 0;
            GolfBall.velocityY = 0;
            break;
        case 4:
            ScoreHole = {x: 700, y: 250}
            walls = [
                {x: 200, y: 100, width: 150, height: 50, angle: 0.3},
                {x: 200, y: 200, width: 150, height: 50, angle: -0.3},
                {x: 500, y: 100, width: 150, height: 50, angle: -0.3},
                {x: 500, y: 200, width: 150, height: 50, angle: 0.3}
            ]
            GolfBall.x = 50;
            GolfBall.y = 250;
            GolfBall.velocityX = 0;
            GolfBall.velocityY = 0;
            break;
        case 5:
            ScoreHole = {x: 50, y: 275};
            walls = [
                {x: 200, y: 50, width: 400, height: 30, angle: 0},
                {x: 200, y: 250, width: 400, height: 30, angle: 0},
                {x: 200, y: 150, width: 30, height: 200, angle: 0.2},
                {x: 500, y: 150, width: 30, height: 200, angle: -0.2}
            ]
            GolfBall.x = 700;
            GolfBall.y = 150;
            GolfBall.velocityX = 0;
            GolfBall.velocityY = 0;
            break;
        default:
            ScoreHole = {x: 690, y: 140}
            walls = [
                // T - at x: 20-60
                {x: 40, y: 70, width: 15, height: 100, angle: 0},      // vertical line
                {x: 40, y: 25, width: 60, height: 15, angle: 0},       // top bar
                
                // H - at x: 80-130
                {x: 90, y: 70, width: 15, height: 100, angle: 0},      // left vertical
                {x: 120, y: 70, width: 15, height: 100, angle: 0},     // right vertical
                {x: 105, y: 70, width: 30, height: 15, angle: 0},      // middle bar
                
                // A - at x: 150-200
                {x: 165, y: 70, width: 15, height: 80, angle: 0.35},    // left leg
                {x: 190, y: 70, width: 15, height: 80, angle: -0.35},   // right leg
                {x: 175, y: 80, width: 30, height: 15, angle: 0},      // middle bar
                
                // N - at x: 220-280
                {x: 245, y: 60, width: 15, height: 80, angle: 0},     // left vertical
                {x: 265, y: 60, width: 15, height: 80, angle: -0.5},   // diagonal
                {x: 285, y: 60, width: 15, height: 80, angle: 0},     // right vertical
                
                // K - at x: 300-360
                {x: 320, y: 60, width: 15, height: 100, angle: 0},     // left vertical
                {x: 340, y: 40, width: 50, height: 15, angle: -0.7},    // top diagonal
                {x: 340, y: 85, width: 50, height: 15, angle: 0.7},   // bottom diagonal
                
                // S - at x: 380-440
                {x: 410, y: 20, width: 60, height: 15, angle: 0},      // top bar
                {x: 410, y: 60, width: 60, height: 15, angle: 0},      // middle bar
                {x: 410, y: 100, width: 60, height: 15, angle: 0},     // bottom bar
                {x: 385, y: 40, width: 15, height: 55, angle: 0},      // left vertical
                {x: 435, y: 80, width: 15, height: 55, angle: 0}       // right vertical
            ]
            GolfBall.x = 50;
            GolfBall.y = 250;
            GolfBall.velocityX = 0;
            GolfBall.velocityY = 0;
            break;
    }
    won = false;
    shots = 0;
    document.getElementById("shots").innerText = `Shots: ${shots}`;
    document.getElementById("level").innerText = `Level: ${level}`;
    document.getElementById("next-level").style.display = 'none';
}

function calcShot(){
    let dx = mouseInitPos.x - mouseStopPos.x;
    let dy = mouseInitPos.y - mouseStopPos.y;

    let drag = 30;
    let velocity = {x: dx/drag, y: dy/drag};

    GolfBall.velocityX = velocity.x;
    GolfBall.velocityY = velocity.y;
}

function moveBall(){
    GolfBall.x += GolfBall.velocityX;
    GolfBall.y += GolfBall.velocityY;

    GolfBall.velocityX *= 0.99;
    GolfBall.velocityY *= 0.99;

    if (Math.abs(GolfBall.velocityX) < 1 && Math.abs(GolfBall.velocityY) < 1){
        GolfBall.velocityX = 0;
        GolfBall.velocityY = 0;
    }


    checkBorderCollision();

    for (let wall of walls){
        resolveWallCollision(wall);
    }
}

function checkBorderCollision(){
    if (GolfBall.x - 16 < 0 || GolfBall.x + 16 > canvas.width){
        GolfBall.velocityX = -GolfBall.velocityX;
        GolfBall.x = Math.max(16, Math.min(canvas.width - 16, GolfBall.x));
    }
    if (GolfBall.y - 16 < 0 || GolfBall.y + 16 > canvas.height){
        GolfBall.velocityY = -GolfBall.velocityY;
        GolfBall.y = Math.max(16, Math.min(canvas.height - 16, GolfBall.y));
    }
}

function rotate_point(wall, point, theta){
    let x = point.x - wall.x*PixelsPerBlock;
    let y = point.y - wall.y*PixelsPerBlock;

    let xd = (x * Math.cos(theta)) - (y * Math.sin(theta));
    let yd = (x * Math.sin(theta)) + (y * Math.cos(theta));

    xd += wall.x*PixelsPerBlock;
    yd += wall.y*PixelsPerBlock;

    return {x: xd, y: yd};
}

function checkWallCollision(wall){
    let points = [
        {x: (wall.x-(wall.width/2))*PixelsPerBlock, y: (wall.y-(wall.height/2))*PixelsPerBlock},
        {x: (wall.x-(wall.width/2))*PixelsPerBlock, y: (wall.y+(wall.height/2))*PixelsPerBlock},
        {x: (wall.x+(wall.width/2))*PixelsPerBlock, y: (wall.y+(wall.height/2))*PixelsPerBlock},
        {x: (wall.x+(wall.width/2))*PixelsPerBlock, y: (wall.y-(wall.height/2))*PixelsPerBlock}
    ]

    for (let i = 0;i < points.length;i++){
        points[i] = rotate_point(wall,points[i],wall.angle)
    }

    let collision = false;
    let normalX = 0;
    let normalY = 0;
    let overlap = Infinity;

    for (let i = 0;i < points.length;i++){
        let point1 = points[i];
        let point2 = points[(i+1)%points.length];

        let edgeX = point2.x - point1.x;
        let edgeY = point2.y - point1.y;
        
        let toCircleX = GolfBall.x - point1.x;
        let toCircleY = GolfBall.y - point1.y;

        let edgeSq = edgeX*edgeX + edgeY*edgeY;

        if (edgeSq > 0){
            let t = Math.max(0, Math.min(1, (toCircleX * edgeX + toCircleY * edgeY) / (edgeSq)));

            let closestX = point1.x + t * edgeX;
            let closestY = point1.y + t * edgeY;

            let distX = GolfBall.x - closestX;
            let distY = GolfBall.y - closestY

            let distance = Math.sqrt(distX*distX + distY*distY);

            if (distance < 10){
                if (distance > 0){
                    edgeNormalX = distX/distance;
                    edgeNormalY = distY/distance;
                    edgeOverlap = 10 - distance; 
                }
                else {
                    edgeNormalX = -edgeY / Math.sqrt(edgeSq);
                    edgeNormalY = edgeX / Math.sqrt(edgeSq);
                    edgeOverlap = 10;
                }
                if (edgeOverlap < overlap){
                    collision = true;
                    overlap = edgeOverlap;
                    normalX = edgeNormalX;
                    normalY = edgeNormalY;
                }
            }
        }

    }

    if (!collision && pointInPolygon({x: GolfBall.x, y: GolfBall.y},points)){
        collision = true;
        let minDist = Infinity;
        let closestNormalX = 0;
        let closestNormalY = 0;

        for (let i = 0;i < points.length;i++){
            let point1 = points[i];
            let point2 = points[(i+1)%points.length];

            let edgeX = point2.x - point1.x;
            let edgeY = point2.y - point1.y;

            let edgeLength = Math.sqrt(edgeX*edgeX + edgeY*edgeY);

            if (edgeLength > 0){
                let toCircleX = GolfBall.x - point1.x;
                let toCircleY = GolfBall.y - point1.y;

                let t = Math.max(0, Math.min(1, (toCircleX * edgeX + toCircleY * edgeY) / (edgeLength * edgeLength)));

                let closestX = point1.x + t*edgeX;
                let closestY = point1.y + t*edgeY;

                let distX = GolfBall.x - closestX;
                let distY = GolfBall.y - closestY;

                let distance = Math.sqrt(distX*distX + distY*distY);

                if (distance < minDist){
                    minDist = distance;
                    if (distance > 0){
                        closestNormalX = distX / distance;
                        closestNormalY = distY / distance;
                    }
                    else {
                        closestNormalX = -edgeY/edgeLength
                        closestNormalY = edgeX/edgeLength
                    }
                }
            }
        }
        if (minDist < Infinity){
            overlap = 10 + minDist;
            normalX = closestNormalX;
            normalY = closestNormalY;
        }
    }

    return collision ? {collision: collision, normalX: normalX, normalY: normalY, overlap: overlap} : {collision: false};
}



function pointInPolygon(point, polygon){
    let x = point.x;
    let y = point.y;

    let inside = false;

    for (let i = 0;i < polygon.length;i++){
        let x1 = polygon[i].x;
        let y1 = polygon[i].y;
        let x2 = polygon[(i+1)%polygon.length].x;
        let y2 = polygon[(i+1)%polygon.length].y;

        if ((x == x1 && y == y1) || (x == x2 && y == y2)){
            return true;
        }

        if (y1 == y2 && y == y1 && Math.min(x1, x2) <= x && x <= Math.max(x1, x2)){
            return true;
        }

        if ((y1 > y) !== (y2 > y)){
            Xintersect = (x2 - x1) * (y - y1) / (y2 - y1) + x1;
            if (Xintersect == x){
                return true;
            }

            if (Xintersect > x){
                inside = !inside;
            }
        }
    }
    return inside;
}

function checkWin(){
    let dx = GolfBall.x - (ScoreHole.x*PixelsPerBlock);
    let dy = GolfBall.y - (ScoreHole.y*PixelsPerBlock);

    let distance = Math.sqrt((dx*dx) + (dy*dy));

    if (distance <= 15){
        won = true;
    }
}

function renderWall(context,wall){
    context.save()

    context.translate(wall.x *PixelsPerBlock, wall.y * PixelsPerBlock);
    context.rotate(wall.angle);

    context.fillStyle = 'red';
    context.fillRect(-(wall.width*PixelsPerBlock)/2, -(wall.height*PixelsPerBlock)/2, wall.width * PixelsPerBlock, wall.height * PixelsPerBlock);

    context.restore();
}

function resolveWallCollision(wall){
    let result = checkWallCollision(wall);

    if (!result.collision)return;

    let collision = result.collision;
    let normalX = result.normalX;
    let normalY = result.normalY;
    let overlap = result.overlap;

    

    if (collision){
        GolfBall.x = GolfBall.x + normalX * overlap;
        GolfBall.y = GolfBall.y + normalY * overlap;

        let dotProduct = GolfBall.velocityX * normalX + GolfBall.velocityY * normalY;

        if (dotProduct < 0){
            GolfBall.velocityX = GolfBall.velocityX - 2 * dotProduct * normalX;
            GolfBall.velocityY = GolfBall.velocityY - 2 * dotProduct * normalY;
        }
        
    }

}

function render(){
    let context = canvas.getContext('2d');
    if (!won){
        context.clearRect(0,0,canvas.width,canvas.height);

        for(let wall of walls){
            renderWall(context, wall);
        }

        context.strokeStyle = 'Black';
        context.fillStyle = 'Black';

        context.beginPath()
        context.arc(ScoreHole.x * PixelsPerBlock, ScoreHole.y * PixelsPerBlock, 15, 0, Math.PI*2)

        context.fill()

        context.strokeStyle = 'Blue';
        context.fillStyle = 'Blue';

        context.beginPath();
        context.arc(GolfBall.x, GolfBall.y, 10, 0, 2 * Math.PI);

        context.fill();
        
        
        

        if (mouseDown){
            context.fillStyle = 'Red';
            context.beginPath();
            context.arc(mouseInitPos.x, mouseInitPos.y, 5, 0, 2*Math.PI);
            context.fill();
            context.lineWidth = 5;


            context.fillStyle = 'Green';
            context.beginPath();
            context.arc(mouseStopPos.x, mouseStopPos.y, 5, 0, 2*Math.PI);
            context.fill();
            context.lineWidth = 5;

        }

    }
}

function main(){
    render();
    if(!won){
        moveBall();
        checkWin();
    }
    else{
        document.getElementById("next-level").style.display = 'block';
    }
    
}

canvas.addEventListener("mousedown",(e)=>{
    mouseDown = true;
    let rect = canvas.getBoundingClientRect();
    mouseInitPos = {x: e.clientX - rect.left, y: e.clientY - rect.top};
    mouseStopPos = mouseInitPos;
})

canvas.addEventListener("mousemove", (e)=>{
    if (mouseDown){
        let rect = canvas.getBoundingClientRect();
        mouseStopPos = {x: e.clientX - rect.left, y: e.clientY - rect.top};
    }
})

canvas.addEventListener("mouseup", (e)=>{
    if (mouseDown){
        let rect = canvas.getBoundingClientRect();
        mouseStopPos = {x: e.clientX - rect.left, y: e.clientY - rect.top};

        calcShot();
        mouseDown = false;
        shots += 1;
        document.getElementById("shots").innerText = `Shots: ${shots}`
    }
})

document.getElementById("next-level").addEventListener("click",(e)=>{
    level += 1;
    get_level(level);
})

document.addEventListener("DOMContentLoaded", (e)=> {
    get_level(level);
    setInterval(main,10);
})


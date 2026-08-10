const canvas = document.getElementById("GolfCanvas");
const BlocksX = 750;
const BlocksY = 300;
canvas.width = document.getElementById("CanvasContainer").offsetWidth - 60;
canvas.height = canvas.width * (BlocksY/BlocksX);
const CenterX = Math.ceil(canvas.width / 2);
const CenterY = Math.ceil(canvas.height / 2);

let GolfBall = {
    x: CenterX,
    y: CenterY,
    velocityX: 0,
    velocityY: 0
}

let walls = [];

let won = 0;
let mouseDown = false
let mouseInitPos = {x:0, y:0}
let mouseStopPos = {x:0, y:0}
let shots = 0;
let level = 1; 

function get_level(level){
    switch(level){
        case 1: 
            walls = [{'TopLeft':(250,100),'TopRight':(500,100),'BottomLeft':(250,200),'BottomRight':(500,200)}]
    }
}

function calcShot(){
    let dx = mouseInitPos.x - mouseStopPos.x;
    let dy = mouseInitPos.y - mouseStopPos.y;

    let drag = 40;
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
}

function checkBorderCollision(){
    if (GolfBall.x - 16 < 0 || GolfBall.x + 16 > canvas.width){
        GolfBall.velocityX = -GolfBall.velocityX
    }
    if (GolfBall.y - 16 < 0 || GolfBall.y + 16 > canvas.height){
        GolfBall.velocityY = -GolfBall.velocityY;
    }
}

function render(){
    if (!won){
        let context = canvas.getContext('2d');
        context.clearRect(0,0,canvas.width,canvas.height);
        context.strokeStyle = 'Black';
        context.fillStyle = 'Black';

        context.beginPath();
        context.arc(GolfBall.x, GolfBall.y, 15, 0, 2 * Math.PI);

        context.fill()

        context.lineWidth = 5;
        context.stroke()

        if (mouseDown){
            console.log("in it")
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
    if(!won){
        render();
        moveBall();
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

setInterval(main,10);
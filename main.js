const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let canvasLength = 480
let canvasWidth = 320 

let faceRadius = 20;
let faceY = 155
let dFaceY = 10

let pringleHeight = 20;
let pringleWidth = 50;
let pringleStartingXValue = canvasLength - 60;
let pringleCurrentXValue = pringleStartingXValue;
let pringleRespawnYValue = Math.floor( Math.random() * (canvasWidth - pringleHeight) ); // this will be the y co-ordinate for the new pringle after collission.
let dPringle = 5;

let upPressed = false 
let downPressed = false

let img = new Image();
img.src = 'pringle.png';

const keyDownHandler = e => {
    if (e.keyCode === 38) {
        upPressed = true; 
    }
    else if (e.keyCode === 40) {
        downPressed = true;
    }
}

const keyUpHandler = e => {
    if (e.keyCode === 38) {
        upPressed = false;
    }
    else if (e.keyCode === 40) {
        downPressed = false;
    }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

const youLost = () => {
    
}

const drawFace = () => {
    ctx.beginPath();
    ctx.arc(30, faceY, faceRadius, Math.PI*2.2 , Math.PI*1.8);
    ctx.lineTo(30, faceY)
    ctx.fillStyle = 'black';
    ctx.fill()
    ctx.closePath()
}

const drawPringle = () => {
    if (pringleCurrentXValue !== 10) {
        ctx.drawImage(img, pringleCurrentXValue, canvasWidth/2, pringleWidth, pringleHeight)
        pringleCurrentXValue -= dPringle
    } 
    else {
        alert('You lost. Start again')
        pringleCurrentXValue = 9
        document.location.reload();
    }
}

const draw = () => {
    ctx.clearRect(10, 10, canvas.width, canvas.height);
    ctx.fillStyle = '#66cccc';
    ctx.fillRect(10, 10, canvasLength, canvasWidth);

    drawFace();
    drawPringle()
    requestAnimationFrame(draw)
    
    if (upPressed === true ) {
        if (faceY - dFaceY > 10 + faceRadius) {
            faceY -= dFaceY
        }
    }
    else if (downPressed === true ) {
        if (faceY + dFaceY < canvasWidth - faceRadius) {
            faceY += dFaceY
        } 
    }
}

draw()



const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#66cccc';
ctx.fillRect(10, 10, 480, 320);
let faceRadius = 20;
let faceY = 155
let dFaceY = 10
let upPressed = false 
let downPressed = false



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

const draw = () => {
    ctx.clearRect(10, 10, canvas.width, canvas.height);
    ctx.fillStyle = '#66cccc';
    ctx.fillRect(10, 10, 480, 320);

    drawFace();
    requestAnimationFrame(draw)
    
    if (upPressed === true  ) {
        if (faceY - dFaceY > 10 + faceRadius ) {
            faceY -= dFaceY
        }
    }
    else if (downPressed === true ) {
        if (faceY + dFaceY < 320 - faceRadius) {
            faceY += dFaceY
        }
    }
}

const drawFace = () => {
    ctx.beginPath();
    ctx.arc(30, faceY, faceRadius, Math.PI*2.2 , Math.PI*1.8);
    ctx.lineTo(30, faceY)
    ctx.fillStyle = 'black';
    ctx.fill()
    ctx.closePath()

}

draw()


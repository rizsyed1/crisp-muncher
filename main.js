
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let canvasLength = 520;
let canvasWidth = 320 
let canvasStartX = 0
let canvasStartY = 0
 
let faceRadius = 20;
let faceY = 155
let dFaceY = 10

let pringleHeight = 20;
let pringleWidth = 50;
let pringleStartingXValue = canvasLength + 60;
let pringleCurrentXValue = pringleStartingXValue;
let pringleRespawnYValue = Math.floor( Math.random() * (canvasWidth - pringleHeight) ); // this will be the y co-ordinate for the new pringle after collission.
let dPringle = 5;

let upPressed = false 
let downPressed = false

const modal = document.querySelector('.modal')
const playAgainButton = document.querySelector('.play-again-button')

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


const toggleModal = () => {
    modal.classList.toggle('show-modal')
    if (modal.className === 'modal') {
        document.location.reload();
    }
}

const drawFace = () => {
    ctx.beginPath();
    ctx.arc(canvasStartX + faceRadius, faceY, faceRadius, Math.PI*2.2 , Math.PI*1.8);
    ctx.lineTo(canvasStartX + faceRadius, faceY)
    ctx.fillStyle = 'black';
    ctx.fill()
    ctx.closePath()
}

const drawPringle = () => {
    if (pringleCurrentXValue !== canvasStartX) {
        pringleCurrentXValue -= dPringle
        ctx.drawImage(img, pringleCurrentXValue, canvasWidth/2, pringleWidth, pringleHeight)

    } 
    else {
        toggleModal()
        pringleCurrentXValue = pringleCurrentXValue - 1
    }
}

const draw = () => {
    console.log(window.innerWidth, window.innerWidth / 4)
    ctx.clearRect(canvasStartX, canvasStartY, canvas.width, canvas.height);
    ctx.fillStyle = '#66cccc';
    ctx.fillRect(canvasStartX, canvasStartY, canvasLength, canvasWidth);

    drawFace();
    drawPringle()
    requestAnimationFrame(draw)
    
    if (upPressed === true ) {
        if (faceY - dFaceY > canvasStartY + faceRadius) {
            faceY -= dFaceY
        }
    }
    else if (downPressed === true ) {
        if (faceY + dFaceY < canvasWidth - faceRadius) {
            faceY += dFaceY
        } 
    }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
playAgainButton.addEventListener('click', toggleModal)

draw()



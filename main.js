
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let canvasLength = 520;
let canvasWidth = 320; 
let canvasStartX = 0;
let canvasStartY = 0;
 
let faceRadius = 20;
let faceX = canvasStartX + faceRadius;
let faceY = canvasWidth/2;
let dFaceY = 10;

let pringleHeight = 20;
let pringleWidth = 50;
let pringleStartingXValue = canvasLength + 60;
let pringleCurrentXValue = pringleStartingXValue;
let pringleCurrentYValue = canvasWidth/2;
let pringleRespawnYValue = Math.floor( Math.random() * (canvasWidth - pringleHeight) ); // this will be the y co-ordinate for the new pringle after collission.
let pringleSpeed = 5;

let upPressed = false; 
let downPressed = false;

const modal = document.querySelector('.modal');
const playAgainButton = document.querySelector('.play-again-button');

let img = new Image();
img.src = 'pringle.png';

// Face range values
let faceUpperYValue = faceY + faceRadius;
let faceLowerYValue = faceY;

//pringle range values 
let pringleUpperYValue = pringleCurrentYValue + pringleHeight;
let pringleLowerYValue = pringleCurrentYValue;
let pringleLowerYValueInFaceRange = faceLowerYValue <= pringleLowerYValue && pringleLowerYValue <= faceUpperYValue;
let pringleUpperYValueInFaceRange = faceLowerYValue <= pringleUpperYValue && pringleUpperYValue <= faceUpperYValue;

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
    modal.classList.toggle('show-modal');
    if (modal.className === 'modal') {
        document.location.reload();
    }
}

const drawFace = () => {
    ctx.beginPath();
    ctx.arc(faceX, faceY, faceRadius, Math.PI*2.2 , Math.PI*1.8);
    ctx.lineTo(canvasStartX + faceRadius, faceY);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
}

const updateIfPringleYValuesInFaceRange = () => {
    pringleLowerYValueInFaceRange = faceLowerYValue <= pringleLowerYValue && pringleLowerYValue <= faceUpperYValue;
    pringleUpperYValueInFaceRange = faceLowerYValue <= pringleUpperYValue && pringleUpperYValue <= faceUpperYValue;
}

const assignFaceYValues = () => {
    faceUpperYValue =  faceY + faceRadius;
    faceLowerYValue = faceY - faceRadius;
}

const drawPringle = () => {
        if (pringleCurrentXValue !== canvasStartX) {
            if (pringleCurrentXValue < faceX && (pringleLowerYValueInFaceRange || pringleUpperYValueInFaceRange) ) {
                console.log('collission!');
                //play crisp munching sound here
            }
            else {
                pringleCurrentXValue -= pringleSpeed
                ctx.drawImage(img, pringleCurrentXValue, pringleCurrentYValue, pringleWidth, pringleHeight);
                updateIfPringleYValuesInFaceRange()
            }
        }
        else {
            toggleModal();
            pringleCurrentXValue = pringleCurrentXValue - 1;
        }
}

const draw = () => {
    ctx.clearRect(canvasStartX, canvasStartY, canvas.width, canvas.height);
    ctx.fillStyle = '#66cccc';
    ctx.fillRect(canvasStartX, canvasStartY, canvasLength, canvasWidth);

    drawFace();
    drawPringle();
    requestAnimationFrame(draw);
    
    if (upPressed === true ) {
        if (faceY - dFaceY > canvasStartY + faceRadius) {
            faceY -= dFaceY;
            assignFaceYValues()
        }
    }
    else if (downPressed === true ) {
        if (faceY + dFaceY < canvasWidth - faceRadius) {
            faceY += dFaceY;
            assignFaceYValues() 
        } 
    }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
playAgainButton.addEventListener('click', toggleModal);

draw()



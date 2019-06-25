const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let canvasLength = 520;
let canvasWidth = 320; 
let canvasStartX = 0;
let canvasStartY = 0;
 
let faceRadius = 20;
let faceX = canvasStartX + faceRadius;
let faceY = faceRadius + 10;
let faceSpeed = 10;

let pringleHeight = 20;
let pringleWidth = 50;
let pringleStartingXValue = canvasLength + 60;
let pringleCurrentXValue = canvasLength + 60;
let pringleYValue = canvasWidth / 2; // this will be the y co-ordinate for the new pringle after collission.
let pringleSpeed = 5;

let upPressed = false; 
let downPressed = false;
let animateAgain = true;

const modal = document.querySelector('.modal');
const playAgainButton = document.querySelector('.play-again-button');

let img = new Image();
img.src = 'pringle.png';

let sound = document.createElement('audio');
sound.src = 'crisp-munch.mp3';

let requestID;

// Face range values
let faceUpperYValue = faceY + faceRadius;
let faceLowerYValue = faceY;

//pringle range values 
let pringleUpperYValue = pringleYValue + pringleHeight;
let pringleLowerYValue = pringleYValue;
let pringleLowerYValueInFaceRange = faceLowerYValue <= pringleLowerYValue && pringleLowerYValue <= faceUpperYValue;
let pringleUpperYValueInFaceRange = faceLowerYValue <= pringleUpperYValue && pringleUpperYValue <= faceUpperYValue;

const generatePringleRespawnYValue = () =>  {
    pringleYValue = Math.floor( Math.random() * (canvasWidth - pringleHeight) );
    pringleUpperYValue = pringleYValue + pringleHeight;
    pringleLowerYValue = pringleYValue;
}

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

const playCollisionSound = () => {
    sound.setAttribute('preload', 'auto');
    sound.setAttribute('controls', 'none');
    sound.style.display = 'none'; 
    document.body.appendChild(sound);
    sound.play();
}

const updateIfPringleYValuesInFaceRange = () => {
    pringleLowerYValueInFaceRange = faceLowerYValue <= pringleLowerYValue && pringleLowerYValue <= faceUpperYValue;
    pringleUpperYValueInFaceRange = faceLowerYValue <= pringleUpperYValue && pringleUpperYValue <= faceUpperYValue;
}


const drawPringle = async () => {
    if (pringleCurrentXValue > canvasStartX) {
        if (pringleCurrentXValue <= faceX + faceRadius && (pringleLowerYValueInFaceRange || pringleUpperYValueInFaceRange) ) {
            pringleSpeed += 0.2;
            if (faceRadius >= 7){
                faceRadius -= 0.1
            }
            await playCollisionSound();
            pringleCurrentXValue = pringleStartingXValue;
            generatePringleRespawnYValue();

        }
        else {
            pringleCurrentXValue -= pringleSpeed;
            ctx.drawImage(img, pringleCurrentXValue, pringleYValue, pringleWidth, pringleHeight);
            updateIfPringleYValuesInFaceRange();
        }
    }
    else {
        animateAgain = false;
        toggleModal();
    }
}

const toggleModal = () => {
    console.log('toggleModal() reached');
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

const draw = () => {
    ctx.clearRect(canvasStartX, canvasStartY, canvas.width, canvas.height);
    ctx.fillStyle = '#66cccc';
    ctx.fillRect(canvasStartX, canvasStartY, canvasLength, canvasWidth);

    drawFace();
    drawPringle();
    
    if (upPressed === true ) {
        if (faceY - faceSpeed > canvasStartY + faceRadius) {
            faceY -= faceSpeed;-
            assignFaceYValues()
        }
    }
    else if (downPressed === true ) {
        if (faceY + faceSpeed < canvasWidth - faceRadius) {
            faceY += faceSpeed;
            assignFaceYValues() 
        } 
    }
    if (animateAgain) {
        requestAnimationFrame(draw)
    }
}

const assignFaceYValues = () => {
    faceUpperYValue =  faceY + faceRadius;
    faceLowerYValue = faceY - faceRadius;
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
playAgainButton.addEventListener('click', toggleModal);

requestID = requestAnimationFrame(draw);




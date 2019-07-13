const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let canvasLength = 520;
let canvasWidth = 320; 
let canvasStartX = 0;
let canvasStartY = 0;
 
// face values
let faceRadius = 20;
let faceX = canvasStartX + faceRadius;
let faceY = faceRadius + 10;
let faceSpeed = 10;

//pringle values
let pringleHeight = 20;
let pringleWidth = 50;
let pringleStartingXValue = canvasLength + 60;
let pringleSpeed = 4;
let pringleArr = [];

let upPressed = false; 
let downPressed = false;
let animateAgain = true;

const modal = document.querySelector('.modal');
const playAgainButton = document.querySelector('.play-again-button');
let oldScore;

// time values
let timeAtBeginningOfGame = Date.now();
let lastPringleSpawnTime = Date.now(); 
let timeBetweenRespawns = 1200;
let tenPercentOfTimeBetweenRespawns = timeBetweenRespawns / 10;

// image element
let img = new Image();
img.src = 'pringle.png';

// sound element
let sound = document.createElement('audio');
sound.src = 'crisp-munch.mp3';

let score = 0;

// requestAnimationFrame ID
let requestID;

// Face range values
let faceUpperYValue = faceY + faceRadius;
let faceLowerYValue = faceY;

//pringle range values 

function spawnNewPringle() {
    let newPringleYValue = Math.floor( Math.random() * (canvasWidth - pringleHeight) );
    pringleArr.push(
        {   
            pringleYValue: newPringleYValue, 
            pringleCurrentXValue : pringleStartingXValue,
            pringleLowerYValueInFaceRange: false,
            pringleUpperYValueInFaceRange: false
        }
    );
}

function keyDownHandler(e) {
    if (e.keyCode === 38) {
        upPressed = true; 
    }
    else if (e.keyCode === 40) {
        downPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode === 38) {
        upPressed = false;
    }
    else if (e.keyCode === 40) {
        downPressed = false;
    }
}

function verifyRespawnTimeHasPassed() {
    let withinTenMillisecondsLessThanTimeBetweenRespawns = Date.now() - lastPringleSpawnTime > timeBetweenRespawns - tenPercentOfTimeBetweenRespawns;
    let withinTenMillisecondsGreaterThanTimeBetweenRespawns = Date.now() - lastPringleSpawnTime < timeBetweenRespawns + tenPercentOfTimeBetweenRespawns;
    
    if (withinTenMillisecondsLessThanTimeBetweenRespawns && withinTenMillisecondsGreaterThanTimeBetweenRespawns) {
        lastPringleSpawnTime = Date.now()
        return true;
    }
    else {
        return false;
    }
}

function verifyGameHasStarted() {
    let withinTenMillisecondsOfGameStart = Date.now()  < timeAtBeginningOfGame + 10;
    if (withinTenMillisecondsOfGameStart) {
        timeAtBeginningOfGame = - 100 // ensures only one crisp renders at the beginning 
        return true;
    }
    else {
        return false;
    }
}


function pringleTimeElapsed() {
    if ( verifyRespawnTimeHasPassed() || verifyGameHasStarted()) { // this is the pain point
        return true;
    }
    else {
        return false;
    }
}

function incrementScore() {
    score += 1;
    oldScore = document.getElementById('scoreNumber');
    oldScore.textContent = score;
};

function playCollisionSound() {
    sound.setAttribute('preload', 'auto');
    sound.setAttribute('controls', 'none');
    sound.style.display = 'none'; 
    document.body.appendChild(sound);
    sound.play();
}

async function collision() {
    incrementScore();
    pringleArr.shift()
    pringleSpeed += 0.3;
    timeBetweenRespawns -= 50;
    tenPercentOfTimeBetweenRespawns = timeBetweenRespawns / 10;
    if (faceRadius >= 7){
        faceRadius -= 0.3;
    }
    await playCollisionSound();
};

function updateIfPringleYValuesInFaceRange() {
    for (let k = 0; k < pringleArr.length; k++) {
        let pringleUpperYValue = pringleArr[k].pringleYValue + pringleHeight;
        let pringleLowerYValue = pringleArr[k].pringleYValue;
        pringleArr[k].pringleLowerYValueInFaceRange = faceLowerYValue <= pringleLowerYValue && pringleLowerYValue <= faceUpperYValue;
        pringleArr[k].pringleUpperYValueInFaceRange = faceLowerYValue <= pringleUpperYValue && pringleUpperYValue <= faceUpperYValue;
    }
}

function drawPringle() {
    for (let i = 0; i < pringleArr.length; i++) {
        ctx.drawImage(img, pringleArr[i].pringleCurrentXValue, pringleArr[i].pringleYValue, pringleWidth, pringleHeight);
    }
}

function drawPringleEngine() {
    if (pringleTimeElapsed()) { //pain point
        spawnNewPringle();
    }
    for (let j = 0; j < pringleArr.length; j++) {
        if (pringleArr[j].pringleCurrentXValue > canvasStartX) {
            pringleArr[j].pringleCurrentXValue -= pringleSpeed;
                drawPringle(); 
                updateIfPringleYValuesInFaceRange();

                if (pringleArr[j].pringleCurrentXValue <= faceX + faceRadius && (pringleArr[j].pringleLowerYValueInFaceRange || pringleArr[j].pringleUpperYValueInFaceRange) ) {
                    collision();
                }
        }
        else {
            animateAgain = false;
            toggleModal();
            break
        }
    }
}

function toggleModal() {
    modal.classList.toggle('show-modal');
    if (modal.className === 'modal') {
        document.location.reload();
    }
}

function drawFace() {
    ctx.beginPath();
    ctx.arc(faceX, faceY, faceRadius, Math.PI*2.2 , Math.PI*1.8);
    ctx.lineTo(canvasStartX + faceRadius, faceY);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(canvasStartX, canvasStartY, canvas.width, canvas.height);
    ctx.fillStyle = '#66cccc';
    ctx.fillRect(canvasStartX, canvasStartY, canvasLength, canvasWidth);
    drawFace();
    //insert if-condition here so drawPringleEngine() is called every three seconds
    drawPringleEngine();
    
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

function assignFaceYValues() {
    faceUpperYValue =  faceY + faceRadius;
    faceLowerYValue = faceY - faceRadius;
}

if(typeof exports === 'object') {
    module.exports = {
        spawnNewPringle,
        keyDownHandler,
        keyUpHandler,
        verifyRespawnTimeHasPassed,
        verifyGameHasStarted,
        pringleTimeElapsed,
        incrementScore,
        playCollisionSound,
        collision,
        updateIfPringleYValuesInFaceRange,
        drawPringle,
        drawPringleEngine,
        toggleModal,
        drawFace,
        draw,
        assignFaceYValues
    }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
playAgainButton.addEventListener('click', toggleModal);

requestID = requestAnimationFrame(draw);




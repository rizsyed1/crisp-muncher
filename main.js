const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const modal = document.querySelector('.modal');
const startScreen = document.querySelector('.starting-screen');
const playAgainButton = document.querySelector('.play-again-button');
const playButton = document.querySelector('.play-button');
const oldScore = document.getElementById('scoreNumber');
const scoreComponent = document.getElementById('score');
const gameOverScoreDisplay = document.getElementById('gameOverScoreDisplay');

// background music 
const backgroundMusic = document.createElement('audio');
backgroundMusic.src = 'background-music.mp3';
backgroundMusic.preload = 'auto';
backgroundMusic.controls = 'none';
backgroundMusic.style.display = 'none'; 
backgroundMusic.volume = 0.6;
document.body.appendChild(backgroundMusic);

// canvas loaded
let canvasLength = 520;
let canvasWidth = 320; 
let canvasStartX = 0;
let canvasStartY = 0;
 
// face values
let faceRadius = 20;
let faceX = canvasStartX + faceRadius;
let faceY = canvasWidth / 2;
let faceSpeed = 10;

//pringle values
let pringleHeight = 20;
let pringleWidth = 50;
let pringleStartingXValue = canvasLength + 60;
let pringleSpeed = 4;
let pringleArr = [];

// button and animation logic
let upPressed = false; 
let downPressed = false;
let animateAgain = true;

// time values
let timeAtBeginningOfGame;
let lastPringleSpawnTime;  
let timeBetweenRespawns = 1200;
let tenPercentOfTimeBetweenRespawns = timeBetweenRespawns / 10;

// image element
let img = new Image();
img.src = 'pringle.png';

// audio element
const crispSound = document.createElement('audio');
crispSound.src = 'crisp-munch.mp3';
crispSound.setAttribute('preload', 'auto');
crispSound.setAttribute('controls', 'none');
crispSound.style.display = 'none'; 
document.body.appendChild(crispSound);

let score = 0;

// requestAnimationFrame ID
let requestID;

// Face range values
let faceUpperYValue = faceY + faceRadius;
let faceLowerYValue = faceY - faceRadius;

//key values 
const arrowUp = 38;
const arrowDown = 40;
const wKey = 87;
const sKey = 83;

const startBackgroundMusic = () => {
    backgroundMusic.play();
}; 

const stopBackgroundMusic = () => {
    backgroundMusic.currentTime = 0;
}; 


const spawnNewPringle = () => {
    if (pringleArr.length > 0) {
        let lastPringleYValue = pringleArr[pringleArr.length - 1].pringleYValue; 
        let rawPringleYValue = Math.floor( Math.random() *  (canvasWidth / 4) ); // ensures that the next pringle only spawns 1/4 of canvas width from last one.
        let aboveOrBelow = Math.random();
        let newPringleYValue;

        if (aboveOrBelow > 0.5 ) { // randomises location of next pringle spawn 
            if ( (lastPringleYValue + rawPringleYValue) <= (canvasWidth - pringleHeight) ){ // ensures canvas doesn't spawn outside of canvas
                newPringleYValue = lastPringleYValue + rawPringleYValue;
            }
            else {
                newPringleYValue = lastPringleYValue - rawPringleYValue;
            }
        }
        else {
            if ( (lastPringleYValue - rawPringleYValue) >= pringleHeight ){// ensures canvas doesn't spawn outside of canvas
                newPringleYValue = lastPringleYValue - rawPringleYValue; 
            }
            else {
                newPringleYValue = lastPringleYValue + rawPringleYValue;  
            }
        }

        pringleArr.push(
            {   
                pringleYValue: newPringleYValue, 
                pringleCurrentXValue : pringleStartingXValue,
                pringleLowerYValueInFaceRange: false,
                pringleUpperYValueInFaceRange: false
            }
        );
    }
    else {
        let newPringleYValue = Math.floor( Math.random() * ( canvasWidth - pringleHeight) );
        pringleArr.push(
            {   
                pringleYValue: newPringleYValue, 
                pringleCurrentXValue : pringleStartingXValue,
                pringleLowerYValueInFaceRange: false,
                pringleUpperYValueInFaceRange: false
            }
        );
    }  
};


const keyDownHandler = e => {
    if (e.keyCode === arrowUp || e.keyCode === wKey) {
        upPressed = true; 
    }
    else if (e.keyCode === arrowDown || e.keyCode === sKey) {
        downPressed = true;
    }
};

const keyUpHandler = e => {
    if (e.keyCode === arrowUp || e.keyCode === wKey) {
        upPressed = false;
    }
    else if (e.keyCode === arrowDown || e.keyCode === sKey) {
        downPressed = false;
    }
};

const verifyRespawnTimeHasPassed = () => {
    let withinTenMillisecondsLessThanTimeBetweenRespawns = Date.now() - lastPringleSpawnTime > timeBetweenRespawns - tenPercentOfTimeBetweenRespawns;
    let withinTenMillisecondsGreaterThanTimeBetweenRespawns = Date.now() - lastPringleSpawnTime < timeBetweenRespawns + tenPercentOfTimeBetweenRespawns;
    
    if (withinTenMillisecondsLessThanTimeBetweenRespawns && withinTenMillisecondsGreaterThanTimeBetweenRespawns) {
        lastPringleSpawnTime = Date.now();
        return true;
    }
    else {
        return false;
    }
};

const verifyGameHasStarted = () => {
    let withinTenMillisecondsOfGameStart = Date.now()  < timeAtBeginningOfGame + 10;
    if (withinTenMillisecondsOfGameStart) {
        timeAtBeginningOfGame = - 100;
        return true;
    }
    else {
        return false;
    }
};


const pringleTimeElapsed = () => {
    if ( verifyRespawnTimeHasPassed() || verifyGameHasStarted()) { 
        return true;
    }
    else {
        return false;
    }
};

const incrementScore = () => {
    score += 1;
    oldScore.textContent = score;
};

const playCollisionSound = () => {
    if (crispSound.paused) {
        crispSound.play();
    }
    else{
        crispSound.currentTime = 0;
    }
    
};

const collision = async () => {
    incrementScore();
    pringleArr = pringleArr.slice(1)
    pringleSpeed += 0.3;
    if (timeBetweenRespawns > 700){
        timeBetweenRespawns -= 50;
    }
    tenPercentOfTimeBetweenRespawns = timeBetweenRespawns / 10;
    if (faceRadius >= 7){
        faceRadius -= 0.3;
    }
    await playCollisionSound();
};

const updateIfPringleYValuesInFaceRange = (i) =>  {
        let pringleUpperYValue = pringleArr[i].pringleYValue + pringleHeight;
        let pringleLowerYValue = pringleArr[i].pringleYValue;
        pringleArr[i].pringleLowerYValueInFaceRange = faceLowerYValue <= pringleLowerYValue && pringleLowerYValue <= faceUpperYValue;
        pringleArr[i].pringleUpperYValueInFaceRange = faceLowerYValue <= pringleUpperYValue && pringleUpperYValue <= faceUpperYValue;
};

const drawPringle = (i) => {
        ctx.drawImage(img, pringleArr[i].pringleCurrentXValue, pringleArr[i].pringleYValue, pringleWidth, pringleHeight);
};

const drawPringleEngine = () => {
    if (pringleTimeElapsed()) {
        spawnNewPringle();
    }
    for (let j = pringleArr.length - 1; j >= 0 ; j--) {
        if (pringleArr[j].pringleCurrentXValue > canvasStartX) {
            pringleArr[j].pringleCurrentXValue -= pringleSpeed;
                drawPringle(j); 
                updateIfPringleYValuesInFaceRange(j);

                if (pringleArr[j].pringleCurrentXValue <= faceX + faceRadius && (pringleArr[j].pringleLowerYValueInFaceRange || pringleArr[j].pringleUpperYValueInFaceRange) ) {
                    collision();
                }
        }
        else {
            animateAgain = false;
            toggleModal();
            break;
        }
    }
};

const toggleModal = () => {
    modal.classList.toggle('show-modal');
    if(modal.className === 'modal show-modal') {
        gameOverScoreDisplay.textContent = score;
        backgroundMusic.pause();
    }
    if (modal.className === 'modal') {
        playAgain();
    }
};

const playAgain = () => {
    score = 0;
    oldScore.textContent = score;
    animateAgain = true; 
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();
    resetGlobalStateToDefault();
    requestID = requestAnimationFrame(draw);
};

const resetGlobalStateToDefault = () => {
    faceRadius = 20;
    faceX = canvasStartX + faceRadius;
    faceY = canvasWidth / 2;
    faceSpeed = 10;
    pringleSpeed = 4;
    pringleArr = [];
    timeBetweenRespawns = 1200;
    timeAtBeginningOfGame = Date.now();
    lastPringleSpawnTime = Date.now(); 
};

const drawFace = () => {
    ctx.beginPath();
    ctx.arc(faceX, faceY, faceRadius, Math.PI*2.2 , Math.PI*1.8);
    ctx.lineTo(canvasStartX + faceRadius, faceY);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
};

const draw = () => {
    ctx.clearRect(canvasStartX, canvasStartY, canvas.width, canvas.height);
    ctx.fillStyle = '#66cccc';
    ctx.fillRect(canvasStartX, canvasStartY, canvasLength, canvasWidth);
    drawFace();
    drawPringleEngine();
    
    if (upPressed === true ) {
        if (faceY - faceSpeed > canvasStartY + faceRadius) {
            faceY -= faceSpeed;
            assignFaceYValues();
        }
    }
    else if (downPressed === true ) {
        if (faceY + faceSpeed < canvasWidth - faceRadius) {
            faceY += faceSpeed;
            assignFaceYValues();
        } 
    }

    if (animateAgain) {
        requestAnimationFrame(draw);
    }
};

const assignFaceYValues = () => {
    faceUpperYValue =  faceY + faceRadius;
    faceLowerYValue = faceY - faceRadius;
};

const toggleStartScreen = () => {
    startScreen.remove();
    scoreComponent.classList.toggle('show-score');
    timeAtBeginningOfGame = Date.now();
    lastPringleSpawnTime = Date.now(); 
    backgroundMusic.play();
    requestID = requestAnimationFrame(draw);
};


document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
playAgainButton.addEventListener('click', toggleModal);
playButton.addEventListener('click', toggleStartScreen);
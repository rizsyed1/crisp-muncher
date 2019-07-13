const { createCanvas, loadImage } = require('canvas');
const canvas = createCanvas(520, 320);
const ctx = canvas.getContext('2d');

// canvas values
let canvasLength = 520;
let canvasWidth = 320; 
let canvasStartX = 0;
let canvasStartY = 0;

// pringle values
let pringleHeight, pringleWidth, pringleStartingXValue, pringleCurrentXValue, pringleSpeed;
let pringleYValue = canvasWidth/2; 

// score value
let score;

ctx.fillStyle = '#66cccc';
ctx.fillRect(canvasStartX, canvasStartY, 520, 320);

// upPressed and downPressed booleans 
let upPressed, downPressed;

// Face values
let faceRadius, faceY, faceSpeed;
let faceX = canvasStartX + faceRadius;

// Face range values
let faceLowerYValue, faceUpperYValue;

//pringle range values 
let pringleUpperYValue = pringleYValue + pringleHeight;
let pringleLowerYValue = pringleYValue;
let pringleLowerYValueInFaceRange = faceLowerYValue <= pringleLowerYValue && pringleLowerYValue <= faceUpperYValue;
let pringleUpperYValueInFaceRange = faceLowerYValue <= pringleUpperYValue && pringleUpperYValue <= faceUpperYValue;

// JSDom does not support audio playback
window.HTMLMediaElement.prototype.play = () => { /* do nothing */ };

document.body.innerHTML =	
    `<span id='score' class='score'>Score: <span id='scoreNumber' class='scoreNumber'>0</span></span>
    <canvas id="canvas" width="520" height="320"></canvas>	
    <script src="main.js"></script>
    <div id='modal' class='modal'>
    <div class='modal-content'>
    <button class='play-again-button'></span>
        <h1>Play Again</h1>
    </div>
    </div>`


let modal = document.getElementById('modal');
let sound = document.createElement('audio') ; 

let functions = require('./main.js')

const generatePringleSpawnValue = jest.fn(() => {
    pringleYValue = Math.floor( Math.random() * (canvasWidth - pringleHeight) );
    pringleUpperYValue = pringleYValue + pringleHeight;
    pringleLowerYValue = pringleYValue;
})

const keyDownHandler = jest.fn(e => {
    if (e.keyCode === 38) {
        upPressed = true; 
    }
    else if (e.keyCode === 40) {
        downPressed = true;
    }
})

const keyUpHandler = jest.fn(e => {
    if (e.keyCode === 38) {
        upPressed = false;
    }
    else if (e.keyCode === 40) {
        downPressed = false;
    }
});

const playCollisionSound = jest.fn(() => {
    sound.setAttribute('preload', 'auto');
    sound.setAttribute('controls', 'none');
    sound.style.display = 'none'; 
    document.body.appendChild(sound);
    sound.play();
});
 
const collision = jest.fn( async() => {
    console.log('collision() reached');
    incrementScore();
    pringleSpeed += 0.3;
    if (faceRadius >= 7){
        faceRadius -= 0.3
    }
    await playCollisionSound();
    pringleCurrentXValue = pringleStartingXValue;
    generatePringleSpawnValue();
});

const incrementScore = jest.fn(() => {
    score += 1;
    let oldScore = document.getElementById('scoreNumber');
    oldScore.textContent = score;
});

const updateIfPringleYValuesInFaceRange = jest.fn(() => {
    pringleLowerYValueInFaceRange = faceLowerYValue <= pringleLowerYValue && pringleLowerYValue <= faceUpperYValue;
    pringleUpperYValueInFaceRange = faceLowerYValue <= pringleUpperYValue && pringleUpperYValue <= faceUpperYValue;
})

const drawPringleEngine = jest.fn(async () => {
    return loadImage('pringle.png')
    .then(
        img => {
            return new Promise(res => {
                setTimeout( () => res(img), 1000);
            })
        }
    )    
    .then( 
        async img => {
            if (pringleCurrentXValue > canvasStartX) {
                if (pringleCurrentXValue <= faceX + faceRadius && (pringleLowerYValueInFaceRange || pringleUpperYValueInFaceRange) ) {
                    console
                    collision()
        
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
    )
})

const toggleModal = jest.fn(() => {
    modal.classList.toggle('show-modal');
    if (modal.className === 'modal') {
        document.location.reload();
    }
});

const draw = jest.fn(async () => {
    drawFace();
    await drawPringleEngine()
    if (upPressed === true) {
        if (faceY - faceSpeed > canvasStartY + faceRadius ) {
            faceY -= faceSpeed;
        }
    }
    else if (downPressed === true) {
        if (faceY + faceSpeed < canvasWidth - faceRadius) {
            faceY += faceSpeed;
        }
    }
})


const drawFace = jest.fn(() => {
    ctx.beginPath();
    ctx.arc(30, faceY, faceRadius, Math.PI*2.2 , Math.PI*1.8);
    ctx.lineTo(30, faceY);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
});

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

beforeEach(() => {
    // values
    faceY = 155;
    faceRadius = 20;
    faceX = canvasStartX + faceRadius;
    faceSpeed = 10;
    faceUpperYValue = faceY + faceRadius;
    faceLowerYValue = faceY - faceRadius;
    upPressed = false;
    downPressed = false;  
    pringleHeight = 20;
    pringleWidth = 50;
    pringleStartingXValue = canvasLength + 60;
    pringleCurrentXValue = canvasLength + 60;
    pringleSpeed = 5;
    score = 0;
});

test ('pressing the up arrow moves the face up & letting go of up arrow key leaves face in position', async () => {
    let event = new KeyboardEvent('keydown', {keyCode: 38});
    document.dispatchEvent(event);
    await draw();
    let event2 = new KeyboardEvent('keyup', {keyCode: 38});
    document.dispatchEvent(event2);
    await draw();
    expect(faceY).toBe(145);
});

test ('face will not move beyond top canvas border', async () => {
    faceY = 5;
    let event = new KeyboardEvent('keydown', {keyCode: 38});
    document.dispatchEvent(event); 
    await draw();
    expect(faceY).toBe(5);
});

test('pressing the down arrow key moves the face down & letting go of down arrow key leaves face in position', async () => {
    let event = new KeyboardEvent('keydown', {keyCode: 40});
    document.dispatchEvent(event);
    await draw();
    let event2 = new KeyboardEvent('keyup', {keyCode: 40});
    document.dispatchEvent(event2); 
    await draw();
    expect(faceY).toBe(165);
});

test('the pringle moves towards the face', async () => {
  await draw();
  expect(pringleCurrentXValue).toBeLessThan(pringleStartingXValue);
});

test('the modal appears when the pringle passes the face', async () => {
    pringleCurrentXValue = 0;   
    await draw();
    expect(modal.className).toBe('modal show-modal');
});

test('a munch sound plays when the pringle collides with the face', async () => {
    pringleCurrentXValue = faceX;
    pringleUpperYValue = faceY;
    updateIfPringleYValuesInFaceRange();
    await draw();
    expect(playCollisionSound).toHaveBeenCalled();
})

test('pringle speed increases after collision', async () => {
    pringleCurrentXValue = faceX;
    pringleUpperYValue = faceY;
    updateIfPringleYValuesInFaceRange()
    await draw();
    expect(pringleSpeed).toBe(5.3);
})

test('pringle radius decreases after collision', async () => {
    pringleCurrentXValue = faceX;
    pringleUpperYValue = faceY;
    updateIfPringleYValuesInFaceRange();
    await draw();
    expect(faceRadius).toBe(19.7);
});

test('score increments upon collision', async () => {
    score = 1;
    pringleCurrentXValue = faceX;
    pringleUpperYValue = faceY;
    updateIfPringleYValuesInFaceRange();
    await draw();
    let scoreNumber = document.getElementById('scoreNumber').textContent;
    expect(scoreNumber).toBe('2');
});

let faceRadius, faceY, dFaceY, upPressed, downPressed 
const { createCanvas, loadImage } = require('canvas')
const canvas = createCanvas(480, 320)
const ctx = canvas.getContext('2d');
faceRadius = 20;
let canvasLength = 480;
let canvasWidth = 320; 
let pringleHeight = 20;
let pringleWidth = 50;
let pringleStartingXValue = canvasLength - 60;
let pringleCurrentXValue = pringleStartingXValue;
let dPringle = 5;

ctx.fillStyle = '#66cccc';
ctx.fillRect(10, 10, 480, 320);

document.body.innerHTML =
    '<canvas id="canvas" width="480" height="320"></canvas>' +
    '<script src="main.js"></script>';

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

const draw = jest.fn(() => {
    drawFace();
    drawPringle();
    requestAnimationFrame(draw);

    if (upPressed === true) {
        if (faceY - dFaceY > 10 + faceRadius ) {
            faceY -= dFaceY
        }
    }
    else if (downPressed === true) {
        if (faceY + dFaceY < 320 - faceRadius) {
            faceY += dFaceY
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

const drawPringle = jest.fn(() => {
    loadImage('pringle.png').then((img) => {
        if (pringleCurrentXValue !== 10) {
            console.log('drawPringle() if option')
            ctx.drawImage(img, pringleCurrentXValue, canvasWidth/2, pringleWidth, pringleHeight)
            pringleCurrentXValue -= dPringle
        }
        else {
            console.log('drawPringle() else option')
            Object.defineProperty(window, 'alert', {
                configurable: true,
              });
            window.alert = jest.fn();

            alert('You lost. Start again')
            pringleCurrentXValue = 9;
            console.log(`in drawPringle(), pringleCurrentXValue is ${pringleCurrentXValue} after alert`)
        }
    })
})

beforeEach(() => {
    faceY = 155
    dFaceY = 10;
    upPressed = false;
    downPressed = false;   
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);
});

test ('pressing the up arrow key moves the face up & letting go of up arrow key leaves face in position', () => {
    let event = new KeyboardEvent('keydown', {keyCode: 38})
    document.dispatchEvent(event);
    draw();
    let event2 = new KeyboardEvent('keyup', {keyCode: 38})
    document.dispatchEvent(event2);
    draw();
    expect(faceY).toBe(145);
})

test ('face will not move beyond top canvas border', () => {
    faceY = 15;
    let event = new KeyboardEvent('keydown', {keyCode: 38});
    document.dispatchEvent(event); 
    draw()
    expect(faceY).toBe(15);
    
})

test('pressing the down arrow key moves the face down & letting go of down arrow key leaves face in position', () => {
    let event = new KeyboardEvent('keydown', {keyCode: 40})
    document.dispatchEvent(event);
    draw();
    let event2 = new KeyboardEvent('keyup', {keyCode: 40});
    document.dispatchEvent(event2); 
    draw();
    expect(faceY).toBe(165);
})

test ('the pringle moves towards the face', () => {
    draw() 
    expect(pringleCurrentXValue).toBeLessThan(pringleStartingXValue);
})

test('the user receives an loss alert if the pringle is missed', done => {
    jest.spyOn(window, 'alert');
    pringleCurrentXValue = 10
    console.log('accessing drawPringle()')
    
    drawPringle()
    expect(window.alert).toBeCalledTimes(1)
    
})
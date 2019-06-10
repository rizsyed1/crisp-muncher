let faceRadius, faceY, dFaceY, upPressed, downPressed 
const { createCanvas, loadImage } = require('canvas')
const canvas = createCanvas(480, 320)
const ctx = canvas.getContext('2d');
faceRadius = 20;
let canvasLength = 480;
let canvasWidth = 320; 
let pringleHeight = 20;
let pringleWidth = 50;

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
        ctx.drawImage(img, canvasLength - 60, canvasWidth/2, pringleWidth, pringleHeight)  
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
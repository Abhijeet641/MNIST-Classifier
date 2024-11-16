let model;


async function loadModel() {
    model = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mnist/v1/model.json');
    console.log("Model loaded!");
}

// Canvas setup for drawing
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

canvas.addEventListener('mousedown', () => (isDrawing = true));
canvas.addEventListener('mouseup', () => (isDrawing = false));
canvas.addEventListener('mousemove', draw);

function draw(event) {
    if (!isDrawing) return;
    ctx.fillStyle = 'black';
    ctx.fillRect(event.offsetX, event.offsetY, 8, 8); // Drawing size adjustment can be made here
}

// Clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('result').innerHTML = "Prediction: <strong>-</strong>";
    document.getElementById('accuracy').innerHTML = "Accuracy: <strong>-</strong>";
}

// Save the canvas as an image
function saveCanvas() {
    const link = document.createElement('a');
    link.download = 'digit-drawing.png';
    link.href = canvas.toDataURL();
    link.click();
}


async function predict() {
    if (!model) {
        alert('Model not loaded yet. Please wait.');
        return;
    }

   
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = tf.browser.fromPixels(imageData, 1); 
    data = tf.image.resizeBilinear(data, [28, 28]); 
    data = tf.expandDims(data, 0).div(255); 

   
    const predictions = model.predict(data);
    const predictedValue = tf.argMax(predictions, 1).dataSync()[0];


    document.getElementById('result').innerHTML = `Prediction: <strong>${predictedValue}</strong>`;
}


function predictAndCheck() {
    const expectedValue = document.getElementById('expectedValue').value;

    if (!expectedValue || isNaN(expectedValue) || expectedValue < 0 || expectedValue > 9) {
        alert('Please enter a valid expected value (0-9).');
        return;
    }

    
    predict();

    
    const predictedValue = parseInt(document.getElementById('result').innerText.split(': ')[1]);

    
    const accuracy = predictedValue === parseInt(expectedValue) ? 100 : 0;
    document.getElementById('accuracy').innerHTML = `Accuracy: <strong>${accuracy}%</strong>`;
}


window.onload = loadModel;


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

// Predict the digit
async function predict() {
    if (!model) {
        alert('Model not loaded yet. Please wait.');
        return;
    }

    // Preprocess the image drawn on the canvas
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = tf.browser.fromPixels(imageData, 1); // Convert to grayscale
    data = tf.image.resizeBilinear(data, [28, 28]); // Resize to 28x28 pixels (MNIST image size)
    data = tf.expandDims(data, 0).div(255); // Normalize and expand dimensions to fit the model

    // Get predictions from the model
    const predictions = model.predict(data);
    const predictedValue = tf.argMax(predictions, 1).dataSync()[0];

    // Update the result on the webpage
    document.getElementById('result').innerHTML = `Prediction: <strong>${predictedValue}</strong>`;
}

// Check Accuracy by comparing with the expected value
function predictAndCheck() {
    const expectedValue = document.getElementById('expectedValue').value;

    if (!expectedValue || isNaN(expectedValue) || expectedValue < 0 || expectedValue > 9) {
        alert('Please enter a valid expected value (0-9).');
        return;
    }

    // First, make the prediction
    predict();

    // Extract predicted value from the result section
    const predictedValue = parseInt(document.getElementById('result').innerText.split(': ')[1]);

    // Compare predicted value with the expected value and show accuracy
    const accuracy = predictedValue === parseInt(expectedValue) ? 100 : 0;
    document.getElementById('accuracy').innerHTML = `Accuracy: <strong>${accuracy}%</strong>`;
}

// Load the model when the page is loaded
window.onload = loadModel;


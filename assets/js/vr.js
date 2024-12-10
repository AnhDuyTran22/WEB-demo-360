const canvas = document.getElementById('vrCanvas');
const ctx = canvas.getContext('2d');
const imageSelector = document.getElementById('imageSelector');
const autoRotateBtn = document.getElementById('autoRotateBtn');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isDragging = false;
let startX = 0;
let currentAngle = 0;
let isAutoRotating = false;
let autoRotateInterval;

const img = new Image();
let currentImageIndex = 0;

img.src = imageSelector.value;
img.onload = () => {
    drawScene();
};

function drawScene() {
    const imgWidth = img.width;
    const imgHeight = img.height;
    const xOffset = (currentAngle % imgWidth + imgWidth) % imgWidth;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(img, xOffset, 0, imgWidth - xOffset, imgHeight, 0, 0, canvas.width * (imgWidth - xOffset) / imgWidth, canvas.height);

    if (xOffset > 0) {
        ctx.drawImage(img, 0, 0, xOffset, imgHeight, canvas.width * (imgWidth - xOffset) / imgWidth, 0, canvas.width * xOffset / imgWidth, canvas.height);
    }
}

canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    stopAutoRotate();
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    startX = e.clientX;
    currentAngle -= deltaX;
    drawScene();
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
    if (isAutoRotating) startAutoRotate();
});

canvas.addEventListener('mouseleave', () => {
    isDragging = false;
});

canvas.addEventListener('click', () => {
    const options = imageSelector.options;
    currentImageIndex = (currentImageIndex + 1) % options.length;
    const nextImage = options[currentImageIndex].value;
    imageSelector.value = nextImage;
    img.src = nextImage;
    stopAutoRotate();
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawScene();
});

imageSelector.addEventListener('change', (e) => {
    currentImageIndex = Array.from(imageSelector.options).findIndex(option => option.value === e.target.value);
    img.src = e.target.value;
    stopAutoRotate();
});

autoRotateBtn.addEventListener('click', () => {
    isAutoRotating = !isAutoRotating;
    if (isAutoRotating) {
        autoRotateBtn.textContent = "Stop Auto Rotate";
        startAutoRotate();
    } else {
        autoRotateBtn.textContent = "Start Auto Rotate";
        stopAutoRotate();
    }
});

function startAutoRotate() {
    autoRotateInterval = setInterval(() => {
        currentAngle -= 1;
        drawScene();
    }, 16);
}

function stopAutoRotate() {
    clearInterval(autoRotateInterval);
}

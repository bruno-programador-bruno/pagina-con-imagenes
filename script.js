const container = document.getElementById('container');
let isDragging = false;
let dragImage = null;
let offsetX, offsetY;

// Load saved images from localStorage
document.addEventListener("DOMContentLoaded", () => {
    const savedImages = JSON.parse(localStorage.getItem('images')) || [];
    savedImages.forEach(imgData => {
        createImage(imgData.src, imgData.x, imgData.y);
    });
});

// Paste image functionality
document.addEventListener('paste', function (e) {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            const reader = new FileReader();
            reader.onload = function (event) {
                createImage(event.target.result, 50, 50);
                saveImages();
            };
            reader.readAsDataURL(blob);
        }
    }
});

// Create and append image element
function createImage(src, x, y) {
    const img = document.createElement('img');
    img.src = src;
    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
    container.appendChild(img);

    img.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragImage = img;
        offsetX = e.clientX - img.getBoundingClientRect().left;
        offsetY = e.clientY - img.getBoundingClientRect().top;
    });

    img.addEventListener('mouseup', () => {
        isDragging = false;
        dragImage = null;
        saveImages();
    });
}

// Drag functionality
document.addEventListener('mousemove', (e) => {
    if (isDragging && dragImage) {
        dragImage.style.left = `${e.clientX - offsetX}px`;
        dragImage.style.top = `${e.clientY - offsetY}px`;
    }
});

// Save images positions and sources
function saveImages() {
    const images = [...document.querySelectorAll('img')].map(img => ({
        src: img.src,
        x: parseInt(img.style.left),
        y: parseInt(img.style.top)
    }));
    localStorage.setItem('images', JSON.stringify(images));
}

// Clear images when the page is closed
window.addEventListener('beforeunload', saveImages);

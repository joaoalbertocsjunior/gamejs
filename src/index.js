const Phaser = require('phaser');

const gameWidth = window.innerWidth; // Set your desired game width here
const gameHeight = window.innerHeight; // Set your desired game height here
const cols = 15;
const rows = 15;
let tileSize;

let game;
let tileGraphicsArray = [];
let resizeTimeout;

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'game-container',
        autoCenter: Phaser.Scale.CENTER_BOTH, // Center the canvas and content in the parent container
        width: gameWidth,
        height: gameHeight,
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

game = new Phaser.Game(config);

let yellowCellRow = Math.floor(rows / 2);
let yellowCellCol = Math.floor(cols / 2);

function preload() {
    // Load your assets here (e.g., images, sounds, etc.)
}

function create() {
    // Create the initial tile map using the current tileSize value
    calculateTileSize();
    createTileMap();

    // Listen to the "resize" event on the window object
    window.addEventListener('resize', handleResize);

    // Add keyboard input handling for arrow keys
    this.input.keyboard.on('keydown', handleKeyPress);
}

function deleteTileGraphics() {
    tileGraphicsArray.forEach((graphics) => {
        graphics.destroy();
    });
    tileGraphicsArray = [];
}

function update() {
    // Add your game logic to be executed on each frame here
}

function handleKeyPress(event) {
    switch (event.code) {
        case 'ArrowUp':
            moveYellowCell(yellowCellRow - 1, yellowCellCol);
            break;
        case 'ArrowDown':
            moveYellowCell(yellowCellRow + 1, yellowCellCol);
            break;
        case 'ArrowLeft':
            moveYellowCell(yellowCellRow, yellowCellCol - 1);
            break;
        case 'ArrowRight':
            moveYellowCell(yellowCellRow, yellowCellCol + 1);
            break;
    }
}

function moveYellowCell(newRow, newCol) {
    // Check if the new position is within the grid bounds
    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        // Clear the previous yellow cell
        const previousYellowCell = tileGraphicsArray.find(
            (graphics) => graphics.cellRow === yellowCellRow && graphics.cellCol === yellowCellCol
        );
        previousYellowCell.fillStyle(0xffffff, 1);
        previousYellowCell.fillRect(
            previousYellowCell.cellX,
            previousYellowCell.cellY,
            tileSize,
            tileSize
        );

        // Update the yellow cell position
        yellowCellRow = newRow;
        yellowCellCol = newCol;

        // Draw the new yellow cell
        const newYellowCell = tileGraphicsArray.find(
            (graphics) => graphics.cellRow === yellowCellRow && graphics.cellCol === yellowCellCol
        );
        newYellowCell.fillStyle(0xffff00, 1);
        newYellowCell.fillRect(newYellowCell.cellX, newYellowCell.cellY, tileSize, tileSize);
    }
}

function handleResize() {
    // Clear the current resize timeout
    clearTimeout(resizeTimeout);

    // Set a new resize timeout to avoid rapid resizing
    resizeTimeout = setTimeout(() => {
        // Clear the current tile map graphics
        deleteTileGraphics();

        // Recalculate the tileSize and recreate the updated tile map
        calculateTileSize();
        createTileMap();
    }, 100); // Delay of 100ms before resizing to ensure smooth scaling
}

function calculateTileSize() {
    const tileWidth = game.scale.width / cols;
    const tileHeight = game.scale.height / rows;
    tileSize = Math.min(tileWidth, tileHeight);
}

function createTileMap() {
    // Center the tilemap both horizontally and vertically
    const offsetX = (game.scale.width - cols * tileSize) / 2;
    const offsetY = (game.scale.height - rows * tileSize) / 2;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = offsetX + col * tileSize;
            const y = offsetY + row * tileSize;

            const graphics = game.scene.scenes[0].add.graphics();
            graphics.lineStyle(2, 0xffffff, 1);
            graphics.cellRow = row; // Store the cell row for easy reference
            graphics.cellCol = col; // Store the cell column for easy reference
            graphics.cellX = x; // Store the cell x position for easy reference
            graphics.cellY = y; // Store the cell y position for easy reference

            // Check if it's the middle cell and set it as yellow
            if (row === yellowCellRow && col === yellowCellCol) {
                graphics.fillStyle(0xffff00, 1);
                graphics.fillRect(x, y, tileSize, tileSize);
            } else {
                graphics.strokeRect(x, y, tileSize, tileSize);
            }

            graphics.setDepth(1);
            tileGraphicsArray.push(graphics);
        }
    }
}
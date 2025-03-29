# Multiplayer Tic-Tac-Toe

A real-time multiplayer Tic-Tac-Toe game built with Node.js, Express, Socket.IO, and Phaser.

## Features

- Local 2-player mode on the same computer
- Online multiplayer mode with real-time updates
- Beautiful UI built with Phaser
- Automatic turn management
- Win/draw detection
- Player disconnection handling

## Prerequisites

- Node.js (v12.0.0 or higher)
- npm (comes with Node.js)

## Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:
```bash
npm install
```

## Running the Game

### Production Mode
```bash
npm start
```

### Development Mode
```bash
npm run dev
```
Development mode uses nodemon to automatically restart the server when you make changes to the code.

### Accessing the Game
1. Open your web browser and navigate to:
```
http://localhost:3000
```

3. To play multiplayer:
   - Open the game in two different browser windows
   - First player to connect will be "X"
   - Second player to connect will be "O"
   - Game starts automatically when both players are connected

## How to Play

1. Wait for another player to join
2. When it's your turn, click on any empty cell to place your marker (X or O)
3. First player to get three in a row (horizontally, vertically, or diagonally) wins
4. If all cells are filled and no player has won, the game is a draw

## Technical Details

- Backend: Node.js with Express and Socket.IO
- Frontend: HTML5, JavaScript, Phaser 3
- Real-time communication via WebSocket (Socket.IO)
- Game state managed server-side
- Responsive design that works on both desktop and mobile browsers 
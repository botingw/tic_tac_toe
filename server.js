const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// Serve static files from the current directory
app.use(express.static(__dirname));

// Game state
let gameState = {
    board: Array(9).fill(''),  // 3x3 board represented as 1D array
    currentPlayer: 'X',
    status: 'waiting',  // waiting, ongoing, won, draw
    players: {
        X: null,
        O: null
    },
    readyToRestart: {
        X: false,
        O: false
    }
};

// Win conditions (indices)
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
    [0, 4, 8], [2, 4, 6]              // Diagonals
];

// Check for win
function checkWin(board, player) {
    return winConditions.some(condition => 
        condition.every(index => board[index] === player)
    );
}

// Check for draw
function checkDraw(board) {
    return board.every(cell => cell !== '');
}

// Reset game
function resetGame() {
    gameState.board = Array(9).fill('');
    gameState.currentPlayer = 'X';
    gameState.status = 'ongoing';
    gameState.readyToRestart = { X: false, O: false };
    io.emit('game-state', gameState);
}

// Reset everything (including players)
function resetEverything() {
    gameState.board = Array(9).fill('');
    gameState.currentPlayer = 'X';
    gameState.status = 'waiting';
    gameState.players = { X: null, O: null };
    gameState.readyToRestart = { X: false, O: false };
}

function setupSocketIO(io) {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Assign player (X or O)
        if (!gameState.players.X) {
            gameState.players.X = socket.id;
            socket.emit('player-assignment', 'X');
        } else if (!gameState.players.O) {
            gameState.players.O = socket.id;
            socket.emit('player-assignment', 'O');
            gameState.status = 'ongoing';
            io.emit('game-start');
        } else {
            socket.emit('game-full');
            return;
        }

        // Update all clients with current game state
        io.emit('game-state', gameState);

        // Handle play again request
        socket.on('play-again', () => {
            const player = Object.entries(gameState.players)
                .find(([_, id]) => id === socket.id)?.[0];
            
            if (player) {
                gameState.readyToRestart[player] = true;
                
                // If both players are ready, reset the game
                if (gameState.readyToRestart.X && gameState.readyToRestart.O) {
                    resetGame();
                } else {
                    // Notify other player that this player is ready to restart
                    io.emit('player-ready-restart', player);
                }
            }
        });

        // Handle moves
        socket.on('make-move', (position) => {
            const player = Object.entries(gameState.players)
                .find(([_, id]) => id === socket.id)?.[0];

            if (!player || 
                gameState.status !== 'ongoing' || 
                gameState.currentPlayer !== player || 
                gameState.board[position] !== '' || 
                position < 0 || 
                position > 8) {
                return;
            }

            // Update board
            gameState.board[position] = player;

            // Check win/draw conditions
            if (checkWin(gameState.board, player)) {
                gameState.status = 'won';
                io.emit('game-over', { winner: player });
            } else if (checkDraw(gameState.board)) {
                gameState.status = 'draw';
                io.emit('game-over', { winner: null });
            } else {
                // Switch turns
                gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
            }

            // Broadcast updated game state
            io.emit('game-state', gameState);
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            if (socket.id === gameState.players.X || socket.id === gameState.players.O) {
                resetEverything();
                io.emit('player-disconnected');
            }
        });
    });
}

// Setup Socket.IO
setupSocketIO(io);

// Export functions for testing
module.exports = {
    checkWin,
    checkDraw,
    setupSocketIO
};

// Start server if running directly
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    http.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
} 
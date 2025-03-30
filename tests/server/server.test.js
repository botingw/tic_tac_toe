const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');
const express = require('express');
const { setupSocketIO, checkWin, checkDraw } = require('../../server');

describe('Server Functionality', () => {
  let io, clientSocket, httpServer;
  const port = 3001;

  beforeAll((done) => {
    const app = express();
    httpServer = createServer(app);
    io = new Server(httpServer);
    setupSocketIO(io);
    
    httpServer.listen(port, () => {
      done();
    });
  });

  beforeEach((done) => {
    // Reset any existing connections
    if (clientSocket && clientSocket.connected) {
      clientSocket.disconnect();
    }
    
    // Create new client with explicit configuration
    clientSocket = new Client(`http://localhost:${port}`, {
      transports: ['websocket'],
      reconnection: false,
      forceNew: true,
      autoConnect: false
    });

    // Connect manually after setup
    clientSocket.connect();
    
    clientSocket.on('connect', () => {
      done();
    });
  });

  afterEach((done) => {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
    done();
  });

  afterAll((done) => {
    if (httpServer.listening) {
      httpServer.close(() => {
        io.close();
        done();
      });
    } else {
      done();
    }
  });

  describe('Player Connection', () => {
    test('should assign first player as X', (done) => {
      // Listen for player assignment before anything else
      clientSocket.once('player-assignment', (player) => {
        try {
          expect(player).toBe('X');
          done();
        } catch (err) {
          done(err);
        }
      });
    });

    test('should assign second player as O', (done) => {
      // Create second client with explicit configuration
      const secondClient = new Client(`http://localhost:${port}`, {
        transports: ['websocket'],
        reconnection: false,
        forceNew: true,
        autoConnect: false
      });

      // Connect second client
      secondClient.connect();

      secondClient.once('player-assignment', (player) => {
        try {
          expect(player).toBe('O');
          secondClient.disconnect();
          done();
        } catch (err) {
          secondClient.disconnect();
          done(err);
        }
      });
    });

    test('should notify when game is full', (done) => {
      // Create two more clients to fill the game
      const client2 = new Client(`http://localhost:${port}`, {
        transports: ['websocket'],
        reconnection: false,
        forceNew: true,
        autoConnect: false
      });

      const client3 = new Client(`http://localhost:${port}`, {
        transports: ['websocket'],
        reconnection: false,
        forceNew: true,
        autoConnect: false
      });

      // Connect clients in sequence
      client2.connect();
      client2.once('player-assignment', () => {
        client3.connect();
        client3.once('game-full', () => {
          client2.disconnect();
          client3.disconnect();
          done();
        });
      });
    });
  });

  describe('Game State Management', () => {
    test('should emit game state on connection', (done) => {
      // Listen for game state immediately after connection
      clientSocket.once('game-state', (state) => {
        try {
          expect(state).toHaveProperty('board');
          expect(state).toHaveProperty('currentPlayer');
          expect(state).toHaveProperty('status');
          expect(state).toHaveProperty('players');
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  describe('Move Handling', () => {
    test('should handle valid moves', (done) => {
      // First wait for player assignment
      clientSocket.once('player-assignment', () => {
        // Then wait a bit before making the move
        setTimeout(() => {
          clientSocket.emit('make-move', 0);
          
          // Listen for game state update
          clientSocket.once('game-state', (state) => {
            try {
              expect(state.board[0]).toBe('X');
              done();
            } catch (err) {
              done(err);
            }
          });
        }, 100);
      });
    });
  });
});

describe('Server Functionality - Basic Tests', () => {
  // Skip the Socket.IO tests for now
  describe('Game Logic Tests', () => {
    test('should verify win detection - horizontal', () => {
      const board = ['X', 'X', 'X', '', '', '', '', '', ''];
      expect(checkWin(board, 'X')).toBe(true);
    });

    test('should verify win detection - vertical', () => {
      const board = ['X', '', '', 'X', '', '', 'X', '', ''];
      expect(checkWin(board, 'X')).toBe(true);
    });

    test('should verify win detection - diagonal', () => {
      const board = ['X', '', '', '', 'X', '', '', '', 'X'];
      expect(checkWin(board, 'X')).toBe(true);
    });

    test('should verify draw detection', () => {
      const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
      expect(checkDraw(board)).toBe(true);
    });
  });
}); 
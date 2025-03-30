const { checkWin, checkDraw } = require('../../server');

describe('Game Logic Tests', () => {
  describe('checkWin', () => {
    it('should detect horizontal win', () => {
      const board = ['X', 'X', 'X', '', '', '', '', '', ''];
      expect(checkWin(board, 'X')).toBe(true);
    });

    it('should detect vertical win', () => {
      const board = ['O', '', '', 'O', '', '', 'O', '', ''];
      expect(checkWin(board, 'O')).toBe(true);
    });

    it('should detect diagonal win', () => {
      const board = ['X', '', '', '', 'X', '', '', '', 'X'];
      expect(checkWin(board, 'X')).toBe(true);
    });

    it('should return false for no win', () => {
      const board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
      expect(checkWin(board, 'X')).toBe(false);
      expect(checkWin(board, 'O')).toBe(false);
    });
  });

  describe('checkDraw', () => {
    it('should detect a draw when board is full', () => {
      const board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
      expect(checkDraw(board)).toBe(true);
    });

    it('should return false when board has empty cells', () => {
      const board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', '', 'O'];
      expect(checkDraw(board)).toBe(false);
    });

    it('should return false for empty board', () => {
      const board = Array(9).fill('');
      expect(checkDraw(board)).toBe(false);
    });
  });
}); 
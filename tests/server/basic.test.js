const { checkWin, checkDraw } = require('../../server');

describe('Basic Server Logic Tests', () => {
  test('checkWin identifies horizontal win', () => {
    const board = ['X', 'X', 'X', '', '', '', '', '', ''];
    expect(checkWin(board, 'X')).toBe(true);
  });

  test('checkWin identifies vertical win', () => {
    const board = ['X', '', '', 'X', '', '', 'X', '', ''];
    expect(checkWin(board, 'X')).toBe(true);
  });

  test('checkWin identifies diagonal win', () => {
    const board = ['X', '', '', '', 'X', '', '', '', 'X'];
    expect(checkWin(board, 'X')).toBe(true);
  });

  test('checkDraw identifies full board with no winner', () => {
    const board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
    expect(checkDraw(board)).toBe(true);
  });
}); 
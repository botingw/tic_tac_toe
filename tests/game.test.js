const GameManager = {
  checkWinner: (board) => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return board.includes('') ? null : 'draw';
  }
};

describe('Tic-Tac-Toe Game Logic', () => {
  describe('checkWinner', () => {
    it('should detect horizontal win', () => {
      const board = ['X', 'X', 'X', '', '', '', '', '', ''];
      expect(GameManager.checkWinner(board)).toBe('X');
    });

    it('should detect vertical win', () => {
      const board = ['O', '', '', 'O', '', '', 'O', '', ''];
      expect(GameManager.checkWinner(board)).toBe('O');
    });

    it('should detect diagonal win', () => {
      const board = ['X', '', '', '', 'X', '', '', '', 'X'];
      expect(GameManager.checkWinner(board)).toBe('X');
    });

    it('should detect draw', () => {
      const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
      expect(GameManager.checkWinner(board)).toBe('draw');
    });

    it('should return null for ongoing game', () => {
      const board = ['X', '', '', '', 'O', '', '', '', ''];
      expect(GameManager.checkWinner(board)).toBe(null);
    });
  });
}); 
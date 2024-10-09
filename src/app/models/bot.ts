import { botFirstMove } from './bot-first-move.type';
import { Cell } from './cell';
import { Game } from './game';

export class Bot {

  constructor(private readonly firstMove: botFirstMove = 'center') { }

  async getClaim(game: Game): Promise<Cell> {
    if (game.moves.length === 9)
      switch (this.firstMove) {
        case 'center':
          return game.moves.filter(cell => cell.x === 1 && cell.y === 1)[0];
        case 'corner':
          const cornerMoves = game.moves.filter(cell => cell.x !== 1 && cell.y !== 1);
          return cornerMoves[Math.floor(Math.random() * cornerMoves.length)];
        case 'adjacent':
          const adjacentMoves = game.moves.filter(cell => [1, 3].includes(cell.x + cell.y));
          return adjacentMoves[Math.floor(Math.random() * adjacentMoves.length)];
      }

    if (game.moves.length === 8) {
      const centerMove = game.moves.find(cell => cell.x === 1 && cell.y === 1);
      const cornerMoves = game.moves.filter(cell => cell.x !== 1 && cell.y !== 1);
      return centerMove !== undefined
        ? centerMove
        : cornerMoves[Math.floor(Math.random() * cornerMoves.length)];
    }

    const scores = await this.scores(game, game.turn === 'x' ? 'o' : 'x');

    let maxScoreIndex = 0;
    for (let i = 1; i < scores.length; i++)
      maxScoreIndex = scores[maxScoreIndex] > scores[i] ? maxScoreIndex : i;

    const maxScoreIndexes = scores
      .map((score, index) => score === scores[maxScoreIndex] ? index : -1)
      .filter(score => score !== -1);

    return game.moves[maxScoreIndexes[Math.floor(Math.random() * maxScoreIndexes.length)]];
  }

  private async scores(game: Game, turn: 'x' | 'o', depth = 0): Promise<number[]> {
    return Promise.all(game.moves.map(async move => {
      const gridCopy = JSON.parse(JSON.stringify(game.grid));
      const gameCopy = new Game(gridCopy, turn);

      if (gameCopy.win(move.x, move.y))
        return gameCopy.turn === turn
          ? (100 - depth)
          : (-100 + depth);

      if (gameCopy.areNoMovesRemaining)
        return 0;

      const newScores = await this.scores(gameCopy, turn, depth + 1);

      return gameCopy.turn === turn
        ? Math.max(...newScores)
        : Math.min(...newScores);
    }));
  }
}

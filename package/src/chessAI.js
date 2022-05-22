import {
  BLACK,
  WHITE,
  Coefficients,
  endGameValue,
  TT_UPPER,
  TT_EXACT,
  TT_LOWER,
  SQUARE_WEIGHT_TABLES,
  pieceCode,
  DEFAULT_FEN,
} from "@/constants/chess";
import ChessGame from "./chessGame";
import { TranspositionTable } from "./transpositionTable";

export default class ChessAI {
  positionCount = 0;
  cutOff = 0;
  quiesceCount = 0;
  transpositionNum = 0;
  bestEval = null;

  constructor({ type = "normal", depth = 1 }) {
    this.type = type;
    this.depth = depth;
    this.transpositionTable = new TranspositionTable(this.game);
    this.bestMove = null;
  }

  selectMove(fen, options) {
    const type = options?.type || this.type;
    const depth = options?.depth || this.depth;
    console.log(depth);
    if (fen) this.game = new ChessGame(fen);
    else return null;

    if (type === "random") return this.selectRandomMove(game.uglyMoves);

    if (type === "normal") {
      if (options?.debug) this.resetDebug();

      this.bestMove = null;
      this.search(
        depth,
        Number.NEGATIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        this.game
      );

      if (options?.debug) this.logDebug();

      return this.bestMove.pretty;
    }
  }

  resetDebug() {
    this.positionCount = 0;
    this.quiesceCount = 0;
    this.cutOff = 0;
    this.transpositionNum = 0;
    this.bestEval = null;
  }

  logDebug() {
    console.log("*************************");
    console.log("eval: ", this.bestEval);
    console.log("searched position: ", this.positionCount);
    console.log("cut off count: ", this.cutOff);
    console.log("quiesce count: ", this.quiesceCount);
    console.log(
      "transposition count: ",
      this.transpositionNum,
      Object.keys(this.transpositionTable.hashes).length
    );
  }

  selectRandomMove(moves) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  search(depth, alpha, beta, game, root = 0) {
    if (root > 0 && game.hashHistory.includes(game.zobrist.hash)) return 0;

    const storedHash = this.transpositionTable.getStoredHash(
      {
        depth: depth,
        alpha: alpha,
        beta: beta,
      },
      game
    );

    if (storedHash !== null) {
      this.transpositionNum++;
      if (root === 0) this.bestMove = storedHash.move;
      return storedHash.score;
    }

    if (depth === 0) {
      this.positionCount++;
      return this.quiesce(alpha, beta, game);
    }

    const moves = game.generateMoves();
    if (moves.length === 0) {
      if (game.inCheck()) {
        return Number.NEGATIVE_INFINITY;
      }
      return 0;
    }

    let tt_type = TT_UPPER;
    let bestMove;
    moves.sort((a, b) => b.score - a.score);

    for (const move of moves) {
      game.makeUglyMove(move);
      let evaluation = -this.search(depth - 1, -beta, -alpha, game, root + 1);
      game.undoUglyMove();

      if (evaluation >= beta) {
        this.cutOff++;
        this.transpositionTable.addEvaluation(
          {
            depth,
            move,
            score: beta,
            type: TT_LOWER,
          },
          game
        );
        return beta;
      }

      if (evaluation > alpha) {
        tt_type = TT_EXACT;
        alpha = evaluation;
        bestMove = move;

        if (root === 0) {
          this.bestEval = alpha;
          this.bestMove = bestMove;
        }
      }
    }

    this.transpositionTable.addEvaluation(
      {
        depth,
        move: bestMove,
        score: alpha,
        type: tt_type,
      },
      game
    );

    return alpha;
  }

  quiesce(alpha, beta, game) {
    this.quiesceCount++;
    const stand_pat = this.evaluate(game);

    if (stand_pat >= beta) return beta;

    if (alpha < stand_pat) alpha = stand_pat;

    const captureMoves = game.generateMoves({ onlyCapture: true });
    captureMoves.sort((a, b) => b.score - a.score);

    for (const move of captureMoves) {
      game.makeUglyMove(move);
      const score = -this.quiesce(-beta, -alpha, game);
      game.undoUglyMove();

      if (score >= beta) return beta;
      if (score > alpha) alpha = score;
    }
    return alpha;
  }

  getEndGameWeight(notPawnCount) {
    return 1 - Math.min(1, notPawnCount * (1 / endGameValue));
  }

  endGameEval(
    friendlyKing,
    opponentKing,
    friendlyNotPawnMaterial,
    endGameWeight
  ) {
    let evaluation = 0;

    const { x: opponentKingX, y: opponentKingY } = opponentKing.position;

    const opponentDestDiffX = Math.max(3 - opponentKingX, opponentKingX - 4);
    const opponentDestDiffY = Math.max(3 - opponentKingY, opponentKingY - 4);
    const opponentDestDiff = opponentDestDiffX + opponentDestDiffY;
    evaluation += opponentDestDiff;

    const { x: friendKingX, y: friendKingY } = friendlyKing.position;
    const betweenDestX = Math.abs(friendKingX - opponentKingX);
    const betweenDestY = Math.abs(friendKingY - opponentKingY);
    const betweenDest = betweenDestX + betweenDestY;
    evaluation += 14 - betweenDest;

    return evaluation * 10 * endGameWeight;
  }

  evaluate(_game) {
    const game = this.game || _game;
    const board = game.board;
    const kings = board.kings;
    let whiteEval = 0;
    let blackEval = 0;

    const whiteMaterial = this.getColorMaterial(WHITE, board);
    const blackMaterial = this.getColorMaterial(BLACK, board);
    whiteEval += whiteMaterial;
    blackEval += blackMaterial;

    const whiteNotPawnMaterial =
      whiteMaterial - board.getColorNotPawnNum(WHITE) * Coefficients.p;
    const blackNotPawnMaterial =
      blackMaterial - board.getColorNotPawnNum(BLACK) * Coefficients.p;

    const whiteEndGameWeight = this.getEndGameWeight(whiteNotPawnMaterial);
    const blackEndGameWeight = this.getEndGameWeight(blackNotPawnMaterial);

    whiteEval += this.endGameEval(
      kings.white,
      kings.black,
      whiteNotPawnMaterial,
      whiteEndGameWeight
    );
    blackEval += this.endGameEval(
      kings.black,
      kings.white,
      blackNotPawnMaterial,
      blackEndGameWeight
    );

    whiteEval += this.getPieceWeights(WHITE, whiteNotPawnMaterial, board);
    blackEval += this.getPieceWeights(BLACK, blackNotPawnMaterial, board);
    return (whiteEval - blackEval) * Coefficients[game.currentPlayer];
  }

  getColorMaterial(color, board) {
    let colorEval = 0;
    board.mapColorList(color, (piece) => {
      colorEval += Coefficients[piece.type];
    });

    return colorEval;
  }
  getPieceWeights(color, notPawnMaterial, board) {
    let colorEval = 0;
    board.mapColorList(color, (piece) => {
      if (piece.type !== pieceCode.king) {
        colorEval += SQUARE_WEIGHT_TABLES[piece.color][piece.type][piece.index];
        return;
      }

      if (notPawnMaterial > endGameValue)
        colorEval +=
          SQUARE_WEIGHT_TABLES[piece.color][piece.type]["middle"][piece.index];
      else
        colorEval +=
          SQUARE_WEIGHT_TABLES[piece.color][piece.type]["end"][piece.index];
    });

    return colorEval;
  }
}

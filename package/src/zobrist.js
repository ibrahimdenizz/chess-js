import {
  BLACK,
  K_SIDE_CASTLE,
  Q_SIDE_CASTLE,
  rookSides,
  WHITE,
} from "@/constants/chess";

const randomNumberMultiply = 100000000000000000;

export default class Zobrist {
  pieceKeys = {
    [WHITE]: [],
    [BLACK]: [],
  };

  castlingKeys = {
    [WHITE]: [],
    [BLACK]: [],
  };

  enPassantKeys = {
    [WHITE]: [],
    [BLACK]: [],
  };

  sideToMove = 0;

  hash = 0;

  pieceTypes = ["p", "b", "n", "r", "q", "k"];

  constructor(chess) {
    this.chess = chess;

    for (let i = 0; i < 64; i++) {
      this.pieceKeys[WHITE][i] = {};
      this.pieceKeys[BLACK][i] = {};
      for (const pieceType of this.pieceTypes) {
        this.pieceKeys[WHITE][i][pieceType] = this.randomNumber;
        this.pieceKeys[BLACK][i][pieceType] = this.randomNumber;
      }
    }

    for (let i = 0; i < 4; i++) {
      this.castlingKeys[WHITE][i] = this.randomNumber;
      this.castlingKeys[BLACK][i] = this.randomNumber;
    }

    for (let i = 0; i < 8; i++) {
      this.enPassantKeys[WHITE][i] = this.randomNumber;
      this.enPassantKeys[BLACK][i] = this.randomNumber;
    }

    this.sideToMove = this.randomNumber;
  }

  get randomNumber() {
    return Math.floor(Math.random() * randomNumberMultiply);
  }

  loadMove(move) {
    const piece = move.piece;
    const capture = move.capture;

    if (capture) {
      this.hash ^= this.getPieceKey(capture);
    }

    if (move.castling & K_SIDE_CASTLE) {
      const rook = this.chess.getPiece(rookSides[piece.color].k);
      this.hash ^= this.getPieceKey(rook);
      this.hash ^= this.pieceKeys[rook.color][rook.index - 2][rook.type];
    } else if (move.castling & Q_SIDE_CASTLE) {
      const rook = this.chess.getPiece(rookSides[piece.color].q);
      this.hash ^= this.getPieceKey(rook);
      this.hash ^= this.pieceKeys[rook.color][rook.index + 3][rook.type];
    }

    if (move.enPassant) {
      this.hash ^= this.enPassantKeys[move.targetIndex % 8];
    }

    this.hash ^= this.sideToMove;
    this.hash ^= this.getPieceKey(piece);
    const targetPiece = this.chess.getPiece(move.targetIndex);

    if (targetPiece) this.hash ^= this.getPieceKey(targetPiece);

    this.hash ^= this.pieceKeys[piece.color][move.targetIndex][piece.type];

    if (this.chess.enPassantIndex != 0)
      this.hash ^= this.enPassantKeys[this.chess.enPassantIndex % 8];
  }

  getPieceKey(piece) {
    return this.pieceKeys[piece.color][piece.index][piece.type];
  }

  loadBoard() {
    this.hash = this.calculate(this.chess);
  }

  calculate() {
    let zobristKey = 0;
    for (const piece of this.chess.board.squares) {
      if (piece) {
        zobristKey ^= this.getPieceKey(piece);
      }
    }

    if (this.chess.enPassantIndex) {
      zobristKey ^= this.enPassantKeys[this.chess.enPassantIndex % 8];
    }

    if (this.chess.currentPlayer === BLACK) {
      zobristKey ^= this.sideToMove;
    }

    zobristKey ^= this.castlingKeys[this.chess.castling];

    return zobristKey;
  }
}

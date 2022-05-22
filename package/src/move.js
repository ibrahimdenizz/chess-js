import {
  Coefficients,
  RANKS,
  K_SIDE_CASTLE,
  lastFileWithColor,
  mailbox,
  mailbox64,
  mailboxOffsets,
  pieceCode,
  pieceCodeToMoveOffsets,
  Q_SIDE_CASTLE,
  secondRowsWithColor,
  WHITE,
} from "@/constants/chess.js";

export default class Move {
  piece = null;
  startIndex = 0;
  targetIndex = 0;
  capture = null;
  castling = 0;
  enPassant = false;
  enPassantCapture = false;
  promotion = null;
  score = 0;

  constructor({
    piece,
    targetIndex,
    capture = null,
    enPassant = false,
    enPassantCapture = false,
    castling = 0,
    promotion = null,
    chess,
  }) {
    this.piece = piece;
    this.startIndex = piece.index;
    this.targetIndex = targetIndex;
    this.capture = capture;
    this.enPassant = enPassant;
    this.enPassantCapture = enPassantCapture;
    this.castling = castling;
    this.promotion = promotion;
    this.setScore(chess);
  }

  get isCheck() {
    return this.capture && this.capture.type === pieceCode.king;
  }

  indexToPosition(index) {
    return {
      y: parseInt(index / 8),
      x: index % 8,
    };
  }

  indexToString(index) {
    return "" + RANKS[index % 8] + (parseInt(index / 8) + 1);
  }

  get startPosition() {
    return this.indexToPosition(this.startIndex);
  }

  get targetPosition() {
    return this.indexToPosition(this.targetIndex);
  }

  get startString() {
    return this.indexToString(this.startIndex);
  }

  get targetString() {
    return this.indexToString(this.targetIndex);
  }

  get isTargetLastFile() {
    if (this.piece.color === WHITE) return this.targetPosition.y === 0;
    else return this.targetPosition.y === 7;
  }

  get pretty() {
    let castling = false;

    if (this.castling & K_SIDE_CASTLE) castling = "king-side";
    else if (this.castling & Q_SIDE_CASTLE) castling = "queen-side";

    return {
      san: this.san,
      piece: this.piece.type,
      from: this.startString,
      to: this.targetString,
      castling,
      capture: this.capture ? this.capture.type : null,
      promotion: this.promotion,
      enPassant: this.enPassant,
    };
  }

  getSanConflict(moves) {
    let conflict = "";
    const startPosition = this.startPosition;
    const targetPosition = this.targetPosition;
    let sameRank = false,
      sameFile = false;

    for (const move of moves) {
      if (
        move.piece.type === this.piece.type &&
        move.startIndex !== this.startIndex &&
        move.targetIndex === this.targetIndex
      ) {
        if (startPosition.x === move.startPosition.x) sameRank = true;
        if (startPosition.y === move.startPosition.y) sameFile = true;

        if (sameRank && sameFile) break;
      }
    }

    if (sameFile) conflict += RANKS[startPosition.x];
    if (sameRank) conflict += startPosition.y + 1;

    return conflict;
  }

  setSAN(moves) {
    this.san = "";
    if (this.castling === K_SIDE_CASTLE) this.san = "o-o";
    else if (this.castling === Q_SIDE_CASTLE) this.san = "o-o-o";
    else {
      if (this.piece.type !== pieceCode.pawn) {
        this.san += this.piece.type.toUpperCase();
        this.san += this.getSanConflict(moves);
      }

      if (this.capture) {
        if (this.piece.type === pieceCode.pawn) {
          this.san += RANKS[this.startPosition.x];
        }

        this.san += "x";
      }

      const targetPosition = this.targetPosition;

      this.san += RANKS[targetPosition.x];
      this.san += targetPosition.y + 1;

      if (this.promotion) this.san += "=" + this.promotion.toUpperCase();
    }
  }

  setScore(chess) {
    if (this.capture) this.score += Coefficients[this.capture.type];

    if (this.promotion) this.score += Coefficients[this.promotion];

    if (chess.inAttack(this.targetIndex, this.piece.color))
      this.score -= Coefficients[this.piece.type];

    if (
      this.piece.type !== pieceCode.pawn &&
      chess.inPawnAttack(this.targetIndex, this.piece.color)
    )
      this.score -= Coefficients[this.piece.type];
  }

  static generatePawnMoves(piece, chess, moves, onlyCapture = false) {
    const validMoves = pieceCodeToMoveOffsets[piece.type][piece.color].map(
      (offset) => offset + piece.index
    );

    const moveParams = {
      piece,
      targetIndex: validMoves[0],
      chess,
    };

    if (!onlyCapture) {
      this.generatePawnForward(piece, chess, moves, validMoves, moveParams);
    }

    for (const offset of mailboxOffsets.p[piece.color]) {
      let index = piece.index;
      index = mailbox[mailbox64[index] + offset];

      if (index !== -1) {
        this.generatePawnCapture(
          piece,
          chess,
          moves,
          validMoves,
          moveParams,
          offset,
          index
        );
      }
    }
  }

  static generatePawnForward(piece, chess, moves, validMoves, moveParams) {
    const secondRow = secondRowsWithColor[piece.color];
    if (!this.isIndexValid(validMoves[0])) return [];

    if (!chess.getPiece(validMoves[0])) {
      if (parseInt(validMoves[0] / 8) === lastFileWithColor[piece.color]) {
        this.generatePromotionMoves(moves, moveParams);
      } else {
        moves.push(new Move(moveParams));
        if (piece.position.y === secondRow && !chess.getPiece(validMoves[1])) {
          moveParams.targetIndex = validMoves[1];
          moveParams.enPassant = true;
          moves.push(new Move(moveParams));
          moveParams.enPassant = false;
        }
      }
    }
  }

  static generatePawnCapture(
    piece,
    chess,
    moves,
    validMoves,
    moveParams,
    offset,
    index
  ) {
    const enPassantCaptureIndex =
      offset < 0 ? chess.enPassantIndex - 8 : chess.enPassantIndex + 8;

    const capture = chess.getPiece(index);

    if (capture && capture.color != piece.color) {
      moveParams.targetIndex = capture.index;
      moveParams.capture = capture;
      if (parseInt(validMoves[0] / 8) === lastFileWithColor[piece.color]) {
        this.generatePromotionMoves(moves, moveParams);
      } else {
        moves.push(new Move(moveParams));
      }
    } else if (index === enPassantCaptureIndex) {
      const enPassantPiece = chess.getPiece(chess.enPassantIndex);
      moveParams.capture = enPassantPiece;
      moveParams.targetIndex = enPassantCaptureIndex;
      moves.push(new Move(moveParams));
    }
  }

  static generatePromotionMoves(moves, moveParams) {
    moveParams.promotion = "q";
    moves.push(new Move(moveParams));
    moveParams.promotion = "r";
    moves.push(new Move(moveParams));
    moveParams.promotion = "b";
    moves.push(new Move(moveParams));
    moveParams.promotion = "n";
    moves.push(new Move(moveParams));
    moveParams.promotion = null;
  }

  static generatePieceMoves(piece, chess, moves, onlyCapture = false) {
    const offsets = mailboxOffsets[piece.type];
    const moveParams = {
      piece,
      capture: null,
      chess,
    };

    for (const offset of offsets) {
      let index = piece.index;
      index = mailbox[mailbox64[index] + offset];
      while (index != -1) {
        const sq = chess.getPiece(index);
        if (sq != null) {
          if (sq.color != piece.color) {
            moveParams.capture = sq;
            moveParams.targetIndex = index;
            moves.push(new Move(moveParams));
            moveParams.capture = null;
          } /* capture from i to n */
          break;
        }

        if (!onlyCapture) {
          moveParams.targetIndex = index;
          moves.push(new Move(moveParams));
        }

        if (!piece.isSlide) break;

        index = mailbox[mailbox64[index] + offset];
      }
    }

    // castling
    if (piece.type === pieceCode.king) {
      this.generateCastleMoves(piece, chess, moves);
    }
  }

  static generateCastleMoves(piece, chess, moves) {
    const moveParams = {
      piece,
      chess,
    };
    const index = piece.index;

    if (chess.castling[piece.color] & K_SIDE_CASTLE) {
      if (
        !chess.getPiece(index + 1) &&
        !chess.getPiece(index + 2) &&
        !chess.inCheck() &&
        !chess.inAttack(index + 1, piece.color) &&
        !chess.inAttack(index + 2, piece.color)
      ) {
        moveParams.castling = K_SIDE_CASTLE;
        moveParams.targetIndex = piece.index + 2;
        moves.push(new Move(moveParams));
      }
    }

    if (chess.castling[piece.color] & Q_SIDE_CASTLE) {
      if (
        !chess.getPiece(index - 1) &&
        !chess.getPiece(index - 2) &&
        !chess.getPiece(index - 3) &&
        !chess.inCheck() &&
        !chess.inAttack(index - 1, piece.color) &&
        !chess.inAttack(index - 2, piece.color) &&
        !chess.inAttack(index - 3, piece.color)
      ) {
        moveParams.castling = Q_SIDE_CASTLE;
        moveParams.targetIndex = piece.index - 2;
        moves.push(new Move(moveParams));
      }
    }
  }

  static isIndexValid(index) {
    return index >= 0 && index <= 64;
  }
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", WHITE = "white", BLACK = "black", K_SIDE_CASTLE = 2, Q_SIDE_CASTLE = 1;
const RANKS = ["a", "b", "c", "d", "e", "f", "g", "h"];
const rookSides = {
  black: { k: 7, q: 0 },
  white: {
    k: 63,
    q: 56
  }
};
const secondRowsWithColor = {
  [WHITE]: 6,
  [BLACK]: 1
};
const lastFileWithColor = {
  [WHITE]: 0,
  [BLACK]: 7
};
const pieceTypeToCode = {
  black: {
    k: "k",
    q: "q",
    b: "b",
    n: "n",
    p: "p",
    r: "r"
  },
  white: {
    k: "K",
    q: "Q",
    b: "B",
    n: "N",
    p: "P",
    r: "R"
  }
};
const pieceCode = {
  king: "k",
  queen: "q",
  bishop: "b",
  knight: "n",
  pawn: "p",
  rook: "r"
};
const pieceCodeToName = {
  k: "king",
  q: "queen",
  b: "bishop",
  n: "knight",
  p: "pawn",
  r: "rook"
};
const pieceCodeToMoveOffsets = {
  k: [1, 7, -8, 9, 1, -7, -8, -9],
  q: [1, 7, -8, 9, 1, -7, -8, -9],
  b: [7, 9, -7, -9],
  n: [6, 10, 15, 17, -6, -10, -15, -17],
  p: { [WHITE]: [-8, -16], [BLACK]: [8, 16] },
  r: [1, 8, -1, -8]
};
const mailbox = [
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  -1,
  -1,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  -1,
  -1,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  -1,
  -1,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  -1,
  -1,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  -1,
  -1,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  -1,
  -1,
  48,
  49,
  50,
  51,
  52,
  53,
  54,
  55,
  -1,
  -1,
  56,
  57,
  58,
  59,
  60,
  61,
  62,
  63,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1
];
const mailbox64 = [
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  51,
  52,
  53,
  54,
  55,
  56,
  57,
  58,
  61,
  62,
  63,
  64,
  65,
  66,
  67,
  68,
  71,
  72,
  73,
  74,
  75,
  76,
  77,
  78,
  81,
  82,
  83,
  84,
  85,
  86,
  87,
  88,
  91,
  92,
  93,
  94,
  95,
  96,
  97,
  98
];
const mailboxOffsets = {
  n: [-21, -19, -12, -8, 8, 12, 19, 21],
  b: [-11, -9, 9, 11],
  r: [-10, -1, 1, 10],
  q: [-11, -10, -9, -1, 1, 9, 10, 11],
  k: [-11, -10, -9, -1, 1, 9, 10, 11],
  p: {
    [WHITE]: [-11, -9],
    [BLACK]: [9, 11]
  }
};
const mailboxKingAttackOffsets = {
  k: [-11, -10, -9, -1, 1, 9, 10, 11],
  n: [-21, -19, -12, -8, 8, 12, 19, 21],
  p: {
    [WHITE]: [11, 9],
    [BLACK]: [-9, -11]
  }
};
const TT_EXACT = 0, TT_UPPER = 1, TT_LOWER = 2;
const Coefficients = {
  k: 2e4,
  q: 900,
  r: 500,
  b: 330,
  n: 320,
  p: 100,
  P_ISSUES: 0.5,
  LEGAL_MOVES: 0.1,
  [WHITE]: 1,
  [BLACK]: -1
};
const endGameValue = Coefficients.r * 2 + Coefficients.b + Coefficients.n;
const PAWN_SQ = [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  50,
  50,
  50,
  50,
  50,
  50,
  50,
  50,
  10,
  10,
  20,
  30,
  30,
  20,
  10,
  10,
  5,
  5,
  10,
  25,
  25,
  10,
  5,
  5,
  0,
  0,
  0,
  20,
  20,
  0,
  0,
  0,
  5,
  -5,
  -10,
  0,
  0,
  -10,
  -5,
  5,
  5,
  10,
  10,
  -20,
  -20,
  10,
  10,
  5,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
];
const KNIGHTS_SQ = [
  -50,
  -40,
  -30,
  -30,
  -30,
  -30,
  -40,
  -50,
  -40,
  -20,
  0,
  0,
  0,
  0,
  -20,
  -40,
  -30,
  0,
  10,
  15,
  15,
  10,
  0,
  -30,
  -30,
  5,
  15,
  20,
  20,
  15,
  5,
  -30,
  -30,
  0,
  15,
  20,
  20,
  15,
  0,
  -30,
  -30,
  5,
  10,
  15,
  15,
  10,
  5,
  -30,
  -40,
  -20,
  0,
  5,
  5,
  0,
  -20,
  -40,
  -50,
  -40,
  -30,
  -30,
  -30,
  -30,
  -40,
  -50
];
const BISHOP_SQ = [
  -20,
  -10,
  -10,
  -10,
  -10,
  -10,
  -10,
  -20,
  -10,
  0,
  0,
  0,
  0,
  0,
  0,
  -10,
  -10,
  0,
  5,
  10,
  10,
  5,
  0,
  -10,
  -10,
  5,
  5,
  10,
  10,
  5,
  5,
  -10,
  -10,
  0,
  10,
  10,
  10,
  10,
  0,
  -10,
  -10,
  10,
  10,
  10,
  10,
  10,
  10,
  -10,
  -10,
  5,
  0,
  0,
  0,
  0,
  5,
  -10,
  -20,
  -10,
  -10,
  -10,
  -10,
  -10,
  -10,
  -20
];
const ROOK_SQ = [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  5,
  10,
  10,
  10,
  10,
  10,
  10,
  5,
  -5,
  0,
  0,
  0,
  0,
  0,
  0,
  -5,
  -5,
  0,
  0,
  0,
  0,
  0,
  0,
  -5,
  -5,
  0,
  0,
  0,
  0,
  0,
  0,
  -5,
  -5,
  0,
  0,
  0,
  0,
  0,
  0,
  -5,
  -5,
  0,
  0,
  0,
  0,
  0,
  0,
  -5,
  0,
  0,
  0,
  5,
  5,
  0,
  0,
  0
];
const QUEEN_SQ = [
  -20,
  -10,
  -10,
  -5,
  -5,
  -10,
  -10,
  -20,
  -10,
  0,
  0,
  0,
  0,
  0,
  0,
  -10,
  -10,
  0,
  5,
  5,
  5,
  5,
  0,
  -10,
  -5,
  0,
  5,
  5,
  5,
  5,
  0,
  -5,
  0,
  0,
  5,
  5,
  5,
  5,
  0,
  -5,
  -10,
  5,
  5,
  5,
  5,
  5,
  0,
  -10,
  -10,
  0,
  5,
  0,
  0,
  0,
  0,
  -10,
  -20,
  -10,
  -10,
  -5,
  -5,
  -10,
  -10,
  -20
];
const KING_MD_SQ = [
  -30,
  -40,
  -40,
  -50,
  -50,
  -40,
  -40,
  -30,
  -30,
  -40,
  -40,
  -50,
  -50,
  -40,
  -40,
  -30,
  -30,
  -40,
  -40,
  -50,
  -50,
  -40,
  -40,
  -30,
  -30,
  -40,
  -40,
  -50,
  -50,
  -40,
  -40,
  -30,
  -20,
  -30,
  -30,
  -40,
  -40,
  -30,
  -30,
  -20,
  -10,
  -20,
  -20,
  -20,
  -20,
  -20,
  -20,
  -10,
  20,
  20,
  0,
  0,
  0,
  0,
  20,
  20,
  20,
  30,
  10,
  0,
  0,
  10,
  30,
  20
];
const KING_END_SQ = [
  -50,
  -40,
  -30,
  -20,
  -20,
  -30,
  -40,
  -50,
  -30,
  -20,
  -10,
  0,
  0,
  -10,
  -20,
  -30,
  -30,
  -10,
  20,
  30,
  30,
  20,
  -10,
  -30,
  -30,
  -10,
  30,
  40,
  40,
  30,
  -10,
  -30,
  -30,
  -10,
  30,
  40,
  40,
  30,
  -10,
  -30,
  -30,
  -10,
  20,
  30,
  30,
  20,
  -10,
  -30,
  -30,
  -30,
  0,
  0,
  0,
  0,
  -30,
  -30,
  -50,
  -30,
  -30,
  -30,
  -30,
  -30,
  -30,
  -50
];
const SQUARE_WEIGHT_TABLES = {
  [WHITE]: {
    p: PAWN_SQ,
    n: KNIGHTS_SQ,
    b: BISHOP_SQ,
    r: ROOK_SQ,
    q: QUEEN_SQ,
    k: { middle: KING_MD_SQ, end: KING_END_SQ }
  },
  [BLACK]: {
    p: PAWN_SQ.slice().reverse(),
    n: KNIGHTS_SQ.slice().reverse(),
    b: BISHOP_SQ.slice().reverse(),
    r: ROOK_SQ.slice().reverse(),
    q: QUEEN_SQ.slice().reverse(),
    k: {
      middle: KING_MD_SQ.slice().reverse(),
      end: KING_END_SQ.slice().reverse()
    }
  }
};
class PieceList {
  constructor() {
    __publicField(this, "list", {});
    __publicField(this, "numPieces", 0);
    __publicField(this, "numNotPawn", 0);
  }
  addPiece(piece) {
    this.list[piece.index] = piece;
    this.numPiece++;
    if (piece.type !== "p")
      this.numNotPawn++;
  }
  deletePiece(piece) {
    delete this.list[piece.index];
    this.numPiece--;
    if (piece.type !== "p")
      this.numNotPawn--;
  }
  mapList(cb) {
    for (const pieceIndex in this.list) {
      cb(this.list[pieceIndex]);
    }
  }
}
class Piece {
  constructor({ index, color, code }) {
    __publicField(this, "index", 0);
    __publicField(this, "color", WHITE);
    __publicField(this, "imgUrl", "");
    __publicField(this, "imgAlt", "");
    __publicField(this, "code", "");
    __publicField(this, "isSlide", false);
    this.index = index;
    this.color = color;
    this.code = code;
    this.type = this.code.toLowerCase();
    this.pieceName = pieceCodeToName[this.type];
    this.isSlide = this.type === pieceCode.bishop || this.type === pieceCode.queen || this.type === pieceCode.rook;
  }
  changePieceType(code) {
    this.code = code;
    this.code = code;
    this.type = this.code.toLowerCase();
    this.pieceName = pieceCodeToName[this.type];
    this.isSlide = this.type === pieceCode.bishop || this.type === pieceCode.queen || this.type === pieceCode.rook;
  }
  get position() {
    return {
      x: this.index % 8,
      y: parseInt(this.index / 8)
    };
  }
  equals(piece) {
    return piece.index === this.index;
  }
}
class Board {
  constructor(fen) {
    __publicField(this, "squares", Array(64).fill(null));
    __publicField(this, "validMoves", []);
    __publicField(this, "kings", {
      [WHITE]: null,
      [BLACK]: null
    });
    __publicField(this, "pieceList", {
      black: new PieceList(),
      white: new PieceList()
    });
    this.fenPosition = fen || DEFAULT_FEN.split(" ")[0];
  }
  getPiece(x, y = null) {
    if (x === -1)
      return null;
    if (y)
      return this.squares[(y - 1) * 8 + (x - 1)];
    else
      return this.squares[x];
  }
  addPiece(piece) {
    this.pieceList[piece.color].addPiece(piece);
    this.squares[piece.index] = piece;
  }
  deletePiece(piece) {
    if (piece) {
      this.pieceList[piece.color].deletePiece(piece);
      this.squares[piece.index] = null;
    }
  }
  mapColorList(color, cb) {
    this.pieceList[color].mapList(cb);
  }
  clear() {
    this.squares = Array(64).fill(null);
    this.pieceList = {
      black: new PieceList(),
      white: new PieceList()
    };
  }
  set fenPosition(fenPosition) {
    this.clear();
    fenPosition.split("/").forEach((rowStr, y) => {
      let x = 0;
      rowStr.split("").forEach((char) => {
        if (parseInt(char)) {
          x += parseInt(char);
        } else {
          const pieceParam = {
            index: y * 8 + x,
            code: char,
            color: char !== char.toLowerCase() ? WHITE : BLACK
          };
          const piece = new Piece(pieceParam);
          this.addPiece(piece);
          if (piece.type === pieceCode.king) {
            this.kings[piece.color] = piece;
          }
          x++;
        }
      });
    });
  }
  get fenPosition() {
    let fen = "";
    let nullCount = 0;
    let rowCount = 0;
    this.squares.forEach((piece) => {
      if (piece == null) {
        nullCount++;
        rowCount++;
      } else {
        fen += nullCount ? nullCount + piece.code : "" + piece.code;
        nullCount = 0;
        rowCount++;
      }
      if (rowCount % 8 === 0) {
        fen += nullCount ? nullCount + "/" : "/";
        nullCount = 0;
        rowCount = 0;
      }
    });
    return fen;
  }
  getColorNotPawnNum(color) {
    return this.pieceList[color].numNotPawn;
  }
  get pieceCount() {
    return this.pieceList.white.numPieces + this.pieceList.black.numPieces;
  }
}
class Move {
  constructor({
    piece,
    targetIndex,
    capture = null,
    enPassant = false,
    enPassantCapture = false,
    castling = 0,
    promotion = null,
    chess
  }) {
    __publicField(this, "piece", null);
    __publicField(this, "startIndex", 0);
    __publicField(this, "targetIndex", 0);
    __publicField(this, "capture", null);
    __publicField(this, "castling", 0);
    __publicField(this, "enPassant", false);
    __publicField(this, "enPassantCapture", false);
    __publicField(this, "promotion", null);
    __publicField(this, "score", 0);
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
      x: index % 8
    };
  }
  indexToString(index) {
    return "" + RANKS[index % 8] + (8 - parseInt(index / 8));
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
    if (this.piece.color === WHITE)
      return this.targetPosition.y === 0;
    else
      return this.targetPosition.y === 7;
  }
  get pretty() {
    let castling = false;
    if (this.castling & K_SIDE_CASTLE)
      castling = "king-side";
    else if (this.castling & Q_SIDE_CASTLE)
      castling = "queen-side";
    return {
      san: this.san,
      piece: this.piece.type,
      from: this.startString,
      to: this.targetString,
      castling,
      capture: this.capture ? this.capture.type : null,
      promotion: this.promotion,
      enPassant: this.enPassant
    };
  }
  getSanConflict(moves) {
    let conflict = "";
    const startPosition = this.startPosition;
    let sameRank = false, sameFile = false;
    for (const move of moves) {
      if (move.piece.type === this.piece.type && move.startIndex !== this.startIndex && move.targetIndex === this.targetIndex) {
        if (startPosition.x === move.startPosition.x)
          sameRank = true;
        if (startPosition.y === move.startPosition.y)
          sameFile = true;
        if (sameRank && sameFile)
          break;
      }
    }
    if (sameFile)
      conflict += RANKS[startPosition.x];
    if (sameRank)
      conflict += 8 - startPosition.y;
    return conflict;
  }
  setSAN(moves) {
    this.san = "";
    if (this.castling === K_SIDE_CASTLE)
      this.san = "o-o";
    else if (this.castling === Q_SIDE_CASTLE)
      this.san = "o-o-o";
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
      this.san += this.targetString;
      if (this.promotion)
        this.san += "=" + this.promotion.toUpperCase();
    }
  }
  setScore(chess) {
    if (this.capture)
      this.score += Coefficients[this.capture.type];
    if (this.promotion)
      this.score += Coefficients[this.promotion];
    if (chess.inAttack(this.targetIndex, this.piece.color))
      this.score -= Coefficients[this.piece.type];
    if (this.piece.type !== pieceCode.pawn && chess.inPawnAttack(this.targetIndex, this.piece.color))
      this.score -= Coefficients[this.piece.type];
  }
  static generatePawnMoves(piece, chess, moves, onlyCapture = false) {
    const validMoves = pieceCodeToMoveOffsets[piece.type][piece.color].map((offset) => offset + piece.index);
    const moveParams = {
      piece,
      targetIndex: validMoves[0],
      chess
    };
    if (!onlyCapture) {
      this.generatePawnForward(piece, chess, moves, validMoves, moveParams);
    }
    for (const offset of mailboxOffsets.p[piece.color]) {
      let index = piece.index;
      index = mailbox[mailbox64[index] + offset];
      if (index !== -1) {
        this.generatePawnCapture(piece, chess, moves, validMoves, moveParams, offset, index);
      }
    }
  }
  static generatePawnForward(piece, chess, moves, validMoves, moveParams) {
    const secondRow = secondRowsWithColor[piece.color];
    if (!this.isIndexValid(validMoves[0]))
      return [];
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
  static generatePawnCapture(piece, chess, moves, validMoves, moveParams, offset, index) {
    const enPassantCaptureIndex = offset < 0 ? chess.enPassantIndex - 8 : chess.enPassantIndex + 8;
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
      chess
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
          }
          break;
        }
        if (!onlyCapture) {
          moveParams.targetIndex = index;
          moves.push(new Move(moveParams));
        }
        if (!piece.isSlide)
          break;
        index = mailbox[mailbox64[index] + offset];
      }
    }
    if (piece.type === pieceCode.king) {
      this.generateCastleMoves(piece, chess, moves);
    }
  }
  static generateCastleMoves(piece, chess, moves) {
    const moveParams = {
      piece,
      chess
    };
    const index = piece.index;
    if (chess.castling[piece.color] & K_SIDE_CASTLE) {
      if (!chess.getPiece(index + 1) && !chess.getPiece(index + 2) && !chess.inCheck() && !chess.inAttack(index + 1, piece.color) && !chess.inAttack(index + 2, piece.color)) {
        moveParams.castling = K_SIDE_CASTLE;
        moveParams.targetIndex = piece.index + 2;
        moves.push(new Move(moveParams));
      }
    }
    if (chess.castling[piece.color] & Q_SIDE_CASTLE) {
      if (!chess.getPiece(index - 1) && !chess.getPiece(index - 2) && !chess.getPiece(index - 3) && !chess.inCheck() && !chess.inAttack(index - 1, piece.color) && !chess.inAttack(index - 2, piece.color) && !chess.inAttack(index - 3, piece.color)) {
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
const randomNumberMultiply = 1e17;
class Zobrist {
  constructor(chess) {
    __publicField(this, "pieceKeys", {
      [WHITE]: [],
      [BLACK]: []
    });
    __publicField(this, "castlingKeys", {
      [WHITE]: [],
      [BLACK]: []
    });
    __publicField(this, "enPassantKeys", {
      [WHITE]: [],
      [BLACK]: []
    });
    __publicField(this, "sideToMove", 0);
    __publicField(this, "hash", 0);
    __publicField(this, "pieceTypes", ["p", "b", "n", "r", "q", "k"]);
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
    if (targetPiece)
      this.hash ^= this.getPieceKey(targetPiece);
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
class ChessGame {
  constructor(fen = DEFAULT_FEN) {
    __publicField(this, "currentPlayer", WHITE);
    __publicField(this, "castling", {
      [WHITE]: 0,
      [BLACK]: 0
    });
    __publicField(this, "enPassantIndex", null);
    __publicField(this, "halfMoveCount", 0);
    __publicField(this, "moveCount", 1);
    __publicField(this, "moves", []);
    __publicField(this, "uglyMoves", []);
    __publicField(this, "history", []);
    __publicField(this, "redoHistory", []);
    __publicField(this, "hashHistory", []);
    this.board = new Board();
    this.zobrist = new Zobrist(this);
    this.fen = fen;
    this.buildMoves();
    this.zobrist.loadBoard();
  }
  generatePseudoLegalMoves(onlyCapture = false) {
    const moves = [];
    this.board.mapColorList(this.currentPlayer, (piece) => {
      if (piece.type === pieceCode.pawn)
        Move.generatePawnMoves(piece, this, moves, onlyCapture);
      else
        Move.generatePieceMoves(piece, this, moves, onlyCapture);
    });
    return moves;
  }
  generateMoves(options) {
    let pseudoMoves = this.generatePseudoLegalMoves(options == null ? void 0 : options.onlyCapture);
    const currentPlayer = this.currentPlayer;
    const legalMoves = [];
    for (const pseudoMove of pseudoMoves) {
      this.makeUglyMove(pseudoMove);
      if (!this.inCheck(currentPlayer)) {
        legalMoves.push(pseudoMove);
      }
      this.undoUglyMove();
    }
    if (this.inDoubleCheck())
      return legalMoves.filter((move) => move.piece.type === pieceCode.king);
    return legalMoves;
  }
  buildMoves() {
    this.uglyMoves = this.generateMoves();
    this.uglyMoves.forEach((uglyMove) => uglyMove.setSAN(this.uglyMoves));
    this.moves = this.uglyMoves.map((uglyMove) => uglyMove.pretty);
  }
  getPiece(x, y = null) {
    return this.board.getPiece(x, y);
  }
  getPieceMoves(piece) {
    return this.uglyMoves.filter((move) => move.piece.equals(piece));
  }
  checkCastlingBeforeMove(move) {
    const piece = move.piece;
    if (piece.type === pieceCode.king)
      this.castling[piece.color] = 0;
    else if (piece.type === pieceCode.rook) {
      if (piece.index === rookSides[piece.color].k)
        this.castling[piece.color] &= Q_SIDE_CASTLE;
      else if (piece.index === rookSides[piece.color].q)
        this.castling[piece.color] &= K_SIDE_CASTLE;
    }
  }
  generateHistory(move) {
    this.history.push({
      move,
      castling: {
        [WHITE]: this.castling[WHITE],
        [BLACK]: this.castling[BLACK]
      },
      enPassantIndex: this.enPassantIndex,
      halfMoveCount: this.halfMoveCount,
      moveCount: this.moveCount,
      currentPlayer: this.currentPlayer
    });
    this.hashHistory.push(this.zobrist.hash);
  }
  makeUglyMove(move) {
    this.generateHistory(move);
    this.zobrist.loadMove(move);
    this.board.deletePiece(move.piece);
    this.enPassantIndex = move.enPassant ? move.targetIndex : null;
    if (this.currentPlayer === BLACK)
      this.moveCount++;
    this.currentPlayer = this.opponentColor;
    this.checkCastlingBeforeMove(move);
    if (move.capture) {
      const capturePiece = this.getPiece(move.capture.index);
      this.board.deletePiece(capturePiece);
    }
    if (move.piece.type === pieceCode.pawn) {
      this.makePawnMove(move);
    } else if (move.castling) {
      this.makeCastlingMove(move);
    } else {
      const piece = move.piece;
      piece.index = move.targetIndex;
      this.board.addPiece(piece);
    }
    if (move.piece.type === pieceCode.king)
      this.board.kings[move.piece.color] = move.piece;
    if (move.piece.type === pieceCode.pawn || move.capture)
      this.halfMoveCount = 0;
    else
      this.halfMoveCount++;
  }
  convertToMove(move) {
    let uglyMove = false;
    if ((move == null ? void 0 : move.startIndex) && (move == null ? void 0 : move.targetIndex))
      uglyMove = move;
    else if (typeof move === "string") {
      uglyMove = this.uglyMoves.find((_uglyMove) => _uglyMove.san === move);
    } else {
      uglyMove = this.uglyMoves.find((_uglyMove) => {
        if ((move == null ? void 0 : move.from) === _uglyMove.startString && (move == null ? void 0 : move.to) === _uglyMove.targetString) {
          if (_uglyMove.promotion) {
            return _uglyMove.promotion === move.promotion;
          }
          return true;
        }
      });
    }
    return uglyMove;
  }
  validateMove(move) {
    return !!this.convertToMove(move);
  }
  makeMove(move) {
    if (!this.validateMove(move))
      return false;
    this.makeUglyMove(this.convertToMove(move));
    this.redoHistory = [];
    this.buildMoves();
    return true;
  }
  undoUglyMove() {
    if (this.history.length > 0) {
      const old = this.history.pop();
      const oldHash = this.hashHistory.pop();
      const move = old.move;
      const capture = move.capture;
      const piece = move.piece;
      const promotion = move.promotion;
      if (promotion) {
        piece.changePieceType(pieceTypeToCode[piece.color].p);
      }
      this.castling = old.castling;
      this.enPassantIndex = old.enPassantIndex;
      this.halfMoveCount = old.halfMoveCount;
      this.moveCount = old.moveCount;
      this.currentPlayer = old.currentPlayer;
      this.zobrist.hash = oldHash;
      this.board.deletePiece(piece);
      piece.index = move.startIndex;
      this.board.addPiece(piece);
      if (capture) {
        this.board.addPiece(capture);
      }
      if (move.castling) {
        let rookStartIndex, rookEndIndex;
        if (move.castling & K_SIDE_CASTLE) {
          rookStartIndex = rookSides[piece.color].k;
          rookEndIndex = rookStartIndex - 2;
        } else if (move.castling & Q_SIDE_CASTLE) {
          rookStartIndex = rookSides[piece.color].q;
          rookEndIndex = rookStartIndex + 3;
        }
        const rook = this.getPiece(rookEndIndex);
        this.board.deletePiece(rook);
        rook.index = rookStartIndex;
        this.board.addPiece(rook);
      }
    }
  }
  undoMove() {
    this.redoHistory.push(this.history[this.history.length - 1]);
    this.undoUglyMove();
    this.buildMoves();
  }
  redoMove() {
    if (this.redoHistory.length > 0) {
      const redo = this.redoHistory.pop();
      this.makeUglyMove(redo.move);
      this.buildMoves();
    }
  }
  makeCastlingMove(move) {
    const piece = move.piece;
    if (move.castling & K_SIDE_CASTLE) {
      piece.index += 2;
      this.board.addPiece(piece);
      const rook = this.getPiece(rookSides[piece.color].k);
      this.board.deletePiece(rook);
      rook.index -= 2;
      this.board.addPiece(rook);
    } else if (move.castling & Q_SIDE_CASTLE) {
      piece.index -= 2;
      this.board.addPiece(piece);
      const rook = this.getPiece(rookSides[piece.color].q);
      this.board.deletePiece(rook);
      rook.index += 3;
      this.board.addPiece(rook);
    }
    this.castling[piece.color] = 0;
  }
  makePawnMove(move) {
    const piece = move.piece;
    piece.index = move.targetIndex;
    if (move.promotion) {
      piece.changePieceType(pieceTypeToCode[piece.color][move.promotion]);
    }
    this.board.addPiece(piece);
  }
  loadGameWithFen(fen) {
    this.fen = fen;
    this.buildMoves();
  }
  inKnightAttack(_index, color, returnCount = false) {
    let count = 0;
    for (const knightOffset of mailboxKingAttackOffsets.n) {
      let index = _index;
      index = mailbox[mailbox64[index] + knightOffset];
      const sq = this.getPiece(index);
      if (sq && sq.type === pieceCode.knight && sq.color !== color) {
        if (!returnCount)
          return true;
        count++;
      }
    }
    return returnCount ? count : false;
  }
  inPawnAttack(_index, color, returnCount = false) {
    const opponentColor = this.getOpponentColor(color);
    let count = 0;
    for (const pawnOffset of mailboxKingAttackOffsets.p[opponentColor]) {
      let index = _index;
      index = mailbox[mailbox64[index] + pawnOffset];
      const sq = this.getPiece(index);
      if (sq && sq.type === pieceCode.pawn && sq.color !== color) {
        if (!returnCount)
          return true;
        count++;
      }
    }
    return returnCount ? count : false;
  }
  inKingAttack(_index, color, returnCount = false) {
    let count = 0;
    for (const kingOffset of mailboxKingAttackOffsets.k) {
      let index = _index;
      index = mailbox[mailbox64[index] + kingOffset];
      const sq = this.getPiece(index);
      if (sq && sq.type === pieceCode.king && sq.color !== color) {
        if (!returnCount)
          return true;
        count++;
      }
    }
    return returnCount ? count : false;
  }
  inSlidingAttack(_index, color, returnCount = false) {
    const offsets = mailboxOffsets.k;
    let count = 0;
    for (const offset of offsets) {
      let index = _index;
      index = mailbox[mailbox64[index] + offset];
      while (index != -1 && index != void 0) {
        const sq = this.getPiece(index);
        if (sq != null) {
          let captureOffsets = mailboxOffsets[sq.type];
          if (sq.isSlide && sq.color !== color && captureOffsets.includes(offset)) {
            if (!returnCount)
              return true;
            count++;
          }
          break;
        }
        index = mailbox[mailbox64[index] + offset];
      }
    }
    return returnCount ? count : false;
  }
  inAttack(index, color, returnCount = false) {
    if (returnCount) {
      return this.inKnightAttack(index, color, returnCount) + this.inPawnAttack(index, color, returnCount) + this.inSlidingAttack(index, color, returnCount) + this.inKingAttack(index, color, returnCount);
    }
    return this.inKnightAttack(index, color) || this.inPawnAttack(index, color) || this.inSlidingAttack(index, color) || this.inKingAttack(index, color);
  }
  inCheck(color = this.currentPlayer) {
    return this.inAttack(this.board.kings[color].index, color);
  }
  inDoubleCheck(color = this.currentPlayer) {
    return this.inAttack(this.board.kings[color].index, color, true) > 1;
  }
  perft(depth) {
    let totalMove = 0;
    let captures = 0;
    const moves = this.generatePseudoLegalMoves();
    for (const move of moves) {
      this.makeUglyMove(move);
      if (!this.inCheck()) {
        if (depth - 1 > 0) {
          const perft = this.perft(depth - 1);
          totalMove += perft.count;
          captures += perft.captures;
        } else {
          totalMove++;
          if (move.capture)
            captures++;
        }
      }
      this.undoUglyMove();
    }
    return { count: totalMove, captures };
  }
  getOpponentColor(color) {
    return color === WHITE ? BLACK : WHITE;
  }
  get boardArray() {
    return this.board.squares;
  }
  get opponentColor() {
    return this.currentPlayer === WHITE ? BLACK : WHITE;
  }
  get inThreeFold() {
    if (!this.hashHistory.length)
      return false;
    return this.hashHistory.filter((x) => x === this.zobrist.hash).length >= 3;
  }
  get inFiftyMove() {
    return this.halfMoveCount >= 100;
  }
  get gameOver() {
    return !this.uglyMoves.length || this.board.pieceCount === 2 || this.inThreeFold || this.inFiftyMove;
  }
  get winner() {
    if (this.gameOver) {
      if (this.inCheck() && this.uglyMoves.length === 0) {
        return this.currentPlayer === WHITE ? BLACK : WHITE;
      } else {
        return "draw";
      }
    } else {
      return false;
    }
  }
  get enPassant() {
    const enPassant = this.fenEnPassant;
    return enPassant === "-" ? null : enPassant;
  }
  set enPassant(value) {
    if (value === "-") {
      this.enPassantIndex = null;
    } else {
      const [char, num] = value.split("");
      this.enPassantIndex = (parseInt(num) - 1) * 8 + (char.charCodeAt(0) - 97);
    }
  }
  set castlingStr(value) {
    this.castling[WHITE] = 0;
    this.castling[BLACK] = 0;
    if (value !== "-")
      for (const char of value.split("")) {
        switch (char) {
          case "K":
            this.castling[WHITE] |= K_SIDE_CASTLE;
            break;
          case "Q":
            this.castling[WHITE] |= Q_SIDE_CASTLE;
            break;
          case "k":
            this.castling[BLACK] |= K_SIDE_CASTLE;
            break;
          case "q":
            this.castling[BLACK] |= Q_SIDE_CASTLE;
            break;
        }
      }
  }
  get fenTurn() {
    return this.currentPlayer === WHITE ? "w" : "b";
  }
  get fenCastling() {
    let str = "";
    str += this.castling[WHITE] & K_SIDE_CASTLE ? "K" : "";
    str += this.castling[WHITE] & Q_SIDE_CASTLE ? "Q" : "";
    str += this.castling[BLACK] & K_SIDE_CASTLE ? "k" : "";
    str += this.castling[BLACK] & Q_SIDE_CASTLE ? "q" : "";
    return str ? str : "-";
  }
  get fenEnPassant() {
    if (this.enPassantIndex === null)
      return "-";
    else {
      const char = this.enPassantIndex % 8 + 97;
      const num = 8 - parseInt(this.enPassantIndex / 8);
      return `${String.fromCharCode(char)}${num}`;
    }
  }
  set fen(fen) {
    const split_fen = fen.split(" ");
    this.board.fenPosition = split_fen[0];
    this.currentPlayer = split_fen[1] === "w" ? WHITE : BLACK;
    this.castlingStr = split_fen[2];
    this.enPassant = split_fen[3];
    this.halfMoveCount = parseInt(split_fen[4]);
    this.moveCount = parseInt(split_fen[5]);
  }
  get fen() {
    return `${this.board.fenPosition} ${this.fenTurn} ${this.fenCastling} ${this.fenEnPassant} ${this.halfMoveCount} ${this.moveCount}`;
  }
  get copy() {
    const copyGame = new ChessGame(this.fen);
    copyGame.history = this.history.slice();
    return copyGame;
  }
}
class TranspositionTable {
  constructor(game) {
    __publicField(this, "hashes", {});
    this.game = game;
  }
  get hash() {
    return this.game.zobrist.hash;
  }
  clear() {
    this.hashes = {};
  }
  getHash(game) {
    if (game)
      return game.zobrist.hash;
    else
      return this.hash;
  }
  getMove(game = null) {
    const hash = this.getHash(game);
    return entries[hash].move;
  }
  getStoredHash({ depth, alpha, beta }, game = null) {
    const hash = this.getHash(game);
    const storedHash = this.hashes[hash];
    if (storedHash && depth <= storedHash.depth) {
      if (storedHash.type === TT_EXACT)
        return storedHash;
      if (storedHash.type === TT_LOWER && storedHash.score >= beta)
        return storedHash;
      if (storedHash.type === TT_UPPER && storedHash.score <= alpha)
        return storedHash;
    }
    return null;
  }
  addEvaluation(newHash, game = null) {
    const hash = this.getHash(game);
    newHash.hash = hash;
    this.hashes[hash] = newHash;
  }
}
class ChessAI {
  constructor(type = "normal", depth = 1) {
    __publicField(this, "positionCount", 0);
    __publicField(this, "cutOff", 0);
    __publicField(this, "quiesceCount", 0);
    __publicField(this, "transpositionNum", 0);
    __publicField(this, "bestEval", null);
    this.type = type;
    this.depth = depth;
    this.transpositionTable = new TranspositionTable(this.game);
    this.bestMove = null;
  }
  selectMove(fen, options) {
    const type = (options == null ? void 0 : options.type) || this.type;
    const depth = (options == null ? void 0 : options.depth) || this.depth;
    if (fen)
      this.game = new ChessGame(fen);
    else
      return null;
    if (type === "random")
      return this.selectRandomMove(this.game.uglyMoves);
    if (type === "normal") {
      if (options == null ? void 0 : options.debug)
        this.resetDebug();
      this.bestMove = null;
      this.search(depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, this.game);
      if (options == null ? void 0 : options.debug)
        this.logDebug();
      this.bestMove.setSAN(this.game.uglyMoves);
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
    console.log("transposition count: ", this.transpositionNum, Object.keys(this.transpositionTable.hashes).length);
  }
  selectRandomMove(moves) {
    return moves[Math.floor(Math.random() * moves.length)];
  }
  search(depth, alpha, beta, game, root = 0) {
    if (root > 0 && game.hashHistory.includes(game.zobrist.hash))
      return 0;
    const storedHash = this.transpositionTable.getStoredHash({
      depth,
      alpha,
      beta
    }, game);
    if (storedHash !== null) {
      this.transpositionNum++;
      if (root === 0)
        this.bestMove = storedHash.move;
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
        this.transpositionTable.addEvaluation({
          depth,
          move,
          score: beta,
          type: TT_LOWER
        }, game);
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
    this.transpositionTable.addEvaluation({
      depth,
      move: bestMove,
      score: alpha,
      type: tt_type
    }, game);
    return alpha;
  }
  quiesce(alpha, beta, game) {
    this.quiesceCount++;
    const stand_pat = this.evaluate(game);
    if (stand_pat >= beta)
      return beta;
    if (alpha < stand_pat)
      alpha = stand_pat;
    const captureMoves = game.generateMoves({ onlyCapture: true });
    captureMoves.sort((a, b) => b.score - a.score);
    for (const move of captureMoves) {
      game.makeUglyMove(move);
      const score = -this.quiesce(-beta, -alpha, game);
      game.undoUglyMove();
      if (score >= beta)
        return beta;
      if (score > alpha)
        alpha = score;
    }
    return alpha;
  }
  getEndGameWeight(notPawnCount) {
    return 1 - Math.min(1, notPawnCount * (1 / endGameValue));
  }
  endGameEval(friendlyKing, opponentKing, friendlyNotPawnMaterial, endGameWeight) {
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
    const whiteNotPawnMaterial = whiteMaterial - board.getColorNotPawnNum(WHITE) * Coefficients.p;
    const blackNotPawnMaterial = blackMaterial - board.getColorNotPawnNum(BLACK) * Coefficients.p;
    const whiteEndGameWeight = this.getEndGameWeight(whiteNotPawnMaterial);
    const blackEndGameWeight = this.getEndGameWeight(blackNotPawnMaterial);
    whiteEval += this.endGameEval(kings.white, kings.black, whiteNotPawnMaterial, whiteEndGameWeight);
    blackEval += this.endGameEval(kings.black, kings.white, blackNotPawnMaterial, blackEndGameWeight);
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
        colorEval += SQUARE_WEIGHT_TABLES[piece.color][piece.type]["middle"][piece.index];
      else
        colorEval += SQUARE_WEIGHT_TABLES[piece.color][piece.type]["end"][piece.index];
    });
    return colorEval;
  }
}
export { ChessAI, ChessGame };

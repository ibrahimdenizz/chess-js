export const DEFAULT_FEN =
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  WHITE = "white",
  BLACK = "black",
  K_SIDE_CASTLE = 2,
  Q_SIDE_CASTLE = 1,
  BOTH_SIDE_CASTLE = 3;

export const RANKS = ["a", "b", "c", "d", "e", "f", "g", "h"];

export const rookSides = {
  black: { k: 7, q: 0 },
  white: {
    k: 63,
    q: 56,
  },
};

export const secondRowsWithColor = {
  [WHITE]: 6,
  [BLACK]: 1,
};

export const lastFileWithColor = {
  [WHITE]: 0,
  [BLACK]: 7,
};

export const pieceNameToCode = {
  black: {
    king: "k",
    queen: "q",
    bishop: "b",
    knight: "n",
    pawn: "p",
    rook: "r",
  },
  white: {
    king: "K",
    queen: "Q",
    bishop: "B",
    knight: "N",
    pawn: "P",
    rook: "R",
  },
};

export const pieceTypeToCode = {
  black: {
    k: "k",
    q: "q",
    b: "b",
    n: "n",
    p: "p",
    r: "r",
  },
  white: {
    k: "K",
    q: "Q",
    b: "B",
    n: "N",
    p: "P",
    r: "R",
  },
};

export const pieceCode = {
  king: "k",
  queen: "q",
  bishop: "b",
  knight: "n",
  pawn: "p",
  rook: "r",
};

export const pieceCodeToName = {
  k: "king",
  q: "queen",
  b: "bishop",
  n: "knight",
  p: "pawn",
  r: "rook",
};

export const pieceCodeToMoveOffsets = {
  k: [1, 7, -8, 9, 1, -7, -8, -9],
  q: [1, 7, -8, 9, 1, -7, -8, -9],
  b: [7, 9, -7, -9],
  n: [6, 10, 15, 17, -6, -10, -15, -17],
  p: { [WHITE]: [-8, -16], [BLACK]: [8, 16] },
  r: [1, 8, -1, -8],
};

export const pieceCodeToCaptureOffsets = {
  k: [1, 7, -8, 9, 1, -7, -8, -9],
  q: [1, 7, -8, 9, 1, -7, -8, -9],
  b: [7, 9, -7, -9],
  n: [6, 10, 15, 17, -6, -10, -15, -17],
  p: { [WHITE]: [-7, -9], [BLACK]: [7, 9] },
  r: [1, 8, -1, -8],
};

/* 10x12 Board move generation constants */

export const mailboxOutside = -1;

// prettier-ignore
export const mailbox = [
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1,  0,  1,  2,  3,  4,  5,  6,  7, -1,
  -1,  8,  9, 10, 11, 12, 13, 14, 15, -1,
  -1, 16, 17, 18, 19, 20, 21, 22, 23, -1,
  -1, 24, 25, 26, 27, 28, 29, 30, 31, -1,
  -1, 32, 33, 34, 35, 36, 37, 38, 39, -1,
  -1, 40, 41, 42, 43, 44, 45, 46, 47, -1,
  -1, 48, 49, 50, 51, 52, 53, 54, 55, -1,
  -1, 56, 57, 58, 59, 60, 61, 62, 63, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
];

// prettier-ignore
export const mailbox64 = [
 21, 22, 23, 24, 25, 26, 27, 28,
 31, 32, 33, 34, 35, 36, 37, 38,
 41, 42, 43, 44, 45, 46, 47, 48,
 51, 52, 53, 54, 55, 56, 57, 58,
 61, 62, 63, 64, 65, 66, 67, 68,
 71, 72, 73, 74, 75, 76, 77, 78,
 81, 82, 83, 84, 85, 86, 87, 88,
 91, 92, 93, 94, 95, 96, 97, 98
];

export const mailboxOffsets = {
  n: [-21, -19, -12, -8, 8, 12, 19, 21] /* KNIGHT */,
  b: [-11, -9, 9, 11] /* BISHOP */,
  r: [-10, -1, 1, 10] /* ROOK */,
  q: [-11, -10, -9, -1, 1, 9, 10, 11] /* QUEEN */,
  k: [-11, -10, -9, -1, 1, 9, 10, 11] /* KING */,
  p: {
    [WHITE]: [-11, -9],
    [BLACK]: [9, 11],
  },
};

export const mailboxKingAttackOffsets = {
  k: [-11, -10, -9, -1, 1, 9, 10, 11],
  n: [-21, -19, -12, -8, 8, 12, 19, 21],
  p: {
    [WHITE]: [11, 9],
    [BLACK]: [-9, -11],
  },
};

// Transposition Table Constants

export const TT_EXACT = 0,
  TT_UPPER = 1,
  TT_LOWER = 2;

// AI constants

export const Coefficients = {
  k: 20000,
  q: 900,
  r: 500,
  b: 330,
  n: 320,
  p: 100,
  P_ISSUES: 0.5, // Doubled, blocked and isolated pawns. Maybe later,
  LEGAL_MOVES: 0.1, // Number of legal moves. Maybe later
  [WHITE]: 1,
  [BLACK]: -1,
};

export const endGameValue =
  Coefficients.r * 2 + Coefficients.b + Coefficients.n;

// Piece Square Tables
// prettier-ignore
const PAWN_SQ = [
   0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
   5,  5, 10, 25, 25, 10,  5,  5,
   0,  0,  0, 20, 20,  0,  0,  0,
   5, -5,-10,  0,  0,-10, -5,  5,
   5, 10, 10,-20,-20, 10, 10,  5,
   0,  0,  0,  0,  0,  0,  0,  0
]

// prettier-ignore
const KNIGHTS_SQ = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50,
]

// prettier-ignore
const BISHOP_SQ = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20,
]

// prettier-ignore
const ROOK_SQ = [
  0,  0,  0,  0,  0,  0,  0,  0,
  5, 10, 10, 10, 10, 10, 10,  5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
  0,  0,  0,  5,  5,  0,  0,  0
]

// prettier-ignore
const QUEEN_SQ = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
  -5,  0,  5,  5,  5,  5,  0, -5,
    0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20
]

// prettier-ignore
const KING_MD_SQ = [
  -30,-40,-40,-50,-50,-40,-40,-30,
-30,-40,-40,-50,-50,-40,-40,-30,
-30,-40,-40,-50,-50,-40,-40,-30,
-30,-40,-40,-50,-50,-40,-40,-30,
-20,-30,-30,-40,-40,-30,-30,-20,
-10,-20,-20,-20,-20,-20,-20,-10,
 20, 20,  0,  0,  0,  0, 20, 20,
 20, 30, 10,  0,  0, 10, 30, 20
]

// prettier-ignore
const KING_END_SQ = [
  -50,-40,-30,-20,-20,-30,-40,-50,
  -30,-20,-10,  0,  0,-10,-20,-30,
  -30,-10, 20, 30, 30, 20,-10,-30,
  -30,-10, 30, 40, 40, 30,-10,-30,
  -30,-10, 30, 40, 40, 30,-10,-30,
  -30,-10, 20, 30, 30, 20,-10,-30,
  -30,-30,  0,  0,  0,  0,-30,-30,
  -50,-30,-30,-30,-30,-30,-30,-50
]

export const SQUARE_WEIGHT_TABLES = {
  [WHITE]: {
    p: PAWN_SQ,
    n: KNIGHTS_SQ,
    b: BISHOP_SQ,
    r: ROOK_SQ,
    q: QUEEN_SQ,
    k: { middle: KING_MD_SQ, end: KING_END_SQ },
  },
  [BLACK]: {
    p: PAWN_SQ.slice().reverse(),
    n: KNIGHTS_SQ.slice().reverse(),
    b: BISHOP_SQ.slice().reverse(),
    r: ROOK_SQ.slice().reverse(),
    q: QUEEN_SQ.slice().reverse(),
    k: {
      middle: KING_MD_SQ.slice().reverse(),
      end: KING_END_SQ.slice().reverse(),
    },
  },
};

import {
  BLACK,
  DEFAULT_FEN,
  K_SIDE_CASTLE,
  pieceCode,
  Q_SIDE_CASTLE,
  rookSides,
  WHITE,
  mailbox,
  mailbox64,
  mailboxOffsets,
  mailboxKingAttackOffsets,
  pieceTypeToCode,
} from "@/constants/chess.js";
import Board from "./board.js";
import Move from "./move.js";
import Zobrist from "./zobrist.js";

export default class ChessGame {
  currentPlayer = WHITE;
  castling = {
    [WHITE]: 0,
    [BLACK]: 0,
  };
  enPassantIndex = null;
  halfMoveCount = 0;
  moveCount = 1;
  moves = [];
  uglyMoves = [];
  history = [];
  redoHistory = [];
  hashHistory = [];

  constructor(fen = DEFAULT_FEN) {
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
      else Move.generatePieceMoves(piece, this, moves, onlyCapture);
    });

    return moves;
  }

  generateMoves(options) {
    let pseudoMoves = this.generatePseudoLegalMoves(options?.onlyCapture);

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
    if (piece.type === pieceCode.king) this.castling[piece.color] = 0;
    else if (piece.type === pieceCode.rook) {
      if (piece.index === rookSides[piece.color].k)
        this.castling[piece.color] &= Q_SIDE_CASTLE;
      else if (piece.index === rookSides[piece.color].q)
        this.castling[piece.color] &= K_SIDE_CASTLE;
    }
  }

  generateHistory(move) {
    this.history.push({
      move: move,
      castling: {
        [WHITE]: this.castling[WHITE],
        [BLACK]: this.castling[BLACK],
      },
      enPassantIndex: this.enPassantIndex,
      halfMoveCount: this.halfMoveCount,
      moveCount: this.moveCount,
      currentPlayer: this.currentPlayer,
    });
    this.hashHistory.push(this.zobrist.hash);
  }

  makeUglyMove(move) {
    this.generateHistory(move);
    this.zobrist.loadMove(move);

    this.board.deletePiece(move.piece);

    this.enPassantIndex = move.enPassant ? move.targetIndex : null;

    if (this.currentPlayer === BLACK) this.moveCount++;
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
    else this.halfMoveCount++;
  }

  convertToMove(move) {
    let uglyMove;
    if (move instanceof Move) uglyMove = move;
    else if (typeof move === "string" || move?.san) {
      uglyMove = this.uglyMoves.find((_uglyMove) => _uglyMove.san === move);
    } else {
      uglyMove = this.uglyMoves.find((_uglyMove) => {
        if (
          move.from === _uglyMove.startString &&
          move.to === _uglyMove.targetString
        ) {
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
      // Update pawn as queen when it is in last square
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
        if (!returnCount) return true;
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
        if (!returnCount) return true;
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
        if (!returnCount) return true;
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

      while (index != -1 && index != undefined) {
        const sq = this.getPiece(index);

        if (sq != null) {
          let captureOffsets = mailboxOffsets[sq.type];

          if (
            sq.isSlide &&
            sq.color !== color &&
            captureOffsets.includes(offset)
          ) {
            if (!returnCount) return true;
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
      return (
        this.inKnightAttack(index, color, returnCount) +
        this.inPawnAttack(index, color, returnCount) +
        this.inSlidingAttack(index, color, returnCount) +
        this.inKingAttack(index, color, returnCount)
      );
    }

    return (
      this.inKnightAttack(index, color) ||
      this.inPawnAttack(index, color) ||
      this.inSlidingAttack(index, color) ||
      this.inKingAttack(index, color)
    );
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
          if (move.capture) captures++;
        }
      }
      this.undoUglyMove();
    }

    return { count: totalMove, captures };
  }

  getOpponentColor(color) {
    return color === WHITE ? BLACK : WHITE;
  }

  get board64Arr() {
    return this.board.squares;
  }

  get opponentColor() {
    return this.currentPlayer === WHITE ? BLACK : WHITE;
  }

  get inThreeFold() {
    if (!this.hashHistory.length) return false;

    return this.hashHistory.filter((x) => x === this.zobrist.hash).length >= 3;
  }

  get inFiftyMove() {
    return this.halfMoveCount >= 100;
  }

  get gameOver() {
    return (
      !this.uglyMoves.length ||
      this.board.pieceCount === 2 ||
      this.inThreeFold ||
      this.inFiftyMove
    );
  }

  get winner() {
    if (this.gameOver) {
      if (this.inCheck()) {
        return this.currentPlayer === WHITE ? BLACK : WHITE;
      } else {
        return "draw";
      }
    } else {
      return null;
    }
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

  // FEN
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
    if (this.enPassantIndex === null) return "-";
    else {
      const char = (this.enPassantIndex % 8) + 97;
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

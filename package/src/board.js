import { BLACK, DEFAULT_FEN, pieceCode, WHITE } from "@/constants/chess";
import PieceList from "./pieceList";
import Piece from "./pieces";

export default class Board {
  squares = Array(64).fill(null);
  validMoves = [];
  kings = {
    [WHITE]: null,
    [BLACK]: null,
  };
  pieceList = {
    black: new PieceList(),
    white: new PieceList(),
  };

  constructor(fen) {
    this.fenPosition = fen || DEFAULT_FEN.split(" ")[0];
  }

  getPiece(x, y = null) {
    if (x === -1) return null;
    if (y) return this.squares[(y - 1) * 8 + (x - 1)];
    else return this.squares[x];
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
      white: new PieceList(),
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
            color: char !== char.toLowerCase() ? WHITE : BLACK,
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

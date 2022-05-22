import { pieceCode, pieceCodeToName, WHITE } from "@/constants/chess";

class Piece {
  index = 0;
  color = WHITE;
  imgUrl = "";
  imgAlt = "";
  code = "";
  isSlide = false;

  constructor({ index, color, code }) {
    this.index = index;
    this.color = color;
    this.code = code;
    this.type = this.code.toLowerCase();
    this.pieceName = pieceCodeToName[this.type];
    this.isSlide =
      this.type === pieceCode.bishop ||
      this.type === pieceCode.queen ||
      this.type === pieceCode.rook;
  }

  changePieceType(code) {
    this.code = code;
    this.code = code;
    this.type = this.code.toLowerCase();
    this.pieceName = pieceCodeToName[this.type];
    this.isSlide =
      this.type === pieceCode.bishop ||
      this.type === pieceCode.queen ||
      this.type === pieceCode.rook;
  }

  get position() {
    return {
      x: this.index % 8,
      y: parseInt(this.index / 8),
    };
  }

  equals(piece) {
    return piece.index === this.index;
  }
}

export default Piece;

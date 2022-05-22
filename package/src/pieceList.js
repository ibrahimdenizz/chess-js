export default class PieceList {
  list = {};
  numPieces = 0;
  numNotPawn = 0;

  addPiece(piece) {
    this.list[piece.index] = piece;
    this.numPiece++;
    if (piece.type !== "p") this.numNotPawn++;
  }

  deletePiece(piece) {
    delete this.list[piece.index];
    this.numPiece--;
    if (piece.type !== "p") this.numNotPawn--;
  }

  mapList(cb) {
    for (const pieceIndex in this.list) {
      cb(this.list[pieceIndex]);
    }
  }
}

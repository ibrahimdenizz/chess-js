import { TT_EXACT, TT_LOWER, TT_UPPER } from "@/constants/chess";

export class TranspositionTable {
  hashes = {};

  constructor(game) {
    this.game = game;
  }

  get hash() {
    return this.game.zobrist.hash;
  }

  clear() {
    this.hashes = {};
  }

  getHash(game) {
    if (game) return game.zobrist.hash;
    else return this.hash;
  }

  getMove(game = null) {
    const hash = this.getHash(game);
    return entries[hash].move;
  }

  getStoredHash({ depth, alpha, beta }, game = null) {
    const hash = this.getHash(game);
    const storedHash = this.hashes[hash];

    if (storedHash && depth <= storedHash.depth) {
      if (storedHash.type === TT_EXACT) return storedHash;
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

<template>
  <div>
    <p
      :style="{
        'text-align': 'center',
      }"
    >
      Winner: {{ winner }}
    </p>
    <p
      :style="{
        'text-align': 'center',
      }"
    >
      FEN: {{ game.fen }}
    </p>
    <p
      :style="{
        'text-align': 'center',
      }"
    >
      Zobrist Hash: {{ game.zobrist.hash }}
    </p>
    <div class="home">
      <chess-board
        :size="chessBoardSize"
        :game="game"
        v-model="fen"
        @onMovePlayed="onMovePlayed"
        @onGameOver="onGameOver"
      />
      <div>
        <div class="btn-group">
          <button class="btn" @click="undoMove()">Undo</button>
          <button class="btn" @click="redoMove()">Redo</button>
        </div>
        <button class="btn" @click="changeGameType('two-player')">
          Two player
        </button>
        <button class="btn" @click="changeGameType('random-ai')">
          Random AI
        </button>
        <button class="btn" @click="changeGameType('normal-ai')">
          Normal AI
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ChessBoard } from "@ibrahimdeniz/vue-chessboard";
import { ChessAI, ChessGame } from "@ibrahimdeniz/chess-js";
import "@ibrahimdeniz/vue-chessboard/dist/style.css";

const ratio = 0.8;

export default {
  name: "App",
  data() {
    const [width, height] = [window.innerWidth, window.innerHeight];
    const game = new ChessGame();
    return {
      chessBoardSize: width > height ? height * ratio : width * ratio,
      fen: "",
      game,
      randomAI: new ChessAI({ type: "random" }),
      normalAI: new ChessAI({ type: "normal", depth: 3 }),
      winner: null,
      gameType: "normal-ai",
      isPlayTwoAI: false,
      aiMove: null,
    };
  },
  components: {
    ChessBoard,
  },
  mounted() {
    window.addEventListener("resize", this.myEventHandler);
  },
  unmounted() {
    window.removeEventListener("resize", this.myEventHandler);
  },
  methods: {
    myEventHandler() {
      const [width, height] = [window.innerWidth, window.innerHeight];
      this.chessBoardSize = width > height ? height * ratio : width * ratio;
    },
    onMovePlayed({ move, game }) {
      console.log(move);
      game.makeMove(move);
      if (this.gameType !== "two-player") this.makeAiMove(game);
    },
    makeAiMove(game) {
      return setTimeout(() => {
        if (this.gameType === "random-ai") {
          if (!game.gameOver && game.currentPlayer === "black") {
            const aiMove = this.randomAI.selectMove(game.fen);
            game.makeMove(aiMove);
          }
        } else if (this.gameType === "normal-ai") {
          if (!game.gameOver && game.currentPlayer === "black") {
            const aiMove = this.normalAI.selectMove(game.fen, { debug: true });
            game.makeMove(aiMove);
          }
        }
      }, 0);
    },
    onGameOver({ winner }) {
      this.winner = winner;
    },
    changeGameType(type) {
      this.isPlayTwoAI = false;
      this.gameType = type;
      this.game = new ChessGame();
    },
    undoMove() {
      this.game.undoMove();
    },
    redoMove() {
      this.game.redoMove();
    },
    async playTwoAI() {
      this.isPlayTwoAI = true;
      while (!this.game.gameOver && this.isPlayTwoAI) {
        const move = this.randomAI.selectMove(this.game.copy);
        this.game.makeMove(move);
        await this.sleep(300);
      }
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
}

.btn-group .btn {
  display: initial;
}

.btn {
  height: 50px;
  width: 100px;
  margin-left: 20px;
  margin-bottom: 20px;
  display: block;
}
</style>

# chess-js

Javascript chess library for chess rules and chess ai

## Installation

```bash
# npm
npm install @ibrahimdeniz/chess-js

#yarn
yarn add @ibrahimdeniz/chess-js
```

# Example

## ChessGame Example

```js
import { ChessGame } from "@ibrahimdeniz/chess-js";

const game = new ChessGame();

console.log(game.moves);
/*
  [
    {
      san: 'a3',
      piece: 'p',
      from: 'a2',
      to: 'a3',
      castling: false,
      capture: null,
      promotion: null,
      enPassant: false
    },
  ...
  ]
 */

// Validate Move
console.log(game.validateMove({ from: "a7", to: "a6" })); // false
// or with Standard Algebraic Notation (SAN)
// console.log(game.validateMove("a7")); // false

// Make move with from and to squares
game.makeMove({ from: "a2", to: "a3" });
// or with Standard Algebraic Notation (SAN)
// game.makeMove("a3");
// or with library moves
// game.makeMove(game.moves[0])

console.log(game.fen); // rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR/ b KQkq - 0 1

// Undo last move
game.undoMove();
console.log(game.fen); // rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1

// Redo last undo move
game.redoMove();
console.log(game.fen); // rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR/ b KQkq - 0 1

// Check game over
console.log(game.gameOver); // false
```

## ChessAI

```js
import { ChessAI } from "@ibrahimdeniz/chess-js";

const ai = new ChessAI();

const startFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1";
const move = ai.selectMove(startFEN, { depth: 5 });
console.log(move);
/* 
  {
    san: 'd4',
    piece: 'p',
    from: 'd2',
    to: 'd4',
    castling: false,
    capture: null,
    promotion: null,
    enPassant: true
  }
*/
```

# API

1. [ChessGame](#chessgame)
   - [Constructor(fen)](#constructor-fen)
   - [Properties](#properties)
     - [moves](#moves)
     - [fen](#fen)
     - [gameOver](#gameover)
     - [winner](#winner)
     - [currentPlayer](#currentplayer-and-opponentplayer)
     - [opponentColor](#currentplayer-and-opponentplayer)
     - [enPassant](#enpassant)
     - [halfMoveCount](#halfmovecount)
     - [moveCount](#movecount)
     - [copy](#copy)
   - [Methods](#methods)
     - [loadGameWithFen(fen)](#loadgamewithfenfen)
     - [validateMove(move)](#validatemovemove)
     - [makeMove(move)](#makemovemove)
     - [undoMove()](#undomove)
     - [redoMove()](#redomove)
     - [inCheck()](#incheck)
     - [inDoubleCheck()](#indoublecheck)
2. [ChessAI](#chessai-1)
   - [Constructor(type, depth)](#constructor-type---depth)
   - [Methods](#methods-1)
     - [selectMove(fen, options)](#selectmovefen-options)

## ChessGame

### Constructor([ fen ])

Constructor of ChessGame class takes optional [Forsyth-Edwards Notation](https://www.chessprogramming.org/Forsyth-Edwards_Notation) string to load game

Paramaters:

| Name | Type   | Default                                                    | Definition                                                                            |
| ---- | ------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| fen  | String | "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" | [Forsyth-Edwards Notation](https://www.chessprogramming.org/Forsyth-Edwards_Notation) |

```js
// Create game with default start fen string.
// rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1
const game = new ChessGame();

// Create game with fen string
const game = new ChessGame(
  "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2"
);
```

## Properties

### moves

Array object of valid chess moves. Type structure of object:

| Name      | Type                                   | Definition                                                                                         |
| --------- | -------------------------------------- | -------------------------------------------------------------------------------------------------- |
| san       | String                                 | [Standard Algebraic Notation (SAN)](https://www.chessprogramming.org/Algebraic_Chess_Notation#SAN) |
| piece     | 'p' \| 'n' \| 'b' \| 'r' \| 'q' \| 'k' | Type of piece with char                                                                            |
| from      | String                                 | Algebraic definition of start square                                                               |
| to        | String                                 | Algebraic definition of end square                                                                 |
| castling  | false \| 'king-side' \| 'queen-side'   | Define there is castling and side of castling                                                      |
| capture   | null \| piece                          | There is capture and type of capture piece                                                         |
| promotion | null \| 'n' \| 'b' \| 'r' \| 'q'       | There is promotion and type of promotion                                                           |
| enPassant | Boolean                                | Is move en passant                                                                                 |

Example:

```js
console.log(game.moves[0]);
/*
  {
    san: 'a3',
    piece: 'p',
    from: 'a2',
    to: 'a3',
    castling: false,
    capture: null,
    promotion: null,
    enPassant: false
  },
 */
```

### fen

[Forsyth-Edwards Notation](https://www.chessprogramming.org/Forsyth-Edwards_Notation) string of current game.

```js
console.log(game.fen); // rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1
game.makeMove("a3");
console.log(game.fen); // rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR/ b KQkq - 0 1
```

### gameOver

Get current game status.

```js
console.log(game.gameOver); // false
// draw position
game.loadGameWithFen("7k/4NK2/5r2/5BN1/8/8/8/8 w - - 103 115");
console.log(game.gameOver); // true
// checkmate position
game.loadGameWithFen("3rkbnr/1p1bp3/1q1p3p/p5pQ/3n4/PPR5/5PPP/6K1 b - - 2 2");
console.log(game.gameOver); // true
```

### winner

Get winner of game. It can be black, white or draw.

```js
console.log(game.winner); // false
// draw position
game.loadGameWithFen("7k/4NK2/5r2/5BN1/8/8/8/8 w - - 103 115");
console.log(game.winner); // draw
// checkmate position
game.loadGameWithFen("3rkbnr/1p1bp3/1q1p3p/p5pQ/3n4/PPR5/5PPP/6K1 b - - 2 2");
console.log(game.winner); // white
```

### currentPlayer and opponentPlayer

Get current player color and its opponent color

```js
console.log(game.currentPlayer, game.opponentPlayer); // white, black
game.makeMove("a3");
console.log(game.currentPlayer, game.opponentPlayer); // black, white
```

### enPassant

Get [en passant](https://www.chessprogramming.org/En_passant) square if there is in current game

```js
console.log(game.enPassant); // null
game.makeMove("e4");
console.log(game.enPassant); // 'e4'
```

### halfMoveCount

Get [half move count](https://www.chessprogramming.org/Halfmove_Clock) of current game.

```js
console.log(game.halfMoveCount); // 0
game.makeMove("Na3");
console.log(game.halfMoveCount); // 1
```

### moveCount

Get count of black moves for current game.

```js
console.log(game.moveCount); // 0
game.makeMove("a3"); // white move
console.log(game.moveCount); // 0
game.makeMove("a5"); // black move
console.log(game.moveCount); // 1
```

### copy

Get copy of current game

```js
console.log(game instanceof ChessGame); // true
console.log(game.copy instanceof ChessGame); // true
```

## Methods

### loadGameWithFen(fen)

This method load game for created game with fen.

Paramaters:

| Name | Type   | Default | Definition                                                                            |
| ---- | ------ | ------- | ------------------------------------------------------------------------------------- |
| fen  | String | -       | [Forsyth-Edwards Notation](https://www.chessprogramming.org/Forsyth-Edwards_Notation) |

Example:

```js
const game = new ChessGame();
console.log(game.fen); // rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1
game.loadGameWithFen("3rkbnr/1p1bp3/1q1p3p/p5pQ/3n4/PPR5/5PPP/6K1 b - - 2 2");
console.log(game.fen); // 3rkbnr/1p1bp3/1q1p3p/p5pQ/3n4/PPR5/5PPP/6K1/ b - - 2 2
```

### validateMove(move)

This method load game for created game with fen.

Paramaters:

| Name | Type             | Default | Definition |
| ---- | ---------------- | ------- | ---------- |
| move | String \| Object | -       | Chess move |

Example:

```js
console.log(game.validateMove("e4")); // true
console.log(game.validateMove({ from: "e7", to: "e8" })); // false
```

### makeMove(move)

This method validate move and change game status according to move.

Paramaters:

| Name | Type             | Default | Definition |
| ---- | ---------------- | ------- | ---------- |
| move | String \| Object | -       | Chess move |

Example:

```js
console.log(game.makeMove("e4")); // true
console.log(game.fen); // rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR/ b KQkq e4 0 1
console.log(game.makeMove("e4")); // false
console.log(game.fen); // rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR/ b KQkq e4 0 1
console.log(game.makeMove({ from: "e7", to: "e6" })); // true
console.log(game.fen); // rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR/ w KQkq - 0 2
console.log(game.makeMove({ from: "e7", to: "e6" })); // false
console.log(game.fen); // rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR/ w KQkq - 0 2
console.log(game.makeMove(game.moves[0])); // true
console.log(game.fen); // rnbqkbnr/pppp1ppp/4p3/4P3/8/8/PPPP1PPP/RNBQKBNR/ b KQkq - 0 2
```

### undoMove()

This method undo last move.

Paramaters:

| Name | Type | Default | Definition |
| ---- | ---- | ------- | ---------- |

Example:

```js
game.makeMove("e4");
console.log(game.fen); // rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR/ b KQkq e4 0 1
game.undoMove();
console.log(game.fen); // rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1
```

### redoMove()

This method redo last undo move.

Paramaters:

| Name | Type | Default | Definition |
| ---- | ---- | ------- | ---------- |

Example:

```js
game.makeMove("e4");
console.log(game.fen); // rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR/ b KQkq e4 0 1
game.undoMove();
console.log(game.fen); // rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/ w KQkq - 0 1
game.redoMove();
console.log(game.fen); // rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR/ b KQkq e4 0 1
```

### inCheck()

This method return true if current player king is in check.

Paramaters:

| Name | Type | Default | Definition |
| ---- | ---- | ------- | ---------- |

Example:

```js
game.loadGameWithFen(
  "rnbqk1nr/pppp1ppp/8/2b1Q3/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 0 3"
);
console.log(game.inCheck()); // true
```

### inDoubleCheck()

This method return true if current player king is in double check.

Paramaters:

| Name | Type | Default | Definition |
| ---- | ---- | ------- | ---------- |

Example:

```js
game.loadGameWithFen(
  "rnbk1b1r/pp3ppp/2p5/4q1B1/4n3/8/PPP2PPP/2KR1BNR b - - 1 10"
);
console.log(game.inDoubleCheck()); // true
```

## ChessAI

### Constructor([ type ], [ depth ])

Constructor of ChessAI class takes optional type and depth parameter to load game

Paramaters:

| Name  | Type                 | Default  | Definition                                |
| ----- | -------------------- | -------- | ----------------------------------------- |
| type  | 'normal' \| 'random' | 'normal' | Type of ai. Random generate random moves. |
| depth | Number               | 1        | Dept of normal ai                         |

Example:

```js
const ai = new ChessAI();
const ai = new ChessAI("random");
const ai = new ChessAI("normal", 5);
```

## Methods

### selectMove(fen, options)

This method search move according to depth with fen string and select best move for fen.
Paramaters:

| Name          | Type    | Default | Definition                                                                            |
| ------------- | ------- | ------- | ------------------------------------------------------------------------------------- |
| fen           | String  |         | [Forsyth-Edwards Notation](https://www.chessprogramming.org/Forsyth-Edwards_Notation) |
| options.depth | Number  | 1       | depth of normal ai                                                                    |
| options.debug | Boolean | false   | to print debug informations                                                           |

Example:

```js
const game = new ChessGame();
const ai = new ChessAI();

const move = ai.selectMove(game.fen, { depth: 5 });

console.log(move);
/*
  {
    san: 'd4',
    piece: 'p',
    from: 'd2',
    to: 'd4',
    castling: false,
    capture: null,
    promotion: null,
    enPassant: true
  }
*/
```

# LICENSE

```
MIT License

Copyright (c) 2022 İbrahim Deniz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```

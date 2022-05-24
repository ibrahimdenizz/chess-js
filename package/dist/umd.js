(function(p,g){typeof exports=="object"&&typeof module!="undefined"?g(exports):typeof define=="function"&&define.amd?define(["exports"],g):(p=typeof globalThis!="undefined"?globalThis:p||self,g(p.chessJS={}))})(this,function(p){"use strict";var et=Object.defineProperty;var st=(p,g,h)=>g in p?et(p,g,{enumerable:!0,configurable:!0,writable:!0,value:h}):p[g]=h;var a=(p,g,h)=>(st(p,typeof g!="symbol"?g+"":g,h),h);const g="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",h="white",l="black",w=["a","b","c","d","e","f","g","h"],k={black:{k:7,q:0},white:{k:63,q:56}},R={[h]:6,[l]:1},K={[h]:0,[l]:7},_={black:{k:"k",q:"q",b:"b",n:"n",p:"p",r:"r"},white:{k:"K",q:"Q",b:"B",n:"N",p:"P",r:"R"}},d={king:"k",queen:"q",bishop:"b",knight:"n",pawn:"p",rook:"r"},m={k:"king",q:"queen",b:"bishop",n:"knight",p:"pawn",r:"rook"},B={k:[1,7,-8,9,1,-7,-8,-9],q:[1,7,-8,9,1,-7,-8,-9],b:[7,9,-7,-9],n:[6,10,15,17,-6,-10,-15,-17],p:{[h]:[-8,-16],[l]:[8,16]},r:[1,8,-1,-8]},I=[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,2,3,4,5,6,7,-1,-1,8,9,10,11,12,13,14,15,-1,-1,16,17,18,19,20,21,22,23,-1,-1,24,25,26,27,28,29,30,31,-1,-1,32,33,34,35,36,37,38,39,-1,-1,40,41,42,43,44,45,46,47,-1,-1,48,49,50,51,52,53,54,55,-1,-1,56,57,58,59,60,61,62,63,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],x=[21,22,23,24,25,26,27,28,31,32,33,34,35,36,37,38,41,42,43,44,45,46,47,48,51,52,53,54,55,56,57,58,61,62,63,64,65,66,67,68,71,72,73,74,75,76,77,78,81,82,83,84,85,86,87,88,91,92,93,94,95,96,97,98],M={n:[-21,-19,-12,-8,8,12,19,21],b:[-11,-9,9,11],r:[-10,-1,1,10],q:[-11,-10,-9,-1,1,9,10,11],k:[-11,-10,-9,-1,1,9,10,11],p:{[h]:[-11,-9],[l]:[9,11]}},T={k:[-11,-10,-9,-1,1,9,10,11],n:[-21,-19,-12,-8,8,12,19,21],p:{[h]:[11,9],[l]:[-9,-11]}},L=0,N=1,q=2,P={k:2e4,q:900,r:500,b:330,n:320,p:100,P_ISSUES:.5,LEGAL_MOVES:.1,[h]:1,[l]:-1},D=P.r*2+P.b+P.n,Q=[0,0,0,0,0,0,0,0,50,50,50,50,50,50,50,50,10,10,20,30,30,20,10,10,5,5,10,25,25,10,5,5,0,0,0,20,20,0,0,0,5,-5,-10,0,0,-10,-5,5,5,10,10,-20,-20,10,10,5,0,0,0,0,0,0,0,0],H=[-50,-40,-30,-30,-30,-30,-40,-50,-40,-20,0,0,0,0,-20,-40,-30,0,10,15,15,10,0,-30,-30,5,15,20,20,15,5,-30,-30,0,15,20,20,15,0,-30,-30,5,10,15,15,10,5,-30,-40,-20,0,5,5,0,-20,-40,-50,-40,-30,-30,-30,-30,-40,-50],O=[-20,-10,-10,-10,-10,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,10,10,5,0,-10,-10,5,5,10,10,5,5,-10,-10,0,10,10,10,10,0,-10,-10,10,10,10,10,10,10,-10,-10,5,0,0,0,0,5,-10,-20,-10,-10,-10,-10,-10,-10,-20],U=[0,0,0,0,0,0,0,0,5,10,10,10,10,10,10,5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,0,0,0,5,5,0,0,0],G=[-20,-10,-10,-5,-5,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,5,5,5,0,-10,-5,0,5,5,5,5,0,-5,0,0,5,5,5,5,0,-5,-10,5,5,5,5,5,0,-10,-10,0,5,0,0,0,0,-10,-20,-10,-10,-5,-5,-10,-10,-20],F=[-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-20,-30,-30,-40,-40,-30,-30,-20,-10,-20,-20,-20,-20,-20,-20,-10,20,20,0,0,0,0,20,20,20,30,10,0,0,10,30,20],W=[-50,-40,-30,-20,-20,-30,-40,-50,-30,-20,-10,0,0,-10,-20,-30,-30,-10,20,30,30,20,-10,-30,-30,-10,30,40,40,30,-10,-30,-30,-10,30,40,40,30,-10,-30,-30,-10,20,30,30,20,-10,-30,-30,-30,0,0,0,0,-30,-30,-50,-30,-30,-30,-30,-30,-30,-50],A={[h]:{p:Q,n:H,b:O,r:U,q:G,k:{middle:F,end:W}},[l]:{p:Q.slice().reverse(),n:H.slice().reverse(),b:O.slice().reverse(),r:U.slice().reverse(),q:G.slice().reverse(),k:{middle:F.slice().reverse(),end:W.slice().reverse()}}};class S{constructor(){a(this,"list",{});a(this,"numPieces",0);a(this,"numNotPawn",0)}addPiece(t){this.list[t.index]=t,this.numPiece++,t.type!=="p"&&this.numNotPawn++}deletePiece(t){delete this.list[t.index],this.numPiece--,t.type!=="p"&&this.numNotPawn--}mapList(t){for(const e in this.list)t(this.list[e])}}class z{constructor({index:t,color:e,code:s}){a(this,"index",0);a(this,"color",h);a(this,"imgUrl","");a(this,"imgAlt","");a(this,"code","");a(this,"isSlide",!1);this.index=t,this.color=e,this.code=s,this.type=this.code.toLowerCase(),this.pieceName=m[this.type],this.isSlide=this.type===d.bishop||this.type===d.queen||this.type===d.rook}changePieceType(t){this.code=t,this.code=t,this.type=this.code.toLowerCase(),this.pieceName=m[this.type],this.isSlide=this.type===d.bishop||this.type===d.queen||this.type===d.rook}get position(){return{x:this.index%8,y:parseInt(this.index/8)}}equals(t){return t.index===this.index}}class ${constructor(t){a(this,"squares",Array(64).fill(null));a(this,"validMoves",[]);a(this,"kings",{[h]:null,[l]:null});a(this,"pieceList",{black:new S,white:new S});this.fenPosition=t||g.split(" ")[0]}getPiece(t,e=null){return t===-1?null:e?this.squares[(e-1)*8+(t-1)]:this.squares[t]}addPiece(t){this.pieceList[t.color].addPiece(t),this.squares[t.index]=t}deletePiece(t){t&&(this.pieceList[t.color].deletePiece(t),this.squares[t.index]=null)}mapColorList(t,e){this.pieceList[t].mapList(e)}clear(){this.squares=Array(64).fill(null),this.pieceList={black:new S,white:new S}}set fenPosition(t){this.clear(),t.split("/").forEach((e,s)=>{let n=0;e.split("").forEach(i=>{if(parseInt(i))n+=parseInt(i);else{const o={index:s*8+n,code:i,color:i!==i.toLowerCase()?h:l},r=new z(o);this.addPiece(r),r.type===d.king&&(this.kings[r.color]=r),n++}})})}get fenPosition(){let t="",e=0,s=0;return this.squares.forEach(n=>{n==null?(e++,s++):(t+=e?e+n.code:""+n.code,e=0,s++),s%8===0&&(t+=e?e+"/":"/",e=0,s=0)}),t}getColorNotPawnNum(t){return this.pieceList[t].numNotPawn}get pieceCount(){return this.pieceList.white.numPieces+this.pieceList.black.numPieces}}class f{constructor({piece:t,targetIndex:e,capture:s=null,enPassant:n=!1,enPassantCapture:i=!1,castling:o=0,promotion:r=null,chess:c}){a(this,"piece",null);a(this,"startIndex",0);a(this,"targetIndex",0);a(this,"capture",null);a(this,"castling",0);a(this,"enPassant",!1);a(this,"enPassantCapture",!1);a(this,"promotion",null);a(this,"score",0);this.piece=t,this.startIndex=t.index,this.targetIndex=e,this.capture=s,this.enPassant=n,this.enPassantCapture=i,this.castling=o,this.promotion=r,this.setScore(c)}get isCheck(){return this.capture&&this.capture.type===d.king}indexToPosition(t){return{y:parseInt(t/8),x:t%8}}indexToString(t){return""+w[t%8]+(8-parseInt(t/8))}get startPosition(){return this.indexToPosition(this.startIndex)}get targetPosition(){return this.indexToPosition(this.targetIndex)}get startString(){return this.indexToString(this.startIndex)}get targetString(){return this.indexToString(this.targetIndex)}get isTargetLastFile(){return this.piece.color===h?this.targetPosition.y===0:this.targetPosition.y===7}get pretty(){let t=!1;return this.castling&2?t="king-side":this.castling&1&&(t="queen-side"),{san:this.san,piece:this.piece.type,from:this.startString,to:this.targetString,castling:t,capture:this.capture?this.capture.type:null,promotion:this.promotion,enPassant:this.enPassant}}getSanConflict(t){let e="";const s=this.startPosition;let n=!1,i=!1;for(const o of t)if(o.piece.type===this.piece.type&&o.startIndex!==this.startIndex&&o.targetIndex===this.targetIndex&&(s.x===o.startPosition.x&&(n=!0),s.y===o.startPosition.y&&(i=!0),n&&i))break;return i&&(e+=w[s.x]),n&&(e+=8-s.y),e}setSAN(t){this.san="",this.castling===2?this.san="o-o":this.castling===1?this.san="o-o-o":(this.piece.type!==d.pawn&&(this.san+=this.piece.type.toUpperCase(),this.san+=this.getSanConflict(t)),this.capture&&(this.piece.type===d.pawn&&(this.san+=w[this.startPosition.x]),this.san+="x"),this.san+=this.targetString,this.promotion&&(this.san+="="+this.promotion.toUpperCase()))}setScore(t){this.capture&&(this.score+=P[this.capture.type]),this.promotion&&(this.score+=P[this.promotion]),t.inAttack(this.targetIndex,this.piece.color)&&(this.score-=P[this.piece.type]),this.piece.type!==d.pawn&&t.inPawnAttack(this.targetIndex,this.piece.color)&&(this.score-=P[this.piece.type])}static generatePawnMoves(t,e,s,n=!1){const i=B[t.type][t.color].map(r=>r+t.index),o={piece:t,targetIndex:i[0],chess:e};n||this.generatePawnForward(t,e,s,i,o);for(const r of M.p[t.color]){let c=t.index;c=I[x[c]+r],c!==-1&&this.generatePawnCapture(t,e,s,i,o,r,c)}}static generatePawnForward(t,e,s,n,i){const o=R[t.color];if(!this.isIndexValid(n[0]))return[];e.getPiece(n[0])||(parseInt(n[0]/8)===K[t.color]?this.generatePromotionMoves(s,i):(s.push(new f(i)),t.position.y===o&&!e.getPiece(n[1])&&(i.targetIndex=n[1],i.enPassant=!0,s.push(new f(i)),i.enPassant=!1)))}static generatePawnCapture(t,e,s,n,i,o,r){const c=o<0?e.enPassantIndex-8:e.enPassantIndex+8,u=e.getPiece(r);if(u&&u.color!=t.color)i.targetIndex=u.index,i.capture=u,parseInt(n[0]/8)===K[t.color]?this.generatePromotionMoves(s,i):s.push(new f(i));else if(r===c){const y=e.getPiece(e.enPassantIndex);i.capture=y,i.targetIndex=c,s.push(new f(i))}}static generatePromotionMoves(t,e){e.promotion="q",t.push(new f(e)),e.promotion="r",t.push(new f(e)),e.promotion="b",t.push(new f(e)),e.promotion="n",t.push(new f(e)),e.promotion=null}static generatePieceMoves(t,e,s,n=!1){const i=M[t.type],o={piece:t,capture:null,chess:e};for(const r of i){let c=t.index;for(c=I[x[c]+r];c!=-1;){const u=e.getPiece(c);if(u!=null){u.color!=t.color&&(o.capture=u,o.targetIndex=c,s.push(new f(o)),o.capture=null);break}if(n||(o.targetIndex=c,s.push(new f(o))),!t.isSlide)break;c=I[x[c]+r]}}t.type===d.king&&this.generateCastleMoves(t,e,s)}static generateCastleMoves(t,e,s){const n={piece:t,chess:e},i=t.index;e.castling[t.color]&2&&!e.getPiece(i+1)&&!e.getPiece(i+2)&&!e.inCheck()&&!e.inAttack(i+1,t.color)&&!e.inAttack(i+2,t.color)&&(n.castling=2,n.targetIndex=t.index+2,s.push(new f(n))),e.castling[t.color]&1&&!e.getPiece(i-1)&&!e.getPiece(i-2)&&!e.getPiece(i-3)&&!e.inCheck()&&!e.inAttack(i-1,t.color)&&!e.inAttack(i-2,t.color)&&!e.inAttack(i-3,t.color)&&(n.castling=1,n.targetIndex=t.index-2,s.push(new f(n)))}static isIndexValid(t){return t>=0&&t<=64}}const V=1e17;class Y{constructor(t){a(this,"pieceKeys",{[h]:[],[l]:[]});a(this,"castlingKeys",{[h]:[],[l]:[]});a(this,"enPassantKeys",{[h]:[],[l]:[]});a(this,"sideToMove",0);a(this,"hash",0);a(this,"pieceTypes",["p","b","n","r","q","k"]);this.chess=t;for(let e=0;e<64;e++){this.pieceKeys[h][e]={},this.pieceKeys[l][e]={};for(const s of this.pieceTypes)this.pieceKeys[h][e][s]=this.randomNumber,this.pieceKeys[l][e][s]=this.randomNumber}for(let e=0;e<4;e++)this.castlingKeys[h][e]=this.randomNumber,this.castlingKeys[l][e]=this.randomNumber;for(let e=0;e<8;e++)this.enPassantKeys[h][e]=this.randomNumber,this.enPassantKeys[l][e]=this.randomNumber;this.sideToMove=this.randomNumber}get randomNumber(){return Math.floor(Math.random()*V)}loadMove(t){const e=t.piece,s=t.capture;if(s&&(this.hash^=this.getPieceKey(s)),t.castling&2){const i=this.chess.getPiece(k[e.color].k);this.hash^=this.getPieceKey(i),this.hash^=this.pieceKeys[i.color][i.index-2][i.type]}else if(t.castling&1){const i=this.chess.getPiece(k[e.color].q);this.hash^=this.getPieceKey(i),this.hash^=this.pieceKeys[i.color][i.index+3][i.type]}t.enPassant&&(this.hash^=this.enPassantKeys[t.targetIndex%8]),this.hash^=this.sideToMove,this.hash^=this.getPieceKey(e);const n=this.chess.getPiece(t.targetIndex);n&&(this.hash^=this.getPieceKey(n)),this.hash^=this.pieceKeys[e.color][t.targetIndex][e.type],this.chess.enPassantIndex!=0&&(this.hash^=this.enPassantKeys[this.chess.enPassantIndex%8])}getPieceKey(t){return this.pieceKeys[t.color][t.index][t.type]}loadBoard(){this.hash=this.calculate(this.chess)}calculate(){let t=0;for(const e of this.chess.board.squares)e&&(t^=this.getPieceKey(e));return this.chess.enPassantIndex&&(t^=this.enPassantKeys[this.chess.enPassantIndex%8]),this.chess.currentPlayer===l&&(t^=this.sideToMove),t^=this.castlingKeys[this.chess.castling],t}}class E{constructor(t=g){a(this,"currentPlayer",h);a(this,"castling",{[h]:0,[l]:0});a(this,"enPassantIndex",null);a(this,"halfMoveCount",0);a(this,"moveCount",1);a(this,"moves",[]);a(this,"uglyMoves",[]);a(this,"history",[]);a(this,"redoHistory",[]);a(this,"hashHistory",[]);this.board=new $,this.zobrist=new Y(this),this.fen=t,this.buildMoves(),this.zobrist.loadBoard()}generatePseudoLegalMoves(t=!1){const e=[];return this.board.mapColorList(this.currentPlayer,s=>{s.type===d.pawn?f.generatePawnMoves(s,this,e,t):f.generatePieceMoves(s,this,e,t)}),e}generateMoves(t){let e=this.generatePseudoLegalMoves(t==null?void 0:t.onlyCapture);const s=this.currentPlayer,n=[];for(const i of e)this.makeUglyMove(i),this.inCheck(s)||n.push(i),this.undoUglyMove();return this.inDoubleCheck()?n.filter(i=>i.piece.type===d.king):n}buildMoves(){this.uglyMoves=this.generateMoves(),this.uglyMoves.forEach(t=>t.setSAN(this.uglyMoves)),this.moves=this.uglyMoves.map(t=>t.pretty)}getPiece(t,e=null){return this.board.getPiece(t,e)}getPieceMoves(t){return this.uglyMoves.filter(e=>e.piece.equals(t))}checkCastlingBeforeMove(t){const e=t.piece;e.type===d.king?this.castling[e.color]=0:e.type===d.rook&&(e.index===k[e.color].k?this.castling[e.color]&=1:e.index===k[e.color].q&&(this.castling[e.color]&=2))}generateHistory(t){this.history.push({move:t,castling:{[h]:this.castling[h],[l]:this.castling[l]},enPassantIndex:this.enPassantIndex,halfMoveCount:this.halfMoveCount,moveCount:this.moveCount,currentPlayer:this.currentPlayer}),this.hashHistory.push(this.zobrist.hash)}makeUglyMove(t){if(this.generateHistory(t),this.zobrist.loadMove(t),this.board.deletePiece(t.piece),this.enPassantIndex=t.enPassant?t.targetIndex:null,this.currentPlayer===l&&this.moveCount++,this.currentPlayer=this.opponentColor,this.checkCastlingBeforeMove(t),t.capture){const e=this.getPiece(t.capture.index);this.board.deletePiece(e)}if(t.piece.type===d.pawn)this.makePawnMove(t);else if(t.castling)this.makeCastlingMove(t);else{const e=t.piece;e.index=t.targetIndex,this.board.addPiece(e)}t.piece.type===d.king&&(this.board.kings[t.piece.color]=t.piece),t.piece.type===d.pawn||t.capture?this.halfMoveCount=0:this.halfMoveCount++}convertToMove(t){let e;return(t==null?void 0:t.startIndex)&&(t==null?void 0:t.targetIndex)?e=t:typeof t=="string"?e=this.uglyMoves.find(s=>s.san===t):e=this.uglyMoves.find(s=>{if(t.from===s.startString&&t.to===s.targetString)return s.promotion?s.promotion===t.promotion:!0}),e}validateMove(t){return!!this.convertToMove(t)}makeMove(t){return this.validateMove(t)?(this.makeUglyMove(this.convertToMove(t)),this.redoHistory=[],this.buildMoves(),!0):!1}undoUglyMove(){if(this.history.length>0){const t=this.history.pop(),e=this.hashHistory.pop(),s=t.move,n=s.capture,i=s.piece;if(s.promotion&&i.changePieceType(_[i.color].p),this.castling=t.castling,this.enPassantIndex=t.enPassantIndex,this.halfMoveCount=t.halfMoveCount,this.moveCount=t.moveCount,this.currentPlayer=t.currentPlayer,this.zobrist.hash=e,this.board.deletePiece(i),i.index=s.startIndex,this.board.addPiece(i),n&&this.board.addPiece(n),s.castling){let r,c;s.castling&2?(r=k[i.color].k,c=r-2):s.castling&1&&(r=k[i.color].q,c=r+3);const u=this.getPiece(c);this.board.deletePiece(u),u.index=r,this.board.addPiece(u)}}}undoMove(){this.redoHistory.push(this.history[this.history.length-1]),this.undoUglyMove(),this.buildMoves()}redoMove(){if(this.redoHistory.length>0){const t=this.redoHistory.pop();this.makeUglyMove(t.move),this.buildMoves()}}makeCastlingMove(t){const e=t.piece;if(t.castling&2){e.index+=2,this.board.addPiece(e);const s=this.getPiece(k[e.color].k);this.board.deletePiece(s),s.index-=2,this.board.addPiece(s)}else if(t.castling&1){e.index-=2,this.board.addPiece(e);const s=this.getPiece(k[e.color].q);this.board.deletePiece(s),s.index+=3,this.board.addPiece(s)}this.castling[e.color]=0}makePawnMove(t){const e=t.piece;e.index=t.targetIndex,t.promotion&&e.changePieceType(_[e.color][t.promotion]),this.board.addPiece(e)}loadGameWithFen(t){this.fen=t,this.buildMoves()}inKnightAttack(t,e,s=!1){let n=0;for(const i of T.n){let o=t;o=I[x[o]+i];const r=this.getPiece(o);if(r&&r.type===d.knight&&r.color!==e){if(!s)return!0;n++}}return s?n:!1}inPawnAttack(t,e,s=!1){const n=this.getOpponentColor(e);let i=0;for(const o of T.p[n]){let r=t;r=I[x[r]+o];const c=this.getPiece(r);if(c&&c.type===d.pawn&&c.color!==e){if(!s)return!0;i++}}return s?i:!1}inKingAttack(t,e,s=!1){let n=0;for(const i of T.k){let o=t;o=I[x[o]+i];const r=this.getPiece(o);if(r&&r.type===d.king&&r.color!==e){if(!s)return!0;n++}}return s?n:!1}inSlidingAttack(t,e,s=!1){const n=M.k;let i=0;for(const o of n){let r=t;for(r=I[x[r]+o];r!=-1&&r!=null;){const c=this.getPiece(r);if(c!=null){let u=M[c.type];if(c.isSlide&&c.color!==e&&u.includes(o)){if(!s)return!0;i++}break}r=I[x[r]+o]}}return s?i:!1}inAttack(t,e,s=!1){return s?this.inKnightAttack(t,e,s)+this.inPawnAttack(t,e,s)+this.inSlidingAttack(t,e,s)+this.inKingAttack(t,e,s):this.inKnightAttack(t,e)||this.inPawnAttack(t,e)||this.inSlidingAttack(t,e)||this.inKingAttack(t,e)}inCheck(t=this.currentPlayer){return this.inAttack(this.board.kings[t].index,t)}inDoubleCheck(t=this.currentPlayer){return this.inAttack(this.board.kings[t].index,t,!0)>1}perft(t){let e=0,s=0;const n=this.generatePseudoLegalMoves();for(const i of n){if(this.makeUglyMove(i),!this.inCheck())if(t-1>0){const o=this.perft(t-1);e+=o.count,s+=o.captures}else e++,i.capture&&s++;this.undoUglyMove()}return{count:e,captures:s}}getOpponentColor(t){return t===h?l:h}get boardArray(){return this.board.squares}get opponentColor(){return this.currentPlayer===h?l:h}get inThreeFold(){return this.hashHistory.length?this.hashHistory.filter(t=>t===this.zobrist.hash).length>=3:!1}get inFiftyMove(){return this.halfMoveCount>=100}get gameOver(){return!this.uglyMoves.length||this.board.pieceCount===2||this.inThreeFold||this.inFiftyMove}get winner(){return this.gameOver?this.inCheck()&&this.uglyMoves.length===0?this.currentPlayer===h?l:h:"draw":!1}get enPassant(){const t=this.fenEnPassant;return t==="-"?null:t}set enPassant(t){if(t==="-")this.enPassantIndex=null;else{const[e,s]=t.split("");this.enPassantIndex=(parseInt(s)-1)*8+(e.charCodeAt(0)-97)}}set castlingStr(t){if(this.castling[h]=0,this.castling[l]=0,t!=="-")for(const e of t.split(""))switch(e){case"K":this.castling[h]|=2;break;case"Q":this.castling[h]|=1;break;case"k":this.castling[l]|=2;break;case"q":this.castling[l]|=1;break}}get fenTurn(){return this.currentPlayer===h?"w":"b"}get fenCastling(){let t="";return t+=this.castling[h]&2?"K":"",t+=this.castling[h]&1?"Q":"",t+=this.castling[l]&2?"k":"",t+=this.castling[l]&1?"q":"",t||"-"}get fenEnPassant(){if(this.enPassantIndex===null)return"-";{const t=this.enPassantIndex%8+97,e=8-parseInt(this.enPassantIndex/8);return`${String.fromCharCode(t)}${e}`}}set fen(t){const e=t.split(" ");this.board.fenPosition=e[0],this.currentPlayer=e[1]==="w"?h:l,this.castlingStr=e[2],this.enPassant=e[3],this.halfMoveCount=parseInt(e[4]),this.moveCount=parseInt(e[5])}get fen(){return`${this.board.fenPosition} ${this.fenTurn} ${this.fenCastling} ${this.fenEnPassant} ${this.halfMoveCount} ${this.moveCount}`}get copy(){const t=new E(this.fen);return t.history=this.history.slice(),t}}class X{constructor(t){a(this,"hashes",{});this.game=t}get hash(){return this.game.zobrist.hash}clear(){this.hashes={}}getHash(t){return t?t.zobrist.hash:this.hash}getMove(t=null){const e=this.getHash(t);return entries[e].move}getStoredHash({depth:t,alpha:e,beta:s},n=null){const i=this.getHash(n),o=this.hashes[i];return o&&t<=o.depth&&(o.type===L||o.type===q&&o.score>=s||o.type===N&&o.score<=e)?o:null}addEvaluation(t,e=null){const s=this.getHash(e);t.hash=s,this.hashes[s]=t}}class j{constructor(t="normal",e=1){a(this,"positionCount",0);a(this,"cutOff",0);a(this,"quiesceCount",0);a(this,"transpositionNum",0);a(this,"bestEval",null);this.type=t,this.depth=e,this.transpositionTable=new X(this.game),this.bestMove=null}selectMove(t,e){const s=(e==null?void 0:e.type)||this.type,n=(e==null?void 0:e.depth)||this.depth;if(t)this.game=new E(t);else return null;if(s==="random")return this.selectRandomMove(game.uglyMoves);if(s==="normal")return e!=null&&e.debug&&this.resetDebug(),this.bestMove=null,this.search(n,Number.NEGATIVE_INFINITY,Number.POSITIVE_INFINITY,this.game),e!=null&&e.debug&&this.logDebug(),this.bestMove.setSAN(this.game.uglyMoves),this.bestMove.pretty}resetDebug(){this.positionCount=0,this.quiesceCount=0,this.cutOff=0,this.transpositionNum=0,this.bestEval=null}logDebug(){console.log("*************************"),console.log("eval: ",this.bestEval),console.log("searched position: ",this.positionCount),console.log("cut off count: ",this.cutOff),console.log("quiesce count: ",this.quiesceCount),console.log("transposition count: ",this.transpositionNum,Object.keys(this.transpositionTable.hashes).length)}selectRandomMove(t){return t[Math.floor(Math.random()*t.length)]}search(t,e,s,n,i=0){if(i>0&&n.hashHistory.includes(n.zobrist.hash))return 0;const o=this.transpositionTable.getStoredHash({depth:t,alpha:e,beta:s},n);if(o!==null)return this.transpositionNum++,i===0&&(this.bestMove=o.move),o.score;if(t===0)return this.positionCount++,this.quiesce(e,s,n);const r=n.generateMoves();if(r.length===0)return n.inCheck()?Number.NEGATIVE_INFINITY:0;let c=N,u;r.sort((y,b)=>b.score-y.score);for(const y of r){n.makeUglyMove(y);let b=-this.search(t-1,-s,-e,n,i+1);if(n.undoUglyMove(),b>=s)return this.cutOff++,this.transpositionTable.addEvaluation({depth:t,move:y,score:s,type:q},n),s;b>e&&(c=L,e=b,u=y,i===0&&(this.bestEval=e,this.bestMove=u))}return this.transpositionTable.addEvaluation({depth:t,move:u,score:e,type:c},n),e}quiesce(t,e,s){this.quiesceCount++;const n=this.evaluate(s);if(n>=e)return e;t<n&&(t=n);const i=s.generateMoves({onlyCapture:!0});i.sort((o,r)=>r.score-o.score);for(const o of i){s.makeUglyMove(o);const r=-this.quiesce(-e,-t,s);if(s.undoUglyMove(),r>=e)return e;r>t&&(t=r)}return t}getEndGameWeight(t){return 1-Math.min(1,t*(1/D))}endGameEval(t,e,s,n){let i=0;const{x:o,y:r}=e.position,c=Math.max(3-o,o-4),u=Math.max(3-r,r-4);i+=c+u;const{x:b,y:v}=t.position,J=Math.abs(b-o),Z=Math.abs(v-r),tt=J+Z;return i+=14-tt,i*10*n}evaluate(t){const e=this.game||t,s=e.board,n=s.kings;let i=0,o=0;const r=this.getColorMaterial(h,s),c=this.getColorMaterial(l,s);i+=r,o+=c;const u=r-s.getColorNotPawnNum(h)*P.p,y=c-s.getColorNotPawnNum(l)*P.p,b=this.getEndGameWeight(u),v=this.getEndGameWeight(y);return i+=this.endGameEval(n.white,n.black,u,b),o+=this.endGameEval(n.black,n.white,y,v),i+=this.getPieceWeights(h,u,s),o+=this.getPieceWeights(l,y,s),(i-o)*P[e.currentPlayer]}getColorMaterial(t,e){let s=0;return e.mapColorList(t,n=>{s+=P[n.type]}),s}getPieceWeights(t,e,s){let n=0;return s.mapColorList(t,i=>{if(i.type!==d.king){n+=A[i.color][i.type][i.index];return}e>D?n+=A[i.color][i.type].middle[i.index]:n+=A[i.color][i.type].end[i.index]}),n}}p.ChessAI=j,p.ChessGame=E,Object.defineProperties(p,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});

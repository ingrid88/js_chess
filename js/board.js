(function(){
  window.CH = window.CH || {}

  CH.LetterPos = ["a","b","c","d","e","f","g","h"];

  CH.SIZE = 8;
  // player classes and piece classes?

  // We need history.
  // 1. Either board knows who moved and piece knows where it moved
  // 2. Or, Board knows who moved where.

  // We need a graveyard for taken pieces (use this to keep score)

  // We need to ensure king is never left in check
  // a win is defined by checkmate
  // 1. king can't move out of check
  // 2. Or, no other piece can inhibit check

  Board = CH.Board = function (grid){
    this.grid = grid;
    if (this.grid.length === 0){
      this.gridMake();
      this.populateBoard();
    }
  };

  Board.prototype.gridMake = function(){
    this.grid = [];
    for (var i = 0; i < CH.SIZE; i++){
      this.grid[i] = [];
      for (var j = 0; j < CH.SIZE; j++){
        this.grid[i].push([]);
      }
    }
  };

  Board.prototype.inBoard = function(pos){
    var x = pos[0];
    var y = pos[1];
    if(x >= 0 && x < CH.SIZE && y >= 0 && y < CH.SIZE){
      return true
    }
    return false
  };



  Board.prototype.populateBoard = function(){
    for (var i = 0; i < CH.PieceNames.length ; i++){
      for (var j = 0; j < CH.Positions[CH.PieceNames[i]].length; j++){
        var color = "black";
        var type = CH.PieceNames[i];
        var position = [7 - CH.Positions[CH.PieceNames[i]][j][0], CH.Positions[CH.PieceNames[i]][j][1]];
        var image = CH.Pieces[CH.PieceNames[i]][1];
        this.grid[7 - CH.Positions[CH.PieceNames[i]][j][0]][CH.Positions[CH.PieceNames[i]][j][1]] = new CH.Piece(color, type, position, image);
        var color = "white";
        var position = [CH.Positions[CH.PieceNames[i]][j][0], CH.Positions[CH.PieceNames[i]][j][1]];
        var image = CH.Pieces[CH.PieceNames[i]][0];
        this.grid[CH.Positions[CH.PieceNames[i]][j][0]][CH.Positions[CH.PieceNames[i]][j][1]] = new CH.Piece(color, type, position, image);
      }
    }
  };

  Board.prototype.chessPos = function(start, end){

  };

  Board.prototype.vertexPos = function(pos){
    var col = Math.floor(pos/8);
    var row = pos % 8;
    var piece = [col, row];
    return piece
  };

  Board.prototype.inBounds = function(pos){
    if(pos[0] > 7 || pos[0] < 0 || pos[1] > 7 || pos[1] < 0){
      return false
    }
    return true
  };

  Board.prototype.pieceColor = function(start){
    var pos = this.vertexPos(start);
    var piece = this.grid[pos[0]][pos[1]];
    return piece.color
  };

  Board.prototype.clearFile = function(){

  };
  Board.prototype.direction = function (begin) {
    //debugger
    var piece = this.grid[begin[0]][begin[1]];
    var dir = piece.direction();
    return dir
  };

  Board.prototype.hasPiece = function(pos){
    //debugger
    if (this.grid[pos[0]][pos[1]].length === 0){
      return false
    }
    return true
  };

  Board.prototype.sameColor = function(begin, endup){
    //debugger
    var piece = this.grid[begin[0]][begin[1]];
    var placed = this.grid[endup[0]][endup[1]];
    if( piece.color === placed.color) {
      return true
    }
    return false
  }

  Board.prototype.pawnMove = function (begin, endup, piece) {
    var deltas = CH.Moves[piece.type];

    var dir = this.direction(begin);
    if (dir === -1) {
      var setupPos = [7-begin[0], begin[1]];
    } else {
      var setupPos = begin;
    }

    // move one step forwards if there isn't any piece ahead
    if (begin[0] + dir * deltas[0][0] === endup[0] &&
    begin[1] + dir * deltas[0][1] === endup[1]){
      return true
    }

    // move two steps forward only if still in original position and no piece in spot
    if(CH.Positions[piece.type].includes(setupPos)){
      if (begin[0] + dir * deltas[1][0] === endup[0] &&
      begin[1] + dir * deltas[1][1] === endup[1]){
        return true
      }
    }
    return false

  };

  Board.prototype.enPassant = function(piece, begin, endup){

  };

  Board.prototype.castle = function(piece, begin, endup){
     // Castling may only be done if the king has never moved,
     // the rook involved has never moved,
     // the squares between the king and the rook involved are unoccupied
     // cannot be done when in check
     //debugger
     if(begin[1] > endup[1]){
       //kingside move
       var dir = -1;
       var rookPos = 0;
     } else {
       //queenside move
       var dir = 1;
       var rookPos = 7;
     }

    var king = piece;
    if (king.color === "white") {
      var rook = this.grid[0][rookPos];
      var kingPos = [0, 3];
    } else {
      var rook = this.grid[7][rookPos];
      var kingPos = [7, 3]
    }
    // var rook = this.grid[0][7]

    var pos1 = [begin[0], begin[1] + dir * 1];
    var pos2 = [begin[0], begin[1] + dir * 2];
    // queen side only
    var pos3 = [begin[0], begin[1] + dir * 3];

    if (begin[0] === endup[0] && begin[1] + dir * 2 === endup[1] &&
    begin[0] === kingPos[0] && begin[1] === kingPos[1] &&
    !this.hasPiece(pos1) && !this.hasPiece(pos2)
    && king.moved === false && rook.moved === false) {
      if(dir === 1){
        if(!this.hasPiece(pos3)){
          return true
        }
      } else {
        return true
      }
    }
    return false
  };

  Board.prototype.castleMove = function(piece, begin, endup){
    // move the rook on appropriate side
    debugger
    if(begin[1] > endup[1]){
      //kingside move
      var dir = -1;
      var rookPos = 0;
      var rookNewY = 2;
    } else {
      //queenside move
      var dir = 1;
      var rookPos = 7;
      var rookNewY = 4;
    }

    var king = piece;
    if (king.color === "white") {
      var rook = this.grid[0][rookPos];
      var rookOldPos = [0, rookPos];
      var rookNewX = 0;
      var kingPos = [0, 3];
    } else {
      var rook = this.grid[7][rookPos];
      var rookNewX = 7;
      var rookOldPos = [7, rookPos];
      var kingPos = [7, 3];
    }

    //var rookPos = rook.position;
    rook.moved = true;
    var rookNewPos = [rookNewX, rookNewY];
    this.grid[rookNewPos[0]][rookNewPos[1]] = rook;
    this.grid[rookOldPos[0]][rookOldPos[1]] = [];
    rook.position = rookNewPos;

  };

  Board.prototype.queenMe = function(piece, endup){
    // if pawn has reached other side of board, turn it into a queen
    // white has to reach [x,7], black has to reach [x,0]
    if((endup[0] === 0 && piece.color === "black")
    || ( endup[0] === 7 && piece.color === "white")){
      var color = piece.color;
      var type = "Queen";
      var position = endup;
      var i = piece.color === "black" ? 0 : 1;
      var image = CH.Pieces[type][i];
      this.grid[endup[0]][endup[1]] = new Piece(color, type, position, image);
    }
  };


  Board.prototype.pawnKill = function(begin, endup, piece){
    var deltas = CH.Moves[piece.type];
    var dir = this.direction(begin);
    //debugger
    // move sideways if the position it is moving to has another piece dif color
    if (begin[0] + dir * deltas[2][0] === endup[0] &&
    begin[1] + dir * deltas[2][1] === endup[1]){
      return true
    }
    if (begin[0] + dir * deltas[3][0] === endup[0] &&
    begin[1] + dir * deltas[3][1] === endup[1]){
      return true
    }
    return false
  };

  Board.prototype.pawnLogic = function(begin, endup, piece){

    if (this.hasPiece(endup) && !this.sameColor(begin, endup) ){
      // attack opponent
      return this.pawnKill(begin, endup, piece);
    } else {
      // move one step or two steps up
      return this.pawnMove(begin, endup, piece);
    }

    return false
  };



  Board.prototype.validMove = function(start, moveto){
    //debugger
    var begin = this.vertexPos(start);
    var endup = this.vertexPos(moveto);
    var piece = this.grid[begin[0]][begin[1]];
    // we also need to make sure that they can't move and reveal a check!
    // every potential move needs to call kingLogic and check
    //debugger
    if(piece.type === "Pawn"){
      return this.pawnLogic(begin, endup, piece)
    }
    if(piece.type === "Knight"){
      return this.knightLogic(piece, begin, endup)
    }
    if(piece.type === "King"){
      debugger
      var castle = this.castle(piece, begin, endup);
      var kingmove = this.kingMove(piece, begin, endup);
      if (castle || kingmove){
        return true
      }
    }
    if(piece.type === "Queen" || piece.type === "Rook" || piece.type === "Bishop"){
      // Which direction is he traveling in?
      var travelDir = this.consecutivePieces(piece, begin, endup);
      // check if file / rank / diagonal returned is empty
      if (travelDir.length > 0){
        return this.emptyFile(begin, endup, travelDir);
      }
      return false
    }

  };

  Board.prototype.kingMove = function (piece, begin, endup) {
    //whether or not it is possible to move there (not worrying about check)
    var takes = this.grid[endup[0]][endup[1]];
    if (takes.color === piece.color){
      return false
    } else {
      var deltas = CH.Moves[piece.type];
      for (var i = 0; i < deltas.length; i++){
        if(endup[0] - begin[0] === deltas[i][0] &&
        endup[1] - begin[1] === deltas[i][1]){
          return true
        }
      }
      if (this.castle(piece, begin, endup)){
        return true
      }
    }
    return false
  };

  Board.prototype.findKing = function(color){
    for (var i = 0; i < CH.SIZE; i++){
      for (var j=0; j < CH.SIZE; j++){
        var piece = this.grid[i][j];
        if (piece.type === "King" && piece.color === color){
          var kingPos = [i, j];
        }
      }
    }
    return kingPos
  };


  Board.prototype.outofCheck = function(color){
    // find players king position
    var opponentColor = (color === "white") ? "black" : "white";
    var kingPos = this.findKing(color);
    return this.intoCheck(kingPos, opponentColor);
  };

  Board.prototype.intoCheck = function (endup, color) {
    // get all opponents pieces and check if they can check the king
    // without putting their own king in check
    // for checking different colors
    //&& this.grid[i][j].color !== this.grid[begin[0]][begin[1]].color
    for (var i = 0; i < CH.SIZE; i++){
      for (var j = 0; j < CH.SIZE; j++){
        var piece = this.grid[i][j];
        if(piece.length !== 0 && piece.color === color ){
          //debugger
          if(piece.type === "Pawn"){
            var begin = [i,j];
            var pawnCheck = this.pawnKill(begin, endup, piece);
          }
          if(piece.type === "Knight"){
            var begin = [i,j];
            var knightCheck = this.knightLogic(piece, begin, endup);
          }
          if(piece.type === "Queen" || piece.type === "Rook" || piece.type === "Bishop"){
            // Which direction is he traveling in?
            var begin = [i,j];
            var travelDir = this.consecutivePieces(piece, begin, endup);
            // check if file / rank / diagonal returned is empty
            if (travelDir.length > 0){
              var QueenRookBishopCheck = this.emptyFile(begin, endup, travelDir);
            }
          }
          if(piece.type === "King"){
            // since a king cannot move to the spot he protects, we don't need to actually
            // see if he would be killed if moved to that check spot. Therefore, don't
            // iterate for him. Simply check if he can move there. If he can, he protects it.
            // he can't actually move there.
            var begin = [i,j];
            var kingCheck = this.kingMove(piece, begin, endup);
          }
        }
        if(kingCheck || QueenRookBishopCheck || knightCheck || pawnCheck){
          return true
        }
      }
    }
    return false
  };

  Board.prototype.consecutivePieces = function(piece, begin, endup){
    var travelDir = [];
    var deltas = CH.Moves[piece.type];
    for(var i = 0; i < deltas.length; i++){
      // diagonal
      if (Math.abs(deltas[i][0]) === Math.abs(deltas[i][1])) {
        if (Math.abs(endup[0] - begin[0]) === Math.abs(endup[1] - begin[1]) &&
        Math.sign(endup[1] - begin[1]) === Math.sign(deltas[i][1]) &&
        Math.sign(endup[0] - begin[0]) === Math.sign(deltas[i][0]) &&
        !this.sameColor(begin, endup)){
          travelDir = deltas[i];
          //break;
        }
      }
      // files and columns
      if (deltas[i][0] === 0 || deltas[i][1] === 0){
        if (((endup[0] - begin[0]) === 0 || (endup[1] - begin[1]) === 0) &&
        Math.sign(endup[1] - begin[1]) === Math.sign(deltas[i][1]) &&
        Math.sign(endup[0] - begin[0]) === Math.sign(deltas[i][0]) &&
        !this.sameColor(begin, endup)){
          travelDir = deltas[i];
          //break;
        }
      }
    }
    return travelDir
  };

  Board.prototype.emptyFile = function(begin, endup, travelDir){
    //debugger
    var xstep = begin[0];
    var ystep = begin[1];
    while((xstep + travelDir[0])!== endup[0] || (ystep + travelDir[1]) !== endup[1]){
      xstep = xstep + travelDir[0];
      ystep = ystep + travelDir[1];
      if (this.hasPiece([xstep, ystep])){
        return false
      }
    }
    return true
  };

  Board.prototype.knightLogic = function(piece, begin, endup){
    var deltas = CH.Moves[piece.type];
    //debugger
    for(var i = 0; i < deltas.length; i++){
      if (begin[0] + deltas[i][0] === endup[0] &&
      begin[1] + deltas[i][1] === endup[1] &&
      !this.sameColor(begin, endup)) {
        return true
      }
    }
    return false
  };

  Board.prototype.makeMove = function(start, moveto){
    //debugger
    var begin = this.vertexPos(start);
    var endup = this.vertexPos(moveto);
    var piece = this.grid[begin[0]][begin[1]];
    piece.moved = true;
    piece.position = endup;
    this.grid[endup[0]][endup[1]] = piece;
    this.grid[begin[0]][begin[1]] = [];
    if (piece.type === "Pawn" && (endup[0] === 7 || endup[0] === 0)){
      this.QueenMe(piece, endup);
    }
    debugger
    if (piece.type === "King" && Math.abs(begin[1] - endup[1]) > 1){
      this.castleMove(piece, begin, endup);
    }
  };

  Array.prototype.includes = function(val){
    for (var i = 0; i < this.length; i ++) {
      if (this[i][0] === val[0] && this[i][1] === val[1]){
        return true
      }
    }
    return false
  };

  Array.prototype.select = function(callback){
    newArray = [];
    this.forEach(function(val){
      if (callback(val)){
        newArray.push(val);
      }
    });
    return newArray
  };

})();

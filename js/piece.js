(function(){
  window.CH = window.CH || {};

  //Starting Positions of each piece (top left corner is 0,0)
  CH.Positions = {
    "King": [[0,3]],
    "Queen": [[0,4]],
    "Bishop": [[0,2], [0,5]],
    "Rook": [[0,0],[0,7]],
    "Pawn": [[1,0], [1,1], [1,2], [1,3], [1,4], [1,5], [1,6], [1,7]],
    "Knight": [[0,1], [0,6]]
  };

  //piece hash
  CH.Pieces = {
    "Rook": ['♖', '♜'],
    "Knight": ['♘', '♞'],
    "Pawn": ['♙', '♟'],
    "King": ['♔', '♚'],
    "Queen": ['♕', '♛'],
    "Bishop": ['♗', '♝']
  };

  CH.PieceNames = ["Rook", "Knight", "King", "Queen", "Bishop", "Pawn"];

  // Kings can do this once, queens can do this till a piece is in the way
  CH.Moves = {
    "King": [[-1,-1],[-1,0],[-1,1], [0,1], [1,0],[1,1],[1,-1],[0,-1]],
    "Queen": [[-1,-1],[-1,0],[-1,1], [0,1], [1,0],[1,1],[1,-1],[0,-1]],
    "Bishop": [[1,1],[1,-1],[-1,1], [-1,-1]],
    "Rook": [[1,0], [-1,0], [0,1], [0,-1]],
    "Pawn": [[1,0], [2,0], [1,1], [1,-1]],
    "Knight": [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]
  };

  CH.BoardSize = 8;

  Piece = CH.Piece = function (color, type, position, image){
    this.color = color;
    this.type = type;
    this.position = position;
    this.image = image;
    this.moved = false
  };

  //Colors
  Piece.prototype.direction = function(){
    //debugger
    if (this.color === "white"){
      return 1
    } else {
      return -1
    }
  };

  Piece.prototype.validMove = function(){


  };


  //Queen, Bishop, Rook
  Piece.prototype.persistant = function(){
    // for each direction, build array of positions till hit a piece or board edge
  };

  //King, Knight
  Piece.prototype.step = function(piece){


  };

  //pawn
  // these are the only pieces that move in one direction
  // can turn into other pieces when moved to the opposite side of the board
  Board.prototype.pawn = function(piece, player){};



})();

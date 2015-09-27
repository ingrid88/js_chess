(function(){
  window.CH = window.CH || {}

  // Kings can do this once, queens can do this till a piece is in the way
  CH.KingAndQueen = [[-1,-1],[-1,0],[-1,1],[0,1],[1,0],[1,1],[1,-1],[0,-1]];
  CH.PawnMove = [[1,0]];
  CH.PawnTake = [[1,1], [1,-1]];

  // Bishops can do this till a piece is in the way (recursion)
  CH.Bishop = [[1,1],[1,-1],[-1,1],[-1,-1]];
  CH.Knight = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];

  // Rooks can do this till a piece is in the way (recursion)
  CH.Rook = [[1,0],[-1,0],[0,1],[0,-1]];
  CH.BoardSize = 8;

  // We need history.
  // 1. Either board knows who moved and piece knows where it moved
  // 2. Or, Board knows who moved where.

  // We need a graveyard for taken pieces (use this to keep score)

  // We need to ensure king is never left in check
  // a win is defined by checkmate
  // 1. king can't move out of check
  // 2. Or, no other piece can inhibit check

  Board = CH.Board = function (){
    this.grid();
    this.generateMinePositions();
    this.populateBoard();
  }

  Board.prototype.grid = function(){
    this.grid = [];
    for (var i = 0; i < CH.BoardSize; i++){
      this.grid[i] = [];
      for (var j=0; j < CH.BoardSize; j++){
        this.grid[i].push([]);
      }
    }
  };

  Board.prototype.inBoard = function(pos){
    var x = pos[0];
    var y = pos[1];
    if(x >= 0 && x < CH.BoardSize && y >= 0 && y < CH.BoardSize){
      return true
    }
    return false
  };

  Board.prototype.populateBoard = function(){
    for (var i = 0; i < CH.BoardSize; i++){
      for (var j = 0; j < CH.BoardSize; j++){
        has_bomb = false
        if (this.minePositions.includes([i,j])) {
          has_bomb = true;
        };
        this.grid[i][j] = new CH.Piece(location, color);
      }
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

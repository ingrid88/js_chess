(function(){
  window.MS = window.MS || {};

  Piece = CH.Piece = function (board, color, type){
    this.color = color;
    this.board = board;
    this.type = type;
  };

  Piece.prototype.validMove = function(){


  };

  Piece.prototype.move = function(pos){
    if(this.validMove(pos)){
      this.board.location() = null;
      this.board.pos 
    }
  }

})();

(function(){
  window.CH = window.CH || {};

  var View = CH.View = function($el){
    var grid = [];
    this.board = new CH.Board(grid);
    this.$el = $el;
    this.activePlayer = "white";
    this.setupBoard();
    this.renderBoard();
    this.$el.on("click", "li", this.eventListener.bind(this));
    $(".alert-message").append("Please Move Player: " + this.activePlayer);
    this.boardArray = [];
  };

  View.prototype.eventListener = function(event){
    debugger
    var clickedPos = $(event.currentTarget).index();
    var pos = this.board.vertexPos(clickedPos);
    var piece = this.board.grid[pos[0]][pos[1]];
    // first move
    if (this.startPos == null){
      if (piece.length === 0){
        // 0. empty spot
        $(".alert-message").empty();
        $(".alert-message").append("Empty square");
      } else if (!this.correctPlayer(clickedPos)){
        // 1. incorrect player? "wrong player"
        $(".alert-message").empty();
        $(".alert-message").append("Wrong player");
      } else if (this.correctPlayer(clickedPos)) {
        // 3. correct player and king not in check / king selected if in check
        this.startPos = clickedPos;
      }
    } else {
      if (!this.board.validMove(this.startPos, clickedPos)) {
        // 4. impossible move? "impossible move"
        $(".alert-message").empty();
        $(".alert-message").append("Impossible Move");
        // reset startPos to null
        this.startPos = null;
      } else {
        // make copy of board and test what this move does
        var grid = jQuery.extend(true, {}, this.board.grid);
        this.boardCopy = new Board(grid);
        this.boardCopy.makeMove(this.startPos, clickedPos);
        // does this move take king out of check?
        // does this move put king in check?

        if (this.boardCopy.outofCheck(this.activePlayer) &&
        this.board.outofCheck(this.activePlayer)) {
        // 2. is king in check? "move king out of check"
          $(".alert-message").empty();
          $(".alert-message").append("Move king out of check first!");
          this.startPos = null;
        } else if (this.boardCopy.outofCheck(this.activePlayer)){
        // 2. check if currentPlayer king in check on board copy
          $(".alert-message").empty();
          $(".alert-message").append("Cannot put king in check");
          this.startPos = null;
        } else {
        //   c. make move
          debugger
          this.board.makeMove(this.startPos, clickedPos);
        //    1. keep copy of board (history)
        //    2. record chess move on page
          this.history();
        //    3. put taken piece in graveyard
        //    5. render board
          this.renderBoard();
        //    6. reset start
          this.startPos = null;
          //    4. change active player
          this.activePlayer = (this.activePlayer === "white") ? "black" : "white";

          if(this.board.outofCheck(this.activePlayer)
          && this.checkMate(this.activePlayer)){
              debugger
              $(".alert-message").empty();
              $(".alert-message").append("Player " + this.activePlayer + " wins. Game over.");
              var square = this.$el.find("li");
              $(square).removeClass("active");
              this.$el.off("click");
            } else {
              debugger
              $(".alert-message").empty();
              $(".alert-message").append("Player " + this.activePlayer + "'s turn");
          }
        }
      }
    }
  };

  View.prototype.checkMate = function(activePlayerColor){
      // for every piece on board that is opponents, can they block/ stop the check?
      debugger
      for (var i = 0; i < CH.SIZE; i++){
        for (var j = 0; j < CH.SIZE; j++){
          var piece = this.board.grid[i][j];
          if (piece.length !== 0 && piece.color === activePlayerColor){
// can this piece be moved to any other spot and stop a checkmate
// brute force?
  // - attempt moveto every other spot on the board
    // a. is it a valid move? Yes?
    // b. does it stop the check?
            var startPos = [i, j];
            for (var k = 0; k < CH.SIZE; k++){
              for (var z = 0; z < CH.SIZE; z++){
                var endPos = [k, z];
                // make copy of board and test what this move does
                var grid = jQuery.extend(true, {}, this.board.grid);
                this.boardCopy = new Board(grid);
                // make each piece move if valid move!
                var start = startPos[0] * 8 + startPos[1];
                var moveto = endPos[0] * 8 + endPos[1];
                debugger
                if(this.boardCopy.validMove(start, moveto)){ // king seems to think it can move where the bishop is?!
                  this.boardCopy.makeMove(start, moveto);
                  if (!this.boardCopy.outofCheck(this.activePlayer)){
                    // if the move takes king out of checkMate
                    debugger
                    return false
                  }
                }
              }
            }

          }
        }
      }
    return true
    //all possible moves made by king are impossible
    // Or, no other piece can inhibit check
  };

  // View.prototype.kingHistory = function(){
  //   var history = this.history();
  //   for(var i = 0; i < history.length; i++){
  //     var piece = this.board.grid[0][3];
  //     if(piece.type !== "King"){
  //       return false
  //     }
  //   }
  //   return true
  // };

  View.prototype.history = function(){
    var grid = jQuery.extend(true, {}, this.board.grid);
    this.boardArray.push(new Board(grid));
  };

  View.prototype.renderHistory = function(){
    // print out move made in chess format
    // store piece in graveyard
  };

  View.prototype.correctPlayer = function(clickedPos){
    var color = this.board.pieceColor(clickedPos)
    if(color === this.activePlayer){
      return true
    }
    return false
  };


  View.prototype.renderBoard = function(){
    // add pieces from location array
    for (var i = 0; i < CH.SIZE; i++){
      for (var j = 0; j < CH.SIZE; j++){
        var sq = i * 8 + j;
        //var m = this.$el.find("li [data-pos='"+ [i,j] +"']")
        var square = this.$el.find("li")[sq];
        $(square).empty();
        $(square).removeClass("active");
        if(this.board.grid[i][j].color !== undefined){
          var img = this.board.grid[i][j].image;
          $(square).append(img);
          $(square).addClass("active");
        } else {
          $(square).attr('id', "empty");
        }
      }
    }
  };

  View.prototype.setupBoard = function(){
    $(".alert-message").empty();
    var $ul = $("<ul>");
    $ul.addClass("clearfix");
    for (var i = 0; i < CH.SIZE; i++){
      for (var j = 0; j < CH.SIZE; j++){
        var $li = $("<li>");
        $li.data("pos", [i, j]);
        if((j + i + 1) % 2 === 0){
          $li.addClass("even");
        } else {
          $li.addClass("odd");
        }
        $ul.append($li);
      }
    }
    this.$el.append($ul);
  };

})();

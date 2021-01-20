var interval;
var board;
var gameOver = false;

var availableLettersMove = {"a":["b"],"b":["a","c"],"c":["b","d"],"d":["c","e"],"e":["d","f"],"f":["e","g"],"g":["f","h"],"h":["g"]};

$(document).ready(function() {

    initBoard();
});

/**
* Init the chess board by placing the pawns accordingly
*/
function initBoard() {

    clearInterval(interval);

    // Sets the images and the starting points of the pieces
    var config = {
        pieceTheme: '../static/common/img/chesspieces/wikipedia/{piece}.png',
        position:  $("#myBoard").data("position"),
        orientation: $("#userColor").text().toLowerCase(),
        draggable: true,
        onDrop: onDrop,
        onDragStart: onDragStart,
    };

    // Creates the board with the chosen configuration
    board = Chessboard('myBoard', config);

    interval = setInterval(refreshBoard, 2000)
}

/**
 * On raffraichit régulièrement le plateau pour annoncer les coups joués et les changements de joueurs
 */
function refreshBoard() {

    var data = {
        gameOver: gameOver,
    }

    $.ajax({
        type: 'GET',
        data: data,
        url: refresh_board
    }).done(function(data) {
        
        $(".boardContainer").html(data);
        initBoard();
        testVictory()

    }).fail(function(data) {
        console.log('Erreur ajaxCall');
        console.log(data);
    });
}

/**
 * Returns true if the move is possible (if it respects the movement restrictions and if there isn't a pawn already)
 */
function canPawnMoveHere(source, target, piece) {

    // Both colors can move left and right
    if (!availableLettersMove[source[0]].some(l => l === target[0])) {
        
        return false;
    }

    // A piece cannot get outside of the board (up/down)
    if (target[1] > 8 || target[1] < 1) {
        
        return false;
    }

    // If we move the black piece
    if (piece[0] == 'b') {

        // It can go back and forth
        if (!(parseInt(source[1]) + 1 === parseInt(target[1]) ||
            parseInt(source[1]) - 1 === parseInt(target[1]))) {

            return false;
        }
    }
    else {

        // It can only go forward
        if (!(parseInt(source[1]) + 1 === parseInt(target[1]))) {

            return false;
        }
    }

    // Now we need to be sure there is not already a pawn at the desired destination cell
    if (board.position()[target]) {
        
        return false;
    }

    return true;
}

// Once the player has played an action
function onDrop(source, target, piece, newPos, oldPos, orientation) {  

    if (!canPawnMoveHere(source, target, piece)) {

        return 'snapback';
    }

    // If we arrived here, then our move is valid. We send the new position to the server
    var data = {
        position: Chessboard.objToFen(newPos),
    };

    $.ajax({
        type: 'GET',
        data: data,
        url: play_move
    }).done(function(data) {

        refreshBoard();

    }).fail(function(data) {
        console.log('Erreur ajaxCall');
        console.log(data);
    });
}

/**
 * Triggers when a piece is clicked in order to move it
 * @param {*} source 
 * @param {*} piece 
 * @param {*} position 
 * @param {*} orientation 
 */
function onDragStart(source, piece, position, orientation) {
    
    // If it isn't our turn we don't move the pieces
    if ($("#userColor").text() !== $("#colorTurn").text()) {

        return false;
    }

    // If we clicked on a color that isn't ours we don't move the pieces
    if ($("#userColor").text()[0].toLowerCase() != piece[0]) {
        return false;
    }

    // Cancel temporarily the refresh while the user is moving a piece so there is no weird board refresh
    clearInterval(interval);
}

/**
 * Look if there is a winner
 */
function testVictory() {

    var position = board.position();
    var isDraw = true;
    gameOver = false;

    // Checks the position of all the pieces
    for (var cellValue in position) {

        // The black piece
        if (position[cellValue][0] === 'b') {

            // If the black piece has reach the opposite of the board, it wins
            if (cellValue[1] == 1) {
            
                $(".colorTurn").text('BLACK WIN');
                gameOver = true;
                isDraw = false;
                break;
            }
            // Else we need to check if it can still move. If it cannot, white win
            else {

                // Get all directions in board left and right
                availableLettersMove[cellValue[0]].forEach(function(hDir) {
                
                    var vDir = parseInt(cellValue[1]);

                    if (!canPawnMoveHere(cellValue, hDir + (vDir - 1), 'b') && !canPawnMoveHere(cellValue, hDir + (vDir + 1), 'b')) {

                        $(".colorTurn").text('WHITE WIN');
                        gameOver = true;
                        isDraw = false;
                    }
                });
            }
        }
        // The white pieces
        else {

            // If none of the white piece can move and it's white's turn, it's a draw
            availableLettersMove[cellValue[0]].forEach(function(hDir) {
            
                var vDir = parseInt(cellValue[1]);

                if (canPawnMoveHere(cellValue, hDir + (vDir + 1), 'b')) {

                    isDraw = false;
                }
            });
        }
    }

    if (isDraw) {

        $(".colorTurn").text("DRAW");
        gameOver = true;
    }

    return gameOver;
}


$(document).ready(function() {

    initBoard();
});

var board;

/**
* Init the chess board by placing the pawns accordingly
*/
function initBoard() {

    // Sets the images and the starting points of the pieces
    var config = {
        pieceTheme: '../static/board/img/chesspieces/wikipedia/{piece}.png',
        position: {
            a1: 'wP',
            c1: 'wP',
            e1: 'wP',
            g1: 'wP',
            d8: 'bP',
        },
        draggable: true,
        onDrop: onDrop,
    };

    // Creates the board with the chosen configuration
    board = Chessboard('myBoard', config)
}

function onDrop (source, target, piece, newPos, oldPos, orientation) {

    console.log('Source: ' + source)
    console.log('Target: ' + target)
    console.log('Piece: ' + piece)
    console.log('New position: ' + Chessboard.objToFen(newPos))
    console.log('Old position: ' + Chessboard.objToFen(oldPos))
    console.log('Orientation: ' + orientation)
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')

    // Both colors can move left and right
    if (!((source[0] === 'a' && target[0] === 'b') ||
        (source[0] === 'b' && (target[0] === 'a' || target[0] === 'c')) ||
        (source[0] === 'c' && (target[0] === 'b' || target[0] === 'd')) ||
        (source[0] === 'd' && (target[0] === 'c' || target[0] === 'e')) ||
        (source[0] === 'e' && (target[0] === 'd' || target[0] === 'f')) ||
        (source[0] === 'f' && (target[0] === 'e' || target[0] === 'g')) ||
        (source[0] === 'g' && (target[0] === 'f' || target[0] === 'h')) ||
        (source[0] === 'h' && target[0] === 'g'))) {

        return 'snapback';
    }

    // If we move the black piece
    if (piece[0] == 'b'){

        // It can go back and forth
        if (!(parseInt(source[1]) + 1 === parseInt(target[1]) ||
            parseInt(source[1]) - 1 === parseInt(target[1]))) {

            return 'snapback';
        }
    }
    else{

        // It can only go forward
        if (!(parseInt(source[1]) + 1 === parseInt(target[1]))) {

            return 'snapback';
        }
    }
}
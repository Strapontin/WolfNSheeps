var interval;

$(document).ready(function() {

    initBoard();

    // interval = setInterval(refreshBoard, 3000);
});

var board;

/**
* Init the chess board by placing the pawns accordingly
*/
function initBoard() {

    // Sets the images and the starting points of the pieces
    var config = {
        pieceTheme: '../static/common/img/chesspieces/wikipedia/{piece}.png',
        position:  $("#myBoard").data("position")
        //     {a1: 'wP',
        //     c1: 'wP',
        //     e1: 'wP',
        //     g1: 'wP',
        //     d8: 'bP',}
        ,
        orientation: $("#userColor").text().toLowerCase(),
        draggable: true,
        onDrop: onDrop,
        onDragStart: onDragStart,
    };

    // Creates the board with the chosen configuration
    board = Chessboard('myBoard', config);
    // console.log(config)
}

/**
 * On raffraichit régulièrement le plateau pour annoncer les coups joués et les changements de joueurs
 */
function refreshBoard() {

    var roomName = window.location.pathname.split('/');

    var data = {
        roomName: roomName[roomName.length - 1],
    };

    $.ajax({
        type: 'GET',
        data: data,
        url: refresh_board
    }).done(function(data) {
        // console.log("Retour ajaxCall");
        // console.log(data);
        
        $(".boardContainer").html(data);
        initBoard();

    }).fail(function(data) {
        console.log('Erreur ajaxCall');
        console.log(data);
    });
}

function onDrop(source, target, piece, newPos, oldPos, orientation) {

    var result = '';

    // Both colors can move left and right
    if (!((source[0] === 'a' && target[0] === 'b') ||
        (source[0] === 'b' && (target[0] === 'a' || target[0] === 'c')) ||
        (source[0] === 'c' && (target[0] === 'b' || target[0] === 'd')) ||
        (source[0] === 'd' && (target[0] === 'c' || target[0] === 'e')) ||
        (source[0] === 'e' && (target[0] === 'd' || target[0] === 'f')) ||
        (source[0] === 'f' && (target[0] === 'e' || target[0] === 'g')) ||
        (source[0] === 'g' && (target[0] === 'f' || target[0] === 'h')) ||
        (source[0] === 'h' && target[0] === 'g'))) {

        result = 'snapback';
    }

    // If we move the black piece
    if (piece[0] == 'b') {

        // It can go back and forth
        if (!(parseInt(source[1]) + 1 === parseInt(target[1]) ||
            parseInt(source[1]) - 1 === parseInt(target[1]))) {

            result = 'snapback';
        }
    }
    else{

        // It can only go forward
        if (!(parseInt(source[1]) + 1 === parseInt(target[1]))) {

            result = 'snapback';
        }
    }

    if (result !== '') {
        return result;
    }

    // TODO : envoyer au serveur l'action à faire
    console.log('Current position as an Object:')
    console.log(board.position())

    console.log('Current position as a FEN string:')
    console.log(board.fen())
}

/**
 * Triggers when a piece is clicked in order to move it
 * @param {*} source 
 * @param {*} piece 
 * @param {*} position 
 * @param {*} orientation 
 */
function onDragStart(source, piece, position, orientation) {
    
    // // If it isn't our turn we don't move the pieces
    // if ($("#userColor").text() !== $("#colorTurn").text()) {

    //     return false;
    // }

    // // If we clicked on a color that isn't ours we don't move the pieces
    // if ($("#userColor").text()[0].toLowerCase() != piece[0]) {
    //     return false;
    // }
}

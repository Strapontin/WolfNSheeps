
$(document).ready(function() {

    initHomePage();
});

var ajaxInterval;

function initHomePage() {

    refreshAvailableRooms();

     ajaxInterval = setInterval(() => {
        
         refreshAvailableRooms();
     }, 3000);

    // Initialisation des évènements
    $("#createRoom").off("click").on("click", createNewRoom);
}

/**
 * Refresh the list of available rooms
 */
function refreshAvailableRooms() {

    var data = { };

    $.ajax({
        type: 'GET',
        data: data,
        url: show_all_rooms
    }).done(function(data) {
        console.log("Retour ajaxCall");
        console.log(data);
        
        $("#availableRoomsContainer").html(data);
        createAllMiniatureBoard();

    }).fail(function(data) {
        console.log('Erreur ajaxCall');
        console.log(data);

        clearInterval(ajaxInterval);
    });
}

/**
 * Create a new room to play in
 */
function createNewRoom() {

    var data = {
        roomName: $("#inputRoomName").val()
    };

    $.ajax({
        type: 'GET',
        data: data,
        url: create_new_room
    }).done(function(data) {
        console.log("Retour ajaxCall");
        console.log(data);
        
    }).fail(function(data) {
        console.log('Erreur ajaxCall');
        console.log(data);

        clearInterval(ajaxInterval);
    });
}

function createAllMiniatureBoard() {

    $(".boardMiniature").each(function (index, element) {

        var config = {
            pieceTheme: '../static/common/img/chesspieces/wikipedia/{piece}.png',
            position: $(element).data("position"),
            showNotation: false,
        };

        console.log($(element).data("position"));

        var board = Chessboard($(element).attr("id"), config);
    });
}

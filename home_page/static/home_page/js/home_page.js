
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
        // console.log("Retour ajaxCall");
        // console.log(data);
        
        // Show all rooms created by users
        $("#availableRoomsContainer").html(data);
        createAllMiniatureBoard();

        // Add click event to connect to available rooms
        $(".boardMiniature, .btnJoinRoom").not(".cantJoinRoom").off('click').on('click', joinRoom);

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
        roomName: $("#inputRoomName").val(),
        colorChosen: $("#colorChosen").val(),
    };

    // A room must have a name
    if (data.roomName) {

        $.ajax({
            type: 'GET',
            data: data,
            url: create_new_room
        }).done(function(data) {
            console.log("Retour ajaxCall");
            console.log(data);

            refreshAvailableRooms();
            
        }).fail(function(data) {
            console.log('Erreur ajaxCall');
            console.log(data);

            clearInterval(ajaxInterval);
        });
    }
}

/**
 * After the home page gets the data of the rooms, we create the little boards to see the game
 */
function createAllMiniatureBoard() {

    $(".boardMiniature").each(function (index, element) {

        var config = {
            pieceTheme: '../static/common/img/chesspieces/wikipedia/{piece}.png',
            position: $(element).data("position"),
            showNotation: false,
        };

        // console.log($(element).data("position"));

        var board = Chessboard($(element).attr("id"), config);
    });
}

/**
 * When the user clicks on a room for which he has the possibility to join
 */
function joinRoom(event) {

    console.log('Joining room...');

    var data = {
        roomName: $(event.currentTarget).parents(".roomContainer").find(".roomName").text(),
    };

    $.ajax({
        type: 'GET',
        data: data,
        url: join_room
    }).done(function(data) {
        console.log("Retour ajaxCall");
        console.log(data);

        // An error happened while trying to connect to the room
        if (data.errorMessage) {
            console.log(data.errorMessage);
        }
        else {
            // No error, we should have the url to join the room
            window.location.href = data.url;
        }
        
    }).fail(function(data) {
        console.log('Erreur ajaxCall');
        console.log(data);

        clearInterval(ajaxInterval);
    });
}

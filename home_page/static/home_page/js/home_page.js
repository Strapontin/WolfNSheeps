
$(document).ready(function() {

    initHomePage();
});

var ajaxInterval;

function initHomePage() {

    refreshAvailableRooms();

    // Initialisation des évènements
    $("#createRoom").off("click").on("click", createNewRoom);
}

/**
 * Refresh the list of available rooms
 */
function refreshAvailableRooms() {

    var data = {
        val1: 1,
        val2: "maval2"
    };

    ajaxInterval = setInterval(() => {
        
        $.ajax({
            type: 'GET',
            data: data,
            url: show_all_rooms
        }).done(function(data) {
            console.log("Retour ajaxCall");
            console.log(data);
        }).fail(function(data) {
            console.log('Erreur ajaxCall');
            console.log(data);

            clearInterval(ajaxInterval);
        });
    }, 3000);
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

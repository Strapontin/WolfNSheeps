# board/views.py
from django.shortcuts import render
from WolfNSheeps.helper import get_user_name, get_user_color
from board.models import Room
from django.utils import timezone


def board_page(request, room_name):

    room = Room.objects.get(room_name=room_name)

    user_color = get_user_color(request, room)

    return render(request, 'board/board_page.html', {
        'room': room,
        'user_color': user_color,
    })


def refresh_board(request):
    user = get_user_name(request)

    room_name = request.GET['roomName']
    room = Room.objects.get(room_name=room_name)

    room.last_time_updated = timezone.now()
    room.save()

    user_color = get_user_color(request, room)

    return render(request, 'board/board.html', {
        'room': room,
        'user_color': user_color,
    })

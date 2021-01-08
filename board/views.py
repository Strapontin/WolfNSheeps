# board/views.py
from django.shortcuts import render


def board(request):
    return render(request, 'board/board.html')


def room(request, room_name):
    return render(request, 'board/room.html', {
        'room_name': room_name
    })

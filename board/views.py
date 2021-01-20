# board/views.py
from django.http import JsonResponse
from django.shortcuts import render
from WolfNSheeps.helper import get_user_name, get_user_color
from board.models import Room
from django.utils import timezone
import re


def board_page(request, room_name):
    room = Room.objects.get(room_name=room_name)

    return render(request, 'board/board_page.html', {
        'room': room,
        'user_color': get_user_color(request, room),
    })


def refresh_board(request):
    url = request.META.get('HTTP_REFERER')
    room_name = re.findall(r'\w+$', url)[0]
    room = Room.objects.get(room_name=room_name)

    game_over = request.GET['gameOver']

    if not game_over:
        room.last_time_updated = timezone.now()
        room.save()

    return render(request, 'board/board.html', {
        'room': room,
        'user_color': get_user_color(request, room),
    })


def play_move(request):
    url = request.META.get('HTTP_REFERER')
    room_name = re.findall(r'\w+$', url)[0]

    room = Room.objects.get(room_name=room_name)
    user_color = get_user_color(request, room)

    # If it isn't the actual player's color turn, the move isn't saved
    if room.color_turn != user_color:
        result = {'status': 401, 'errorMessage': "It isn't your turn."}
        return JsonResponse(result)

    # Everything seems in order, the move is saved and it is the opponent turn
    # position = \
    #     re.findall(r'^\w{1,8}\/\w{1,8}\/\w{1,8}\/\w{1,8}\/\w{1,8}\/\w{1,8}\/\w{1,8}\/\w{1,8}$',
    #                request.GET['position'])[0]
    room.position = request.GET['position']

    if room.color_turn == 'White':
        room.color_turn = 'Black'
    else:
        room.color_turn = 'White'

    room.last_time_updated = timezone.now()
    room.save()

    return render(request, 'board/board.html', {
    })

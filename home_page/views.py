import json
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.utils import timezone
from django.core import serializers
from WolfNSheeps.helper import get_user_name
import random

from board import models


def home_page(request):
    return render(request, 'home_page/home.html')


def show_all_rooms(request):
    # Remove all the rooms that are now unused
    for room in list(models.Room.objects.all()):
        room.delete_non_used_rooms()

    rooms = serializers.serialize("python", models.Room.objects.all())

    user_name = get_user_name(request)

    return render(request, 'home_page/room_miniature.html', {
        'rooms': rooms,
        'user_name': user_name
    })


def create_new_room(request):
    creator = get_user_name(request)

    color_chosen = request.GET['colorChosen']

    if color_chosen == "Random":
        color_chosen = random.choice(['White', 'Black'])

    room_name = request.GET['roomName'].replace(' ', '_')
    last_time_updated = timezone.now()
    color_turn = random.choice(['White', 'Black'])

    models.Room(room_name=room_name, creator=creator, last_time_updated=last_time_updated, color_turn=color_turn,
                creator_color=color_chosen).save()

    result = {'status': 200, 'dataVariable': 'mesvars'}
    return JsonResponse(result)


def join_room(request):
    user = get_user_name(request)

    room_name = request.GET['roomName']
    room = models.Room.objects.get(room_name=room_name)

    # If the user is the room creator or the second player, we let him enter freely
    result = {'status': 200, 'url': '/board/' + room_name}

    # If there is no second user yet, this user becomes the second user
    if room.second_player == '' and room.creator != user:
        room.second_player = user
        room.save()

    # Else we had a problem, this room isn't joinable
    elif room.second_player != user and room.creator != user:
        result = {'status': 200, 'errorMessage': 'You cannot join this room'}

    return JsonResponse(result)

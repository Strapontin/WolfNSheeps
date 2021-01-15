import json
from django.http import JsonResponse
from django.shortcuts import render
from django.utils import timezone
from django.core import serializers
import random

from board import models
from django.utils.safestring import SafeString


def get_creator_name(request):
    # A user will be an ip address and the browser info. Two browsers on a same computer are two players
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')

    creator = ip + request.META['HTTP_USER_AGENT']

    return creator


def home_page(request):
    return render(request, 'home_page/home.html')


def show_all_rooms(request):
    # print(request.GET)

    # Remove all the rooms that are now unused
    for room in list(models.Room.objects.all()):
        room.delete_non_used_rooms()

    # rooms = list(models.Room.objects.all())
    rooms = serializers.serialize("python", models.Room.objects.all())

    # print('__')
    # print(rooms)
    # print('__0')
    # print(rooms[0])
    # print(rooms[1])
    # print('__')
    # print('__')

    creator_name = get_creator_name(request)
    print(creator_name)

    result = {'status': 200, 'rooms': rooms}
    return render(request, 'home_page/room_miniature.html', {
        'rooms': rooms,
        'creator_name': creator_name
    })
    # return JsonResponse(result)


def create_new_room(request):
    creator = get_creator_name(request)

    room_name = request.GET['roomName']
    # second_player = ''
    last_time_updated = timezone.now()
    # position
    color_turn = random.choice('wb')

    models.Room(room_name=room_name, creator=creator, last_time_updated=last_time_updated, color_turn=color_turn).save()

    result = {'status': 200, 'dataVariable': 'mesvars'}
    return JsonResponse(result)

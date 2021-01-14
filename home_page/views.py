import json
from django.http import JsonResponse
from django.shortcuts import render
from django.utils import timezone
import random

from board import models


def home_page(request):
    return render(request, 'home_page/home.html')


def show_all_rooms(request):
    print(request.GET)

    # Remove all the rooms that are now unused
    for room in list(models.Room.objects.all()):
        room.delete_non_used_rooms()

    print(list(models.Room.objects.all()))

    result = {'status': 200, 'dataVariable': 'mesvars'}
    return JsonResponse(result)


def create_new_room(request):

    # A user will be an ip address and the browser info. Two browsers on a same computer are two players
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')

    room_name = request.GET['roomName']
    creator = ip + request.META['HTTP_USER_AGENT']
    # second_player = ''
    last_time_updated = timezone.now()
    # position
    color_turn = random.choice('wb')

    models.Room(room_name=room_name, creator=creator, last_time_updated=last_time_updated, color_turn=color_turn).save()

    result = {'status': 200, 'dataVariable': 'mesvars'}
    return JsonResponse(result)

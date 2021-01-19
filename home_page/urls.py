# board/urls.py
from django.urls import path

from . import views

urlpatterns = [
    path('', views.home_page, name='home_page'),
    path('ajax/ajax_call_url', views.show_all_rooms, name='show_all_rooms'),
    path('ajax/create_new_room', views.create_new_room, name='create_new_room'),
    path('ajax/join_room', views.join_room, name='join_room'),
]

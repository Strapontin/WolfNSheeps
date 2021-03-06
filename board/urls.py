# board/urls.py
from django.urls import path

from . import views

urlpatterns = [
    path('<str:room_name>', views.board_page, name='board_page'),
    path('ajax/refresh_board', views.refresh_board, name='refresh_board'),
    path('ajax/play_move', views.play_move, name='play_move'),
    # path('i/<str:room_name>', views.room, name='room'),
]

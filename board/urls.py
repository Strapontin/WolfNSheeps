# board/urls.py
from django.urls import path

from . import views

urlpatterns = [
    path('', views.board, name='board'),
    path('i/', views.room, name='room'),
]

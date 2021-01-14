from django.db import models
from django.utils import timezone


class Room(models.Model):
    room_name = models.CharField(max_length=200)
    creator = models.CharField(max_length=200)
    second_player = models.CharField(max_length=200, default="")
    last_time_updated = models.DateTimeField()
    position = models.CharField(max_length=200, default='3p4/8/8/8/8/8/8/P1P1P1P1')
    color_turn = models.CharField(max_length=2)

    def __str__(self):
        return self.room_name

    def is_full(self):
        return self.second_player != ""

    def delete_non_used_rooms(self):
        if self.last_time_updated <= timezone.now() - timezone.timedelta(minutes=5):
            self.delete()

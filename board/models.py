from django.db import models
from django.utils import timezone


# Room(room_name="never_dying_room", creator="notyou", last_time_updated=timezone.now() + timezone.timedelta(hours=99999), color_turn="b").save()
class Room(models.Model):
    room_name = models.CharField(max_length=200, unique=True)
    creator = models.CharField(max_length=200)
    creator_color = models.CharField(max_length=5)
    second_player = models.CharField(max_length=200, default="")
    last_time_updated = models.DateTimeField()
    position = models.CharField(max_length=200, default='3p4/8/8/8/8/8/8/P1P1P1P1')
    color_turn = models.CharField(max_length=5)

    def __str__(self):
        return self.room_name

    def is_full(self):
        return self.second_player != ""

    def delete_non_used_rooms(self):
        if self.last_time_updated <= timezone.now() - timezone.timedelta(minutes=5):
            self.delete()

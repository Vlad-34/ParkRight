from django.db import models

from scooter.models import Scooter as Scooter
from user.models import User

# Create your models here.

class ImageMap(models.Model):  
    '''A model that represents a mapping between a user and a scooter image. The model has the following fields:
    - id - The unique identifier of the mapping.
    - scooter_id - The ID of the scooter.
    - user_id - The ID of the user.
    - timestamp - The timestamp of the mapping.
    - image - The image of the scooter.
    - prediction - The prediction of the image.'''
    id = models.AutoField(primary_key=True)
    scooter_id = models.ForeignKey(Scooter, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    image = models.CharField(max_length=50, default='')
    prediction = models.CharField(max_length=7)
    def __str__(self) -> str:
        return str(self.timestamp) + ' | ' + self.prediction
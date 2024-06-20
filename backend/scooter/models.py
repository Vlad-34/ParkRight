from django.db import models

# Create your models here.

class Scooter(models.Model): 
    '''A model that represents a scooter. The model has the following fields:
    - id - The unique identifier of the scooter.
    - name - The name of the scooter.''' 
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=31, unique=True)
    def __str__(self) -> str:
        return self.name
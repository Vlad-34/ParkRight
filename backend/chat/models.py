from django.db import models
from user.models import User

class Message(models.Model):
    '''A model that represents a chat message. The model has the following fields:
    - sender - The user who sent the message.
    - receiver - The user who received the message.
    - content - The content of the message.
    - timestamp - The timestamp of the message.'''
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='receiver')
    content = models.TextField()
    timestamp = models.DateTimeField(default=None)
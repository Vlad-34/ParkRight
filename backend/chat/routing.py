# routing.py
from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'^ws/chat/(?P<id>\d+)/$', consumers.ChatConsumer.as_asgi()),
]
'''The URL configuration for the chat app. The URL pattern is as follows:
- ws/chat/(?P<id>\d+)/ - The URL pattern for the chat websocket. The ID of the user is passed as a parameter in the URL.'''
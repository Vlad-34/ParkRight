from django.urls import path
from . import views


urlpatterns = [
    path("<int:pk>", views.ChatView.as_view(), name='chat_view'),
]
'''The URL configuration for the chat app. The URLs are as follows:
- <int:pk> - The endpoint to get the chat messages between the current user and the user with the ID specified in the URL.'''
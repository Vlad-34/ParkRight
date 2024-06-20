from django.urls import path
from . import views

urlpatterns = [
    path('register', views.UserRegistration.as_view(), name='register'),
    path('<int:pk>/users', views.UserListFromRole.as_view(), name='users-for-id'),
    path('<int:pk>', views.UserDetails.as_view(), name='user'),
]
'''The URL configuration for the user app. The URLs are as follows:
- register - The endpoint to register a new user.
- users/<int:pk> - The endpoint to get all users for another one with a certain id.
- <int:pk> - The endpoint to get a single user.'''
from django.urls import path
from . import views

urlpatterns = [
    path('', views.PredictView.as_view(), name='predict'),
]
'''The URL configuration for the predict app. The URLs are as follows:
- '' - The endpoint to make a prediction.'''
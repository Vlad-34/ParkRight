from django.urls import path
from . import views

urlpatterns = [
    path('', views.ImageMapList.as_view(), name='image-maps'),
    path('<str:value>/<int:id>/<str:time>', views.ImageMapBy.as_view(), name='image-map'),
]
'''The URL configuration for the image_map app. The URLs are as follows:
- "" - The endpoint to get all image maps.
- <str:value>/<int:id>/<str:time> - The endpoint to filter image maps by scooter and time.'''
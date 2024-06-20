from datetime import datetime, timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from user.models import User
from scooter.models import Scooter
from .models import ImageMap
from .serializers import ImageMapSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import permission_classes

class ImageMapList(APIView):
    '''A view that returns all image maps or creates a new image map. The view has the following methods:
    - get_permissions - Returns the permissions required to access the view.
    - get - Returns all image maps.
    - post - Creates a new image map.'''
    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAdminUser()]
        return [IsAuthenticated()]
    
    def get(self, request, format=None):
        scooters = ImageMap.objects.all()
        serializer = ImageMapSerializer(scooters, many=True)
        return Response(serializer.data)
    
    def post(self, request, format=None):
        image_map = {'scooter_id': Scooter.objects.get(name=request.data['nickname']).id,
                     'user_id': User.objects.get(id=request.data['user_id']),
                     'prediction': request.data['prediction'],
                     'image': request.data['image_name'],
                     'timestamp': request.data['timestamp']}
        serializer = ImageMapSerializer(data=image_map)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@permission_classes([IsAdminUser])
class ImageMapBy(APIView):
    '''A view that returns image maps filtered by scooter and time. The view has the following methods:
    - get - Returns image maps filtered by scooter and time. Filtering is done based on the `value`, `ID`, and `time` parameters. Value can be 'scooter' or 'user'. Time can be 'week' or 'month'. '''
    def get(self, request, value, id, time, format=None):
        image_map = []
        if value == 'scooter':
            image_map = ImageMap.objects.filter(scooter_id=id)
        elif value == 'user':
            image_map = ImageMap.objects.filter(user_id=id)
        if time == 'week':
            image_map = image_map.filter(timestamp__gte=datetime.now()-timedelta(days=7))
        elif time == 'month':
            image_map = image_map.filter(timestamp__gte=datetime.now()-timedelta(days=30))
        serializer = ImageMapSerializer(image_map, many=True)
        return Response(serializer.data)
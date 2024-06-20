from .models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserNoPasswordSerializer, UserSerializer
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.decorators import permission_classes

class UserRegistration(APIView):
    '''A view that allows the registration of a new user. The view has the following methods:
    - post - A method that registers a new user.'''
    def post(self, request, format=None):
        data = request.data
        data['password'] = make_password(data['password'])
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@permission_classes([IsAuthenticated])
class UserListFromRole(APIView):
    '''A view that returns a list of all users with a specific role. The view has the following methods:
    - get - A method that returns a list of chat users for a user with a specific id'''
    def get(self, request, pk, format=None):
        all_users = User.objects.all()
        users = []
        user = User.objects.filter(id=pk).first()
        if user is not None and user.is_staff:
            users = User.objects.filter(is_staff=False)
        elif user is not None and not user.is_staff:
            users = User.objects.filter(is_staff=True)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
@permission_classes([IsAuthenticated])
class UserDetails(APIView):
    '''A view that returns a single user. The view has the following methods:
    - get - A method that returns a single user.
    - patch - A method that updates a single user.'''

    def get(self, request, pk, format=None):
        user = User.objects.get(pk=pk)
        serializer = UserNoPasswordSerializer(user)
        return Response(serializer.data)
    
    def patch(self, request, pk, format=None):
        user = User.objects.get(id=pk)
        if user:
            if request.data['password'] == '':
                request.data['password'] = user.password
            if request.data['username'] == '':
                request.data['username'] = user.username
            if request.data['first_name'] == '':
                request.data['first_name'] = user.first_name
            if request.data['last_name'] == '':
                request.data['last_name'] = user.last_name

            serializer = UserSerializer(user, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_404_NOT_FOUND)
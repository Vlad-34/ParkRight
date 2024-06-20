from django.db.models import Q

from user.models import User

from .serializers import MessageSerializer
from .models import Message
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


class ChatView(APIView):
    '''A view that returns the chat messages between the current user and the user with the ID specified in the URL.'''
    permission_classes = [IsAuthenticated]

    def get(self, request, pk, format=None):
        user = User.objects.get(pk=pk)
        if request.user.id != user.id:
            return Response({'message': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        messages = Message.objects.filter(Q(receiver=user) | Q(sender=user))
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
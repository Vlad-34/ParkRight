import datetime
import time
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from user.models import User
from .models import Message
from auth.views import MyTokenObtainPairSerializer

class ChatTestCase(APITestCase):
    '''Test case for the chat functionality. This test case will test the following:
    - Retrieve messages for the receiver
    - Access restricted to message sender or receiver'''
    def setUp(self):
        self.client = APIClient()
        self.user = User(username='vladu', password='PaSsWoRd')
        self.user.set_password(self.user.password)
        self.user.save()

        self.receiver = User(username='support', password='AnOtHeRpAsSwOrD')
        self.receiver.set_password(self.receiver.password)
        self.receiver.save()
        
        token = MyTokenObtainPairSerializer.get_token(self.user)
        self.access_token = str(token.access_token)
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        
        self.message = Message(
            sender=self.user,
            receiver=self.receiver,
            content='Hello, world',
            timestamp=datetime.datetime.now()
        )
        self.message.save()
        
        self.url = reverse('chat_view', kwargs={'pk': self.user.id})

    def test_retrieve_messages(self):
        """Test retrieving messages for the receiver."""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Hello', response.data[0]['content']) 

    def test_access_restricted_to_message_sender_or_receiver(self):
        """Ensure only the sender or receiver can access the message."""
        another_user = User(username='otheruser', password='YetAnOtHeRpAsSwOrD')
        another_user.set_password(another_user.password)
        another_user.save()
        token = MyTokenObtainPairSerializer.get_token(another_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {str(token.access_token)}')
        
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
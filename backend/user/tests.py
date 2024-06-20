from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import User as CustomUser
from .serializers import UserNoPasswordSerializer

class UserAPITests(TestCase):
    '''Test cases for the User API. The test cases include the following:
        - Test the registration of a new user.
        - Test the retrieval of a single User object.
        - Test the updating of a User object.
        - Test the retrieval of all User objects filtered by role.'''
    def setUp(self):
        self.client = APIClient()
        self.admin = CustomUser.objects.create_superuser('admin', 'admin@gmail.com', 'AdMinPaSsWoRd')
        self.admin.is_staff = True
        self.admin.save()

        self.user = CustomUser.objects.create_user('vladu', 'vlad.ursache777@gmail.com', 'PaSsWoRd')
        self.user.save()
        
        self.register_url = reverse('register')
        self.user_details_url = reverse('user', kwargs={'pk': self.user.pk})
        self.users_for_id_url = reverse('users-for-id', kwargs={'pk': self.user.pk})
        
        self.client.force_authenticate(user=self.admin)

    def test_get_single_user_as_admin(self):
        response = self.client.get(self.user_details_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializer = UserNoPasswordSerializer(self.user)
        self.assertEqual(response.data, serializer.data)

    def test_user_list_from_role(self):
        response = self.client.get(self.users_for_id_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected_users = CustomUser.objects.filter(is_staff=False)
        self.assertEqual(len(response.data), expected_users.count())
